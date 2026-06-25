import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOrderEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { estimateShipping, cartSubtotal } from "@/lib/shipping";

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(9),
  }),
  shippingAddress: z.object({
    county: z.string().min(1),
    city: z.string().min(1),
    localityType: z.enum(["urban", "rural"]),
    address: z.string().min(5),
    postalCode: z.string().regex(/^\d{6}$/),
  }),
  paymentMethod: z.enum(["card", "ramburs"]),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        variant: z.string().optional(),
        unitPrice: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const order = orderSchema.parse(await request.json());
    const orderId = `SB-${Date.now().toString(36).toUpperCase()}`;
    const session = await auth();

    // Recompute shipping authoritatively on the server (never trust the client).
    const lines = order.items.map((i) => ({
      productId: i.productId,
      variantPrice: i.unitPrice,
      quantity: i.quantity,
    }));
    const subtotal = cartSubtotal(lines);
    const shippingResult = await estimateShipping({
      items: lines,
      county: order.shippingAddress.county,
      locality: order.shippingAddress.city,
      localityType: order.shippingAddress.localityType,
      cashOnDelivery: order.paymentMethod === "ramburs" ? subtotal : 0,
    });
    const shipping = shippingResult.free ? 0 : shippingResult.cost ?? 0;
    const total = subtotal + shipping;
    const shippingTbd = !shippingResult.free && !shippingResult.available;

    const baseNotes = order.notes?.trim() || "";
    const notes =
      (shippingTbd ? "[Transport: se calculează la livrare] " : "") + baseNotes || null;

    const totals = { subtotal, shipping, total };

    // Persist the order (linked to the account if the buyer is logged in).
    await prisma.order.create({
      data: {
        orderNumber: orderId,
        userId: session?.user?.id ?? null,
        customerFirstName: order.customer.firstName,
        customerLastName: order.customer.lastName,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        shippingCounty: order.shippingAddress.county,
        shippingCity: order.shippingAddress.city,
        shippingAddress: order.shippingAddress.address,
        shippingPostalCode: order.shippingAddress.postalCode,
        paymentMethod: order.paymentMethod,
        notes,
        items: JSON.stringify(order.items),
        subtotal,
        shipping,
        total,
      },
    });

    // Notify the shop by email. The order is already saved, so a mail failure
    // must not fail the request.
    try {
      await sendOrderEmail({
        orderId,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        notes: notes ?? undefined,
        items: order.items,
        totals,
      });
    } catch (mailError) {
      console.error("Failed to send order notification email:", mailError);
    }

    return NextResponse.json({ success: true, orderId, totals }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ success: false, message: "Eroare internă de server." }, { status: 500 });
  }
}

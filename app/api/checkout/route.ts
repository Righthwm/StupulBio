import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOrderEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(9),
  }),
  shippingAddress: z.object({
    county: z.string().min(1),
    city: z.string().min(2),
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
  totals: z.object({
    subtotal: z.number().int().nonnegative(),
    shipping: z.number().int().nonnegative(),
    total: z.number().int().positive(),
  }),
});

export async function POST(request: Request) {
  try {
    const order = orderSchema.parse(await request.json());
    const orderId = `SB-${Date.now().toString(36).toUpperCase()}`;
    const session = await auth();

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
        notes: order.notes ?? null,
        items: JSON.stringify(order.items),
        subtotal: order.totals.subtotal,
        shipping: order.totals.shipping,
        total: order.totals.total,
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
        notes: order.notes,
        items: order.items,
        totals: order.totals,
      });
    } catch (mailError) {
      console.error("Failed to send order notification email:", mailError);
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ success: false, message: "Eroare internă de server." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/db/orders";

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
  // Prices are whole lei and persist into integer columns — reject decimals
  // loudly instead of letting them truncate silently on insert.
  totals: z.object({
    subtotal: z.number().int().nonnegative(),
    shipping: z.number().int().nonnegative(),
    total: z.number().int().positive(),
  }),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const order = orderSchema.parse(body);

    // Card payments never reach this mock with real card data — the card fields
    // are validated client-side only and intentionally not sent to the server.
    const orderId = `SB-${Date.now().toString(36).toUpperCase()}`;

    await createOrder(orderId, {
      customer: order.customer,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      items: order.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        variant: i.variant,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      totals: order.totals,
    });

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Eroare internă de server." }, { status: 500 });
  }
}

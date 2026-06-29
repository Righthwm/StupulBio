import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOrderEmail } from "@/lib/email";
import { checkoutInputSchema, persistOrder } from "@/lib/orders";

/** Ramburs orders: persist immediately and notify the shop. Card payments go
 *  through /api/payment/initiate instead. */
export async function POST(request: Request) {
  try {
    const input = checkoutInputSchema.parse(await request.json());
    const { orderId, totals, notes } = await persistOrder(input, "n/a");

    try {
      await sendOrderEmail({
        orderId,
        customer: input.customer,
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        notes: notes ?? undefined,
        couponCode: input.couponCode,
        items: input.items,
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

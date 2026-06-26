import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkoutInputSchema, persistOrder } from "@/lib/orders";
import { isNetopiaConfigured, startPayment, NetopiaError } from "@/lib/netopia";

/** Card payment: persist a pending order, start the Netopia payment, and return
 *  the URL the browser should be redirected to (hosted card page + 3D Secure). */
export async function POST(request: Request) {
  try {
    if (!isNetopiaConfigured()) {
      return NextResponse.json(
        { success: false, message: "Plata cu cardul nu este disponibilă momentan." },
        { status: 503 }
      );
    }

    const input = checkoutInputSchema.parse(await request.json());
    const { orderId, totals } = await persistOrder(input, "pending");

    const origin = new URL(request.url).origin;
    const result = await startPayment({
      orderId,
      amount: totals.total, // whole lei == whole RON
      description: `Comandă ${orderId} — Stupul Bio`,
      billing: {
        email: input.customer.email,
        phone: input.customer.phone,
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        city: input.shippingAddress.city,
        postalCode: input.shippingAddress.postalCode,
        details: input.shippingAddress.address,
      },
      notifyUrl: `${origin}/api/payment/confirm`,
      redirectUrl: `${origin}/payment/return?orderId=${encodeURIComponent(orderId)}`,
    });

    await prisma.order.update({
      where: { orderNumber: orderId },
      data: { paymentId: result.ntpID },
    });

    return NextResponse.json({ success: true, orderId, redirectUrl: result.redirectUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    if (error instanceof NetopiaError) {
      console.error("Netopia initiate error:", error);
      return NextResponse.json({ success: false, message: "Plata nu a putut fi inițiată." }, { status: 502 });
    }
    console.error("Payment initiate error:", error);
    return NextResponse.json({ success: false, message: "Eroare internă de server." }, { status: 500 });
  }
}

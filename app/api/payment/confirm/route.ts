import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyIpn } from "@/lib/netopia";
import { sendOrderEmail, type OrderItem } from "@/lib/email";

/**
 * Netopia IPN (server-to-server). The order is marked paid/failed ONLY here,
 * after the signature is verified — never on the browser redirect, which can be
 * forged. Responds { errorCode: 0 } so Netopia stops retrying.
 */
export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const token =
      request.headers.get("Verification-token") ?? request.headers.get("verification-token");
    const ipn = verifyIpn(raw, token);

    if (!ipn.verified) {
      console.error("Netopia IPN: signature verification failed");
      return NextResponse.json({ errorCode: 1, message: "invalid signature" }, { status: 400 });
    }
    if (!ipn.orderId) {
      return NextResponse.json({ errorCode: 1, message: "missing order id" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { orderNumber: ipn.orderId } });
    if (!order) {
      return NextResponse.json({ errorCode: 1, message: "order not found" }, { status: 404 });
    }

    if (ipn.status === "paid" && order.paymentStatus !== "paid") {
      await prisma.order.update({
        where: { orderNumber: ipn.orderId },
        data: { paymentStatus: "paid", paymentId: ipn.ntpID || order.paymentId },
      });
      try {
        await sendOrderEmail({
          orderId: order.orderNumber,
          customer: {
            firstName: order.customerFirstName,
            lastName: order.customerLastName,
            email: order.customerEmail,
            phone: order.customerPhone,
          },
          shippingAddress: {
            county: order.shippingCounty,
            city: order.shippingCity,
            address: order.shippingAddress,
            postalCode: order.shippingPostalCode,
          },
          paymentMethod: order.paymentMethod === "card" ? "card" : "ramburs",
          notes: order.notes ?? undefined,
          items: JSON.parse(order.items) as OrderItem[],
          totals: { subtotal: order.subtotal, shipping: order.shipping, total: order.total },
        });
      } catch (mailError) {
        console.error("Failed to send paid-order email:", mailError);
      }
    } else if (ipn.status === "failed" && order.paymentStatus === "pending") {
      await prisma.order.update({
        where: { orderNumber: ipn.orderId },
        data: { paymentStatus: "failed" },
      });
    }

    return NextResponse.json({ errorCode: 0 });
  } catch (error) {
    console.error("Netopia IPN error:", error);
    return NextResponse.json({ errorCode: 1 }, { status: 500 });
  }
}

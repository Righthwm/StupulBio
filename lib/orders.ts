import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { estimateShipping, cartSubtotal } from "@/lib/shipping";
import { couponDiscount, getCoupon } from "@/lib/coupons";

/** Shared validation for both the ramburs checkout and card payment-initiate routes. */
export const checkoutInputSchema = z.object({
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
  couponCode: z.string().max(40).optional(),
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

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export interface PersistedOrder {
  orderId: string;
  totals: { subtotal: number; shipping: number; discount: number; total: number };
  shippingTbd: boolean;
  notes: string | null;
}

/**
 * Recompute shipping authoritatively, then persist the order (linked to the
 * logged-in account if any). `paymentStatus` is "n/a" for ramburs and "pending"
 * for card until the IPN confirms it.
 */
export async function persistOrder(input: CheckoutInput, paymentStatus: string): Promise<PersistedOrder> {
  const orderId = `SB-${Date.now().toString(36).toUpperCase()}`;
  const session = await auth();

  const lines = input.items.map((i) => ({
    productId: i.productId,
    variantPrice: i.unitPrice,
    quantity: i.quantity,
  }));
  const subtotal = cartSubtotal(lines);
  const shippingResult = await estimateShipping({
    items: lines,
    county: input.shippingAddress.county,
    locality: input.shippingAddress.city,
    localityType: input.shippingAddress.localityType,
    cashOnDelivery: input.paymentMethod === "ramburs" ? subtotal : 0,
  });
  const shipping = shippingResult.free ? 0 : shippingResult.cost ?? 0;
  // Coupon validated + applied server-side so the total can't be tampered with.
  const coupon = getCoupon(input.couponCode);
  const discount = couponDiscount(subtotal, input.couponCode);
  const total = Math.max(0, subtotal - discount + shipping);
  const shippingTbd = !shippingResult.free && !shippingResult.available;

  const notes =
    (shippingTbd ? "[Transport: se calculează la livrare] " : "") + (input.notes?.trim() || "") || null;

  await prisma.order.create({
    data: {
      orderNumber: orderId,
      userId: session?.user?.id ?? null,
      customerFirstName: input.customer.firstName,
      customerLastName: input.customer.lastName,
      customerEmail: input.customer.email,
      customerPhone: input.customer.phone,
      shippingCounty: input.shippingAddress.county,
      shippingCity: input.shippingAddress.city,
      shippingAddress: input.shippingAddress.address,
      shippingPostalCode: input.shippingAddress.postalCode,
      paymentMethod: input.paymentMethod,
      paymentStatus,
      notes,
      items: JSON.stringify(input.items),
      subtotal,
      shipping,
      couponCode: coupon?.code ?? null,
      discount,
      total,
    },
  });

  return { orderId, totals: { subtotal, shipping, discount, total }, shippingTbd, notes };
}

// Discount coupons. Plain module (no "use client", no server deps) so it can be
// imported on both the client (instant feedback at checkout) and the server
// (authoritative recompute when persisting the order).

export interface Coupon {
  code: string;
  /** Percentage off the product subtotal. */
  percent: number;
  label: string;
}

const COUPONS: Record<string, Coupon> = {
  FAGURE10: { code: "FAGURE10", percent: 10, label: "10% reducere abonare" },
};

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export function getCoupon(code: string | null | undefined): Coupon | null {
  if (!code) return null;
  return COUPONS[normalizeCouponCode(code)] ?? null;
}

/** Discount in whole lei a coupon applies to the given subtotal (0 if invalid). */
export function couponDiscount(subtotal: number, code: string | null | undefined): number {
  const coupon = getCoupon(code);
  if (!coupon) return 0;
  return Math.round((subtotal * coupon.percent) / 100);
}

// Discount coupons. Plain module (no "use client", no server deps) so it can be
// imported on both the client (instant feedback at checkout) and the server
// (authoritative recompute when persisting the order).
//
// A coupon discounts either a `percent` of the subtotal OR a fixed `amount` (lei).
// Optional `expiresAt` (YYYY-MM-DD, valid through that day) and `maxUses` (total
// redemptions, enforced server-side by counting orders) gate validity.

export interface Coupon {
  code: string;
  /** Percentage off the product subtotal (use this OR `amount`). */
  percent?: number;
  /** Fixed amount off, in whole lei (use this OR `percent`). */
  amount?: number;
  label: string;
  /** Last valid day, inclusive — ISO date "YYYY-MM-DD". */
  expiresAt?: string;
  /** Total number of redemptions allowed across all orders. */
  maxUses?: number;
}

const COUPONS: Record<string, Coupon> = {
  FAGURE5: { code: "FAGURE5", percent: 5, label: "5% reducere abonare" },
  VARA50: { code: "VARA50", amount: 50, label: "50 lei reducere", expiresAt: "2026-08-31" },
  BONUS25: { code: "BONUS25", amount: 25, label: "25 lei reducere", maxUses: 10 },
};

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

/** True if the coupon has an expiry date that has passed. */
export function isCouponExpired(coupon: Coupon, now: Date = new Date()): boolean {
  if (!coupon.expiresAt) return false;
  return now.getTime() > new Date(`${coupon.expiresAt}T23:59:59`).getTime();
}

/** Returns the coupon if it exists and hasn't expired; otherwise null. Usage
 *  limits are NOT checked here (they need the database — see the server side). */
export function getCoupon(code: string | null | undefined): Coupon | null {
  if (!code) return null;
  const coupon = COUPONS[normalizeCouponCode(code)];
  if (!coupon || isCouponExpired(coupon)) return null;
  return coupon;
}

/** Discount in whole lei a coupon applies to the given subtotal (0 if invalid).
 *  Never exceeds the subtotal. */
export function couponDiscount(subtotal: number, code: string | null | undefined): number {
  const coupon = getCoupon(code);
  if (!coupon) return 0;
  const raw =
    coupon.amount != null ? coupon.amount : Math.round((subtotal * (coupon.percent ?? 0)) / 100);
  return Math.min(raw, subtotal);
}

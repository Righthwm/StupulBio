import { NextResponse } from "next/server";
import { z } from "zod";
import { getCoupon, couponDiscount } from "@/lib/coupons";
import { couponUsageCount } from "@/lib/orders";

const schema = z.object({
  code: z.string().max(40),
  subtotal: z.number().int().nonnegative(),
});

/** Validate a coupon (existence, expiry, usage limit) and return its discount. */
export async function POST(request: Request) {
  let parsed: z.infer<typeof schema>;
  try {
    parsed = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ valid: false, message: "Cod invalid." }, { status: 400 });
  }
  const { code, subtotal } = parsed;

  const coupon = getCoupon(code);
  if (!coupon) {
    return NextResponse.json({ valid: false, message: "Cod invalid sau expirat." });
  }

  if (coupon.maxUses != null) {
    try {
      if ((await couponUsageCount(coupon.code)) >= coupon.maxUses) {
        return NextResponse.json({ valid: false, message: "Acest cod a fost epuizat." });
      }
    } catch (error) {
      // Fail open — persistOrder enforces the limit authoritatively at checkout.
      console.error("Coupon usage check failed:", error);
    }
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    label: coupon.label,
    discount: couponDiscount(subtotal, coupon.code),
  });
}

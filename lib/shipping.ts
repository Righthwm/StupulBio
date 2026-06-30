import { products } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { estimateTariff, FanCourierUnavailableError } from "@/lib/fancourier";
import { provisionalTariff } from "@/lib/shipping-config";

/** Fallback weight (kg) for a cart line whose variant has no configured weight. */
const DEFAULT_ITEM_WEIGHT_KG = 1;

export interface CartLineInput {
  productId: string;
  variantPrice: number;
  quantity: number;
}

/** Total gross parcel weight (kg) for the cart, looked up from product data. */
export function packageWeightKg(items: CartLineInput[]): number {
  let total = 0;
  for (const line of items) {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.price === line.variantPrice);
    const weight = variant?.weightKg ?? product?.variants[0]?.weightKg ?? DEFAULT_ITEM_WEIGHT_KG;
    total += weight * line.quantity;
  }
  return Math.round(total * 100) / 100;
}

/** Cart subtotal (lei), recomputed from product data rather than trusting the client. */
export function cartSubtotal(items: CartLineInput[]): number {
  return items.reduce((sum, line) => sum + line.variantPrice * line.quantity, 0);
}

export interface ShippingResult {
  /** Qualifies for free shipping (subtotal >= threshold). */
  free: boolean;
  /** false => couldn't price it at all ("se calculează la livrare"). */
  available: boolean;
  /**
   * true => the cost comes from the provisional table (lib/shipping-config.ts),
   * not the live Fan Courier API. Drives the "preț estimativ" note in checkout.
   */
  estimated: boolean;
  /** Cost in lei: 0 when free, a number when priced, null when unavailable. */
  cost: number | null;
  weightKg: number;
}

export interface EstimateInput {
  items: CartLineInput[];
  county: string;
  locality: string;
  localityType: "urban" | "rural";
  /** Cash-on-delivery amount in lei (ramburs); 0 when paying by card. */
  cashOnDelivery: number;
}

/**
 * Authoritative shipping calculation, shared by the estimate endpoint and the
 * checkout route. Free above the threshold; otherwise the Fan Courier tariff,
 * or `available: false` when the courier API isn't configured/reachable.
 */
export async function estimateShipping(input: EstimateInput): Promise<ShippingResult> {
  const weightKg = packageWeightKg(input.items);
  const subtotal = cartSubtotal(input.items);

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { free: true, available: true, estimated: false, cost: 0, weightKg };
  }

  try {
    const cost = await estimateTariff({
      county: input.county,
      locality: input.locality,
      localityType: input.localityType,
      weightKg,
      cashOnDelivery: input.cashOnDelivery,
      declaredValue: subtotal,
    });
    return { free: false, available: true, estimated: false, cost, weightKg };
  } catch (error) {
    if (error instanceof FanCourierUnavailableError) {
      // No live courier API yet: fall back to the provisional table so the
      // customer still sees a concrete (estimated) shipping cost.
      const cost = provisionalTariff(weightKg, input.localityType, input.county, input.locality);
      return { free: false, available: true, estimated: true, cost, weightKg };
    }
    throw error;
  }
}

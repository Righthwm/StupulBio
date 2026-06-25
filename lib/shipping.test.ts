import { describe, it, expect } from "vitest";
import { packageWeightKg, cartSubtotal, estimateShipping } from "./shipping";

// miere-salcam 1kg = 45 lei / 1.4 kg ; propolis 20ml = 15 lei / 0.2 kg
const salcam = { productId: "miere-salcam", variantPrice: 45, quantity: 2 };
const propolis = { productId: "tinctura-propolis", variantPrice: 15, quantity: 1 };

describe("packageWeightKg", () => {
  it("sums variant weights × quantity", () => {
    expect(packageWeightKg([salcam])).toBe(2.8); // 1.4 × 2
    expect(packageWeightKg([salcam, propolis])).toBe(3.0); // 2.8 + 0.2
  });

  it("falls back to a default weight for unknown products", () => {
    expect(packageWeightKg([{ productId: "nope", variantPrice: 1, quantity: 3 }])).toBe(3);
  });
});

describe("cartSubtotal", () => {
  it("sums price × quantity", () => {
    expect(cartSubtotal([salcam, propolis])).toBe(105); // 45×2 + 15
  });
});

describe("estimateShipping", () => {
  const addr = { county: "Cluj", locality: "Cluj-Napoca", localityType: "urban" as const, cashOnDelivery: 0 };

  it("is free at or above the 250 lei threshold", async () => {
    const bigOrder = [{ productId: "miere-salcam", variantPrice: 200, quantity: 2 }]; // 400 lei
    const result = await estimateShipping({ items: bigOrder, ...addr });
    expect(result.free).toBe(true);
    expect(result.cost).toBe(0);
  });

  it("reports unavailable below threshold when Fan Courier is not configured", async () => {
    const result = await estimateShipping({ items: [salcam, propolis], ...addr }); // 105 lei
    expect(result.free).toBe(false);
    expect(result.available).toBe(false);
    expect(result.cost).toBeNull();
    expect(result.weightKg).toBe(3.0);
  });
});

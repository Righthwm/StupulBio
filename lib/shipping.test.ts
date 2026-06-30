import { describe, it, expect } from "vitest";
import { packageWeightKg, cartSubtotal, estimateShipping } from "./shipping";
import {
  baseRateForWeight,
  ruralSurchargeForKm,
  provisionalTariff,
  estimateDistanceKm,
} from "./shipping-config";

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

  it("falls back to the provisional table below threshold when Fan Courier is not configured", async () => {
    const result = await estimateShipping({ items: [salcam, propolis], ...addr }); // 105 lei, 3.0 kg
    expect(result.free).toBe(false);
    expect(result.available).toBe(true);
    expect(result.estimated).toBe(true);
    expect(result.cost).toBe(22); // 3 kg urban bracket
    expect(result.weightKg).toBe(3.0);
  });

  it("adds the precomputed rural surcharge to the provisional estimate", async () => {
    const rural = { county: "Gorj", locality: "Sterpoaia", localityType: "rural" as const, cashOnDelivery: 0 };
    const result = await estimateShipping({ items: [salcam, propolis], ...rural }); // 3.0 kg
    expect(result.estimated).toBe(true);
    expect(result.cost).toBe(22 + 15); // 3 kg base + Sterpoaia 31 km → 25–50 km bracket
  });
});

describe("provisional shipping config", () => {
  it("prices each weight bracket", () => {
    expect(baseRateForWeight(0.8)).toBe(18); // ≤1 kg
    expect(baseRateForWeight(1.4)).toBe(20); // ≤2 kg
    expect(baseRateForWeight(3)).toBe(22); // ≤3 kg
    expect(baseRateForWeight(4.5)).toBe(25); // ≤5 kg
    expect(baseRateForWeight(9)).toBe(32); // ≤10 kg
    expect(baseRateForWeight(20)).toBe(48); // ≤20 kg
  });

  it("adds an overage fee above the top bracket", () => {
    expect(baseRateForWeight(23)).toBe(48 + 3 * 2); // 3 kg over 20 → +6 lei
  });

  it("maps distance to the right rural surcharge", () => {
    expect(ruralSurchargeForKm(5)).toBe(5);
    expect(ruralSurchargeForKm(20)).toBe(10);
    expect(ruralSurchargeForKm(40)).toBe(15);
    expect(ruralSurchargeForKm(120)).toBe(20);
  });

  it("only surcharges rural localities", () => {
    expect(provisionalTariff(3, "urban")).toBe(22);
    expect(provisionalTariff(3, "rural")).toBe(22 + 15); // no locality → default 30 km
  });

  it("reads the precomputed distance per Gorj locality", () => {
    expect(estimateDistanceKm("Gorj", "Barza", "rural")).toBe(9);
    expect(estimateDistanceKm("Gorj", "Arcani", "rural")).toBe(12);
    expect(estimateDistanceKm("Gorj", "Bojinu", "rural")).toBe(56);
    expect(estimateDistanceKm("Gorj", "Barza", "urban")).toBe(0); // urban = agency in town
    expect(estimateDistanceKm("Gorj", "Sat Inexistent", "rural")).toBe(30); // fallback default
  });

  it("brackets the surcharge by real distance", () => {
    expect(provisionalTariff(3, "rural", "Gorj", "Barza")).toBe(22 + 5); // 9 km
    expect(provisionalTariff(3, "rural", "Gorj", "Arcani")).toBe(22 + 10); // 12 km
    expect(provisionalTariff(3, "rural", "Gorj", "Alimpești")).toBe(22 + 15); // 41 km
    expect(provisionalTariff(3, "rural", "Gorj", "Bojinu")).toBe(22 + 20); // 56 km
  });
});

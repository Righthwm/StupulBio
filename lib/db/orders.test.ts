import { describe, expect, it } from "vitest";
import { buildOrderRow } from "./orders";

const order = {
  customer: { firstName: "Ion", lastName: "Pop", email: "ion@example.com", phone: "0712345678" },
  shippingAddress: { county: "Cluj", city: "Cluj-Napoca", address: "Str. Florilor 1", postalCode: "400000" },
  paymentMethod: "ramburs" as const,
  notes: "fără sonerie",
  items: [{ productId: "miere-salcam", name: "Miere de Salcâm", variant: "1kg", unitPrice: 50, quantity: 2 }],
  totals: { subtotal: 100, shipping: 0, total: 100 },
};

describe("buildOrderRow", () => {
  it("flattens the parsed order into a db row", () => {
    const row = buildOrderRow("SB-ABC", order);
    expect(row).toMatchObject({
      id: "SB-ABC",
      customerFirstName: "Ion",
      customerLastName: "Pop",
      customerEmail: "ion@example.com",
      customerPhone: "0712345678",
      shippingCounty: "Cluj",
      shippingCity: "Cluj-Napoca",
      shippingAddress: "Str. Florilor 1",
      shippingPostalCode: "400000",
      paymentMethod: "ramburs",
      notes: "fără sonerie",
      subtotal: 100,
      shipping: 0,
      total: 100,
    });
    expect(row.items).toHaveLength(1);
    expect(row.items[0].productId).toBe("miere-salcam");
  });

  it("defaults notes to null when missing", () => {
    const { notes, ...rest } = order;
    void notes;
    const row = buildOrderRow("SB-XYZ", rest);
    expect(row.notes).toBeNull();
  });
});

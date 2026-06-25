import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateShipping, cartSubtotal } from "@/lib/shipping";

const schema = z.object({
  county: z.string().min(1),
  locality: z.string().min(1),
  localityType: z.enum(["urban", "rural"]),
  paymentMethod: z.enum(["card", "ramburs"]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantPrice: z.number().int().nonnegative(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    // Ramburs collects the goods value on delivery.
    const cashOnDelivery = data.paymentMethod === "ramburs" ? cartSubtotal(data.items) : 0;

    const result = await estimateShipping({
      items: data.items,
      county: data.county,
      locality: data.locality,
      localityType: data.localityType,
      cashOnDelivery,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Shipping estimate error:", error);
    return NextResponse.json({ error: "Eroare internă de server." }, { status: 500 });
  }
}

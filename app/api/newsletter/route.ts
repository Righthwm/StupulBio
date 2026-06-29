import { NextResponse } from "next/server";
import { z } from "zod";
import { sendNewsletterSignup } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
  source: z.enum(["newsletter", "popup"]).optional(),
});

/** Newsletter / exit-popup signup → notifies the shop and emails the code. */
export async function POST(request: Request) {
  try {
    const { email, source } = schema.parse(await request.json());
    await sendNewsletterSignup(email, source ?? "newsletter");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: "Email invalid." }, { status: 400 });
    }
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ ok: false, message: "Eroare la abonare." }, { status: 500 });
  }
}

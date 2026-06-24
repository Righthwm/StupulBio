import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.enum(["Comandă", "Informații produs", "Parteneriat", "Altele"]),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());

    // Persist the message so it shows in the admin panel.
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        subject: data.subject,
        message: data.message,
      },
    });

    // Email notification — message is already saved, so a mail failure is non-fatal.
    try {
      await sendContactEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });
    } catch (mailError) {
      console.error("Failed to send contact notification email:", mailError);
    }

    return NextResponse.json(
      { success: true, message: "Mesajul a fost primit. Răspundem în 24h." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("Contact error:", error);
    return NextResponse.json({ success: false, message: "Eroare internă de server." }, { status: 500 });
  }
}

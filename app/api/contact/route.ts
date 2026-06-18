import { NextResponse } from "next/server";
import { z } from "zod";
import { createMessage } from "@/lib/db/messages";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.enum(["Comandă", "Informații produs", "Parteneriat", "Altele"]),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = schema.parse(body);

    await createMessage({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json(
      { success: true, message: "Mesajul a fost primit. Răspundem în 24h." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Eroare internă de server." },
      { status: 500 }
    );
  }
}

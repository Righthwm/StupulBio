import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere."),
  email: z.string().email("Email invalid."),
  password: z.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere."),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Există deja un cont cu acest email." },
        { status: 409 }
      );
    }

    const password = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: { name: data.name.trim(), email, password, role: "CLIENT" },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Eroare internă de server." },
      { status: 500 }
    );
  }
}

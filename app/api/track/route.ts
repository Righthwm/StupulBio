import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Records a page visit. Called fire-and-forget by middleware (which runs on the
 * edge and can't use Prisma). Protected by a shared secret so it can't be
 * spammed from outside. statusCode is unknown at middleware time → stored as 200.
 */
export async function POST(request: Request) {
  if (request.headers.get("x-track-secret") !== process.env.AUTH_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { path, method, ip, userAgent, userId } = (await request.json()) as {
      path?: string;
      method?: string;
      ip?: string | null;
      userAgent?: string | null;
      userId?: string | null;
    };

    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    await prisma.pageVisit.create({
      data: {
        path: path.slice(0, 512),
        method: method ?? "GET",
        ip: ip ?? null,
        userAgent: userAgent ? userAgent.slice(0, 512) : null,
        statusCode: 200,
        userId: userId ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

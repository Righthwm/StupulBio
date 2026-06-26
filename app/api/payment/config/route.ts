import { NextResponse } from "next/server";
import { isNetopiaConfigured } from "@/lib/netopia";

/** Tells the checkout UI whether card payment is available (Netopia configured). */
export async function GET() {
  return NextResponse.json({ cardEnabled: isNetopiaConfigured() });
}

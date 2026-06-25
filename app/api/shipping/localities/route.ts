import { NextResponse } from "next/server";
import { localitiesForCounty } from "@/lib/localities";

/** Localities for a county, used to populate the checkout dropdown. */
export async function GET(request: Request) {
  const county = new URL(request.url).searchParams.get("county") ?? "";
  return NextResponse.json({ localities: localitiesForCounty(county) });
}

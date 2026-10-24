import { NextResponse } from "next/server";
import { getDealers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dealers = await getDealers({ limit: 60 });
    const agencies = [...new Set(dealers.map((dealer) => dealer.agency.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ agencies }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
  } catch (error) {
    console.error("agency options failed", error);
    return NextResponse.json({ agencies: [] }, { status: 500 });
  }
}

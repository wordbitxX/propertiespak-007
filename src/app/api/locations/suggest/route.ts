import { NextResponse } from "next/server";
import { suggestLocations } from "@/lib/location-suggest";
import { getLocationAreaCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Instant location suggestions for the homepage search box (no external calls). */
export async function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 60);
  const areas = await getLocationAreaCounts();
  return NextResponse.json(
    { results: suggestLocations(query, areas) },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
  );
}

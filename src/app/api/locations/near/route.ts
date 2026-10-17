import { NextResponse } from "next/server";
import { resolveNearMe } from "@/lib/near-me";
import { getListingPoints } from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * "Use my location" for the homepage search: turns the visitor's coordinates
 * into a place name and a search radius that actually has listings. The
 * coordinates are only used for this calculation and are never stored.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  if (!params.get("lat") || !params.get("lng") || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
  const purpose = params.get("purpose") ?? undefined;
  const points = await getListingPoints();
  return NextResponse.json(resolveNearMe(lat, lng, purpose, points), {
    headers: { "Cache-Control": "private, no-store" },
  });
}

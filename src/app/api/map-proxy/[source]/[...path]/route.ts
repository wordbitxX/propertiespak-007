import { NextResponse } from "next/server";
import {
  DEEP_ZOOM_DZI_NAMES,
  DHA_SOCIETY_IMAGE_NAMES,
  DHAPLUS_SOURCE,
  PPS_SOURCE,
} from "@/lib/map-library";

/**
 * Same-origin proxy for the society map viewers.
 *
 *   /api/map-proxy/pps/<Name>.dzi                       → DeepZoom descriptor
 *   /api/map-proxy/pps/<Name>_files/<level>/<x>_<y>.jpg → DeepZoom tile
 *   /api/map-proxy/dhaplus/<image>.jpg                  → DHA Plus HD society map
 *
 * Only files belonging to the curated maps in `@/lib/map-library` are allowed,
 * so this can never be used as an open proxy. Responses are cached at the edge
 * for a long time because map tiles never change once published.
 */

// Overridable for local testing against a mock upstream.
const PPS_BASE = process.env.MAP_PROXY_PPS_BASE || PPS_SOURCE.deepZoomBase;
const DHAPLUS_BASE = process.env.MAP_PROXY_DHAPLUS_BASE || DHAPLUS_SOURCE.imageBase;

const DZI_FILE = /^([A-Za-z0-9-]+)\.dzi$/;
const DZI_TILE = /^([A-Za-z0-9-]+)_files\/(\d{1,2})\/(\d{1,5})_(\d{1,5})\.(jpg|jpeg|png)$/;
const DHAPLUS_IMAGE = /^[A-Za-z0-9]{20,64}\.(jpg|jpeg|png)$/;

const CONTENT_TYPES: Record<string, string> = {
  dzi: "application/xml; charset=utf-8",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

const LONG_CACHE = "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800";

function resolveUpstream(source: string, path: string): { url: string; ext: string } | null {
  if (source === "pps") {
    const dzi = DZI_FILE.exec(path);
    if (dzi && DEEP_ZOOM_DZI_NAMES.has(dzi[1])) return { url: `${PPS_BASE}${path}`, ext: "dzi" };
    const tile = DZI_TILE.exec(path);
    if (tile && DEEP_ZOOM_DZI_NAMES.has(tile[1])) return { url: `${PPS_BASE}${path}`, ext: tile[5].toLowerCase() };
    return null;
  }
  if (source === "dhaplus") {
    const image = DHAPLUS_IMAGE.exec(path);
    if (image && DHA_SOCIETY_IMAGE_NAMES.has(path)) return { url: `${DHAPLUS_BASE}${path}`, ext: image[1].toLowerCase() };
    return null;
  }
  return null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ source: string; path: string[] }> }) {
  const { source, path } = await params;
  const joined = path.join("/");
  const upstream = resolveUpstream(source, joined);
  if (!upstream) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "public, max-age=3600" } });
  }

  let response: Response;
  try {
    response = await fetch(upstream.url, {
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      headers: { Accept: upstream.ext === "dzi" ? "application/xml,text/xml,*/*" : "image/*,*/*" },
    });
  } catch {
    return NextResponse.json({ error: "Map source unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  if (!response.ok || !response.body) {
    // Missing tiles at the edge of a pyramid are normal; cache the miss briefly.
    const status = response.status === 404 ? 404 : 502;
    return NextResponse.json(
      { error: status === 404 ? "Not found" : "Map source unavailable" },
      { status, headers: { "Cache-Control": status === 404 ? "public, max-age=3600" : "no-store" } },
    );
  }

  return new NextResponse(response.body, {
    status: 200,
    headers: {
      "Content-Type": CONTENT_TYPES[upstream.ext] ?? "application/octet-stream",
      "Cache-Control": LONG_CACHE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

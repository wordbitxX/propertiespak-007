import { NextResponse } from "next/server";
import {
  DEEP_ZOOM_DZI_NAMES,
  DHA_SOCIETY_IMAGE_NAMES,
  DHAPLUS_SOURCE,
  PPS_SOURCE,
} from "@/lib/map-library";
import { SOCIETY_MAPS } from "@/lib/society-maps";
import { LRE_PDF_BASE, SOCIETY_PDF_MAPS } from "@/lib/society-pdf-maps";

/**
 * Same-origin proxy for the society map viewers.
 *
 *   /api/map-proxy/pps/<Name>.dzi                       → DeepZoom descriptor
 *   /api/map-proxy/pps/<Name>_files/<level>/<x>_<y>.jpg → DeepZoom tile
 *   /api/map-proxy/dhaplus/<image>.jpg                  → DHA Plus HD society map
 *   /api/map-proxy/bplus/<cdn|maps>/<layer>/<z>/<x>/<y>.png → DHA Plus plot-layout tile
 *     (same-origin, so the map can mask the CDN's "no data" filler tiles)
 *   /api/map-proxy/lre/<path>.pdf[?download=1]              → curated society PDF map
 *     (same-origin, so the preview modal can embed it and the download button
 *      can force `Content-Disposition: attachment`; edge-cached like tiles)
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
const BPLUS_HOSTS: Record<string, string> = {
  cdn: process.env.MAP_PROXY_BPLUS_CDN_BASE || "https://maps-cdn.bahriaplus.com/",
  maps: process.env.MAP_PROXY_BPLUS_MAPS_BASE || "https://maps.bahriaplus.com/",
};
const BPLUS_TILE = /^(cdn|maps)\/(global\/[a-z0-9/_-]+?)\/(\d{1,2})\/(\d{1,7})\/(\d{1,7})\.png$/i;
/** "cdn/global/dha/lhr/phase1" for every layer published in SOCIETY_MAPS. */
const BPLUS_LAYERS = new Set(
  SOCIETY_MAPS.flatMap((society) =>
    society.layers.map((layer) => {
      const match = /^https:\/\/(maps-cdn|maps)\.bahriaplus\.com\/(.+)\/\{z\}\/\{x\}\/\{y\}\.png$/.exec(layer.tiles);
      return match ? `${match[1] === "maps-cdn" ? "cdn" : "maps"}/${match[2]}` : "";
    }),
  ).filter(Boolean),
);
const DHAPLUS_IMAGE = /^[A-Za-z0-9]{20,64}\.(jpg|jpeg|png)$/;

/** Exact upstream paths of the curated PDF maps — the proxy allow-list. */
const LRE_BASE = process.env.MAP_PROXY_LRE_BASE || LRE_PDF_BASE;
const LRE_PDF_PATHS = new Set(
  SOCIETY_PDF_MAPS.filter((map) => map.pdfUrl.startsWith(LRE_PDF_BASE)).map((map) =>
    map.pdfUrl.slice(LRE_PDF_BASE.length),
  ),
);

const CONTENT_TYPES: Record<string, string> = {
  dzi: "application/xml; charset=utf-8",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
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
  if (source === "bplus") {
    const tile = BPLUS_TILE.exec(path);
    if (tile && BPLUS_LAYERS.has(`${tile[1]}/${tile[2]}`)) {
      return { url: `${BPLUS_HOSTS[tile[1]]}${tile[2]}/${tile[3]}/${tile[4]}/${tile[5]}.png`, ext: "png" };
    }
    return null;
  }
  if (source === "dhaplus") {
    const image = DHAPLUS_IMAGE.exec(path);
    if (image && DHA_SOCIETY_IMAGE_NAMES.has(path)) return { url: `${DHAPLUS_BASE}${path}`, ext: image[1].toLowerCase() };
    return null;
  }
  if (source === "lre") {
    if (path.toLowerCase().endsWith(".pdf") && LRE_PDF_PATHS.has(path)) return { url: `${LRE_BASE}${path}`, ext: "pdf" };
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
      signal: AbortSignal.timeout(upstream.ext === "pdf" ? 60_000 : 20_000),
      headers: {
        Accept:
          upstream.ext === "dzi"
            ? "application/xml,text/xml,*/*"
            : upstream.ext === "pdf"
              ? "application/pdf,*/*"
              : "image/*,*/*",
      },
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

  const headers = {
    "Content-Type": CONTENT_TYPES[upstream.ext] ?? "application/octet-stream",
    "Cache-Control": LONG_CACHE,
    "X-Content-Type-Options": "nosniff",
  } as Record<string, string>;

  if (upstream.ext === "pdf") {
    // `?download=1` forces a real save dialog; without it the same URL stays
    // embeddable inline (Chrome refuses to render attachment responses inside
    // frames, which is exactly what broke the old direct embeds).
    const wantsDownload = new URL(_request.url).searchParams.has("download");
    const fileName = joined.split("/").pop() ?? "map.pdf";
    headers["Content-Disposition"] = `${wantsDownload ? "attachment" : "inline"}; filename="${fileName.replace(/"/g, "")}"`;
    if (wantsDownload) headers["Cache-Control"] = "public, max-age=3600, s-maxage=86400";
    const length = response.headers.get("content-length");
    if (length) headers["Content-Length"] = length;
  }

  return new NextResponse(response.body, { status: 200, headers });
}

"use client";

import { useEffect, useRef, useState } from "react";
import type OpenSeadragon from "openseadragon";

export type SocietyMapSource =
  /** `url` = our proxied .dzi; `direct` lets the browser load the source tiles itself if the proxy fails. */
  | { type: "dzi"; url: string; direct?: { base: string; name: string } }
  /** `url` = our proxied image; `direct` = the original image URL used as a browser-side fallback. */
  | { type: "image"; url: string; direct?: string };

type Status = "loading" | "ready" | "error";

const ZOOM_STEP = 1.5;
const PROBE_TIMEOUT = 6000;
const MAX_LEVEL = 20;
const CACHE_PREFIX = "pp-dzi:v2:";

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.referrerPolicy = "no-referrer";
    image.decoding = "async";
    const timer = window.setTimeout(() => resolve(null), PROBE_TIMEOUT);
    image.onload = () => {
      window.clearTimeout(timer);
      resolve(image.naturalWidth > 0 ? image : null);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      resolve(null);
    };
    image.src = url;
  });
}

type DeepZoomDims = { format: string; width: number; height: number; tileSize: number; overlap: number };

function descriptorFor(root: string, dims: DeepZoomDims) {
  return {
    Image: {
      xmlns: "http://schemas.microsoft.com/deepzoom/2008",
      Url: root,
      Format: dims.format,
      Overlap: String(dims.overlap),
      TileSize: String(dims.tileSize),
      Size: { Width: String(dims.width), Height: String(dims.height) },
    },
  };
}

function readCachedDims(key: string): DeepZoomDims | null {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const dims = JSON.parse(raw) as DeepZoomDims;
    return dims.width > 0 && dims.height > 0 && dims.tileSize > 0 ? dims : null;
  } catch {
    return null;
  }
}

function writeCachedDims(key: string, dims: DeepZoomDims) {
  try {
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(dims));
  } catch {
    /* storage full or blocked — discovery simply runs again next time */
  }
}

/**
 * Rebuild a DeepZoom descriptor from the public tile pyramid alone (plain <img> loads, no CORS),
 * so the map still opens when the .dzi file itself cannot be fetched. Every probe round runs in
 * parallel, so this takes ~25 small requests in three round trips:
 *   1. tile 0_0 of every level  → highest level, tile size, and the single-tile level widths;
 *   2. the 2nd/3rd tiles of the top level → overlap;
 *   3. the 1–3 candidate edge tiles → the exact image width and height.
 */
async function discoverDeepZoom(base: string, name: string): Promise<DeepZoomDims | null> {
  const root = `${base}${name}_files/`;
  const formats = ["jpg", "png", "jpeg"];
  const roots = await Promise.all(formats.map((format) => loadImage(`${root}0/0_0.${format}`)));
  const formatIndex = roots.findIndex(Boolean);
  if (formatIndex < 0) return null;
  const format = formats[formatIndex];
  const tile = (level: number, x: number, y: number) => loadImage(`${root}${level}/${x}_${y}.${format}`);

  const levels = await Promise.all(
    Array.from({ length: MAX_LEVEL + 1 }, (_, level) => (level === 0 ? Promise.resolve(roots[formatIndex]) : tile(level, 0, 0))),
  );
  let max = 0;
  levels.forEach((image, level) => {
    if (image) max = level;
  });
  const first = levels[max];
  if (!first) return null;

  const [right1, right2, down1, down2] = await Promise.all([tile(max, 1, 0), tile(max, 2, 0), tile(max, 0, 1), tile(max, 0, 2)]);
  // A middle tile carries overlap on both sides, the first tile only on one.
  let overlap: number | null = null;
  if (right1 && right2) overlap = right1.naturalWidth - first.naturalWidth;
  else if (down1 && down2) overlap = down1.naturalHeight - first.naturalHeight;
  const edge = Math.max(first.naturalWidth, first.naturalHeight);
  if (overlap === null || overlap < 0 || overlap > 8) overlap = edge % 2 === 1 ? 1 : 0;
  const tileSize = (right1 || down1 ? edge : edge + overlap) - overlap;

  const measure = async (dim: "naturalWidth" | "naturalHeight", hasSecond: boolean, probe: (i: number) => Promise<HTMLImageElement | null>) => {
    if (!hasSecond) return first[dim];
    const full = first[dim];
    // Largest level where this axis is still a single tile: its tile 0 is the whole level.
    let single = -1;
    for (let level = max - 1; level >= 0; level -= 1) {
      const image = levels[level];
      if (image && image[dim] < full) {
        single = level;
        break;
      }
    }
    if (single < 0) return null;
    const scale = 2 ** (max - single);
    const levelSize = levels[single]![dim];
    const lo = (levelSize - 1) * scale + 1;
    const hi = levelSize * scale;
    const firstCandidate = Math.max(1, Math.ceil(lo / tileSize) - 1);
    const lastCandidate = Math.max(firstCandidate, Math.ceil(hi / tileSize) - 1);
    const indices = Array.from({ length: Math.min(8, lastCandidate - firstCandidate + 1) }, (_, i) => firstCandidate + i);
    const images = await Promise.all(indices.map(probe));
    for (let i = indices.length - 1; i >= 0; i -= 1) {
      const image = images[i];
      if (image) return indices[i] * tileSize - overlap + image[dim];
    }
    return null;
  };

  const [width, height] = await Promise.all([
    measure("naturalWidth", Boolean(right1), (x) => tile(max, x, 0)),
    measure("naturalHeight", Boolean(down1), (y) => tile(max, 0, y)),
  ]);
  if (!width || !height) return null;
  return { format, width, height, tileSize, overlap };
}

/** Promise that resolves once `ms` have passed (or immediately if the signal says stop). */
function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

/**
 * Pan & zoom viewer (OpenSeadragon) for high-resolution society maps.
 * Supports DeepZoom (.dzi) tile pyramids and single large images.
 */
export function SocietyMapViewer({
  source,
  title,
  sourceName,
  sourceUrl,
}: {
  source: SocietyMapSource;
  title: string;
  sourceName: string;
  sourceUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [fullPage, setFullPage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let viewer: OpenSeadragon.Viewer | null = null;

    const fail = () => {
      if (!cancelled) setStatus("error");
    };

    (async () => {
      const OSD = (await import("openseadragon")).default;
      if (cancelled || !containerRef.current) return;
      viewer = OSD({
        element: containerRef.current,
        crossOriginPolicy: false,
        // The canvas drawer works with cross-origin tiles that send no CORS headers.
        drawer: "canvas",
        // Paint whatever resolution is ready right away instead of fading levels in.
        immediateRender: true,
        blendTime: 0,
        showNavigationControl: false,
        showNavigator: true,
        navigatorPosition: "BOTTOM_RIGHT",
        navigatorAutoFade: false,
        navigatorBackground: "#f4f7f5",
        navigatorBorderColor: "#0e3b2c",
        navigatorDisplayRegionColor: "#16a34a",
        visibilityRatio: 0.8,
        constrainDuringPan: true,
        minZoomImageRatio: 0.8,
        maxZoomPixelRatio: 3,
        animationTime: 0.6,
        springStiffness: 9,
        gestureSettingsMouse: { scrollToZoom: true, clickToZoom: false, dblClickToZoom: true },
        gestureSettingsTouch: { pinchToZoom: true, flickEnabled: true, dblClickToZoom: true },
      });
      viewerRef.current = viewer;
      viewer.addHandler("open", () => {
        if (!cancelled) setStatus("ready");
      });
      viewer.addHandler("full-page", (event) => {
        if (!cancelled) setFullPage(Boolean((event as unknown as { fullPage: boolean }).fullPage));
      });

      /* ---------- single HD image: CDN first, our proxy as the fallback ---------- */
      if (source.type === "image") {
        // `buildPyramid` is supported by OpenSeadragon's ImageTileSource but missing from the type definitions.
        const proxied = { tileSource: { type: "image", url: source.url, buildPyramid: true } as unknown as OpenSeadragon.TileSourceOptions };
        let usedProxy = !source.direct;
        viewer.addHandler("open-failed", () => {
          if (cancelled) return;
          if (usedProxy) return fail();
          usedProxy = true;
          viewer?.open(proxied);
        });
        viewer.open(source.direct ? { tileSource: { type: "image", url: source.direct, buildPyramid: false } as unknown as OpenSeadragon.TileSourceOptions } : proxied);
        return;
      }

      /* ---------- DeepZoom pyramid ---------- */
      const direct = source.direct;
      const cacheKey = direct ? `${direct.base}${direct.name}` : "";
      let mode: "direct" | "proxy" | null = null;
      let tileFailures = 0;
      let tilesLoaded = 0;

      const openProxy = () => {
        if (cancelled || mode === "proxy") return;
        mode = "proxy";
        viewer?.open({ tileSource: source.url });
      };
      const openDirect = (dims: DeepZoomDims) => {
        if (cancelled || !direct) return;
        mode = "direct";
        viewer?.open({ tileSource: descriptorFor(`${direct.base}${direct.name}_files/`, dims) });
      };

      viewer.addHandler("open-failed", () => {
        if (cancelled) return;
        if (mode === "proxy") fail();
      });
      viewer.addHandler("tile-loaded", () => {
        tilesLoaded += 1;
      });
      // Direct tiles suddenly blocked (hotlink rules changed)? Fall back to the proxy once.
      viewer.addHandler("tile-load-failed", () => {
        if (cancelled || mode !== "direct") return;
        tileFailures += 1;
        if (tilesLoaded === 0 && tileFailures >= 4) {
          if (direct) window.localStorage.removeItem(CACHE_PREFIX + cacheKey);
          openProxy();
        }
      });

      // Seen this map before: open straight from the source tiles, no round trips.
      const cached = direct ? readCachedDims(cacheKey) : null;
      if (cached) {
        openDirect(cached);
        return;
      }

      // Race our proxy against browser-side discovery; whichever answers first wins.
      let settled = false;
      const proxyOk = fetch(source.url, { signal: AbortSignal.timeout(8000) })
        .then((response) => response.ok)
        .catch(() => false);
      const discovery = direct
        ? Promise.race([proxyOk.then((ok) => (ok ? null : undefined)), wait(1500).then(() => undefined)]).then((skip) =>
            skip === null ? null : discoverDeepZoom(direct.base, direct.name),
          )
        : Promise.resolve(null);

      proxyOk.then((ok) => {
        if (cancelled || settled || !ok) return;
        settled = true;
        openProxy();
      });
      discovery.then((dims) => {
        if (cancelled || !dims || !direct) return;
        writeCachedDims(cacheKey, dims);
        if (settled) return;
        settled = true;
        openDirect(dims);
      });
      Promise.all([proxyOk, discovery]).then(([ok, dims]) => {
        if (!ok && !dims) fail();
      });
    })().catch(fail);

    return () => {
      cancelled = true;
      viewer?.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-open only when the map itself changes
  }, [source.type, source.url]);

  const zoom = (factor: number) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.viewport.zoomBy(factor);
    viewer.viewport.applyConstraints();
  };

  return (
    <div className="society-map-viewer-shell" data-testid="society-map-viewer" data-status={status}>
      <div ref={containerRef} className="society-map-viewer" role="img" aria-label={`${title} — zoomable map`} />

      {status === "ready" && (
        <div className="society-map-controls" role="toolbar" aria-label="Map controls">
          <button type="button" onClick={() => zoom(ZOOM_STEP)} aria-label="Zoom in" title="Zoom in">
            <span aria-hidden="true">+</span>
          </button>
          <button type="button" onClick={() => zoom(1 / ZOOM_STEP)} aria-label="Zoom out" title="Zoom out">
            <span aria-hidden="true">−</span>
          </button>
          <button type="button" onClick={() => viewerRef.current?.viewport.goHome()} aria-label="Reset view" title="Reset view">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5.5 10v9.5h13V10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => viewerRef.current?.setFullPage(!fullPage)}
            aria-label={fullPage ? "Exit full screen" : "Full screen"}
            title={fullPage ? "Exit full screen" : "Full screen"}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {fullPage ? (
                <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
              ) : (
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              )}
            </svg>
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="society-map-overlay" aria-live="polite">
          <span className="society-map-spinner" aria-hidden="true" />
          <span>Loading HD map…</span>
        </div>
      )}

      {status === "error" && (
        <div className="society-map-overlay society-map-overlay--error" role="alert">
          <strong>This map could not be loaded right now.</strong>
          <span>Please try again shortly, or open it on {sourceName}.</span>
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">
            Open on {sourceName}
          </a>
        </div>
      )}

      {status === "ready" && (
        <p className="society-map-hint">Scroll or pinch to zoom · drag to pan · double-click to zoom in</p>
      )}
    </div>
  );
}

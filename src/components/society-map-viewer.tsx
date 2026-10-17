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
const PROBE_TIMEOUT = 15000;

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.referrerPolicy = "no-referrer";
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

/** Largest n in [known, limit) for which exists(n) is true, given exists(known) === true. */
async function lastExisting(known: number, limit: number, exists: (n: number) => Promise<boolean>) {
  let lo = known;
  let hi = lo + 1;
  while (hi < limit && (await exists(hi))) {
    lo = hi;
    hi = Math.min(limit, hi * 2);
  }
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (await exists(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * Rebuild a DeepZoom descriptor from the public tile pyramid alone (plain <img> loads, no CORS),
 * so the map still opens when the .dzi file itself cannot be fetched.
 */
async function discoverDeepZoom(base: string, name: string) {
  const root = `${base}${name}_files/`;
  for (const format of ["jpg", "png", "jpeg"]) {
    const tile = (level: number, x: number, y: number) => loadImage(`${root}${level}/${x}_${y}.${format}`);
    if (!(await tile(0, 0, 0))) continue;
    const maxLevel = await lastExisting(0, 21, async (level) => Boolean(await tile(level, 0, 0)));
    const first = await tile(maxLevel, 0, 0);
    if (!first) return null;
    const cols = (await lastExisting(0, 4096, async (x) => Boolean(await tile(maxLevel, x, 0)))) + 1;
    const rows = (await lastExisting(0, 4096, async (y) => Boolean(await tile(maxLevel, 0, y)))) + 1;

    let overlap = 1;
    if (cols >= 3) {
      const second = await tile(maxLevel, 1, 0);
      if (second) overlap = second.naturalWidth - first.naturalWidth;
    } else if (rows >= 3) {
      const second = await tile(maxLevel, 0, 1);
      if (second) overlap = second.naturalHeight - first.naturalHeight;
    }
    overlap = Math.max(0, overlap);
    const tileSize = cols > 1 ? first.naturalWidth - overlap : rows > 1 ? first.naturalHeight - overlap : Math.max(first.naturalWidth, first.naturalHeight);

    const lastCol = cols > 1 ? await tile(maxLevel, cols - 1, 0) : first;
    const lastRow = rows > 1 ? await tile(maxLevel, 0, rows - 1) : first;
    if (!lastCol || !lastRow) return null;
    const width = cols > 1 ? (cols - 1) * tileSize + lastCol.naturalWidth - overlap : first.naturalWidth;
    const height = rows > 1 ? (rows - 1) * tileSize + lastRow.naturalHeight - overlap : first.naturalHeight;

    return {
      Image: {
        xmlns: "http://schemas.microsoft.com/deepzoom/2008",
        Url: root,
        Format: format,
        Overlap: String(overlap),
        TileSize: String(tileSize),
        Size: { Width: String(width), Height: String(height) },
      },
    };
  }
  return null;
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

    (async () => {
      const OSD = (await import("openseadragon")).default;
      if (cancelled || !containerRef.current) return;
      viewer = OSD({
        element: containerRef.current,
        // `buildPyramid` is supported by OpenSeadragon's ImageTileSource but missing from the type definitions.
        tileSources:
          source.type === "dzi"
            ? source.url
            : ({ type: "image", url: source.url, buildPyramid: true } as unknown as OpenSeadragon.TileSourceOptions),
        crossOriginPolicy: false,
        // The canvas drawer works with cross-origin tiles that send no CORS headers.
        drawer: "canvas",
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
      let triedDirect = false;
      viewer.addHandler("open-failed", async () => {
        if (cancelled) return;
        if (triedDirect || !source.direct) {
          setStatus("error");
          return;
        }
        // Our proxy could not reach the source: let the visitor's browser load it directly.
        triedDirect = true;
        if (source.type === "image") {
          viewer?.open({ tileSource: { type: "image", url: source.direct, buildPyramid: false } });
          return;
        }
        const descriptor = await discoverDeepZoom(source.direct.base, source.direct.name);
        if (cancelled) return;
        if (descriptor) viewer?.open({ tileSource: descriptor });
        else setStatus("error");
      });
      viewer.addHandler("full-page", (event) => {
        if (!cancelled) setFullPage(Boolean((event as unknown as { fullPage: boolean }).fullPage));
      });
    })().catch(() => {
      if (!cancelled) setStatus("error");
    });

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

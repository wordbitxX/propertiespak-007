"use client";

import { useEffect, useRef, useState } from "react";
import type OpenSeadragon from "openseadragon";

export type SocietyMapSource = { type: "dzi"; url: string } | { type: "image"; url: string };

type Status = "loading" | "ready" | "error";

const ZOOM_STEP = 1.5;

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
      viewer.addHandler("open-failed", () => {
        if (!cancelled) setStatus("error");
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

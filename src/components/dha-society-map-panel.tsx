"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { IconMap } from "@/components/icons";
import { SocietyMapViewer } from "@/components/society-map-viewer";
import { SOCIETY_MAPS } from "@/lib/society-maps";

const LeafletMap = dynamic(() => import("@/components/leaflet-map").then((mod) => mod.LeafletMap), {
  ssr: false,
  loading: () => <div className="dha-plot-map-loading">Loading interactive plot map…</div>,
});

type Tab = "plot" | "image";

/** [[south, west], [north, east]] covering every sector layer (DHA Plus bounds come in mixed order). */
function societyBounds(layers: { bounds: [number, number, number, number] }[]): [[number, number], [number, number]] | null {
  if (!layers.length) return null;
  let south = 90, west = 180, north = -90, east = -180;
  for (const { bounds: [a, b, c, d] } of layers) {
    south = Math.min(south, a, c);
    north = Math.max(north, a, c);
    west = Math.min(west, b, d);
    east = Math.max(east, b, d);
  }
  return [[south, west], [north, east]];
}

/**
 * DHA society map, the way dhaplus.com/maps shows it: the interactive satellite + plot-grid
 * map where DHA Plus publishes plot overlays, plus the zoomable HD map image.
 */
export function DhaSocietyMapPanel({
  slug,
  name,
  image,
  directImage,
  sourceName,
  sourceUrl,
}: {
  slug: string;
  name: string;
  image: string | null;
  directImage: string | null;
  sourceName: string;
  sourceUrl: string;
}) {
  const society = useMemo(() => SOCIETY_MAPS.find((item) => item.slug === slug) ?? null, [slug]);
  const bounds = useMemo(() => (society ? societyBounds(society.layers) : null), [society]);
  const [tab, setTab] = useState<Tab>(society ? "plot" : "image");

  const tabs: { key: Tab; label: string; available: boolean }[] = [
    { key: "plot", label: "Interactive plot map", available: Boolean(society && bounds) },
    { key: "image", label: "HD map image", available: Boolean(image) },
  ];
  const available = tabs.filter((item) => item.available);

  if (!available.length) {
    return (
      <div className="society-map-empty">
        <IconMap className="h-10 w-10 text-forest-700" aria-hidden="true" />
        <p className="font-sans text-[1.05rem] font-semibold text-navy-900">The HD map for {name} is not published yet.</p>
        <p className="text-[0.9rem] text-ink-muted">You can follow its progress on {sourceName}.</p>
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">
          Open on {sourceName}
        </a>
      </div>
    );
  }

  const active = available.some((item) => item.key === tab) ? tab : available[0].key;

  return (
    <div>
      {available.length > 1 && (
        <div className="dha-map-tabs" role="tablist" aria-label={`${name} map views`}>
          {available.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active === item.key}
              onClick={() => setTab(item.key)}
              className="dha-map-tab"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {active === "plot" && society && bounds ? (
        <div className="dha-plot-map" data-testid="dha-plot-map">
          <LeafletMap
            key={society.slug}
            center={{ lat: (bounds[0][0] + bounds[1][0]) / 2, lng: (bounds[0][1] + bounds[1][1]) / 2 }}
            zoom={14}
            fitBounds={bounds}
            society={society}
            showLocate={false}
            allowFullscreen
            heightClass="h-[520px] sm:h-[620px] lg:h-[min(78vh,760px)]"
            header={{
              label: "DHA Plus plot map",
              title: name,
              subtitle: `${society.layers.length} sector plot overlay${society.layers.length === 1 ? "" : "s"} · satellite view`,
            }}
          />
        </div>
      ) : image ? (
        <SocietyMapViewer
          source={{ type: "image", url: image, direct: directImage ?? undefined }}
          title={`${name} map`}
          sourceName={sourceName}
          sourceUrl={sourceUrl}
        />
      ) : null}
    </div>
  );
}

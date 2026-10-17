import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { DhaSocietiesExplorer } from "@/components/dha-societies-explorer";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { DHA_SOCIETY_MAPS, DHAPLUS_SOURCE, DEEP_ZOOM_MAPS } from "@/lib/map-library";

export const metadata = buildMetadata({
  title: "DHA Society Maps — HD Maps of 37 DHA Phases in Lahore, Islamabad, Karachi & More",
  description:
    "Browse HD maps of every DHA society in Pakistan: DHA Lahore Phase 1 to 13, Rahbar, EME, Ivy Green, DHA Islamabad Phase 1 to 7, DHA City Karachi, DHA Multan, Bahawalpur, Gujranwala, Quetta and Peshawar.",
  path: "/maps/dha-societies",
  keywords: [
    "dha society maps",
    "dha lahore map",
    "dha phase 6 map",
    "dha phase 9 prism map",
    "dha islamabad map",
    "dha city karachi map",
    "dha multan map",
    "dha bahawalpur map",
  ],
});

export default function DhaSocietiesMapsPage() {
  const cities = new Set(DHA_SOCIETY_MAPS.map((society) => society.city)).size;
  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: "DHA Society Maps",
          description: "HD maps of 37 DHA societies across Pakistan.",
          path: "/maps/dha-societies",
        })}
      />
      <PageHero
        eyebrow="DHA Societies Maps"
        title="Explore HD DHA Society Maps"
        description="High-resolution maps of every DHA phase and society across Pakistan. Open any map to zoom into blocks and sectors."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Maps", href: "/maps" },
          { name: "DHA Societies", href: "/maps/dha-societies" },
        ]}
      >
        <dl className="mt-6 flex flex-wrap gap-3 text-white">
          {[
            { value: DHA_SOCIETY_MAPS.length, label: "Societies" },
            { value: cities, label: "Cities" },
            { value: "HD", label: "Zoomable maps" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur">
              <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-white/70">{stat.label}</dt>
              <dd className="font-sans text-xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <Section tone="light">
        <div className="ui-container">
          <DhaSocietiesExplorer societies={DHA_SOCIETY_MAPS} />
          <p className="mt-8 text-[0.78rem] leading-relaxed text-ink-muted">
            Map source:{" "}
            <a href={DHAPLUS_SOURCE.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 hover:underline">
              {DHAPLUS_SOURCE.name}
            </a>
            . Maps are for general reference — verify plot details with the DHA office before buying.
          </p>
        </div>
      </Section>

      <Section tone="mist">
        <div className="ui-container">
          <h2 className="font-sans text-[1.15rem] font-semibold text-navy-900">More society maps</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/maps" className="chip">
              PDF maps library
            </Link>
            {DEEP_ZOOM_MAPS.map((map) => (
              <Link key={map.slug} href={`/maps/${map.slug}`} className="chip">
                {map.label}
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

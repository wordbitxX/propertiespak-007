import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { SocietyMapViewer } from "@/components/society-map-viewer";
import { IconArrowRight, IconMap, IconPin } from "@/components/icons";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import {
  DEEP_ZOOM_MAPS,
  PPS_SOURCE,
  deepZoomMapsInGroup,
  deepZoomProxyUrl,
  getDeepZoomMap,
  type DeepZoomMapGroup,
} from "@/lib/map-library";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEEP_ZOOM_MAPS.map((map) => ({ slug: map.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

const GROUP_LABEL: Record<DeepZoomMapGroup, string> = {
  bahria: "Bahria Town Maps",
  dha: "DHA Maps",
  other: "More Lahore society maps",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const map = getDeepZoomMap(slug);
  if (!map) return {};
  return buildMetadata({
    title: `${map.title} — HD Zoomable Map (${new Date().getFullYear()})`,
    description: `${map.description} Zoom in to read block names and plot numbers.`,
    path: `/maps/${map.slug}`,
    keywords: [`${map.title.toLowerCase()}`, `${map.society.toLowerCase()} map`, `${map.society.toLowerCase()} plot map`, "society map lahore"],
  });
}

export default async function DeepZoomMapPage({ params }: PageProps) {
  const { slug } = await params;
  const map = getDeepZoomMap(slug);
  if (!map) notFound();

  const related = deepZoomMapsInGroup(map.group).filter((item) => item.slug !== map.slug);
  const otherGroups = (["dha", "bahria", "other"] as DeepZoomMapGroup[]).filter((group) => group !== map.group);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Maps", href: "/maps" },
    { name: map.title, href: `/maps/${map.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: map.title,
          description: map.description,
          path: `/maps/${map.slug}`,
          about: [map.society, `${map.society} map`],
        })}
      />
      <PageHero eyebrow={`${GROUP_LABEL[map.group]} · ${map.city}`} title={map.title} description={map.description} crumbs={crumbs} />

      <Section tone="light">
        <div className="ui-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <SocietyMapViewer
              source={{ type: "dzi", url: deepZoomProxyUrl(map) }}
              title={map.title}
              sourceName={PPS_SOURCE.name}
              sourceUrl={map.sourceUrl}
            />
            <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-muted">
              Map source:{" "}
              <a href={map.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 underline-offset-2 hover:underline">
                {PPS_SOURCE.name}
              </a>
              . Maps are for general reference — always verify plot numbers, boundaries and approvals with the society
              office before buying.
            </p>
          </div>

          <aside className="space-y-6">
            {related.length > 0 && (
              <nav aria-label={GROUP_LABEL[map.group]} className="rounded-panel border border-soft bg-white p-5 shadow-soft">
                <p className="eyebrow text-forest-700">{GROUP_LABEL[map.group]}</p>
                <ul className="mt-3 space-y-1">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/maps/${item.slug}`} className="society-map-side-link">
                        <IconMap className="h-4 w-4 shrink-0 text-forest-700" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {otherGroups.map((group) => (
              <nav key={group} aria-label={GROUP_LABEL[group]} className="rounded-panel border border-soft bg-white p-5 shadow-soft">
                <p className="eyebrow text-forest-700">{GROUP_LABEL[group]}</p>
                <ul className="mt-3 space-y-1">
                  {deepZoomMapsInGroup(group).map((item) => (
                    <li key={item.slug}>
                      <Link href={`/maps/${item.slug}`} className="society-map-side-link">
                        <IconMap className="h-4 w-4 shrink-0 text-forest-700" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="rounded-panel border border-soft bg-[#F4F7F5] p-5">
              <p className="font-sans text-[0.95rem] font-semibold text-navy-900">More society maps</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/maps" className="society-map-side-link">
                  <IconArrowRight className="h-4 w-4 shrink-0 text-forest-700" /> PDF maps library
                </Link>
                <Link href="/maps/dha-societies" className="society-map-side-link">
                  <IconArrowRight className="h-4 w-4 shrink-0 text-forest-700" /> DHA societies HD maps
                </Link>
                <Link href={`/properties?q=${encodeURIComponent(map.society)}`} className="society-map-side-link">
                  <IconPin className="h-4 w-4 shrink-0 text-forest-700" /> Properties in {map.society}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { DhaSocietyMapPanel } from "@/components/dha-society-map-panel";
import { IconArrowRight, IconMap, IconPin } from "@/components/icons";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import {
  DHA_SOCIETY_MAPS,
  DHAPLUS_SOURCE,
  dhaSocietyImageUrl,
  dhaSocietySourceUrl,
  getDhaSocietyMap,
} from "@/lib/map-library";

export const dynamicParams = false;

export function generateStaticParams() {
  return DHA_SOCIETY_MAPS.map((society) => ({ slug: society.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const society = getDhaSocietyMap(slug);
  if (!society) return {};
  return {
    ...buildMetadata({
    title: `${society.name} Map — HD Society Map`,
    description: `HD zoomable map of ${society.name}${society.blocks ? ` with ${society.blocks} blocks` : ""}. Zoom into sectors, blocks and roads before you buy.`,
    path: `/maps/dha-societies/${society.slug}`,
    keywords: [`${society.name.toLowerCase()} map`, `${society.name.toLowerCase()} block map`, "dha society map"],
    }),
    referrer: "no-referrer",
  };
}

export default async function DhaSocietyMapPage({ params }: PageProps) {
  const { slug } = await params;
  const society = getDhaSocietyMap(slug);
  if (!society) notFound();

  const image = dhaSocietyImageUrl(society);
  const sourceUrl = dhaSocietySourceUrl(society);
  const sameCity = DHA_SOCIETY_MAPS.filter((item) => item.city === society.city && item.slug !== society.slug);
  const description = `HD map of ${society.name}${society.blocks ? ` covering ${society.blocks} blocks` : ""}. Zoom in to explore sectors, blocks and main roads.`;

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: `${society.name} Map`,
          description,
          path: `/maps/dha-societies/${society.slug}`,
          about: [society.name, `${society.name} map`],
        })}
      />
      <PageHero
        eyebrow={`DHA Societies Maps · ${society.city}`}
        title={`${society.name} Map`}
        description={description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Maps", href: "/maps" },
          { name: "DHA Societies", href: "/maps/dha-societies" },
          { name: society.name, href: `/maps/dha-societies/${society.slug}` },
        ]}
      />

      <Section tone="light">
        <div className="ui-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <DhaSocietyMapPanel
              slug={society.slug}
              name={society.name}
              image={image}
              directImage={society.image ? `${DHAPLUS_SOURCE.imageBase}${society.image}` : null}
              sourceName={DHAPLUS_SOURCE.name}
              sourceUrl={sourceUrl}
            />
            <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-muted">
              Map source:{" "}
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 hover:underline">
                {DHAPLUS_SOURCE.name}
              </a>
              . Maps are for general reference — verify plot details with the DHA office before buying.
            </p>
          </div>

          <aside className="space-y-6">
            {sameCity.length > 0 && (
              <nav aria-label={`More DHA maps in ${society.city}`} className="rounded-panel border border-soft bg-white p-5 shadow-soft">
                <p className="eyebrow text-forest-700">More in {society.city}</p>
                <ul className="mt-3 max-h-[440px] space-y-1 overflow-y-auto pr-1">
                  {sameCity.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/maps/dha-societies/${item.slug}`} className="society-map-side-link">
                        <IconMap className="h-4 w-4 shrink-0 text-forest-700" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="rounded-panel border border-soft bg-[#F4F7F5] p-5">
              <p className="font-sans text-[0.95rem] font-semibold text-navy-900">More society maps</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/maps/dha-societies" className="society-map-side-link">
                  <IconArrowRight className="h-4 w-4 shrink-0 text-forest-700" /> All DHA societies
                </Link>
                <Link href="/maps" className="society-map-side-link">
                  <IconArrowRight className="h-4 w-4 shrink-0 text-forest-700" /> PDF maps library
                </Link>
                <Link href={`/properties?q=${encodeURIComponent(society.name)}`} className="society-map-side-link">
                  <IconPin className="h-4 w-4 shrink-0 text-forest-700" /> Properties in {society.name}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

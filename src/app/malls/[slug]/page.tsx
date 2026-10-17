import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PropertyCard } from "@/components/property-card";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/section";
import Image from "next/image";
import { getAllMallSlugs, getMallBySlug, mallDirectionsUrl, mallImage, MALLS } from "@/lib/malls";
import { getLandingProperties } from "@/lib/queries";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, mallJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllMallSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mall = getMallBySlug(slug);
  if (!mall) {
    return buildMetadata({ title: "Mall not found", description: "This mall page is not available on Properties Pak.", path: "/malls" });
  }
  const statusLine = mall.status === "open" ? `Open${mall.opened ? ` since ${mall.opened}` : ""}` : "Coming soon — under construction/announced";
  const cover = mallImage(mall);
  return buildMetadata({
    image: cover.src,
    title: `${mall.name}, ${mall.city} — Location, Shops & Property Nearby | Properties Pak`,
    description: `${mall.name} in ${mall.area}, ${mall.city}: ${statusLine}. ${mall.description} See live property for sale and rent near ${mall.name} on Properties Pak.`,
    path: `/malls/${mall.slug}`,
    keywords: [
      mall.name,
      `${mall.name} ${mall.city}`,
      `malls in ${mall.city}`,
      `${mall.name} location`,
      `${mall.name} shops`,
      mall.status === "upcoming" ? `${mall.name} opening date` : `${mall.name} property nearby`,
      `best malls in ${mall.city}`,
      `biggest mall in ${mall.city}`,
      `shops in ${mall.name}`,
      "shopping malls in Pakistan",
    ],
    ogKicker: mall.status === "open" ? "SHOPPING MALL" : "COMING SOON",
    ogSubtitle: `${mall.name} · ${mall.area}, ${mall.city}`,
  });
}

export default async function MallDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const mall = getMallBySlug(slug);
  if (!mall) notFound();

  const upcoming = mall.status === "upcoming";
  const nearby = mall.citySlug
    ? await getLandingProperties({ city: mall.citySlug, q: mall.area.split(",")[0], pageSize: 6 }, 6).catch(() => ({ items: [], total: 0 }))
    : { items: [], total: 0 };
  const cityMalls = MALLS.filter((item) => item.city === mall.city && item.slug !== mall.slug).slice(0, 6);
  const propertyHref = mall.citySlug
    ? `/properties?city=${mall.citySlug}&q=${encodeURIComponent(mall.area.split(",")[0])}`
    : `/properties?q=${encodeURIComponent(mall.city)}`;
  const commercialHref = mall.citySlug ? `/properties/commercial?city=${mall.citySlug}` : "/properties/commercial";

  const faqs = [
    {
      question: `Where is ${mall.name} located?`,
      answer: `${mall.name} is in ${mall.area}, ${mall.city}. Use the directions button on this page for live navigation, and check parking and peak-hour traffic before a weekend visit.`,
    },
    upcoming
      ? {
          question: `When will ${mall.name} open?`,
          answer: `${mall.name} is ${mall.expected?.toLowerCase() ?? "an announced project"}. Opening timelines for projects of this size are announced by the developer and can change with construction progress — this page is updated as the project moves, and no opening date should be treated as guaranteed.`,
        }
      : {
          question: `When did ${mall.name} open?`,
          answer: mall.opened
            ? `${mall.name} opened in ${mall.opened} and is trading now in ${mall.area}, ${mall.city}.`
            : `${mall.name} is open and trading in ${mall.area}, ${mall.city}.`,
        },
    {
      question: `Is property near ${mall.name} a good buy?`,
      answer: `Malls lift footfall, shop rents and staff housing demand around them, which supports — but does not guarantee — property values nearby. Compare live listings near ${mall.name} with the Pakistan Property Price Index, and verify any specific property's title, dues and transfer procedure before paying a token amount.`,
    },
  ];

  const cover = mallImage(mall);

  const facts: { label: string; value: string }[] = [
    { label: "Status", value: upcoming ? `Coming soon · ${mall.expected ?? "Announced"}` : `Open${mall.opened ? ` since ${mall.opened}` : ""}` },
    { label: "Location", value: `${mall.area}, ${mall.city}` },
    ...(mall.developer ? [{ label: "Developer / group", value: mall.developer }] : []),
    ...(mall.sizeLabel ? [{ label: "Scale", value: mall.sizeLabel }] : []),
    ...(mall.storesLabel ? [{ label: "Stores", value: mall.storesLabel }] : []),
  ];

  return (
    <>
      <JsonLd data={mallJsonLd({ slug: mall.slug, name: mall.name, description: mall.description, city: mall.city, area: mall.area, status: mall.status, openingDate: mall.opened, image: cover.src })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Malls", href: "/malls" },
          { name: mall.name, href: `/malls/${mall.slug}` },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="relative isolate overflow-hidden bg-[#04150E] pb-14 pt-32 text-white lg:pb-16 lg:pt-40">
        <Image src={cover.src} alt={cover.alt} fill priority sizes="100vw" className="object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,21,14,0.66) 0%, rgba(4,21,14,0.45) 40%, rgba(4,21,14,0.95) 100%), linear-gradient(95deg, rgba(4,21,14,0.85) 0%, rgba(4,21,14,0.28) 60%, rgba(4,21,14,0.12) 100%)",
          }}
        />
        <div className="ui-container relative z-10">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Malls", href: "/malls" },
              { name: mall.name, href: `/malls/${mall.slug}` },
            ]}
          />
          <p className="eyebrow mt-8 text-[#DFB872]">
            <span className="h-[1px] w-6 bg-current opacity-70" />
            {upcoming ? "Coming soon · Upcoming mall" : "Shopping mall"} · {mall.city}
          </p>
          <h1 className="display-2 mt-4 max-w-4xl text-white">
            {mall.name} — {mall.city}
          </h1>
          <p className="lede mt-4 max-w-3xl text-white/80">{mall.description}</p>

          <dl className="mt-9 flex flex-wrap gap-2.5">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-white/18 bg-white/[0.08] px-4 py-3 backdrop-blur-md"
              >
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#DFB872]">{fact.label}</dt>
                <dd className="mt-1 font-sans text-[0.9rem] font-bold leading-snug text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={mallDirectionsUrl(mall)} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Get directions
            </a>
            <Link href={propertyHref} className="btn btn-green">
              Property near this mall
            </Link>
            <Link href={commercialHref} className="btn btn-ghost-light">
              Shops & commercial nearby
            </Link>
          </div>
        </div>
      </section>

      <Section tone="light">
        <div className="ui-container">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <SectionHeading eyebrow="Highlights" title={`What ${mall.name} is known for`} />
              <ul className="mt-6 space-y-3.5">
                {mall.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 border-b border-soft pb-3.5 text-[0.9375rem] leading-relaxed text-ink">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-muted">
                {upcoming
                  ? `Because ${mall.name} is still ${mall.expected?.toLowerCase() ?? "in development"}, the smartest property moves around it usually happen before opening: shops and apartments within walking distance reprice as construction milestones land. Track progress here, and compare asking prices with the wider ${mall.city} market before committing.`
                  : `For property hunters, ${mall.name} is the anchor of its catchment: homes within a short drive rent to mall staff, managers and the families who want the retail on their doorstep, and commercial units on the approach roads trade on its footfall.`}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/pakistan-property-price-index" className="btn btn-outline">
                  Pakistan Property Price Index
                </Link>
                {mall.citySlug && (
                  <Link href={`/city/${mall.citySlug}`} className="btn btn-outline">
                    {mall.city} property hub
                  </Link>
                )}
                <Link href="/maps" className="btn btn-outline">
                  Society PDF Maps
                </Link>
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Questions" title={`${mall.name} FAQs`} />
              <div className="mt-5 grid gap-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-panel border border-soft bg-white px-5 py-4 shadow-soft">
                    <summary className="cursor-pointer list-none font-sans text-[0.9375rem] font-semibold text-navy-900">
                      {faq.question}
                    </summary>
                    <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {nearby.items.length > 0 && (
        <Section tone="mist">
          <div className="ui-container">
            <SectionHeading
              eyebrow="Live listings"
              title={`Property near ${mall.name}`}
              description={`Houses, apartments, shops and plots currently listed around ${mall.area}, ${mall.city}.`}
              action={{ label: "See all nearby", href: propertyHref }}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.items.slice(0, 6).map((property, index) => (
                <Reveal key={property.id} delay={index * 40}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {cityMalls.length > 0 && (
        <Section tone="light">
          <div className="ui-container">
            <SectionHeading
              eyebrow="Keep exploring"
              title={`More malls in ${mall.city}`}
              action={{ label: "All Pakistan malls", href: "/malls" }}
            />
            <div className="mt-7 flex flex-wrap gap-2">
              {cityMalls.map((item) => (
                <Link key={item.slug} href={`/malls/${item.slug}`} className="chip">
                  {item.name}
                  {item.status === "upcoming" ? " · Coming soon" : ""}
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}

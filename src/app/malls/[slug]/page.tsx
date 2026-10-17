import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { KeywordLinks } from "@/components/keyword-links";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { PropertyCard } from "@/components/property-card";
import { IconPin } from "@/components/icons";
import { MALLS, getMallBySlug, type Mall } from "@/lib/malls";
import { searchProperties } from "@/lib/queries";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  mallJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const mall = getMallBySlug(slug);
  if (!mall) return {};
  return buildMetadata({
    title: `${mall.name} — Shops for Sale & Rent in ${mall.name}, ${mall.cityName} | Properties Pak`,
    description: `${mall.summary} Find shops, offices and commercial units for sale and rent in ${mall.name}, ${mall.location} — prices, installments and verified agents on Properties Pak.`,
    path: `/malls/${mall.slug}`,
    keywords: mall.keywords,
    ogKicker: mall.status === "Coming soon" ? "Coming soon" : "Mall guide",
  });
}

function mallFaqs(mall: Mall) {
  return [
    {
      question: `Where is ${mall.name} located?`,
      answer: `${mall.name} is located at ${mall.location} in ${mall.cityName}, Pakistan. ${mall.note}. Open the listings on this page for the exact shop or unit locations inside the mall.`,
    },
    {
      question: `Are shops available for sale in ${mall.name}?`,
      answer: `${mall.status === "Coming soon" ? "As a " + mall.status.toLowerCase() + " project, " + mall.name + " is being marketed ahead of completion — shops and commercial units are typically sold through the developer or on resale." : "Yes — shops and commercial units in " + mall.name + " come up for sale on resale, and mall management or the developer may also release inventory directly."} Current listings appear on this page, and our verified agents in ${mall.cityName} can share recent price comparisons for the mall.`,
    },
    {
      question: `What is the price of shops in ${mall.name}?`,
      answer: `Shop prices in ${mall.name} vary by floor, frontage and unit size — ground-floor and food-court units command the highest rates. Use the live listings on this page as the price benchmark, and compare asking prices per square foot with similar units in ${mall.cityName} before you negotiate.`,
    },
    {
      question: `Can I buy a shop in ${mall.name} on installments?`,
      answer: `${mall.status === "Coming soon" ? "Installment plans are commonly offered for under-development malls like " + mall.name + " — always confirm the possession timeline, development schedule and any mark-up in writing before paying a booking amount." : "Installment-based resale deals appear occasionally for open malls like " + mall.name + ", usually arranged directly between buyer and seller. Compare the total payable against a one-time purchase before committing."}`,
    },
    {
      question: `What facilities does ${mall.name} offer?`,
      answer: `${mall.highlights.join(", ")}. For the latest store directory and opening timings, check with the mall management.`,
    },
  ];
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-panel border border-soft bg-white px-5 py-4 shadow-soft">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-1.5 font-sans text-[1.02rem] font-bold leading-snug text-navy-900">{value}</p>
    </div>
  );
}

export default async function MallPage({ params }: Params) {
  const { slug } = await params;
  const mall = getMallBySlug(slug);
  if (!mall) notFound();

  const listings = await searchProperties({ q: mall.name, pageSize: 6 });
  const related = [...MALLS.filter((item) => item.slug !== mall.slug && item.citySlug === mall.citySlug), ...MALLS.filter(
    (item) => item.slug !== mall.slug && item.citySlug !== mall.citySlug,
  )].slice(0, 4);
  const faqs = mallFaqs(mall);

  return (
    <div>
      <PageHero
        eyebrow={mall.status === "Coming soon" ? "COMING SOON" : mall.status === "New" ? "NEW MALL" : "MALL GUIDE"}
        title={`${mall.name} — Shops & Commercial Units`}
        description={`${mall.summary}`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Malls", href: "/malls" },
          { name: mall.name, href: `/malls/${mall.slug}` },
        ]}
      />

      <Section tone="light" id="overview">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Overview"
            title={`About ${mall.name}`}
            description={`${mall.name} sits at ${mall.location} — one of the organised retail addresses in ${mall.cityName}.`}
            action={{ label: `All properties in ${mall.cityName}`, href: `/properties?city=${mall.citySlug}` }}
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard label="City" value={`${mall.cityName}, Pakistan`} />
            <DetailCard label="Location" value={mall.location} />
            <DetailCard label="Status" value={mall.status} />
            <DetailCard label="At a glance" value={mall.note} />
          </div>

          <div className="mt-8 rounded-panel border border-soft bg-white p-6 shadow-soft">
            <h3 className="font-sans text-[1.05rem] font-bold text-navy-900">Why {mall.name} attracts buyers</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {mall.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-ink-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.82rem] leading-relaxed text-ink-muted">
              Looking for a shop, kiosk, food-court unit or office in {mall.name}? Compare live asking prices below, or talk to a
              verified {mall.cityName} agent who deals inside this mall.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="mist" id="listings">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Live inventory"
            title={`Property in ${mall.name}`}
            description={`Current listings matching ${mall.name} — shops, offices and commercial units for sale and rent.`}
            action={{ label: "All commercial property", href: "/properties/commercial" }}
          />
          {listings.items.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.items.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-panel border border-dashed border-forest-200 bg-white p-10 text-center">
              <p className="font-sans text-[1.05rem] font-bold text-navy-900">
                No listings inside {mall.name} right now
              </p>
              <p className="mx-auto mt-2 max-w-xl text-[0.92rem] leading-relaxed text-ink-muted">
                Inventory inside {mall.name} moves fast. Browse commercial property across {mall.cityName}, or send a request and a
                verified agent will contact you when a unit opens up in this mall.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/properties/commercial?city=${mall.citySlug}`}
                  className="btn-gold rounded-lg px-5 py-2.5 text-[0.86rem]"
                >
                  Commercial property in {mall.cityName}
                </Link>
                <Link
                  href="/list-property"
                  className="rounded-lg border border-forest-300 px-5 py-2.5 text-[0.86rem] font-semibold text-forest-700 transition-colors hover:bg-forest-50"
                >
                  List your property
                </Link>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section tone="light" id="malls-faq">
        <div className="ui-container">
          <FaqList
            faqs={faqs}
            title={`${mall.name} — frequently asked questions`}
            description={`Location, prices, installments and facilities at ${mall.name}, ${mall.cityName}.`}
          />
        </div>
      </Section>

      <Section tone="mist" id="related-malls">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Keep exploring"
            title="More malls to explore"
            description={`Other famous and upcoming malls across Pakistan — including more in ${mall.cityName}.`}
            action={{ label: "All malls", href: "/malls" }}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/malls/${item.slug}`}
                className="group rounded-panel border border-soft bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-card"
              >
                <p className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-forest-700">
                  <IconPin className="h-3 w-3" />
                  {item.cityName}
                </p>
                <h3 className="mt-2 font-sans text-[0.98rem] font-bold leading-snug text-navy-900 group-hover:text-forest-700">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-[0.8rem] text-ink-muted">{item.status}</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <KeywordLinks
        title={`Popular searches for ${mall.name}`}
        description={`What shoppers and investors search when they look for shops and units in ${mall.name}.`}
        tone="light"
        links={mall.keywords.map((label) => ({
          label,
          href: `/properties?q=${encodeURIComponent(label)}`,
        }))}
      />

      <JsonLd
        data={webPageJsonLd({
          name: `${mall.name} — Shops & Commercial Units`,
          description: mall.summary,
          path: `/malls/${mall.slug}`,
          about: [mall.name, `Shopping malls in ${mall.cityName}`],
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Malls", href: "/malls" },
          { name: mall.name, href: `/malls/${mall.slug}` },
        ])}
      />
      <JsonLd
        data={mallJsonLd({
          name: mall.name,
          location: mall.location,
          cityName: mall.cityName,
          summary: mall.summary,
          keywords: mall.keywords,
          path: `/malls/${mall.slug}`,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />
    </div>
  );
}

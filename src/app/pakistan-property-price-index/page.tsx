import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { formatPrice } from "@/lib/format";
import { getPriceIndex } from "@/lib/queries";
import { buildMetadata, faqJsonLd, priceIndexJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pakistan Property Price Index — Median Prices & Price per Sq Ft by City",
  description:
    "The Pakistan Property Price Index by Properties Pak: median asking prices, price per square foot and median rents for houses, apartments, plots and commercial property, computed from live listings by city, type and area.",
  path: "/pakistan-property-price-index",
  keywords: [
    "Pakistan property price index",
    "property prices in Pakistan",
    "price per square foot Lahore",
    "price per square foot Islamabad",
    "price per square foot Karachi",
    "house prices Pakistan",
    "property rates Pakistan",
  ],
  ogKicker: "PRICE INDEX",
  ogSubtitle: "Median asking prices and price per sq ft from live Pakistan listings, by city, type and area.",
});

const FAQS = [
  {
    question: "What is the Pakistan Property Price Index?",
    answer:
      "It is Properties Pak's own asking-price index for Pakistan: median sale prices, median price per square foot and median monthly rents computed from the live listings published on the marketplace, grouped by city, property type and area. It refreshes as listings are added, repriced or removed.",
  },
  {
    question: "How is the price per square foot calculated?",
    answer:
      "For each sale listing with a stated size, we divide the asking price by the area in square feet, then take the median across the group. The median is used instead of the average so a few very expensive listings cannot pull the whole city figure up.",
  },
  {
    question: "Are these transaction prices or asking prices?",
    answer:
      "Asking prices — the prices sellers and dealers publish. Final transaction prices in Pakistan are usually negotiated and are not publicly registered in a searchable dataset, so treat the index as a market guide for comparing cities and areas, not as a valuation of a specific property.",
  },
  {
    question: "How often does the index update?",
    answer:
      "The figures are recomputed from live inventory as the marketplace changes, so a city or area figure moves when new listings arrive or prices are revised. Use the city and society guides alongside the index for local context before making an offer.",
  },
];

function ppsf(value: number) {
  return value > 0 ? `PKR ${Math.round(value).toLocaleString("en-PK")}` : "—";
}

export default async function PriceIndexPage() {
  const index = await getPriceIndex();
  const updated = new Date(index.generatedAt).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd data={priceIndexJsonLd({ listings: index.totals.listings, cities: index.totals.cities, dateModified: index.generatedAt })} />
      <JsonLd data={faqJsonLd(FAQS)} />

      <PageHero
        eyebrow="Properties Pak data · Updated from live listings"
        title="Pakistan Property Price Index"
        description={`Median asking prices, price per square foot and median rents from ${index.totals.listings.toLocaleString("en-PK")} live listings across ${index.totals.cities} cities and ${index.totals.areas} areas — the reference our own guides cite, published so anyone can link to it.`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Pakistan Property Price Index", href: "/pakistan-property-price-index" },
        ]}
      />

      <Section tone="light">
        <div className="ui-container">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Median price per sq ft (sale)", value: ppsf(index.totals.medianPpsf), note: "Across all sale listings with a stated size" },
              { label: "Median asking price (sale)", value: index.totals.medianPrice > 0 ? formatPrice(index.totals.medianPrice, "total") : "—", note: `${index.totals.saleListings.toLocaleString("en-PK")} sale listings` },
              { label: "Live listings analysed", value: index.totals.listings.toLocaleString("en-PK"), note: `${index.totals.rentListings.toLocaleString("en-PK")} of them for rent` },
              { label: "Markets covered", value: `${index.totals.cities} cities`, note: `${index.totals.areas} distinct areas · ${updated}` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-panel border border-soft bg-white px-5 py-4 shadow-soft">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{stat.label}</p>
                <p className="mt-1.5 font-sans text-[1.35rem] font-bold leading-tight text-navy-900">{stat.value}</p>
                <p className="mt-1 text-[0.75rem] text-ink-muted">{stat.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
            Cite this page freely as <span className="font-semibold text-navy-900">“Pakistan Property Price Index — Properties Pak”</span>{" "}
            with a link back to this URL. Figures are medians of asking prices, not registered transactions; see the methodology and
            FAQs below before quoting a number.
          </p>
        </div>
      </Section>

      <Section tone="mist">
        <div className="ui-container">
          <SectionHeading
            eyebrow="By city"
            title="Median prices by city"
            description="Sale medians use every live sale listing in the city; rent medians use monthly asking rents."
          />
          <div className="mt-8 overflow-x-auto rounded-panel border border-soft bg-white shadow-soft">
            <table className="w-full min-w-[720px] text-left text-[0.875rem]">
              <thead>
                <tr className="border-b border-soft text-[0.75rem] uppercase tracking-[0.1em] text-ink-muted">
                  <th className="px-5 py-3.5 font-semibold">City</th>
                  <th className="px-5 py-3.5 font-semibold">Listings</th>
                  <th className="px-5 py-3.5 font-semibold">Median asking price</th>
                  <th className="px-5 py-3.5 font-semibold">Median price / sq ft</th>
                  <th className="px-5 py-3.5 font-semibold">Median rent / month</th>
                  <th className="px-5 py-3.5 font-semibold">Browse</th>
                </tr>
              </thead>
              <tbody>
                {index.byCity.map((row) => (
                  <tr key={row.key} className="border-b border-soft last:border-b-0">
                    <td className="px-5 py-3.5 font-sans font-semibold text-navy-900">{row.label}</td>
                    <td className="px-5 py-3.5">{row.listings.toLocaleString("en-PK")}</td>
                    <td className="px-5 py-3.5">{row.medianPrice > 0 ? formatPrice(row.medianPrice, "total") : "—"}</td>
                    <td className="px-5 py-3.5">{ppsf(row.medianPpsf)}</td>
                    <td className="px-5 py-3.5">{row.medianRent > 0 ? formatPrice(row.medianRent, "month") : "—"}</td>
                    <td className="px-5 py-3.5">
                      <Link href={`/property-for-sale-in-${row.citySlug}`} className="font-semibold text-forest-700 hover:underline">
                        {row.label} property
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="ui-container">
          <SectionHeading
            eyebrow="By property type"
            title="Median prices by property type"
            description="Plots carry no covered area on many listings, so their per-square-foot median can read differently from houses and apartments — compare within a type, not across types."
          />
          <div className="mt-8 overflow-x-auto rounded-panel border border-soft bg-white shadow-soft">
            <table className="w-full min-w-[640px] text-left text-[0.875rem]">
              <thead>
                <tr className="border-b border-soft text-[0.75rem] uppercase tracking-[0.1em] text-ink-muted">
                  <th className="px-5 py-3.5 font-semibold">Type</th>
                  <th className="px-5 py-3.5 font-semibold">Listings</th>
                  <th className="px-5 py-3.5 font-semibold">Median asking price</th>
                  <th className="px-5 py-3.5 font-semibold">Median price / sq ft</th>
                  <th className="px-5 py-3.5 font-semibold">Median rent / month</th>
                </tr>
              </thead>
              <tbody>
                {index.byCategory.map((row) => (
                  <tr key={row.key} className="border-b border-soft last:border-b-0">
                    <td className="px-5 py-3.5 font-sans font-semibold capitalize text-navy-900">{row.label.replaceAll("_", " ")}</td>
                    <td className="px-5 py-3.5">{row.listings.toLocaleString("en-PK")}</td>
                    <td className="px-5 py-3.5">{row.medianPrice > 0 ? formatPrice(row.medianPrice, "total") : "—"}</td>
                    <td className="px-5 py-3.5">{ppsf(row.medianPpsf)}</td>
                    <td className="px-5 py-3.5">{row.medianRent > 0 ? formatPrice(row.medianRent, "month") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="ui-container">
          <SectionHeading
            eyebrow="By area"
            title="Most-listed areas in Pakistan"
            description="Areas with at least three live listings, ranked by supply. Pair an area figure with its society guide before treating it as a price for a specific street or block."
            action={{ label: "Browse towns & societies", href: "/towns" }}
          />
          <div className="mt-8 overflow-x-auto rounded-panel border border-soft bg-white shadow-soft">
            <table className="w-full min-w-[640px] text-left text-[0.875rem]">
              <thead>
                <tr className="border-b border-soft text-[0.75rem] uppercase tracking-[0.1em] text-ink-muted">
                  <th className="px-5 py-3.5 font-semibold">Area</th>
                  <th className="px-5 py-3.5 font-semibold">Listings</th>
                  <th className="px-5 py-3.5 font-semibold">Median asking price</th>
                  <th className="px-5 py-3.5 font-semibold">Median price / sq ft</th>
                  <th className="px-5 py-3.5 font-semibold">Median rent / month</th>
                </tr>
              </thead>
              <tbody>
                {index.byArea.map((row) => (
                  <tr key={row.key} className="border-b border-soft last:border-b-0">
                    <td className="px-5 py-3.5 font-sans font-semibold text-navy-900">
                      <Link href={`/properties?city=${row.citySlug}&q=${encodeURIComponent(row.label)}`} className="hover:underline">
                        {row.label}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">{row.listings.toLocaleString("en-PK")}</td>
                    <td className="px-5 py-3.5">{row.medianPrice > 0 ? formatPrice(row.medianPrice, "total") : "—"}</td>
                    <td className="px-5 py-3.5">{ppsf(row.medianPpsf)}</td>
                    <td className="px-5 py-3.5">{row.medianRent > 0 ? formatPrice(row.medianRent, "month") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="ui-container">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Methodology" title="How this index is built" />
              <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                <p>
                  Every figure comes from the live Properties Pak marketplace — listings published by registered owners, verified
                  dealers and our own desk. A listing enters the index when it goes live and leaves it when it is sold, rented or
                  withdrawn, so the index tracks the market buyers can actually act on today.
                </p>
                <p>
                  We publish medians, not averages: one unusually expensive villa cannot move a city figure the way it would move a
                  mean. Price per square foot uses only sale listings with a stated size, and rents are monthly asking rents.
                </p>
                <p>
                  Asking prices are not transaction prices. In Pakistan the final negotiated price, transfer charges and society dues
                  sit on top of — or below — the asking figure, so always verify a specific property&rsquo;s documents and recent
                  comparable deals before paying a token amount. Nothing on this page is investment advice.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/property-investment-in-pakistan" className="btn btn-primary">
                  Read the investment guide
                </Link>
                <Link href="/tools/rental-yield-calculator" className="btn btn-outline">
                  Rental yield calculator
                </Link>
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Questions" title="Price index FAQs" />
              <div className="mt-5 grid gap-3">
                {FAQS.map((faq) => (
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
    </>
  );
}

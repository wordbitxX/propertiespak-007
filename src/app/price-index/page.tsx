import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { formatNumber, formatPrice } from "@/lib/format";
import { getPriceIndex } from "@/lib/queries";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, webPageJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Pakistan Property Price Index — Live Median House & Plot Prices | Properties Pak",
  description:
    "The Pakistan Property Price Index tracks live median house, apartment, plot and commercial prices across Lahore, Islamabad, Karachi and 25+ markets — computed from real Properties Pak listings, updated continuously.",
  path: "/price-index",
  keywords: [
    "Pakistan property prices",
    "property price index Pakistan",
    "house prices Lahore",
    "plot prices Islamabad",
    "real estate market data Pakistan",
    "average property price Karachi",
  ],
  ogKicker: "Market data",
});

const FAQS = [
  {
    question: "What is the Pakistan Property Price Index?",
    answer:
      "The Pakistan Property Price Index is Properties Pak's live measure of property prices across the country. Median sale prices, median rents and average price per square foot are recomputed from every published listing on the marketplace — it is market data, not estimates or advertised asking prices from a third party.",
  },
  {
    question: "How is the price index calculated?",
    answer:
      "For each city and property type we take the median (middle) price of published listings, which keeps one unusually expensive or cheap property from distorting the picture. Price per square foot is the average listing price divided by the listed area, using only listings that include a floor or land area.",
  },
  {
    question: "How often is the price index updated?",
    answer:
      "The index is computed from live inventory every time the page is served, so it reflects the properties currently published on Properties Pak. As listing volume grows, the medians become a stronger reflection of each local market.",
  },
  {
    question: "Which cities are covered?",
    answer:
      "All cities with live inventory on Properties Pak, led by Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad, Multan, Gujranwala and Peshawar. Each city links straight into its live listings and area guides.",
  },
  {
    question: "Can I use the price index to value a specific property?",
    answer:
      "Treat it as a market-level starting point, not a valuation. Individual properties differ by exact location, condition, plot position and finishes — compare specific listings in the same society or neighbourhood, or speak to a verified agent for a proper opinion of value.",
  },
];

function price(value: number | null) {
  return value && value > 0 ? formatPrice(value) : "—";
}

export default async function PriceIndexPage() {
  const snapshot = await getPriceIndex();
  const { overall, cities, types } = snapshot;

  const highlights = [
    { label: "Live listings analysed", value: formatNumber(overall.listings) },
    { label: "Markets covered", value: formatNumber(overall.cities) },
    { label: "Median sale price", value: price(overall.medianSalePrice) },
    { label: "Median monthly rent", value: price(overall.medianRentPrice) },
    {
      label: "Avg. price / sq ft",
      value: overall.avgPricePerSqft && overall.avgPricePerSqft > 0 ? `PKR ${formatNumber(overall.avgPricePerSqft)}` : "—",
    },
    { label: "Property types tracked", value: formatNumber(overall.propertyTypes) },
  ];

  return (
    <div>
      <PageHero
        eyebrow="MARKET DATA"
        title="Pakistan Property Price Index"
        description="Live median prices for houses, apartments, plots and commercial property — computed from real Properties Pak listings, city by city."
        crumbs={[{ name: "Home", href: "/" }, { name: "Price Index", href: "/price-index" }]}
      />

      {/* Headline numbers */}
      <Section tone="mist">
        <div className="ui-container">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-panel border border-soft bg-white px-5 py-4 shadow-soft">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{item.label}</p>
                <p className="mt-1.5 font-sans text-[1.15rem] font-bold leading-tight text-navy-900">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-muted">
            Computed from {formatNumber(overall.listings)} published listings · last recomputed{" "}
            {new Date(snapshot.computedAt).toLocaleString("en-PK", { dateStyle: "long", timeStyle: "short" })}. Medians are
            used so a single outlier cannot distort a market.
          </p>
        </div>
      </Section>

      {/* City table */}
      <Section tone="light" id="city-prices">
        <div className="ui-container">
          <SectionHeading
            eyebrow="By market"
            title="Property prices by city"
            description="Median asking prices and average price per square foot in each market with live inventory."
            action={{ label: "Browse all properties", href: "/properties" }}
          />
          <div className="mt-8 overflow-x-auto rounded-panel border border-soft bg-white shadow-soft">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-soft bg-mist/60 text-[0.72rem] uppercase tracking-[0.1em] text-ink-muted">
                  <th className="px-5 py-3.5 font-semibold">City</th>
                  <th className="px-5 py-3.5 font-semibold">Listings</th>
                  <th className="px-5 py-3.5 font-semibold">For sale</th>
                  <th className="px-5 py-3.5 font-semibold">For rent</th>
                  <th className="px-5 py-3.5 font-semibold">Median sale price</th>
                  <th className="px-5 py-3.5 font-semibold">Median monthly rent</th>
                  <th className="px-5 py-3.5 font-semibold">Avg. PKR / sq ft</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.citySlug} className="border-b border-soft/70 text-[0.875rem] last:border-0 hover:bg-mist/40">
                    <td className="px-5 py-3.5">
                      <Link href={`/city/${city.citySlug}`} className="font-semibold text-navy-900 hover:text-forest-700">
                        {city.cityName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-ink-muted">{formatNumber(city.listings)}</td>
                    <td className="px-5 py-3.5 tabular-nums text-ink-muted">{formatNumber(city.saleListings)}</td>
                    <td className="px-5 py-3.5 tabular-nums text-ink-muted">{formatNumber(city.rentListings)}</td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-navy-900">{price(city.medianSalePrice)}</td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-navy-900">{price(city.medianRentPrice)}</td>
                    <td className="px-5 py-3.5 tabular-nums text-navy-900">
                      {city.avgPricePerSqft && city.avgPricePerSqft > 0 ? formatNumber(city.avgPricePerSqft) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[0.75rem] text-ink-muted">
            Click a city to open its live listings, society guides and map view. Prices shown are asking prices from
            published Properties Pak inventory.
          </p>
        </div>
      </Section>

      {/* Property type table */}
      <Section tone="mist" id="type-prices">
        <div className="ui-container">
          <SectionHeading
            eyebrow="By property type"
            title="Prices by property type"
            description="How houses, apartments, plots and commercial property compare at the national level."
          />
          <div className="mt-8 overflow-x-auto rounded-panel border border-soft bg-white shadow-soft">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-soft bg-mist/60 text-[0.72rem] uppercase tracking-[0.1em] text-ink-muted">
                  <th className="px-5 py-3.5 font-semibold">Property type</th>
                  <th className="px-5 py-3.5 font-semibold">Listings</th>
                  <th className="px-5 py-3.5 font-semibold">Median price</th>
                  <th className="px-5 py-3.5 font-semibold">Avg. PKR / sq ft</th>
                  <th className="px-5 py-3.5 font-semibold">Live listings</th>
                </tr>
              </thead>
              <tbody>
                {types.map((row) => (
                  <tr key={row.propertyType} className="border-b border-soft/70 text-[0.875rem] last:border-0 hover:bg-white/70">
                    <td className="px-5 py-3.5 font-semibold text-navy-900">{row.propertyType}</td>
                    <td className="px-5 py-3.5 tabular-nums text-ink-muted">{formatNumber(row.listings)}</td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-navy-900">{price(row.medianPrice)}</td>
                    <td className="px-5 py-3.5 tabular-nums text-navy-900">
                      {row.avgPricePerSqft && row.avgPricePerSqft > 0 ? formatNumber(row.avgPricePerSqft) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/properties?type=${encodeURIComponent(row.propertyType)}`}
                        className="font-semibold text-forest-700 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Methodology */}
      <Section tone="light" id="methodology">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Methodology"
            title="How the index is built"
            description="Transparent numbers from live marketplace data — the same inventory buyers and agents see every day."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-panel border border-soft bg-white p-6 shadow-soft">
              <p className="font-sans text-[0.95rem] font-bold text-navy-900">Real listings only</p>
              <p className="mt-2 text-[0.85rem] leading-7 text-ink-muted">
                Every figure is aggregated from published Properties Pak listings. No synthetic data, no third-party
                estimates, no hard-coded prices.
              </p>
            </div>
            <div className="rounded-panel border border-soft bg-white p-6 shadow-soft">
              <p className="font-sans text-[0.95rem] font-bold text-navy-900">Medians, not averages</p>
              <p className="mt-2 text-[0.85rem] leading-7 text-ink-muted">
                Property prices skew heavily at the top end. The median (middle) price reflects what a typical buyer in
                that market actually faces.
              </p>
            </div>
            <div className="rounded-panel border border-soft bg-white p-6 shadow-soft">
              <p className="font-sans text-[0.95rem] font-bold text-navy-900">Continuously recomputed</p>
              <p className="mt-2 text-[0.85rem] leading-7 text-ink-muted">
                The index runs on live inventory, so new listings and price changes flow into the numbers as the
                marketplace moves.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="mist" id="price-index-faq">
        <div className="ui-container">
          <FaqList title="Price index FAQ" faqs={FAQS} />
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/properties" className="btn btn-primary">
              Browse live listings
            </Link>
            <Link href="/tools/property-tax-calculator" className="btn btn-outline">
              Run the numbers
            </Link>
          </div>
        </div>
      </Section>

      <JsonLd
        data={webPageJsonLd({
          name: "Pakistan Property Price Index",
          description:
            "Live median property prices across Pakistan — computed from published Properties Pak listings by city and property type.",
          path: "/price-index",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Pakistan Property Price Index", href: "/price-index" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Pakistan Property Price Index",
          description:
            "Median sale prices, median rents and average price per square foot for property across Pakistan, aggregated from live Properties Pak marketplace listings.",
          url: `${SITE.url}/price-index`,
          creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
          isAccessibleForFree: true,
          variableMeasured: [
            "Median sale price by city",
            "Median monthly rent by city",
            "Average price per square foot",
            "Median price by property type",
          ],
          temporalCoverage: "Updated continuously from live listings",
        }}
      />
    </div>
  );
}

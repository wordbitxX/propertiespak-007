import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { MallsExplorer } from "@/components/malls-explorer";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { getAllMalls, getMallCities } from "@/lib/malls";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shopping Malls in Pakistan — All Major & Upcoming Malls | Properties Pak",
  description:
    "Pakistan's mall directory by Properties Pak: every major shopping mall — LuckyOne, Emporium, Dolmen, Packages, Centaurus, Giga — plus the coming-soon projects, by city, with locations, sizes and property near each mall.",
  path: "/malls",
  keywords: [
    "shopping malls in Pakistan",
    "malls in Pakistan",
    "biggest mall in Pakistan",
    "malls in Lahore",
    "malls in Karachi",
    "malls in Islamabad",
    "upcoming malls in Pakistan",
    "new malls in Pakistan",
    "LuckyOne Mall",
    "Emporium Mall",
    "Dolmen Mall Lahore",
  ],
  ogKicker: "MALLS OF PAKISTAN",
  ogSubtitle: "Every major open and upcoming shopping mall in Pakistan, by city.",
});

const FAQS = [
  {
    question: "Which is the biggest shopping mall in Pakistan?",
    answer:
      "By total area, LuckyOne Mall in Karachi (≈3.4 million sq ft, opened 2017) is Pakistan's largest mall. By gross leasable area, Dolmen Mall Lahore (opened December 2024) reports the country's largest GLA. Emporium Mall in Lahore (≈2.7 million sq ft) sits between them as the largest in Punjab by total area.",
  },
  {
    question: "Which new malls are coming soon in Pakistan?",
    answer:
      "The directory's Coming Soon list tracks publicly announced projects: Mall of Islamabad (Blue Area), J7 Emporium (B-17), Paradise Mall (New City Paradise), The Magnus Mall (Gulberg Greens), The Grand Central Mall (Faisalabad), Lahore Sky Mall (Ferozepur Road), Icon Mall & Towers (Bahria Town Lahore), United Mall Gulgasht (Multan) and Mall of Sargodha. Dates are developer-announced and can change — each mall page says what is known so far.",
  },
  {
    question: "Why does a property site run a mall directory?",
    answer:
      "Malls anchor neighbourhood value. A new mall changes footfall, rents and resale demand for every house, apartment, shop and plot around it — so Properties Pak tracks open and upcoming malls alongside society maps and listings, and every mall page links to live property for sale and rent near that mall.",
  },
  {
    question: "Can I buy or rent a shop in one of these malls through Properties Pak?",
    answer:
      "Mall units are usually leased by the mall operator, but shops, plazas and commercial property around these malls trade on the open market. Browse commercial listings near a mall from its page, or list your own commercial property free from the List Property page.",
  },
];

export default function MallsPage() {
  const malls = getAllMalls();
  const cities = getMallCities();
  const openCount = malls.filter((mall) => mall.status === "open").length;
  const upcoming = malls.filter((mall) => mall.status === "upcoming");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Malls", href: "/malls" }])} />
      <JsonLd
        data={collectionPageJsonLd({
          name: "Shopping Malls in Pakistan",
          description: "Directory of open and upcoming shopping malls across Pakistan, with locations, sizes and nearby property.",
          path: "/malls",
        })}
      />
      <JsonLd
        data={itemListJsonLd({
          name: "Shopping malls in Pakistan",
          path: "/malls",
          items: malls.map((mall) => ({ name: `${mall.name} — ${mall.city}`, path: `/malls/${mall.slug}` })),
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <PageHero
        eyebrow="Maps & Malls · Retail destinations"
        title="Shopping Malls in Pakistan"
        description={`${malls.length} malls tracked across ${cities.length} cities — ${openCount} open now and ${upcoming.length} coming soon. The same footfall that fills a mall lifts the houses, apartments and shops around it, so every mall links straight to live property nearby.`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Malls", href: "/malls" },
        ]}
      />

      <Section tone="light">
        <div className="ui-container">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Malls in the directory", value: String(malls.length), note: "Open and coming soon, all Pakistan" },
              { label: "Open now", value: String(openCount), note: "From LuckyOne Karachi to Centaurus Islamabad" },
              { label: "Coming soon", value: String(upcoming.length), note: "Announced projects being tracked" },
              { label: "Cities covered", value: String(cities.length), note: cities.slice(0, 4).map((item) => item.city).join(" · ") },
            ].map((stat) => (
              <div key={stat.label} className="rounded-panel border border-soft bg-white px-5 py-4 shadow-soft">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{stat.label}</p>
                <p className="mt-1.5 font-sans text-[1.5rem] font-bold leading-none text-navy-900">{stat.value}</p>
                <p className="mt-1.5 text-[0.75rem] text-ink-muted">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <MallsExplorer malls={malls} cities={cities} />
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Coming soon"
            title="Upcoming malls being tracked"
            description="Announced and under-construction projects — the ones that move nearby land and shop prices before a single store opens. Dates are developer-announced and can slip; we update pages as projects progress."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((mall) => (
              <Link
                key={mall.slug}
                href={`/malls/${mall.slug}`}
                className="group rounded-panel border border-amber-200 bg-amber-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400"
              >
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-amber-800">
                  {mall.city} · {mall.expected ?? "Announced"}
                </p>
                <h3 className="mt-2 font-sans text-[1.0625rem] font-bold text-navy-900 group-hover:text-forest-700">{mall.name}</h3>
                <p className="mt-1.5 line-clamp-3 text-[0.875rem] leading-relaxed text-ink-muted">{mall.description}</p>
                <span className="mt-3 inline-block text-[0.8125rem] font-bold text-forest-700">Track this project →</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="ui-container">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Why it matters" title="Malls move property markets" />
              <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                <p>
                  A major mall is infrastructure. When Dolmen opened in DHA Phase 6 or LuckyOne on Rashid Minhas Road, the effect
                  showed up first in nearby shop rents, then in apartment demand from retail staff and managers, then in plot
                  prices within a short drive. Upcoming malls move prices even earlier — on announcement and construction
                  milestones, not on opening day.
                </p>
                <p>
                  That is why this directory sits next to our society PDF maps: maps tell you where a plot sits, malls tell you
                  where the footfall — and the next rent increase — is coming from. Pair a mall page with the{" "}
                  <Link href="/pakistan-property-price-index" className="font-semibold text-forest-700 hover:underline">
                    Pakistan Property Price Index
                  </Link>{" "}
                  before you buy near one.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/maps" className="btn btn-primary">Society PDF Maps</Link>
                <Link href="/properties/commercial" className="btn btn-outline">Commercial property for sale</Link>
                <Link href="/advertise" className="btn btn-outline">Retail & mall advertising</Link>
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Questions" title="Mall FAQs" />
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
              <p className="mt-5 rounded-panel border border-soft bg-mist p-5 text-[0.875rem] leading-relaxed text-ink-muted">
                Know a mall we have missed — or a correction to an opening date?{" "}
                <Link href="/contact" className="font-semibold text-forest-700 hover:underline">
                  Tell the Properties Pak team
                </Link>{" "}
                and the directory will be updated after a quick check.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

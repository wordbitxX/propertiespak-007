import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { KeywordLinks } from "@/components/keyword-links";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { IconPin } from "@/components/icons";
import { MALLS, NEW_MALLS, OPEN_MALLS, type Mall } from "@/lib/malls";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, faqJsonLd, itemListJsonLd, webPageJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Shopping Malls in Pakistan — Famous Malls, New Malls & Shops for Sale | Properties Pak",
  description:
    "Explore every famous shopping mall in Pakistan — Emporium Mall, Packages Mall, Dolmen Mall, Lucky One, Centaurus and more — plus new and coming-soon malls. Find shops for sale and rent inside Pakistan's best malls with verified listings and trusted agents.",
  path: "/malls",
  keywords: [
    "shopping malls in Pakistan",
    "famous malls in Pakistan",
    "new malls in Pakistan",
    "coming soon malls Pakistan",
    "shops for sale in malls",
    "mall shops on installments",
    "shopping malls Lahore",
    "shopping malls Karachi",
    "shopping malls Islamabad",
    "mall shops price Pakistan",
  ],
  ogKicker: "Malls directory",
});

const FAQS = [
  {
    question: "Which are the most famous shopping malls in Pakistan?",
    answer:
      "Pakistan's best-known malls include Emporium Mall and Packages Mall in Lahore, Dolmen Mall Lahore in DHA Phase 6, Dolmen Mall Clifton, Lucky One Mall and Ocean Mall in Karachi, and The Centaurus Mall and Giga Mall in Islamabad. Properties Pak lists each of these malls with its location, status and live shops for sale and rent.",
  },
  {
    question: "Are shops inside shopping malls a good investment in Pakistan?",
    answer:
      "Mall shops can earn well because managed malls bring steady footfall, parking and brand anchors that standalone markets lack. The trade-offs are higher entry prices, service charges and less control over subletting. Check the mall's occupancy, the shop's floor position (ground floor and food-court units usually perform best) and compare the asking price with recent deals in the same mall before buying.",
  },
  {
    question: "Which new malls are coming soon in Pakistan?",
    answer:
      "New and under-development projects include Emporium Mall Faisalabad and Grand Central Mall on Canal Road Faisalabad, The Mall of Islamabad in the Blue Area, Prime Mall on Raiwind Road Lahore, Icon Mall & Towers at the Bahria Town Lahore Ring Road interchange and The Magnus Mall in Gulberg Islamabad. Statuses move quickly — confirm current development stage with the developer before investing.",
  },
  {
    question: "Can I buy a shop on installments in a shopping mall?",
    answer:
      "Yes — many new and under-construction malls sell shops on installment plans, and some open malls resell units with payment plans arranged privately. Jasmine Grand Mall in Bahria Town Lahore and several Faisalabad and Islamabad projects actively market shops on installments. Always verify the developer's possession timeline and approve the payment plan before paying a booking amount.",
  },
  {
    question: "How do I find shops for sale or rent in a specific mall?",
    answer:
      "Open the mall's page on Properties Pak to see current listings, or search the mall name directly in the property search. You can also filter commercial property by city and category, or contact a verified agent who deals in that mall — our agents' profiles list the areas and projects they cover.",
  },
];

function MallCard({ mall }: { mall: Mall }) {
  return (
    <Link
      href={`/malls/${mall.slug}`}
      className="group flex h-full flex-col rounded-panel border border-soft bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-sans text-[1.05rem] font-bold leading-snug text-navy-900 group-hover:text-forest-700">{mall.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
            mall.status === "Coming soon"
              ? "bg-amber-100 text-amber-800"
              : mall.status === "New"
                ? "bg-sky-100 text-sky-700"
                : "bg-forest-100 text-forest-700"
          }`}
        >
          {mall.status}
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[0.82rem] text-ink-muted">
        <IconPin className="h-3.5 w-3.5 shrink-0 text-forest-600" />
        {mall.location}
      </p>
      <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-muted">{mall.note}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-[0.82rem] font-semibold text-forest-700">
        View mall & shops
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}

export default async function MallsPage() {
  return (
    <div>
      <PageHero
        eyebrow="MALLS DIRECTORY"
        title="Shopping Malls in Pakistan"
        description="Famous malls, new openings and coming-soon projects — with shops, offices and commercial units for sale and rent inside Pakistan's best shopping destinations."
        crumbs={[{ name: "Home", href: "/" }, { name: "Malls", href: "/malls" }]}
      />

      <Section tone="light" id="famous-malls">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Open & trading"
            title="Famous shopping malls in Pakistan"
            description="The country's best-known retail destinations across Lahore, Karachi, Islamabad and beyond — open, trading and drawing daily footfall."
            action={{ label: "Browse commercial property", href: "/properties/commercial" }}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OPEN_MALLS.map((mall) => (
              <MallCard key={mall.slug} mall={mall} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="mist" id="new-malls">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Under development"
            title="New & coming soon malls"
            description="Announced and under-construction mall projects — the next wave of organised retail across Pakistan. Confirm the latest development status with the developer before investing."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {NEW_MALLS.map((mall) => (
              <MallCard key={mall.slug} mall={mall} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="light" id="malls-faq">
        <div className="ui-container">
          <FaqList
            faqs={FAQS}
            title="Shopping malls in Pakistan — your questions answered"
            description="Everything shoppers and investors ask about malls, mall shops and installment plans across Pakistan."
          />
        </div>
      </Section>

      <KeywordLinks
        title="Popular mall searches"
        description="Jump straight to the searches shoppers and investors use about malls across Pakistan."
        tone="mist"
        links={MALLS.slice(0, 12).flatMap((mall) => mall.keywords.slice(0, 2)).map((label) => ({
          label,
          href: `/properties?q=${encodeURIComponent(label)}`,
        }))}
      />

      <JsonLd
        data={webPageJsonLd({
          name: "Shopping Malls in Pakistan",
          description:
            "Directory of famous, new and coming-soon shopping malls in Pakistan with shops for sale and rent, investment notes and FAQs.",
          path: "/malls",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Malls", href: "/malls" },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: "Shopping Malls in Pakistan",
          description: "Famous, new and coming-soon shopping malls across Pakistan.",
          path: "/malls",
        })}
      />
      <JsonLd
        data={itemListJsonLd({
          name: "Shopping Malls in Pakistan",
          path: "/malls",
          items: MALLS.map((mall) => ({ name: `${mall.name}, ${mall.cityName}`, path: `/malls/${mall.slug}` })),
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
    </div>
  );
}

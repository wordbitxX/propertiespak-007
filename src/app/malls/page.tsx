import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { MallCard, MallsExplorer } from "@/components/malls-explorer";
import { Section, SectionHeading } from "@/components/section";
import { getAllMalls, getMallCities } from "@/lib/malls";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shopping Malls in Pakistan — All Major & Upcoming Malls | Properties Pak",
  description:
    "Pakistan's premium mall directory: every major shopping mall — LuckyOne, Emporium, Dolmen, Packages, Centaurus, Giga — plus the coming-soon projects, by city, with locations, sizes and property near each mall.",
  path: "/malls",
  keywords: [
    "shopping malls in Pakistan",
    "malls in Pakistan",
    "best malls in Pakistan",
    "biggest mall in Pakistan",
    "largest mall in Pakistan",
    "top 10 malls in Pakistan",
    "list of shopping malls in Pakistan",
    "malls in Lahore",
    "best malls in Lahore",
    "malls in Karachi",
    "malls in Islamabad",
    "upcoming malls in Pakistan",
    "new malls in Pakistan",
    "new mall opening in Pakistan 2026",
    "LuckyOne Mall Karachi",
    "Emporium Mall Lahore",
    "Dolmen Mall Lahore",
    "Centaurus Mall Islamabad",
    "property near malls in Pakistan",
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
      "The directory's Coming Soon list tracks publicly announced projects: Mall of Islamabad (Blue Area), J7 Emporium (B-17), Paradise Mall (New City Paradise), The Magnus Mall (Gulberg Greens), Giga Boutique Mall (DHA Phase 2, Islamabad), The Grand Central Mall (Faisalabad), Lahore Sky Mall (Ferozepur Road), Icon Mall & Towers and Prime Mall (Lahore), United Mall Gulgasht (Multan) and Mall of Sargodha. Dates are developer-announced and can change — each mall page says what is known so far.",
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
  const bySlug = (slug: string) => malls.find((mall) => mall.slug === slug);
  // Lahore's heavyweights first — the city's biggest malls lead the page.
  const LahoreIcons = [
    "emporium-mall-lahore",
    "packages-mall-lahore",
    "dolmen-mall-lahore",
    "amanah-mall-lahore",
    "mall-of-lahore",
    "jasmine-grand-mall-lahore",
  ].map(bySlug).filter((mall) => Boolean(mall)) as typeof malls;
  const landmarks = [
    "luckyone-mall-karachi",
    "centaurus-mall-islamabad",
    "giga-mall-islamabad",
    "dolmen-mall-clifton-karachi",
  ].map(bySlug).filter((mall) => Boolean(mall)) as typeof malls;

  const stats = [
    { value: String(malls.length), label: "Malls tracked", note: "Open + coming soon" },
    { value: String(openCount), label: "Open now", note: "LuckyOne to Centaurus" },
    { value: String(upcoming.length), label: "Coming soon", note: "Announced projects" },
    { value: String(cities.length), label: "Cities", note: cities.slice(0, 3).map((item) => item.city).join(" · ") },
  ];

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

      {/* Cinematic image hero — no boxes, one rich visual statement. */}
      <section className="relative isolate overflow-hidden bg-[#04150E] pb-14 pt-32 text-white lg:pb-16 lg:pt-40">
        <Image
          src="/images/malls/mall-hero-atrium.jpg"
          alt="Inside a premium shopping mall atrium in Pakistan — golden evening light over multi-level galleries"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,21,14,0.72) 0%, rgba(4,21,14,0.55) 42%, rgba(4,21,14,0.94) 100%), linear-gradient(95deg, rgba(4,21,14,0.82) 0%, rgba(4,21,14,0.25) 58%, rgba(4,21,14,0.1) 100%)",
          }}
        />
        <div className="ui-container relative z-10">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Malls", href: "/malls" }]} />
          <p className="eyebrow mt-8 text-[#DFB872]">
            <span className="h-[1px] w-6 bg-current opacity-70" />
            Maps &amp; Malls · Retail destinations of Pakistan
          </p>
          <h1 className="display-2 mt-4 max-w-3xl text-white">Shopping Malls in Pakistan</h1>
          <p className="lede mt-4 max-w-2xl text-white/80">
            {malls.length} malls across {cities.length} cities — {openCount} open now, {upcoming.length} coming soon. From
            LuckyOne and Dolmen to the projects still on the crane, every mall links straight to the property market around it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#mall-directory" className="btn btn-gold">
              Browse all malls
            </a>
            <a href="#coming-soon" className="btn btn-ghost-light">
              Coming soon · {upcoming.length} projects
            </a>
          </div>
          <dl className="mt-11 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/15 pt-7 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-sans text-[2rem] font-extrabold leading-none text-white">
                  {stat.value}
                  <span className="text-[#DFB872]">.</span>
                </dd>
                <dt className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/70">{stat.label}</dt>
                <dd className="mt-1 text-[0.78rem] text-white/50">{stat.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Lahore first: the city's biggest malls lead the directory. */}
      <Section tone="light">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Lahore first"
            title="Lahore's biggest malls"
            description="Emporium, Packages, Dolmen, Amanah and the rest of the heavyweights — the malls that anchor Johar Town, Gulberg, DHA and Cantt property demand."
            action={{ label: "All Lahore property", href: "/city/lahore" }}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {LahoreIcons.map((mall, index) => (
              <MallCard key={mall.slug} mall={mall} priority={index < 3} />
            ))}
          </div>
        </div>
      </Section>

      {/* National landmarks */}
      <Section tone="mist">
        <div className="ui-container">
          <SectionHeading
            eyebrow="The icons"
            title="Pakistan's landmark malls"
            description="The destinations that define retail in Karachi and Islamabad — and move every property price around them."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {landmarks.map((mall) => (
              <MallCard key={mall.slug} mall={mall} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="ui-container" id="mall-directory">
          <SectionHeading
            eyebrow="Directory"
            title="All malls, by city"
            description="Search by name or area, filter by city, or jump straight to the coming-soon projects investors are watching."
          />
          <div className="mt-8">
            <MallsExplorer malls={malls} cities={cities} />
          </div>
        </div>
      </Section>

      {/* Coming soon — dark premium band over the render artwork. */}
      <section id="coming-soon" className="relative isolate overflow-hidden bg-[#04150E] py-16 text-white lg:py-20">
        <Image
          src="/images/malls/mall-upcoming-render.jpg"
          alt="Upcoming luxury shopping mall under construction in Pakistan at dusk — illustrative visualisation"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#04150E] via-[#04150E]/72 to-[#04150E]" />
        <div className="ui-container relative z-10">
          <SectionHeading
            tone="dark"
            eyebrow="Coming soon"
            title="Upcoming malls being tracked"
            description="Announced and under-construction projects — the ones that move nearby land and shop prices before a single store opens. Dates are developer-announced and can slip; pages update as projects progress."
          />
          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((mall) => (
              <MallCard key={mall.slug} mall={mall} />
            ))}
          </div>
        </div>
      </section>

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

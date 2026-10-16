import { ResilientImage } from "@/components/resilient-image";
import Link from "next/link";
import {
  IconArrowRight,
  IconCalculator,
  IconChart,
  IconCheck,
  IconCompass,
  IconLayers,
  IconShield,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import type { Testimonial } from "@/db/schema";

const BENEFITS = [
  {
    icon: IconShield,
    title: "Property Discovery",
    copy: "Explore a curated catalogue with structured prices, sizes and locations, so your shortlist starts clean.",
  },
  {
    icon: IconCompass,
    title: "Smart search & filters",
    copy: "Filter by city, society, property type, budget, size and bedrooms — then sort by price, area or tenant demand.",
  },
  {
    icon: IconLayers,
    title: "Location intelligence",
    copy: "Compare neighbourhoods on the map and understand distance to schools, offices, hospitals and main arteries.",
  },
  {
    icon: IconCalculator,
    title: "Investment tools",
    copy: "Model mortgage instalments, rental yield and affordability before you commit capital or sign an agreement.",
  },
];

export function WhyEstateWx({ listings, cities }: { listings: number; cities: number }) {
  return (
    <Section tone="light" id="why">
      <div className="ui-container">
        <div className="section-card-surface">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <Reveal>
              <p className="eyebrow text-[#0D382A]">
                <span className="h-[1px] w-6 bg-[#DFB872]" />
                Why Properties Pak
              </p>
              <h2 className="display-2 mt-3 text-[#0D261D]">Real Estate, Made Smarter.</h2>
              <p className="lede mt-3.5 text-[#4E6157]">
                Properties Pak brings structure to a market that runs on scattered listings and phone calls. One platform, one
                set of standards, one clear decision path.
              </p>

              <div className="mt-8 grid gap-x-7 gap-y-6 sm:grid-cols-2">
                {BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.title}
                      className="flex gap-3.5 rounded-xl border border-[#E7ECE8] bg-[#F9FBF9] p-4 transition-colors hover:border-[#DFB872]/60"
                    >
                      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0D382A] text-[#DFB872]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-sans text-[0.95rem] font-bold text-[#0D261D]">{benefit.title}</h3>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#586A60]">{benefit.copy}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-x-9 gap-y-4 border-t border-[#E6ECE8] pt-6">
                <div>
                  <p className="font-sans text-[1.65rem] font-extrabold leading-none text-[#0D261D]">{listings}+</p>
                  <p className="mt-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5B6D63]">
                    Live Listings
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[1.65rem] font-extrabold leading-none text-[#0D261D]">{cities}</p>
                  <p className="mt-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5B6D63]">
                    Cities tracked
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[1.65rem] font-extrabold leading-none text-[#0D261D]">8</p>
                  <p className="mt-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5B6D63]">
                    Decision tools
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-[#DFB872]/35 bg-[#071F17] shadow-[0_22px_50px_-22px_rgba(7,31,23,0.45)]">
                <ResilientImage
                  src="/images/smarter-living-hd.webp"
                  fallbackSrc="/images/smarter-living-new.jpg"
                  alt="Double-height luxury Pakistani villa living room opening onto an illuminated infinity pool at dusk"
                  width={1408}
                  height={768}
                  loading="lazy"
                  decoding="async"
                  className="h-[380px] w-full object-cover object-center lg:h-[520px]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061A13]/90 via-[#061A13]/20 to-transparent"
                />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-[#DFB872]/35 bg-[#071E16]/90 p-5 text-white backdrop-blur-md">
                  <p className="eyebrow text-[#DFB872]">Property Information Standards</p>
                  <ul className="mt-3 space-y-2 text-[0.82rem]">
                    {[
                      "Clear property information",
                      "Descriptive property photography",
                      "Indicative pricing and property details",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-white/92">
                        <IconCheck className="h-4 w-4 shrink-0 text-[#F3D590]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function InvestmentSection({
  snapshot,
}: {
  snapshot: { projects: number; commercial: number; cities: number; rentals: number };
}) {
  const points = [
    { title: "High-potential locations", copy: "Areas where infrastructure delivery and demand are moving together." },
    { title: "New developments", copy: "Launch pricing, payment plans and handover timelines side by side." },
    { title: "Commercial opportunities", copy: "Income-producing office, retail and warehouse assets." },
    { title: "Rental opportunities", copy: "Units and areas with strong tenant-demand signals." },
  ];

  return (
    <Section tone="light" id="investor-desk">
      <div className="ui-container">
        <div className="investor-desk-showcase relative isolate overflow-hidden rounded-[20px] border border-[#DFB872]/30 bg-gradient-to-br from-[#071F17] via-[#0B2D22] to-[#0E382A] p-6 text-white shadow-[0_24px_56px_-24px_rgba(6,26,19,0.65)] sm:p-8 lg:p-10">
          <ResilientImage
            src="/images/smarter-living-hd.webp"
            fallbackSrc="/images/smarter-living-new.jpg"
            alt=""
            width={1408}
            height={768}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(680px 380px at 0% 0%, rgba(216, 175, 104,0.16), transparent 60%), linear-gradient(120deg, rgba(6,25,19,0.94) 0%, rgba(10,39,29,0.88) 55%, rgba(8,32,24,0.94) 100%)",
            }}
          />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
            <Reveal>
              <p className="eyebrow text-[#DFB872]">
                <span className="h-[1px] w-6 bg-[#DFB872]" />
                Investor desk
              </p>
              <h2 className="mt-3 font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.028em] text-white">
                Invest With More Confidence.
              </h2>
              <p className="mt-3.5 max-w-2xl text-[0.95rem] leading-relaxed text-white/85">
                Property decisions get better when the numbers are visible. Use Properties Pak to compare locations,
                understand entry and rental economics, and judge a development on evidence rather than optimism.
              </p>

              <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                {points.map((point) => (
                  <li
                    key={point.title}
                    className="flex gap-3.5 rounded-xl border border-white/14 bg-white/[0.06] p-4 backdrop-blur-sm transition-colors hover:border-[#DFB872]/45"
                  >
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#DFB872]/35 bg-[#DFB872]/15 text-[#DFB872]">
                      <IconChart className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-sans text-[0.92rem] font-bold text-white">{point.title}</span>
                      <span className="mt-1 block text-[0.8rem] leading-relaxed text-white/75">{point.copy}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link href="/property-investment-in-pakistan" className="btn btn-gold min-h-[46px] px-6 text-[0.875rem]">
                  <span>Read the Investment Guide</span>
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[9px] border border-white/35 bg-white/10 px-6 font-sans text-[0.875rem] font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#DFB872] hover:bg-white/15 hover:text-[#DFB872]"
                >
                  <span>Open all 8 tools</span>
                </Link>
              </div>

              <p className="mt-5 text-[0.75rem] leading-relaxed text-white/65">
                Tools provide estimates for planning only. They are not investment advice and do not guarantee returns.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-2xl border border-white/18 bg-[#061912]/80 p-6 shadow-[0_20px_44px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md lg:p-7">
                <p className="eyebrow text-[#DFB872]">Platform snapshot</p>
                <dl className="mt-4 divide-y divide-white/12">
                  {[
                    { label: "New developments tracked", value: snapshot.projects, href: "/projects" },
                    { label: "Commercial listings", value: snapshot.commercial, href: "/commercial" },
                    { label: "Rental listings", value: snapshot.rentals, href: "/properties/for-rent" },
                    { label: "Cities covered", value: snapshot.cities, href: "/properties" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 py-3.5">
                      <dt className="font-sans text-[0.875rem] font-medium text-white/88">{row.label}</dt>
                      <dd className="flex items-center gap-3">
                        <span className="font-sans text-[1.4rem] font-extrabold leading-none text-white">
                          {row.value}
                        </span>
                        <Link
                          href={row.href}
                          aria-label={`View ${row.label}`}
                          className="grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:border-[#DFB872] hover:bg-[#DFB872] hover:text-[#082218]"
                        >
                          <IconArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 rounded-xl border border-[#DFB872]/35 bg-gradient-to-r from-[#DFB872]/16 to-[#F3D590]/10 p-4">
                  <p className="text-[0.82rem] leading-relaxed text-white/92">
                    Want a specific area analysed? Our advisory desk prepares short area notes on request — including
                    pricing bands, tenant profiles and supply pipeline.
                  </p>
                  <Link
                    href="/contact?topic=advisory"
                    className="mt-3 inline-flex items-center gap-1.5 font-sans text-[0.84rem] font-bold text-[#DFB872] transition-colors hover:text-[#F3D590]"
                  >
                    <span>Request an area note</span>
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <Section tone="mist">
      <div className="ui-container">
        <div className="max-w-2xl">
          <p className="eyebrow text-forest-700">
            <span className="h-[1px] w-6 bg-current opacity-70" />
            Buyer scenarios
          </p>
          <h2 className="display-2 mt-4 text-navy-900">How different buyers would use Properties Pak</h2>
          <p className="lede mt-4">
            Composite scenarios that show how the platform&rsquo;s search, comparison and calculator
            tools support different property decisions in Pakistan.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-soft bg-white px-3 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            <IconShield className="h-3.5 w-3.5 text-forest-600" /> Scenario example — not a client testimonial
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.slice(0, 3).map((item, index) => (
            <Reveal key={item.name} delay={index * 60}>
              <article className="flex h-full flex-col rounded-panel border border-soft bg-white p-6 shadow-soft">
                <p>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-forest-50 px-2.5 py-1 font-sans text-[0.75rem] font-bold uppercase tracking-[0.12em] text-forest-700">
                    <IconCompass className="h-3.5 w-3.5" /> Buyer scenario
                  </span>
                </p>
                <h3 className="mt-4 font-sans text-[1.0625rem] font-semibold leading-snug text-navy-900">
                  {item.role}
                </h3>
                <p className="mt-1 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-ink-muted">
                  {item.city} · Scenario {item.sortOrder}
                </p>
                <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink">{item.quote}</p>
                <p className="mt-5 border-t border-soft pt-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  Persona example — not a client testimonial
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function CtaSection() {
  return (
    <section
      className="closing-cta-section relative isolate overflow-hidden py-14 sm:py-16 lg:py-20"
      aria-labelledby="closing-cta-heading"
      data-testid="closing-cta"
      style={{
        background: "linear-gradient(120deg, #061B14 0%, #0B2B20 55%, #0E3528 100%)",
      }}
    >
      <ResilientImage
        src="/images/smarter-living-hd.webp"
        fallbackSrc="/images/smarter-living-new.jpg"
        alt=""
        width={1408}
        height={768}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061B14]/95 via-[#09241B]/88 to-[#0B2B20]/78" />
      <div className="ui-container relative z-10">
        <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0 max-w-2xl">
            <p className="eyebrow text-[#DFB872]">Make your next move</p>
            <h2 id="closing-cta-heading" className="mt-3 font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.028em] text-white">
              Find the Right Property. Make the Smarter Move.
            </h2>
            <p className="mt-3.5 text-base leading-7 text-white/82">
              Explore properties, compare opportunities and make more informed real-estate decisions across Pakistan.
            </p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/properties" className="btn btn-gold min-h-12 px-6">
              <span>Explore Properties</span>
              <IconArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/properties?featured=1"
              className="inline-flex min-h-12 items-center justify-center rounded-[9px] border border-white/35 bg-white/10 px-6 font-sans text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#DFB872] hover:bg-white/15 hover:text-[#DFB872]"
            >
              Start Your Search
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

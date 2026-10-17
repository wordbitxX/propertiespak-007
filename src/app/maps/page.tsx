import Link from "next/link";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { SOCIETY_MAP_CITIES, SOCIETY_PDF_MAPS } from "@/lib/society-pdf-maps";
import { MapsExplorer } from "@/components/maps-explorer";
import { getMapProperties } from "@/lib/queries";
import { IconArrowRight, IconPin, IconShield, IconSpark } from "@/components/icons";

const MAPS_FAQS = [
  {
    question: "Where can I download the latest DHA Lahore Phase 1 to 9 Prism PDF maps?",
    answer:
      "You can preview and download official high-resolution PDF maps for DHA Lahore Phase 1 to 5, Phase 6, 7 & 8 (Air Avenue & Ivy Green), Phase 9 Prism, Phase 9 Town, and DHA Phase 11 Rahbar directly on this page at no cost, complete with plot numbers and sector boundaries.",
  },
  {
    question: "Are Bahria Town Lahore, Islamabad/Rawalpindi and Bahria Town Karachi PDF maps available?",
    answer:
      "Yes. Our library includes high-resolution PDF maps for Bahria Town Lahore (all sectors including Sector G), Bahria Orchard Lahore Phases 1–4, Bahria Enclave Islamabad Phases 1 & 2, Bahria Town Rawalpindi Phases 1–8, and Bahria Town Karachi (Part A, Part B, Bahria Paradise and Bahria Sports City).",
  },
  {
    question: "How can I check plot numbers on a live satellite map before buying a plot?",
    answer:
      "Use the Interactive Google Satellite + Plot Number Overlay viewer at the top of this page. Select any DHA phase or society from the dropdown and zoom in to see exact yellow plot-grid boundaries, corner status, park-facing locations, and approach roads overlaid on satellite imagery.",
  },
  {
    question: "Do you have official PDF master plans for Capital Smart City, Lahore Smart City and LDA City?",
    answer:
      "Yes. We provide downloadable PDF master plans for Capital Smart City Islamabad (including Phase 2 and new 5-year sectors), Lahore Smart City Phase 1 & 2, LDA City Lahore (Jinnah & Iqbal Sectors), Lake City Lahore, Park View City Lahore, Etihad Town Phases 1–3, and the Master Plan of Lahore Division.",
  },
];

export const metadata = buildMetadata({
  title: "Download Latest PDF Maps of Housing Societies in Pakistan (DHA, Bahria Town, LDA & Smart Cities)",
  description:
    "Access and download 57+ high-resolution official PDF maps and interactive satellite plot-grid overlays for DHA Lahore (Phases 1–9 Prism), Bahria Town Lahore, Islamabad & Karachi, Capital Smart City, Lahore Smart City, LDA City, Lake City and Park View City.",
  path: "/maps",
  keywords: [
    "pakistan society pdf maps",
    "dha lahore map pdf download",
    "dha phase 9 prism map pdf",
    "dha lahore phase 6 7 8 map pdf",
    "bahria town lahore map pdf",
    "bahria orchard lahore map pdf",
    "bahria town karachi map pdf",
    "bahria town rawalpindi phase 8 map pdf",
    "capital smart city master plan pdf",
    "lahore smart city map pdf",
    "lda city lahore jinnah sector map pdf",
    "lake city lahore map pdf",
    "park view city lahore map pdf",
    "etihad town lahore phase 2 map pdf",
    "dha multan map pdf",
    "dha gujranwala map pdf",
    "dha peshawar map pdf",
    "dha quetta map pdf",
  ],
});

export default async function SocietyMapsPage() {
  const rows = await getMapProperties({}, 200).catch(() => []);
  const mapProperties = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    citySlug: row.citySlug,
    cityName: row.cityName,
    locationArea: row.locationArea,
    price: row.price,
    priceUnit: row.priceUnit,
    lat: row.lat,
    lng: row.lng,
    coverImage: row.coverImage,
    propertyType: row.propertyType,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaValue: row.areaValue,
    areaUnit: row.areaUnit,
  }));

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", href: "/" },
      { name: "Society PDF Maps", href: "/maps" },
    ]),
    collectionPageJsonLd({
      name: "Pakistan Housing Society PDF Maps & Interactive Plot-Grid Overlays",
      description:
        "Downloadable high-resolution PDF maps and interactive satellite plot-number overlays for DHA, Bahria Town, LDA City, Smart Cities and top housing schemes in Pakistan.",
      path: "/maps",
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Top Housing Society PDF Maps in Pakistan",
      numberOfItems: SOCIETY_PDF_MAPS.length,
      itemListElement: SOCIETY_PDF_MAPS.slice(0, 25).map((map, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: map.title,
        description: `${map.society} (${map.city}) — ${map.phasesOrSectors}`,
        url: `${SITE.url}/maps#${map.id}`,
      })),
    },
    faqJsonLd(MAPS_FAQS),
  ];

  return (
    <div className="bg-[#F5F3EE] pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark Emerald & Champagne Gold Hero Section */}
      <section
        className="relative overflow-hidden border-b border-[#DFB872]/30 pb-14 pt-28 text-white sm:pb-16 lg:pb-20 lg:pt-36"
        style={{
          background: "linear-gradient(135deg, #051811 0%, #0B2E21 55%, #061B13 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 22%, rgba(216, 175, 104, 0.22), transparent 48%), radial-gradient(circle at 14% 80%, rgba(18, 92, 67, 0.34), transparent 52%)",
          }}
        />
        <div className="ui-container relative z-10">
          <nav aria-label="Breadcrumb" className="text-[0.75rem] font-medium text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#F3D590]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#F3D590]">Society PDF Maps</li>
            </ol>
          </nav>

          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#DFB872]/40 bg-white/8 px-3.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#F3D590]">
                <IconSpark className="h-3.5 w-3.5" />
                Official Master Plans &amp; Plot-Level PDF Maps
              </p>
              <h1 className="mt-4 font-sans text-[1.95rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-white sm:text-[2.65rem]">
                Download Latest PDF Maps of Top Housing Societies in Pakistan
              </h1>
              <p className="mt-4 max-w-2xl text-[0.96rem] leading-relaxed text-white/82">
                Explore and download high-resolution PDF maps with plot numbers, sector boundaries, commercial zones, and ring-road interchanges across{" "}
                <strong className="font-semibold text-[#F3D590]">
                  DHA Lahore (Phases 1–9 Prism), Bahria Town (Lahore, Islamabad/Rawalpindi &amp; Karachi), Capital Smart City, Lahore Smart City, LDA City, Lake City, Park View City
                </strong>{" "}
                and more.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#maps-library"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E2BC76] to-[#D4A85D] px-5 py-3 text-[0.84rem] font-extrabold text-[#120D05] shadow-md transition hover:brightness-105"
                >
                  Browse All {SOCIETY_PDF_MAPS.length} PDF Maps
                  <IconArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-[0.84rem] font-bold text-white transition hover:border-[#F3D590] hover:text-[#F3D590]"
                >
                  Browse Verified Properties
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Interactive HD maps">
                <span className="mr-1 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-white/60">HD maps:</span>
                {[
                  { label: "DHA Societies", href: "/maps/dha-societies" },
                  { label: "DHA Lahore", href: "/maps/dha-societies?city=Lahore" },
                  { label: "Bahria Town Lahore", href: "/maps/bahria-town-lahore-map" },
                  { label: "Lake City", href: "/maps/lake-city-map" },
                  { label: "LDA Avenue", href: "/maps/lda-avenue-map" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[0.74rem] font-semibold text-white/90 transition hover:border-[#F3D590] hover:text-[#F3D590]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Stats Card */}
            <div className="rounded-2xl border border-[#DFB872]/35 bg-white/[0.06] p-5 backdrop-blur-md sm:p-6">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#F3D590]">
                Maps Coverage Snapshot
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/12 bg-white/[0.05] p-3.5">
                  <p className="font-sans text-[1.55rem] font-extrabold text-[#F3D590]">
                    {SOCIETY_PDF_MAPS.length}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] font-semibold text-white/80">
                    High-Res Society PDFs
                  </p>
                </div>
                <div className="rounded-xl border border-white/12 bg-white/[0.05] p-3.5">
                  <p className="font-sans text-[1.55rem] font-extrabold text-[#F3D590]">
                    {SOCIETY_MAP_CITIES.length}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] font-semibold text-white/80">
                    Major Cities Covered
                  </p>
                </div>
                <div className="rounded-xl border border-white/12 bg-white/[0.05] p-3.5">
                  <p className="font-sans text-[1.2rem] font-extrabold text-white">
                    DHA &amp; Bahria
                  </p>
                  <p className="mt-0.5 text-[0.74rem] font-medium text-white/75">
                    All Phases &amp; Sectors
                  </p>
                </div>
                <div className="rounded-xl border border-white/12 bg-white/[0.05] p-3.5">
                  <p className="font-sans text-[1.2rem] font-extrabold text-white">
                    100% Free
                  </p>
                  <p className="mt-0.5 text-[0.74rem] font-medium text-white/75">
                    Instant Preview &amp; Download
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#DFB872]/25 bg-[#08241A]/90 px-3.5 py-2.5 text-[0.75rem] text-white/85">
                <IconShield className="h-4 w-4 shrink-0 text-[#F3D590]" />
                <span>Includes plot-level numbering for DHA, Bahria, LDA City &amp; Smart Cities.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maps & Malls cross-promo: mall footfall moves the same neighbourhoods these maps cover. */}
      <section className="ui-container mt-8 sm:mt-10" aria-labelledby="maps-malls-heading">
        <div
          className="relative overflow-hidden rounded-[22px] border border-[#DFB872]/40 p-6 text-white shadow-[0_24px_60px_-34px_rgba(5,24,17,0.75)] sm:p-9"
          style={{ background: "linear-gradient(118deg, #04140E 0%, #0A2A1E 52%, #10402D 100%)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 92% 12%, rgba(223,184,114,0.26), transparent 42%), radial-gradient(circle at 6% 100%, rgba(22,163,74,0.22), transparent 48%)",
            }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F3D590]/70 to-transparent" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#DFB872]/40 bg-white/[0.06] px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-[#F3D590]">
                <IconPin className="h-3.5 w-3.5" />
                Maps &amp; Malls
              </p>
              <h2 id="maps-malls-heading" className="mt-3 font-sans text-[1.5rem] font-extrabold leading-tight tracking-[-0.02em] !text-white sm:text-[1.8rem]">
                Shopping Malls in Pakistan <span className="text-[#F3D590]">— open &amp; coming soon</span>
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/85">
                Maps show where a plot sits; malls show where the footfall is going. Explore every major mall in Pakistan
                with the property around each one.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Featured malls">
                {["LuckyOne", "Emporium", "Dolmen", "Centaurus", "Giga", "Packages Mall"].map((mall) => (
                  <li key={mall} className="rounded-lg border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[0.76rem] font-semibold text-white/90">
                    {mall}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
              <Link href="/malls" className="btn btn-gold justify-center">
                Explore all malls <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/malls/luckyone-mall-karachi"
                className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-white/25 bg-white/[0.04] px-4 font-sans text-[0.85rem] font-semibold text-white transition-colors hover:border-[#DFB872] hover:text-[#F3D590]"
              >
                Pakistan&rsquo;s largest mall
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Maps Explorer */}
      <section id="maps-library" className="ui-container mt-8 sm:mt-10">
        <MapsExplorer initialProperties={mapProperties} />
      </section>

      {/* High-Intent SEO Quick Links & FAQ Section */}
      <section className="ui-container mt-12">
        <div className="rounded-2xl border border-[#DCE3DF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#9A6F2B]">
                High-Intent Property Searches by Plot Size &amp; Society
              </p>
              <h2 className="mt-1 font-sans text-[1.35rem] font-extrabold text-[#0B261C]">
                Explore Verified Plots &amp; Houses in Mapped Societies
              </h2>
            </div>
            <Link
              href="/keywords-for-pakistan"
              className="text-[0.8rem] font-bold text-[#0E4A35] hover:underline"
            >
              View full Pakistan property directory →
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { label: "5 Marla Plot for Sale in Lahore", href: "/5-marla-plot-for-sale-in-lahore" },
              { label: "10 Marla Plot for Sale in Lahore", href: "/10-marla-plot-for-sale-in-lahore" },
              { label: "1 Kanal Plot for Sale in Lahore", href: "/1-kanal-plot-for-sale-in-lahore" },
              { label: "5 Marla Plot for Sale in Islamabad", href: "/5-marla-plot-for-sale-in-islamabad" },
              { label: "10 Marla Plot for Sale in Islamabad", href: "/10-marla-plot-for-sale-in-islamabad" },
              { label: "Plots on Installments in Lahore", href: "/plots-on-installments-in-lahore" },
              { label: "Plots on Installments in Islamabad", href: "/plots-on-installments-in-islamabad" },
              { label: "Houses on Installments in Lahore", href: "/houses-on-installments-in-lahore" },
              { label: "Apartments on Installments in Karachi", href: "/apartments-on-installments-in-karachi" },
              { label: "Property for Sale in DHA Lahore", href: "/property-for-sale/dha-lahore" },
              { label: "Property for Sale in Bahria Town Lahore", href: "/property-for-sale/bahria-town-lahore" },
              { label: "Property for Sale in DHA Islamabad", href: "/property-for-sale/dha-islamabad" },
              { label: "Property for Sale in Bahria Town Karachi", href: "/property-for-sale/bahria-town-karachi" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-[#DCE3DF] bg-[#F8F9F8] px-3 py-1.5 text-[0.76rem] font-semibold text-[#153529] transition hover:border-[#DFB872] hover:bg-[#FBF7EE] hover:text-[#0B261C]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-[#EBF0ED] pt-6">
            <h3 className="font-sans text-[1.1rem] font-extrabold text-[#0B261C]">
              Frequently Asked Questions — Pakistan Society PDF Maps
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {MAPS_FAQS.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-[#E5EAE7] bg-[#FAFBF9] p-4"
                >
                  <h4 className="font-sans text-[0.9rem] font-bold text-[#0B261C]">
                    {faq.question}
                  </h4>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[#52655B]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Advisory CTA */}
      <section className="ui-container mt-10">
        <div
          className="overflow-hidden rounded-2xl border border-[#DFB872]/40 p-6 text-white shadow-xl sm:p-9"
          style={{
            background: "linear-gradient(135deg, #061D15 0%, #0C3124 58%, #071F17 100%)",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#F3D590]">
                <IconPin className="h-3.5 w-3.5" />
                Need Plot Verification or Price Guidance?
              </p>
              <h2 className="mt-2 font-sans text-[1.4rem] font-extrabold tracking-[-0.02em] text-white sm:text-[1.75rem]">
                Verify Plot Locations &amp; Live Market Prices Before You Buy
              </h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-white/80">
                Use these high-resolution PDF maps to check plot numbers, corner/park-facing status, and road widths — then connect with our verified city specialists for transfer fee estimates and current demand rates.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href="/dealers"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E2BC76] to-[#D4A85D] px-5 py-3 text-[0.84rem] font-extrabold text-[#120D05]"
              >
                Speak with a Verified Agent
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-[0.84rem] font-bold text-white hover:border-[#F3D590] hover:text-[#F3D590]"
              >
                Investment Calculators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

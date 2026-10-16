import { CITY_MARKETS, SOCIETIES, getAllLandingSlugs, type LandingContent } from "@/lib/landing-pages";
import type { PropertyFilters } from "@/lib/queries";

/**
 * Keyword matrix — the long-tail layer of the SEO structure.
 *
 * The curated city and property-type pages cover head terms; this file
 * generates the city × property-type × intent combinations that real buyers
 * type into Google ("flats for rent in Karachi", "5 marla house for sale in
 * Lahore", "warehouses for sale in Faisalabad"). Every generated slug renders a
 * full landing page through `/src/app/[landing]/page.tsx` with its own title,
 * meta description, filtered listings, price bands and FAQs, and each one is
 * listed in the XML sitemaps — so the coverage is real pages, not keyword tags.
 *
 * Slug patterns (all resolved by `resolveMatrixKeyword`):
 *   {types}-for-sale-in-{city}      houses, flats, apartments, plots, villas,
 *                                   farmhouses, shops, offices, warehouses
 *   {types}-for-rent-in-{city}      houses, flats, apartments, portions, villas,
 *                                   farmhouses, shops, offices, warehouses
 *   {size}-house-for-sale-in-{city} 5-marla, 10-marla, 1-kanal, 2-kanal
 *   land-for-sale-in-{city} / files-for-sale-in-{city}
 *   property-investment-in-{city}
 */

type TypeCopy = {
  /** Singular + plural as used in H1s and copy. */
  noun: string;
  plural: string;
  /** Filter used to pull live inventory for the page. */
  filters: (citySlug: string, purpose: "buy" | "rent") => PropertyFilters;
  bullets: string[];
  verification: string;
  pitfalls: string;
  /** Optional copy used on the rental variants when tenancy rules differ. */
  rentCopy?: { bullets: string[]; verification: string; pitfalls: string };
};

const TYPE_MATRIX: Record<string, TypeCopy> = {
  houses: {
    noun: "house",
    plural: "houses",
    filters: (city, purpose) => ({ purpose, city, category: "house" }),
    bullets: [
      "Confirm the covered area against the approved plan, not only the marketed number.",
      "Check road width, plot dimensions and any height or setback restriction on that street.",
      "Verify sanctioned electricity load, gas, water source and sewerage before paying a token.",
      "Inspect roofing, drainage and waterproofing — monsoon repairs are the most common post-purchase cost.",
    ],
    verification:
      "Ask for the completion certificate where the society issues one, plus the latest property tax challan and utility bills in the seller's name.",
    pitfalls:
      "Unapproved extra floors and covered areas that breach the approved plan complicate transfer, financing and resale.",
  },
  apartments: {
    noun: "apartment",
    plural: "apartments",
    filters: (city, purpose) => ({ purpose, city, category: "apartment" }),
    rentCopy: {
      bullets: [
        "Compare furnished, semi-furnished and unfurnished apartments by what is included in the monthly rent.",
        "Confirm service charges, parking, lift, generator and utility costs before signing.",
        "Put the lease term, security deposit, rent escalation, notice period and maintenance duties in writing.",
        "Inspect water supply, fire-safety systems, lift condition and backup power in the building.",
      ],
      verification:
        "At handover, match the unit, floor, parking and furniture against the signed inventory and ask for the latest service-charge statement.",
      pitfalls:
        "A low advertised rent may exclude maintenance, utilities or furniture; compare the full monthly cost before choosing an apartment.",
    },
    bullets: [
      "Review maintenance charges, generator and lift costs in writing before booking.",
      "Confirm dedicated parking allocation rather than 'parking available'.",
      "Check the reserve fund, fire safety systems and lift service history.",
      "Assess cross ventilation and sound insulation, especially for inward-facing units.",
    ],
    verification:
      "Request the last two years of maintenance records and society minutes to spot any pending structural or lift expenditure.",
    pitfalls:
      "Underestimated maintenance and one-off upgrade levies are the most common hidden ownership cost.",
  },
  flats: {
    noun: "flat",
    plural: "flats",
    filters: (city, purpose) => ({ purpose, city, category: "apartment" }),
    rentCopy: {
      bullets: [
        "For a flat on rent, compare bedroom count, floor, usable area, lift access and monthly rent.",
        "Ask whether furnishing, parking, water and backup power are included in the advertised terms.",
        "Confirm the security deposit, rent escalation, lease duration, notice period and repair duties in writing.",
        "Inspect the flat and shared areas during a normal working hour, including the lift, water and building access.",
      ],
      verification:
        "Match the advertised bedroom count, floor, usable area and included items to the signed tenancy agreement and handover inventory.",
      pitfalls:
        "A flat with a lower monthly rent can cost more overall when parking, maintenance, utilities or furnishings are excluded.",
    },
    bullets: [
      "Compare price per square foot rather than the headline price — flat sizes vary widely.",
      "Confirm the floor, lift access and backup power arrangement for that specific unit.",
      "Check the water supply arrangement: tanker dependency adds a monthly cost.",
      "Ask what the maintenance charge covers and what it excludes.",
    ],
    verification:
      "Ask to see the building's approved plans and confirm the unit is on a sanctioned floor.",
    pitfalls:
      "Flats marketed with 'extra land' or merged balconies may breach the approved plan and block future transfer.",
  },
  plots: {
    noun: "plot",
    plural: "plots",
    filters: (city, purpose) => ({ purpose, city, category: "plot" }),
    rentCopy: {
      bullets: [
        "Confirm what the land may be used for during the tenancy — storage, parking, construction or agriculture.",
        "Get the term, notice period and rent escalation written into the agreement.",
        "Verify who is authorised to lease the land: owner, attorney or society.",
        "Agree who pays for levelling, boundary marking and any site clearance.",
      ],
      verification:
        "For land on rent, confirm ownership from the revenue record or society file before signing, and keep a copy of the lease with the owner's CNIC.",
      pitfalls:
        "Leasing land without verifying title, or for a use the layout does not permit, exposes the tenant to eviction and lost site investment.",
    },
    bullets: [
      "Verify the plot number on the society's official map, not the seller's photocopy.",
      "Confirm dues clearance, development charges and transfer fee in writing.",
      "Check physical possession, boundary markers and access road width on site.",
      "Compare price per square foot against the surrounding block, not just the society average.",
    ],
    verification:
      "Buy on a society-issued allocation letter or confirmed file; get the transfer done at the society office rather than through a third party.",
    pitfalls:
      "Illegal or unapproved layouts, and files that cannot be transferred in the buyer's name, are the main plot risks.",
  },
  villas: {
    noun: "villa",
    plural: "villas",
    filters: (city, purpose) => ({ purpose, city, type: "Villa" }),
    bullets: [
      "Villas carry a wider specification range — compare construction quality, not only size.",
      "Check boundary walls, landscaping contract and any shared-facility charges.",
      "Confirm the built-up area, basement and rooftop usage rights.",
      "Review security arrangements and maintenance agreements for the block.",
    ],
    verification:
      "For villa schemes, request the developer's specification sheet and any snag list from earlier handovers.",
    pitfalls:
      "Promised amenities that are not yet built, and service charges that rise after handover, are common villa surprises.",
  },
  farmhouses: {
    noun: "farmhouse",
    plural: "farmhouses",
    filters: (city, purpose) => ({ purpose, city, type: "Farmhouse" }),
    bullets: [
      "Confirm agricultural land classification, access road and water rights.",
      "Check electricity connection type and whether the tube well is sanctioned.",
      "Review boundary demarcation and any encroachment along the approach road.",
      "Budget for upkeep: farmhouses carry higher maintenance and security costs.",
    ],
    verification:
      "Verify land records with the revenue authority and confirm there is no litigation on the parcel.",
    pitfalls:
      "Farmhouse plots sold inside unapproved schemes may have no building permission and limited resale demand.",
  },
  shops: {
    noun: "shop",
    plural: "shops",
    filters: (city, purpose) => ({ purpose, city, type: "Shop" }),
    bullets: [
      "Footfall, frontage and visibility decide retail value more than covered area.",
      "Check permitted use, signage rights and any restriction on the trade you plan.",
      "Confirm loading access, parking and utility meters as handed over.",
      "For rentals, agree escalation, fit-out ownership and lock-in clauses in writing.",
    ],
    verification:
      "Ask for the commercial allocation or NOC that permits retail use at that address.",
    pitfalls:
      "Residential units converted to retail without approval can be sealed, and the fit-out cost is lost.",
  },
  offices: {
    noun: "office",
    plural: "offices",
    filters: (city, purpose) => ({ purpose, city, type: "Office" }),
    bullets: [
      "Check floor load, ceiling height and the air-conditioning arrangement for the floor.",
      "Confirm lift capacity, backup power and internet availability for the building.",
      "Review parking allocation per floor — a decisive factor for staff retention.",
      "For rentals, clarify fit-out, restoration and notice periods.",
    ],
    verification:
      "Confirm the building's commercial approval and that the floor plate is permissible office space.",
    pitfalls:
      "Offices marketed as 'corporate floors' inside residential buildings create compliance and access problems.",
  },
  warehouses: {
    noun: "warehouse",
    plural: "warehouses",
    filters: (city, purpose) => ({ purpose, city, type: "Warehouse" }),
    bullets: [
      "Check approach road width and whether container trucks can turn and load on site.",
      "Confirm floor loading, covered height and the sprinkler or fire arrangement.",
      "Verify sanctioned electricity load — storage operations depend on it.",
      "Review drainage on the approach road during monsoon before committing.",
    ],
    verification:
      "Confirm the property's industrial or commercial classification matches your intended use.",
    pitfalls:
      "Warehouses with weak road access or no sanctioned load often sit vacant despite low asking rents.",
  },
  portions: {
    noun: "upper portion",
    plural: "upper portions",
    filters: (city, purpose) => ({ purpose, city, type: "Upper Portion" }),
    bullets: [
      "Confirm the entrance is independent and who holds the keys to the shared gate.",
      "Check the electricity sub-meter and how the bill is split with the lower floor.",
      "Clarify water sharing, roof rights and car parking in writing.",
      "Ask about the family or tenants living on the other floor.",
    ],
    verification:
      "Get the split of utilities, roof usage and maintenance responsibility written into the tenancy agreement.",
    pitfalls:
      "Shared entrances and disputed roof rights are the most frequent source of upper-portion tenancy conflict.",
  },
};

const SALE_TYPES = [
  "houses",
  "flats",
  "apartments",
  "plots",
  "villas",
  "farmhouses",
  "shops",
  "offices",
  "warehouses",
] as const;

const RENT_TYPES = [
  "houses",
  "flats",
  "apartments",
  "plots",
  "portions",
  "villas",
  "farmhouses",
  "shops",
  "offices",
  "warehouses",
] as const;

const HOUSE_SIZES = [
  { slug: "3-marla", label: "3 Marla" },
  { slug: "5-marla", label: "5 Marla" },
  { slug: "10-marla", label: "10 Marla" },
  { slug: "1-kanal", label: "1 Kanal" },
  { slug: "2-kanal", label: "2 Kanal" },
] as const;

const PLOT_SIZES = [
  { slug: "3-marla", label: "3 Marla" },
  { slug: "5-marla", label: "5 Marla" },
  { slug: "10-marla", label: "10 Marla" },
  { slug: "1-kanal", label: "1 Kanal" },
  { slug: "2-kanal", label: "2 Kanal" },
] as const;

const takenSlugs = new Set(getAllLandingSlugs());

function societiesFor(citySlug: string) {
  return SOCIETIES.filter((society) => society.citySlug === citySlug).map((society) => ({
    name: society.name,
    href: `/property-for-sale/${society.slug}`,
    note: society.priceNote,
  }));
}

function bands(city: (typeof CITY_MARKETS)[number], isRent: boolean, isPlot = false) {
  if (!isRent && isPlot) {
    return [
      { label: "Files", range: "Allocation or file", note: "Verify approval, payment history and transfer" },
      { label: "Balloted", range: "Numbered plot", note: "Match the plot to the society's official map" },
      { label: "Possession", range: "Site readiness", note: "Check dues, utilities and access in person" },
    ];
  }
  const band = isRent ? city.rentBand : city.saleBand;
  const [low, high] = band.split("–").map((part) => part.trim());
  return [
    { label: "Entry level", range: low ?? "—", note: "Compact stock in developed blocks" },
    { label: "Mid market", range: "Most end-user transactions", note: "Established areas with completed infrastructure" },
    { label: "Premium", range: high ?? "—", note: "Prime locations, newer construction and larger plots" },
  ];
}

/** Shared scaffolding so every generated page carries city-specific copy. */
function buildMatrixLanding(input: {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  citySlug: string;
  isRent: boolean;
  filters: PropertyFilters;
  introSecond: string;
  bullets: string[];
  verification: string;
  pitfalls: string;
  unitLabel: string;
}): LandingContent | null {
  const city = CITY_MARKETS.find((market) => market.slug === input.citySlug);
  if (!city) return null;

  const societyLinks = societiesFor(city.slug).slice(0, 8);
  const bandLine = input.isRent ? city.rentBand : city.saleBand;

  return {
    slug: input.slug,
    kind: input.isRent ? "city-rent" : "city-sale",
    eyebrow: `${input.unitLabel} · ${city.name}`,
    h1: input.h1,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    keywords: input.keywords,
    intro: [
      city.character,
      input.introSecond,
      `Indicative ${input.isRent ? "rents" : "prices"} in ${city.name} currently run ${bandLine}, with a market benchmark of ${city.ppsf}. Narrow by area, size and budget below, then add two or three shortlisted ${input.unitLabel} to the comparison view.`,
    ],
    filters: input.filters,
    alternatives: {
      city: city.slug,
      purpose: input.isRent ? "rent" : "buy",
      ...(input.filters.category ? { category: input.filters.category } : {}),
      ...(input.filters.type ? { type: input.filters.type } : {}),
      ...(input.filters.commercialOnly ? { commercialOnly: true } : {}),
    },
    facets: [
      { label: `Property for sale in ${city.name}`, href: `/property-for-sale-in-${city.slug}`, note: "All sale inventory" },
      { label: `Property for rent in ${city.name}`, href: `/property-for-rent-in-${city.slug}`, note: "All rentals" },
      { label: `${city.name} area guides`, href: `/city/${city.slug}`, note: "Market overview and towns" },
      ...societyLinks.slice(0, 5).map((society) => ({ label: society.name, href: society.href, note: society.note })),
    ],
    societies: societyLinks,
    priceBands: bands(city, input.isRent, input.filters.category === "plot"),
    insightNotes: [
      { title: `Evaluating ${input.unitLabel}`, copy: input.verification },
      { title: "Common pitfalls", copy: input.pitfalls },
      { title: "Useful checks", copy: input.bullets.join(" ") },
    ],
    faqs: [
      {
        question: `What should I check before ${input.isRent ? "renting" : "buying"} ${input.unitLabel} in ${city.name}?`,
        answer: input.bullets.join(" "),
      },
      {
        question: `What is an indicative ${input.isRent ? "rent" : "price"} for ${input.unitLabel} in ${city.name}?`,
        answer: `Reference ${input.isRent ? "rents" : "bands"} in ${city.name} run ${bandLine}, with a benchmark of ${city.ppsf}. Figures are indicative and based on current asking ${input.isRent ? "rents" : "prices"}.`,
      },
      {
        question: `Which areas of ${city.name} should I shortlist first?`,
        answer: `${city.keyAreas.slice(0, 5).join(", ")} cover most of the live ${input.unitLabel} supply. ${city.accessNote}`,
      },
      {
        question: `How do I compare ${input.unitLabel} in ${city.name} quickly?`,
        answer:
          "Use the price per square foot on each listing, then add up to three shortlisted properties to the comparison view to line up price, area, amenities and the Properties Pak Score side by side.",
      },
    ],
    relatedLinks: [
      { label: `Property for sale in ${city.name}`, href: `/property-for-sale-in-${city.slug}` },
      { label: `Property for rent in ${city.name}`, href: `/property-for-rent-in-${city.slug}` },
      { label: `Property investment in ${city.name}`, href: `/property-investment-in-${city.slug}` },
      { label: `Property dealers in ${city.name}`, href: `/dealers?city=${city.slug}` },
      ...societyLinks.slice(0, 4).map((society) => ({ label: society.name, href: society.href })),
      { label: "Download society PDF maps", href: "/maps" },
      { label: "Mortgage calculator", href: "/tools/mortgage-calculator" },
      { label: "Rental yield calculator", href: "/tools/rental-yield-calculator" },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Slug builders                                                      */
/* ------------------------------------------------------------------ */

function typeSlug(plural: string, purpose: "sale" | "rent", citySlug: string) {
  return `${plural}-for-${purpose}-in-${citySlug}`;
}

function register(matrix: Map<string, LandingContent>, landing: LandingContent | null) {
  // Curated pages win: never shadow an existing landing slug.
  if (!landing || takenSlugs.has(landing.slug) || matrix.has(landing.slug)) return;
  matrix.set(landing.slug, landing);
}

function buildTypeMatrix(): Map<string, LandingContent> {
  const matrix = new Map<string, LandingContent>();

  for (const city of CITY_MARKETS) {
    for (const key of SALE_TYPES) {
      const copy = TYPE_MATRIX[key];
      const slug = typeSlug(key, "sale", city.slug);
      const saleMetaDescription = key === "plots"
        ? `Plots for sale in ${city.name} across ${city.keyAreas.slice(0, 3).join(", ")}. Compare 5 Marla, 10 Marla and 1 Kanal options where listed, plus area and possession status.`
        : `Browse ${copy.plural} for sale in ${city.name} across ${city.keyAreas.slice(0, 4).join(", ")}. Filter by area, budget, size and bedrooms, and compare price per square foot on Properties Pak.`;
      const plotSizeKeywords = key === "plots"
        ? [`5 marla plot for sale in ${city.name}`, `10 marla plot for sale in ${city.name}`, `1 kanal plot for sale in ${city.name}`]
        : [];
      const saleIntro = key === "plots"
        ? `${city.saleSupply} Use the area filters to look for listed 5 Marla, 10 Marla and 1 Kanal plots where available, then verify the exact area and possession status.`
        : city.saleSupply;
      register(
        matrix,
        buildMatrixLanding({
          slug,
          h1: `${copy.plural.replace(/^./, (c) => c.toUpperCase())} for Sale in ${city.name}`,
          metaTitle: `${copy.plural.replace(/^./, (c) => c.toUpperCase())} for Sale in ${city.name} | ${city.keyAreas.slice(0, 3).join(", ")} | Properties Pak`,
          metaDescription: saleMetaDescription,
          keywords: [
            `${copy.plural} for sale in ${city.name}`,
            `${copy.plural} for sale ${city.name}`,
            `${copy.noun} for sale in ${city.name}`,
            `${city.name} ${copy.plural}`,
            `buy ${copy.noun} in ${city.name}`,
            `${copy.plural} ${city.name} price`,
            ...plotSizeKeywords,
          ],
          citySlug: city.slug,
          isRent: false,
          filters: copy.filters(city.slug, "buy"),
          introSecond: saleIntro,
          bullets: copy.bullets,
          verification: copy.verification,
          pitfalls: copy.pitfalls,
          unitLabel: copy.plural,
        }),
      );
    }

    for (const key of RENT_TYPES) {
      const copy = TYPE_MATRIX[key];
      const slug = typeSlug(key, "rent", city.slug);
      const rentalMetaDescription = key === "apartments"
        ? `Find apartments for rent in ${city.name} across ${city.keyAreas.slice(0, 3).join(", ")}. Compare furnished options, bedrooms and monthly rent; availability varies by listing.`
        : key === "flats"
          ? `Find flats for rent in ${city.name} across ${city.keyAreas.slice(0, 3).join(", ")}. Filter by bedroom count, furnishing and monthly rent to check current matches.`
          : `Find ${copy.plural} for rent in ${city.name} — ${city.keyAreas.slice(0, 4).join(", ")}. Compare monthly rent, size, furnishing and locality on Properties Pak.`;
      const rentalKeywords = key === "apartments"
        ? [`furnished apartments for rent in ${city.name}`, `2 bedroom apartments for rent in ${city.name}`]
        : key === "flats"
          ? [`furnished flats for rent in ${city.name}`, `2 bedroom flat for rent in ${city.name}`]
          : [];
      const rentalIntro = key === "apartments"
        ? `${city.rentTenants} Compare furnished, semi-furnished and unfurnished apartments by bedroom count and monthly rent; check service charges and parking before arranging a visit.`
        : key === "flats"
          ? `${city.rentTenants} For a flat on rent, compare bedroom count, furnishing, floor access, parking and monthly rent; use the filters to check current matches.`
          : city.rentTenants;
      register(
        matrix,
        buildMatrixLanding({
          slug,
          h1: `${copy.plural.replace(/^./, (c) => c.toUpperCase())} for Rent in ${city.name}`,
          metaTitle: `${copy.plural.replace(/^./, (c) => c.toUpperCase())} for Rent in ${city.name} | ${city.keyAreas.slice(0, 3).join(", ")} | Properties Pak`,
          metaDescription: rentalMetaDescription,
          keywords: [
            `${copy.plural} for rent in ${city.name}`,
            `${copy.plural} on rent in ${city.name}`,
            `${copy.noun} for rent in ${city.name}`,
            `rent ${copy.noun} ${city.name}`,
            `${city.name} ${copy.plural} rent`,
            `${copy.plural} ${city.name} monthly`,
            ...rentalKeywords,
          ],
          citySlug: city.slug,
          isRent: true,
          filters: copy.filters(city.slug, "rent"),
          introSecond: rentalIntro,
          bullets: copy.rentCopy?.bullets ?? copy.bullets,
          verification: copy.rentCopy?.verification ?? copy.verification,
          pitfalls: copy.rentCopy?.pitfalls ?? copy.pitfalls,
          unitLabel: copy.plural,
        }),
      );
    }

    for (const size of HOUSE_SIZES) {
      const slug = `${size.slug}-house-for-sale-in-${city.slug}`;
      register(
        matrix,
        buildMatrixLanding({
          slug,
          h1: `${size.label} House for Sale in ${city.name}`,
          metaTitle: `${size.label} House for Sale in ${city.name} | Prices & Areas | Properties Pak`,
          metaDescription: `Compare ${size.label} houses for sale in ${city.name}. See indicative price bands, block-wise supply across ${city.keyAreas.slice(0, 3).join(", ")} and current listings on Properties Pak.`,
          keywords: [
            `${size.label.toLowerCase()} house for sale in ${city.name}`,
            `${size.slug.replace("-", " ")} house ${city.name}`,
            `${size.label.toLowerCase()} house price in ${city.name}`,
            `${city.name} ${size.label.toLowerCase()} house`,
            `${size.label.toLowerCase()} house ${city.name} for sale`,
          ],
          citySlug: city.slug,
          isRent: false,
          filters: { purpose: "buy", city: city.slug, category: "house" },
          introSecond: `${city.saleSupply} ${size.label} houses sit in the middle of the ${city.name} market: large enough for a family, small enough to keep the ticket size within reach of end users.`,
          bullets: TYPE_MATRIX.houses.bullets,
          verification: TYPE_MATRIX.houses.verification,
          pitfalls: TYPE_MATRIX.houses.pitfalls,
          unitLabel: `${size.label} houses`,
        }),
      );
    }

    for (const size of PLOT_SIZES) {
      const slug = `${size.slug}-plot-for-sale-in-${city.slug}`;
      register(
        matrix,
        buildMatrixLanding({
          slug,
          h1: `${size.label} Plot for Sale in ${city.name}`,
          metaTitle: `${size.label} Plot for Sale in ${city.name} | Possession & Society Rates | Properties Pak`,
          metaDescription: `Explore ${size.label} plots for sale in ${city.name} across ${city.keyAreas.slice(0, 3).join(", ")}. Compare possession plots, balloted numbers, society maps and asking prices on Properties Pak.`,
          keywords: [
            `${size.label.toLowerCase()} plot for sale in ${city.name}`,
            `${size.slug.replace("-", " ")} plot ${city.name}`,
            `${size.label.toLowerCase()} residential plot in ${city.name}`,
            `${size.label.toLowerCase()} plot price in ${city.name}`,
            `buy ${size.label.toLowerCase()} plot in ${city.name}`,
          ],
          citySlug: city.slug,
          isRent: false,
          filters: { purpose: "buy", city: city.slug, category: "plot" },
          introSecond: `${city.saleSupply} ${size.label} residential plots are among the most actively traded plot sizes in ${city.name}. Always verify the plot number on the official society PDF map and confirm possession status before paying a token.`,
          bullets: TYPE_MATRIX.plots.bullets,
          verification: TYPE_MATRIX.plots.verification,
          pitfalls: TYPE_MATRIX.plots.pitfalls,
          unitLabel: `${size.label} plots`,
        }),
      );
    }

    register(
      matrix,
      buildMatrixLanding({
        slug: `plots-on-installments-in-${city.slug}`,
        h1: `Plots on Installments in ${city.name}`,
        metaTitle: `Plots on Installments in ${city.name} | 3 to 5 Year Payment Plans | Properties Pak`,
        metaDescription: `Find residential and commercial plots on installments in ${city.name} across ${city.keyAreas.slice(0, 3).join(", ")}. Compare down payment, monthly instalments, NOC status and balloting timelines.`,
        keywords: [
          `plots on installments in ${city.name}`,
          `plot on easy installments ${city.name}`,
          `5 marla plot on installments in ${city.name}`,
          `3 marla plot on installments in ${city.name}`,
          `installment plots ${city.name}`,
        ],
        citySlug: city.slug,
        isRent: false,
        filters: { purpose: "buy", city: city.slug, category: "plot" },
        introSecond: `Installment plot plans in ${city.name} allow buyers to enter developing sectors with a 15–30% down payment and quarterly or monthly schedules. Verify the developer's NOC, land ownership and development charges before booking.`,
        bullets: TYPE_MATRIX.plots.bullets,
        verification: TYPE_MATRIX.plots.verification,
        pitfalls: TYPE_MATRIX.plots.pitfalls,
        unitLabel: "installment plots",
      }),
    );

    register(
      matrix,
      buildMatrixLanding({
        slug: `houses-on-installments-in-${city.slug}`,
        h1: `Houses on Installments in ${city.name}`,
        metaTitle: `Houses on Installments in ${city.name} | Easy Payment Plan Homes | Properties Pak`,
        metaDescription: `Compare houses and villas on installments in ${city.name} across ${city.keyAreas.slice(0, 3).join(", ")}. Check booking amount, possession timeline and developer track record on Properties Pak.`,
        keywords: [
          `houses on installments in ${city.name}`,
          `house on installment in ${city.name}`,
          `5 marla house on installments in ${city.name}`,
          `easy installment homes ${city.name}`,
        ],
        citySlug: city.slug,
        isRent: false,
        filters: { purpose: "buy", city: city.slug, category: "house" },
        introSecond: `Houses on installments in ${city.name} are offered in gated communities and developer-built villa enclaves. Confirm when physical possession is handed over during the payment schedule and review the construction specification sheet.`,
        bullets: TYPE_MATRIX.houses.bullets,
        verification: TYPE_MATRIX.houses.verification,
        pitfalls: TYPE_MATRIX.houses.pitfalls,
        unitLabel: "installment houses",
      }),
    );

    register(
      matrix,
      buildMatrixLanding({
        slug: `apartments-on-installments-in-${city.slug}`,
        h1: `Apartments on Installments in ${city.name}`,
        metaTitle: `Apartments & Flats on Installments in ${city.name} | Payment Plans | Properties Pak`,
        metaDescription: `Browse apartments and flats on installments in ${city.name}. Compare down payments, construction progress, rental yield potential and developer approvals on Properties Pak.`,
        keywords: [
          `apartments on installments in ${city.name}`,
          `flats on installments in ${city.name}`,
          `luxury apartments payment plan ${city.name}`,
          `studio apartment on installments ${city.name}`,
        ],
        citySlug: city.slug,
        isRent: false,
        filters: { purpose: "buy", city: city.slug, category: "apartment" },
        introSecond: `Vertical residential projects in ${city.name} frequently offer 2 to 4 year construction-linked installment plans. Always check the approved building plan, escrow or milestone schedule, and handover date in writing.`,
        bullets: TYPE_MATRIX.apartments.bullets,
        verification: TYPE_MATRIX.apartments.verification,
        pitfalls: TYPE_MATRIX.apartments.pitfalls,
        unitLabel: "installment apartments",
      }),
    );

    register(
      matrix,
      buildMatrixLanding({
        slug: `land-for-sale-in-${city.slug}`,
        h1: `Land for Sale in ${city.name}`,
        metaTitle: `Land for Sale in ${city.name} | Plots, Files & Societies | Properties Pak`,
        metaDescription: `Land for sale in ${city.name} — residential plots, society files and development parcels across ${city.keyAreas.slice(0, 3).join(", ")}. Verify dues and transfer before you buy.`,
        keywords: [
          `land for sale in ${city.name}`,
          `land in ${city.name}`,
          `plot for sale in ${city.name}`,
          `residential land ${city.name}`,
          `land price in ${city.name}`,
          `society plot ${city.name}`,
        ],
        citySlug: city.slug,
        isRent: false,
        filters: { purpose: "buy", city: city.slug, category: "plot" },
        introSecond: TYPE_MATRIX.plots.verification,
        bullets: TYPE_MATRIX.plots.bullets,
        verification: TYPE_MATRIX.plots.verification,
        pitfalls: TYPE_MATRIX.plots.pitfalls,
        unitLabel: "land",
      }),
    );

    register(
      matrix,
      buildMatrixLanding({
        slug: `files-for-sale-in-${city.slug}`,
        h1: `Property Files for Sale in ${city.name}`,
        metaTitle: `Property Files for Sale in ${city.name} | Instalment & Transfer Files`,
        metaDescription: `Property files for sale in ${city.name}: compare file prices, instalment status, transfer procedure and society dues before buying a file on Properties Pak.`,
        keywords: [
          `files for sale in ${city.name}`,
          `property file ${city.name}`,
          `plot file for sale ${city.name}`,
          `instalment file ${city.name}`,
          `file price in ${city.name}`,
        ],
        citySlug: city.slug,
        isRent: false,
        filters: { purpose: "buy", city: city.slug, category: "plot" },
        introSecond: `Files trade below possession plots because the buyer inherits the payment schedule. Confirm how many instalments remain, whether the file is transferable in your name, and the exact dues position with the society office.`,
        bullets: TYPE_MATRIX.plots.bullets,
        verification: TYPE_MATRIX.plots.verification,
        pitfalls: TYPE_MATRIX.plots.pitfalls,
        unitLabel: "files",
      }),
    );

    register(
      matrix,
      buildMatrixLanding({
        slug: `property-investment-in-${city.slug}`,
        h1: `Property Investment in ${city.name}`,
        metaTitle: `Property Investment in ${city.name} | Yield, Areas & Risks | Properties Pak`,
        metaDescription: `Property investment in ${city.name}: rental yields, appreciation corridors, entry tickets and the documentation checks to complete before committing capital.`,
        keywords: [
          `property investment in ${city.name}`,
          `real estate investment ${city.name}`,
          `best property investment ${city.name}`,
          `rental yield ${city.name}`,
          `investment property ${city.name}`,
          `where to invest in ${city.name} property`,
        ],
        citySlug: city.slug,
        isRent: false,
        filters: { purpose: "buy", city: city.slug },
        introSecond: city.investorAngle,
        bullets: [
          "Model the yield on net rent, not gross, after maintenance and vacancy.",
          "Check the resale depth of the specific block, not the society average.",
          "Confirm transfer procedure, dues clearance and documentation before paying a token.",
          "Budget for holding costs: taxes, maintenance and any society charges.",
        ],
        verification:
          "For investment purchases, compare two or three comparable transactions in the same block rather than relying on asking prices alone.",
        pitfalls:
          "Investing in an illiquid block, or in a scheme with incomplete infrastructure, is the most common reason returns stall.",
        unitLabel: "investment property",
      }),
    );
  }

  const SOCIETY_POWER_PAGES = [
    {
      slug: "dha-lahore-map-pdf",
      h1: "DHA Lahore Map PDF Download & Verified Properties (Phases 1 to 9 Prism)",
      metaTitle: "DHA Lahore Map PDF (Phase 1 to 9 Prism) & Plots/Houses for Sale | Properties Pak",
      metaDescription: "Download official high-resolution DHA Lahore Phase 1 to 9 Prism PDF maps with plot numbers, and browse verified houses and plots for sale in DHA Lahore.",
      keywords: ["dha lahore map pdf", "dha phase 9 prism map pdf", "dha lahore phase 6 7 8 map", "dha lahore houses for sale"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore" },
      unitLabel: "DHA Lahore properties",
    },
    {
      slug: "dha-phase-9-prism-lahore",
      h1: "DHA Phase 9 Prism Lahore — Plots, Houses & High-Resolution Sector Map",
      metaTitle: "DHA Phase 9 Prism Lahore Plots for Sale & Official Map PDF | Properties Pak",
      metaDescription: "Explore 5 Marla, 10 Marla and 1 Kanal residential & commercial plots for sale in DHA Phase 9 Prism Lahore, plus downloadable sector maps with plot numbers.",
      keywords: ["dha phase 9 prism lahore", "dha 9 prism plots for sale", "dha phase 9 prism map pdf", "1 kanal plot dha 9 prism"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore", category: "plot" },
      unitLabel: "DHA Phase 9 Prism plots",
    },
    {
      slug: "bahria-town-lahore-for-sale",
      h1: "Bahria Town Lahore — Houses, Plots & Official Sector Maps",
      metaTitle: "Bahria Town Lahore Houses & Plots for Sale | Sector Maps | Properties Pak",
      metaDescription: "Find verified 5 Marla, 10 Marla and 1 Kanal houses and plots for sale in Bahria Town Lahore (Sectors A to G & Bahria Orchard) with official PDF maps.",
      keywords: ["bahria town lahore houses for sale", "bahria town lahore plots", "bahria town lahore map pdf", "bahria orchard lahore"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore" },
      unitLabel: "Bahria Town Lahore properties",
    },
    {
      slug: "capital-smart-city-islamabad-for-sale",
      h1: "Capital Smart City Islamabad — Plots, Villas & Master Plan PDF Map",
      metaTitle: "Capital Smart City Islamabad Plots for Sale & Master Plan PDF | Properties Pak",
      metaDescription: "Explore residential and commercial plots, files, and villas in Capital Smart City Islamabad (Overseas, Executive & Harmony Park) with downloadable master plan maps.",
      keywords: ["capital smart city islamabad", "capital smart city plots for sale", "capital smart city master plan pdf"],
      citySlug: "islamabad",
      filters: { purpose: "buy" as const, city: "islamabad", category: "plot" },
      unitLabel: "Capital Smart City plots",
    },
    {
      slug: "lahore-smart-city-for-sale",
      h1: "Lahore Smart City — Residential & Commercial Plots & Official Map PDF",
      metaTitle: "Lahore Smart City Plots for Sale, Payment Plan & Map PDF | Properties Pak",
      metaDescription: "Compare Overseas Prime, Executive Block and Harmony Park plots in Lahore Smart City with downloadable high-resolution master plan PDF maps.",
      keywords: ["lahore smart city plots for sale", "lahore smart city map pdf", "lahore smart city payment plan"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore", category: "plot" },
      unitLabel: "Lahore Smart City plots",
    },
    {
      slug: "lda-city-lahore-for-sale",
      h1: "LDA City Lahore (Jinnah & Iqbal Sectors) — Plots for Sale & Official Map PDF",
      metaTitle: "LDA City Lahore Plots for Sale & Jinnah/Iqbal Sector Map PDF | Properties Pak",
      metaDescription: "Browse 5 Marla, 10 Marla and 1 Kanal plots for sale in LDA City Lahore (Jinnah Sector & Iqbal Sector) and download the official LDA map PDF.",
      keywords: ["lda city lahore plots for sale", "lda city jinnah sector map pdf", "lda city lahore map download"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore", category: "plot" },
      unitLabel: "LDA City Lahore plots",
    },
    {
      slug: "lake-city-lahore-for-sale",
      h1: "Lake City Lahore (M1 to M8) — Houses, Plots & Official Master Plan Map",
      metaTitle: "Lake City Lahore Houses & Plots for Sale (M1–M8) | Properties Pak",
      metaDescription: "Discover designer houses, golf-estate villas and plots for sale in Lake City Lahore Ring Road corridor (Sectors M1 to M8) with official PDF maps.",
      keywords: ["lake city lahore houses for sale", "lake city lahore plots", "lake city lahore map pdf"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore" },
      unitLabel: "Lake City Lahore properties",
    },
    {
      slug: "park-view-city-lahore-for-sale",
      h1: "Park View City Lahore & Islamabad — Houses, Plots & Block Maps",
      metaTitle: "Park View City Lahore Houses & Plots for Sale | Official Map PDF | Properties Pak",
      metaDescription: "Browse 5 Marla, 10 Marla and 1 Kanal houses and plots for sale in Park View City Lahore & Islamabad with official block-wise PDF maps.",
      keywords: ["park view city lahore houses for sale", "park view city plots", "park view city lahore map pdf"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore" },
      unitLabel: "Park View City properties",
    },
    {
      slug: "etihad-town-lahore-for-sale",
      h1: "Etihad Town Lahore (Phase 1, 2 & 3) — Plots, Houses & Official Maps",
      metaTitle: "Etihad Town Lahore Phase 1, 2 & 3 Plots & Houses for Sale | Properties Pak",
      metaDescription: "Explore residential and commercial plots and houses for sale in Etihad Town Lahore Phases 1, 2 & 3 on Raiwind Road with official PDF maps.",
      keywords: ["etihad town lahore plots for sale", "etihad town phase 2 map pdf", "etihad town lahore houses"],
      citySlug: "lahore",
      filters: { purpose: "buy" as const, city: "lahore" },
      unitLabel: "Etihad Town Lahore properties",
    },
  ];

  for (const item of SOCIETY_POWER_PAGES) {
    register(
      matrix,
      buildMatrixLanding({
        slug: item.slug,
        h1: item.h1,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        keywords: item.keywords,
        citySlug: item.citySlug,
        isRent: false,
        filters: item.filters,
        introSecond: `You can also inspect and download the official high-resolution plot-number PDF map and interactive satellite plot-grid overlay on our dedicated Society Maps page (/maps).`,
        bullets: TYPE_MATRIX.plots.bullets,
        verification: TYPE_MATRIX.plots.verification,
        pitfalls: TYPE_MATRIX.plots.pitfalls,
        unitLabel: item.unitLabel,
      }),
    );
  }

  return matrix;
}

const MATRIX = buildTypeMatrix();

export function resolveMatrixKeyword(slug: string): LandingContent | null {
  return MATRIX.get(slug) ?? null;
}

export function getAllMatrixKeywordSlugs(): string[] {
  return [...MATRIX.keys()];
}

export function getMatrixKeywordCount(): number {
  return MATRIX.size;
}

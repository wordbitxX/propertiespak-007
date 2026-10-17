/**
 * Pakistan's shopping malls — famous destinations plus new / under-development
 * projects. Used by the header "Malls" menu, the /malls hub and the per-mall
 * landing pages that carry the mall keyword set ("shops for sale in …",
 * "mall shops on installments", …).
 *
 * Status wording is deliberately conservative: "Coming soon" entries describe
 * announced or under-construction projects and tell visitors to confirm current
 * status with the developer.
 */

export type MallStatus = "Open" | "New" | "Coming soon";

export type Mall = {
  slug: string;
  name: string;
  citySlug: string;
  cityName: string;
  location: string;
  status: MallStatus;
  /** One-line fact card, e.g. opening year or size note. */
  note: string;
  summary: string;
  highlights: string[];
  /** Search phrases this landing page should capture. */
  keywords: string[];
};

export const MALLS: Mall[] = [
  /* ---------------------------- Lahore · open ---------------------------- */
  {
    slug: "emporium-mall-lahore",
    name: "Emporium Mall",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Johar Town, Lahore",
    status: "Open",
    note: "Nishat Group · Johar Town · one of Lahore's largest malls",
    summary:
      "Emporium Mall in Johar Town is one of Lahore's flagship shopping destinations, anchored by international fashion brands, a large food court and a multiplex cinema. Its catchment across Johar Town, Wapda Town and the Ring Road corridor makes it one of the strongest retail addresses in the city for shop buyers and investors.",
    highlights: ["International & local brand mix", "Multiplex cinema", "Large food court", "High footfall Johar Town catchment"],
    keywords: [
      "shops for sale in Emporium Mall",
      "Emporium Mall shops for rent",
      "Emporium Mall shops on installments",
      "mall shops price Lahore",
      "commercial shops Johar Town",
      "Emporium Mall Lahore",
    ],
  },
  {
    slug: "packages-mall-lahore",
    name: "Packages Mall",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Walton Road, Lahore",
    status: "Open",
    note: "Packages Group · Walton Road · 700+ retail outlets",
    summary:
      "Packages Mall on Walton Road is one of the busiest retail centres in Lahore, with hundreds of outlets, a luxury cinema and a broad food offering. Its central location between Gulberg, Cantonment and DHA keeps weekday and weekend footfall consistently high.",
    highlights: ["700+ retail outlets", "Luxury cinema", "Central Walton Road location", "Strong family footfall"],
    keywords: [
      "shops for sale in Packages Mall",
      "Packages Mall shops for rent",
      "mall shops Walton Road",
      "retail shops price Lahore",
      "commercial property Packages Mall",
      "Packages Mall Lahore",
    ],
  },
  {
    slug: "dolmen-mall-lahore",
    name: "Dolmen Mall Lahore",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "DHA Phase 6, Lahore",
    status: "New",
    note: "Dolmen Group · DHA Phase 6 · opened December 2024 · largest GLA in Pakistan",
    summary:
      "Dolmen Mall Lahore opened in DHA Phase 6 in December 2024 and is the largest mall in the country by gross leasable area. Built by Dolmen Group — the operator behind Dolmen Mall Clifton in Karachi — it brings several first-to-Pakistan brands, a large food court and parking for around 2,000 vehicles near the Lahore Ring Road and airport corridor.",
    highlights: ["Largest GLA in Pakistan", "First-to-Pakistan international brands", "DHA Phase 6 address", "Parking for ~2,000 vehicles"],
    keywords: [
      "shops for sale in Dolmen Mall Lahore",
      "Dolmen Mall Lahore shops for rent",
      "DHA Phase 6 mall shops",
      "mall shops price DHA Lahore",
      "new mall Lahore shops",
      "Dolmen Mall Lahore",
    ],
  },
  {
    slug: "fortress-square-lahore",
    name: "Fortress Square",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Fortress Stadium, Lahore Cantt",
    status: "Open",
    note: "Fortress Stadium · five retail levels · cinema & rooftop food court",
    summary:
      "Fortress Square at Fortress Stadium is a long-established mall destination for the Cantonment catchment, with more than a hundred stores, a cinema and a rooftop food court. Its location near the stadium and Saddar keeps it popular with families and young shoppers alike.",
    highlights: ["100+ stores", "Cinema", "Rooftop food court", "Fortress Stadium footfall"],
    keywords: [
      "shops for sale in Fortress Square",
      "Fortress Square shops for rent",
      "mall shops Cantt Lahore",
      "retail shops Fortress Stadium",
      "commercial property Lahore Cantt",
      "Fortress Square Lahore",
    ],
  },
  {
    slug: "amanah-mall-lahore",
    name: "Amanah Mall",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Model Town Link Road, Lahore",
    status: "Open",
    note: "Model Town Link Road · cinema, trampoline & VR parks",
    summary:
      "Amanah Mall on Model Town Link Road combines retail with family entertainment, including a cinema, trampoline park and VR zone. Its position between Model Town, Garden Town and Johar Town gives shops here a dense residential catchment.",
    highlights: ["Cinema & family entertainment", "Trampoline and VR parks", "Dense Model Town catchment", "Link Road visibility"],
    keywords: [
      "shops for sale in Amanah Mall",
      "Amanah Mall shops for rent",
      "mall shops Model Town",
      "retail shops Link Road Lahore",
      "shops on installments Lahore",
      "Amanah Mall Lahore",
    ],
  },
  {
    slug: "xinhua-mall-lahore",
    name: "Xinhua Mall",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Main Boulevard Gulberg, Lahore",
    status: "Open",
    note: "Gulberg III · Main Boulevard retail address",
    summary:
      "Xinhua Mall sits on Main Boulevard Gulberg, one of Lahore's premium retail streets. The mall's fashion, dining and service outlets draw shoppers from across Gulberg, Kalma Chowk and the central city belt.",
    highlights: ["Main Boulevard Gulberg address", "Fashion & dining mix", "Premium central catchment", "High street visibility"],
    keywords: [
      "shops for sale in Xinhua Mall",
      "Xinhua Mall shops for rent",
      "mall shops Gulberg Lahore",
      "retail shops Main Boulevard",
      "commercial property Gulberg",
      "Xinhua Mall Lahore",
    ],
  },
  {
    slug: "mall-of-lahore",
    name: "Mall of Lahore",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Bahria Town, Lahore",
    status: "Open",
    note: "Bahria Town Lahore · retail, corporate offices & apartments",
    summary:
      "Mall of Lahore is the retail anchor of Bahria Town Lahore, combining shops with corporate offices and apartments in one mixed-use complex. It serves the scheme's large residential population and is a natural first address for retail investors targeting Bahria Town.",
    highlights: ["Bahria Town Lahore anchor mall", "Mixed-use retail & offices", "On-site residential catchment", "Managed community environment"],
    keywords: [
      "shops for sale in Mall of Lahore",
      "Mall of Lahore shops for rent",
      "mall shops Bahria Town Lahore",
      "commercial shops Bahria Town",
      "shops on installments Bahria Town Lahore",
      "Mall of Lahore",
    ],
  },

  /* ---------------------------- Karachi · open ---------------------------- */
  {
    slug: "dolmen-mall-clifton-karachi",
    name: "Dolmen Mall Clifton",
    citySlug: "karachi",
    cityName: "Karachi",
    location: "Clifton, Karachi",
    status: "Open",
    note: "Dolmen Group · Clifton · flagship seafront mall",
    summary:
      "Dolmen Mall Clifton is Karachi's best-known shopping mall, part of the Dolmen City complex on the Clifton seafront. Its hypermarket, international brands and food court make it one of the strongest retail catchments in the country for shop and kiosk buyers.",
    highlights: ["Clifton seafront location", "Hypermarket anchor", "International brand mix", "Dolmen City complex"],
    keywords: [
      "shops for sale in Dolmen Mall Clifton",
      "Dolmen Mall Clifton shops for rent",
      "mall shops Clifton Karachi",
      "retail shops price Karachi",
      "commercial property Clifton",
      "Dolmen Mall Karachi",
    ],
  },
  {
    slug: "dolmen-mall-tariq-road-karachi",
    name: "Dolmen Mall Tariq Road",
    citySlug: "karachi",
    cityName: "Karachi",
    location: "Tariq Road, Karachi",
    status: "Open",
    note: "Dolmen Group · Tariq Road · prime high-street mall",
    summary:
      "Dolmen Mall Tariq Road sits in the middle of one of Karachi's busiest shopping streets. The mall's brand mix and air-conditioned environment pull the Tariq Road walk-in crowd into managed retail space — a key advantage for shops compared with open high-street units.",
    highlights: ["Tariq Road high street", "Air-conditioned mall environment", "Strong walk-in footfall", "Fashion & lifestyle brands"],
    keywords: [
      "shops for sale in Dolmen Mall Tariq Road",
      "Tariq Road mall shops for rent",
      "mall shops Tariq Road Karachi",
      "retail shops price Karachi",
      "shops on installments Karachi",
      "Dolmen Mall Tariq Road",
    ],
  },
  {
    slug: "dolmen-mall-hyderi-karachi",
    name: "Dolmen Mall Hyderi",
    citySlug: "karachi",
    cityName: "Karachi",
    location: "Hyderi, North Nazimabad, Karachi",
    status: "Open",
    note: "Dolmen Group · Hyderi · family retail hub",
    summary:
      "Dolmen Mall Hyderi serves the dense residential belt of North Nazimabad and Hyderi. Its family-oriented retail, dining and grocery mix makes it a dependable neighbourhood mall address for small shop buyers.",
    highlights: ["Hyderi / North Nazimabad catchment", "Family-oriented retail mix", "Grocery & dining anchors", "Established footfall"],
    keywords: [
      "shops for sale in Dolmen Mall Hyderi",
      "Dolmen Mall Hyderi shops for rent",
      "mall shops North Nazimabad",
      "retail shops Hyderi Karachi",
      "small shops price Karachi",
      "Dolmen Mall Hyderi",
    ],
  },
  {
    slug: "lucky-one-mall-karachi",
    name: "Lucky One Mall",
    citySlug: "karachi",
    cityName: "Karachi",
    location: "Rashid Minhas Road, Karachi",
    status: "Open",
    note: "Rashid Minhas Road · one of the largest malls in Pakistan",
    summary:
      "Lucky One Mall on Rashid Minhas Road is one of the largest shopping malls in Pakistan, with a hypermarket, hundreds of retail outlets, a large food court and family entertainment. Its scale and Gulshan-e-Iqbal catchment make it a major address for retail investment on the scheme belt.",
    highlights: ["Among Pakistan's largest malls", "Hypermarket anchor", "Large food court & entertainment", "Gulshan / Rashid Minhas catchment"],
    keywords: [
      "shops for sale in Lucky One Mall",
      "Lucky One Mall shops for rent",
      "mall shops Rashid Minhas Road",
      "retail shops price Karachi",
      "shops on installments Lucky One",
      "Lucky One Mall Karachi",
    ],
  },
  {
    slug: "ocean-mall-karachi",
    name: "Ocean Mall",
    citySlug: "karachi",
    cityName: "Karachi",
    location: "Clifton, Karachi",
    status: "Open",
    note: "Clifton · high-rise mall tower",
    summary:
      "Ocean Mall is a prominent mall tower on Clifton's retail strip, with shops, dining and a cinema in a vertical format. Its address near Do Talwar places it in one of Karachi's highest-value commercial corridors.",
    highlights: ["Clifton retail strip", "High-rise mall format", "Cinema & dining", "Do Talwar corridor"],
    keywords: [
      "shops for sale in Ocean Mall",
      "Ocean Mall shops for rent",
      "mall shops Clifton Karachi",
      "commercial shops Do Talwar",
      "retail shops price Karachi",
      "Ocean Mall Karachi",
    ],
  },
  {
    slug: "park-towers-karachi",
    name: "Park Towers",
    citySlug: "karachi",
    cityName: "Karachi",
    location: "Clifton, Karachi",
    status: "Open",
    note: "Clifton · established mall & office tower",
    summary:
      "Park Towers is an established mall and office complex in Clifton, with retail floors that serve the surrounding residential and business population. Its longevity and location make it a steady, lower-drama retail investment compared with brand-new launches.",
    highlights: ["Established Clifton address", "Retail + office mix", "Stable tenant base", "Central Clifton catchment"],
    keywords: [
      "shops for sale in Park Towers",
      "Park Towers shops for rent",
      "mall shops Clifton",
      "commercial shops Karachi Clifton",
      "retail shops price Karachi",
      "Park Towers Karachi",
    ],
  },

  /* --------------------------- Islamabad · open --------------------------- */
  {
    slug: "centaurus-mall-islamabad",
    name: "The Centaurus Mall",
    citySlug: "islamabad",
    cityName: "Islamabad",
    location: "F-8, Jinnah Avenue, Islamabad",
    status: "Open",
    note: "F-8 · opened 2013 · mall, residences & hotel",
    summary:
      "The Centaurus Mall on Jinnah Avenue is Islamabad's landmark mixed-use development — a four-level shopping mall beneath residential and office towers and a hotel. It remains the capital's best-known retail address for premium brands and investors.",
    highlights: ["Islamabad landmark address", "Premium brand mix", "Mixed-use towers & hotel", "Jinnah Avenue visibility"],
    keywords: [
      "shops for sale in Centaurus Mall",
      "Centaurus Mall shops for rent",
      "mall shops F-8 Islamabad",
      "retail shops price Islamabad",
      "commercial property Jinnah Avenue",
      "Centaurus Mall Islamabad",
    ],
  },
  {
    slug: "giga-mall-islamabad",
    name: "Giga Mall",
    citySlug: "islamabad",
    cityName: "Islamabad",
    location: "DHA Phase 2, Islamabad Expressway",
    status: "Open",
    note: "World Trade Center Islamabad · DHA Phase 2",
    summary:
      "Giga Mall, inside the World Trade Center Islamabad complex on the Islamabad Expressway, serves the DHA and Bahria twin-city corridor. A recent extension has expanded its brand and lifestyle floors, strengthening an already deep catchment.",
    highlights: ["World Trade Center complex", "DHA / Bahria corridor", "Expanded brand floors", "Expressway visibility"],
    keywords: [
      "shops for sale in Giga Mall",
      "Giga Mall shops for rent",
      "mall shops DHA Islamabad",
      "retail shops Islamabad Expressway",
      "shops on installments Islamabad",
      "Giga Mall Islamabad",
    ],
  },
  {
    slug: "safa-gold-mall-islamabad",
    name: "Safa Gold Mall",
    citySlug: "islamabad",
    cityName: "Islamabad",
    location: "F-8 Markaz, Islamabad",
    status: "Open",
    note: "F-8 Markaz · compact gold-location mall",
    summary:
      "Safa Gold Mall sits in F-8 Markaz, one of Islamabad's busiest commercial centres. Its compact retail format suits boutique shops, jewellery, mobile and service outlets that rely on Markaz footfall rather than destination visits.",
    highlights: ["F-8 Markaz footfall", "Boutique & service retail", "Central commercial address", "High visibility units"],
    keywords: [
      "shops for sale in Safa Gold Mall",
      "Safa Gold Mall shops for rent",
      "mall shops F-8 Markaz",
      "retail shops price Islamabad",
      "small commercial shops Islamabad",
      "Safa Gold Mall Islamabad",
    ],
  },

  /* ---------------------------- New / coming soon ---------------------------- */
  {
    slug: "emporium-mall-faisalabad",
    name: "Emporium Mall Faisalabad",
    citySlug: "faisalabad",
    cityName: "Faisalabad",
    location: "Canal Road, Faisalabad",
    status: "Coming soon",
    note: "Announced Nishat Group project · Canal Road — confirm status with the developer",
    summary:
      "Emporium Mall Faisalabad is an announced Nishat Group project on Canal Road, following the success of Emporium Mall Lahore. As a planned destination mall it has already lifted investor interest in commercial shops along the Canal Road corridor — confirm current launch status with the developer before booking.",
    highlights: ["Announced by Nishat Group", "Canal Road corridor", "Destination mall format planned", "Early-stage shop investment interest"],
    keywords: [
      "shops for sale in Emporium Mall Faisalabad",
      "Emporium Mall Faisalabad shops",
      "mall shops Canal Road Faisalabad",
      "coming soon mall Faisalabad",
      "shops on installments Faisalabad",
      "Emporium Mall Faisalabad",
    ],
  },
  {
    slug: "grand-central-mall-faisalabad",
    name: "Grand Central Mall",
    citySlug: "faisalabad",
    cityName: "Faisalabad",
    location: "Canal Road, Faisalabad",
    status: "Coming soon",
    note: "Under construction · mixed-use mall, offices & residences",
    summary:
      "Grand Central Mall on Canal Road, Faisalabad is a large mixed-use development under construction, planned to combine shopping outlets with corporate offices and residences. Its scale makes it one of the most-watched retail projects in the city — verify development progress and payment plans before investing.",
    highlights: ["Large mixed-use scheme", "Retail, offices & residences", "Canal Road location", "Under construction"],
    keywords: [
      "shops for sale in Grand Central Mall",
      "Grand Central Mall Faisalabad shops",
      "mall shops Canal Road Faisalabad",
      "coming soon mall Faisalabad",
      "commercial shops Faisalabad",
      "Grand Central Mall Faisalabad",
    ],
  },
  {
    slug: "mall-of-islamabad",
    name: "The Mall of Islamabad",
    citySlug: "islamabad",
    cityName: "Islamabad",
    location: "Blue Area, Jinnah Avenue, Islamabad",
    status: "Coming soon",
    note: "Bahria Town project under construction · Blue Area tower",
    summary:
      "The Mall of Islamabad is a Bahria Town mixed-use tower under construction in the Blue Area on Jinnah Avenue, planned to combine retail with offices and apartments. For retail buyers it represents early-stage access to a Blue Area mall address — confirm construction and handover timelines with the developer.",
    highlights: ["Blue Area / Jinnah Avenue", "Bahria Town development", "Retail, offices & apartments", "Under construction"],
    keywords: [
      "shops for sale in Mall of Islamabad",
      "Mall of Islamabad shops",
      "mall shops Blue Area Islamabad",
      "coming soon mall Islamabad",
      "commercial shops Jinnah Avenue",
      "The Mall of Islamabad",
    ],
  },
  {
    slug: "prime-mall-lahore",
    name: "Prime Mall",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Raiwind Road (Al Kabir Downtown), Lahore",
    status: "Coming soon",
    note: "Upcoming mixed-use high-rise · shops, food court, tech offices",
    summary:
      "Prime Mall is an upcoming mixed-use high-rise on Main Raiwind Road inside Al Kabir Downtown, opposite Lake City. Plans combine shops and kiosks with a food court, smart tech offices and serviced apartments — an early entry point on the fast-growing Raiwind Road retail belt.",
    highlights: ["Raiwind Road growth corridor", "Shops, food court & tech offices", "Opposite Lake City catchment", "Mixed-use high-rise"],
    keywords: [
      "shops for sale in Prime Mall Lahore",
      "Prime Mall Raiwind Road shops",
      "mall shops Raiwind Road",
      "coming soon mall Lahore",
      "shops on installments Raiwind Road",
      "Prime Mall Lahore",
    ],
  },
  {
    slug: "icon-mall-towers-lahore",
    name: "Icon Mall & Towers",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Ring Road Interchange, Bahria Town Lahore",
    status: "Coming soon",
    note: "Twin-tower mixed-use project · 22 kanals · shops + furnished apartments",
    summary:
      "Icon Mall & Towers is a twin-tower mixed-use development at the Lahore Ring Road interchange at the entrance to Bahria Town Lahore, combining commercial outlets with furnished apartments and hotel-style units. Its gateway location targets both Bahria Town residents and Ring Road traffic.",
    highlights: ["Ring Road interchange gateway", "Bahria Town Lahore entrance", "150+ planned outlets", "Shops + furnished apartments"],
    keywords: [
      "shops for sale in Icon Mall Bahria Town",
      "Icon Mall Towers Lahore shops",
      "mall shops Bahria Town Lahore",
      "coming soon mall Lahore",
      "shops on installments Bahria Town",
      "Icon Mall & Towers Lahore",
    ],
  },
  {
    slug: "jasmine-grand-mall-lahore",
    name: "Jasmine Grand Mall",
    citySlug: "lahore",
    cityName: "Lahore",
    location: "Sector E, Bahria Town Lahore",
    status: "New",
    note: "Bahria Town Lahore Sector E · shops & food court on installments",
    summary:
      "Jasmine Grand Mall in Bahria Town Lahore's Sector E offers retail shops and a food court with installment plans, targeting buyers who want a managed mall unit with a low entry ticket. It sits inside one of Lahore's largest gated residential populations.",
    highlights: ["Shops on installments", "Food court retail", "Sector E, Bahria Town Lahore", "Managed mall format"],
    keywords: [
      "shops for sale in Jasmine Grand Mall",
      "Jasmine Grand Mall shops on installments",
      "mall shops Bahria Town Lahore Sector E",
      "new mall Lahore shops",
      "cheap shops Bahria Town",
      "Jasmine Grand Mall Lahore",
    ],
  },
  {
    slug: "the-magnus-mall-islamabad",
    name: "The Magnus Mall",
    citySlug: "islamabad",
    cityName: "Islamabad",
    location: "Gulberg, Islamabad",
    status: "Coming soon",
    note: "Under construction · Gulberg Islamabad mixed-use mall",
    summary:
      "The Magnus Mall is an under-construction mixed-use mall project in Gulberg Islamabad, part of the wave of mall-and-apartment towers reshaping the Gulberg corridor. Early buyers should verify development stage, approvals and payment schedule before committing.",
    highlights: ["Gulberg Islamabad corridor", "Mixed-use mall tower", "Under construction", "Early-stage pricing window"],
    keywords: [
      "shops for sale in The Magnus Mall",
      "Magnus Mall Islamabad shops",
      "mall shops Gulberg Islamabad",
      "coming soon mall Islamabad",
      "shops on installments Gulberg Islamabad",
      "The Magnus Mall",
    ],
  },
  {
    slug: "united-mall-gulgasht-multan",
    name: "United Mall Gulgasht",
    citySlug: "multan",
    cityName: "Multan",
    location: "Gulgasht Colony, Multan",
    status: "New",
    note: "Partially operational since 2025 · retail & apartments",
    summary:
      "United Mall Gulgasht in Multan's Gulgasht Colony is a multi-purpose commercial project, partially operational since 2025 with retail space and apartments. It is one of the newer managed mall formats in Multan and a marker of the city's growing organised retail supply.",
    highlights: ["Partially operational", "Retail + apartments", "Gulgasht Colony catchment", "Modern managed mall"],
    keywords: [
      "shops for sale in United Mall Multan",
      "United Mall Gulgasht shops for rent",
      "mall shops Gulgasht Multan",
      "new mall Multan shops",
      "commercial shops Multan",
      "United Mall Gulgasht Multan",
    ],
  },
];

export const OPEN_MALLS = MALLS.filter((mall) => mall.status === "Open");
export const NEW_MALLS = MALLS.filter((mall) => mall.status !== "Open");

export function getMallBySlug(slug: string): Mall | undefined {
  return MALLS.find((mall) => mall.slug === slug);
}

export function getAllMallSlugs(): string[] {
  return MALLS.map((mall) => mall.slug);
}

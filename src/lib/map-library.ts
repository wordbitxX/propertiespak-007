/**
 * Society maps shown under the header "Maps" menu.
 *
 * 1. Deep-zoom society maps — the same high-resolution, zoomable maps that
 *    Pakistan Property Services (pakistanpropertyservices.com.pk) publishes as
 *    DeepZoom (DZI) tiles. Tiles are served through our own
 *    `/api/map-proxy/pps/...` route so they load on our origin (no CORS or
 *    hot-link issues) and are cached at the edge.
 * 2. DHA society maps — the HD society maps listed on dhaplus.com/maps, shown
 *    in a zoomable viewer through `/api/map-proxy/dhaplus/...`.
 *
 * Every page credits and links back to the original source.
 */

export const PPS_SOURCE = {
  name: "Pakistan Property Services",
  url: "https://pakistanpropertyservices.com.pk",
  /** Upstream folder holding the `.dzi` files and their `_files/` tile pyramids. */
  deepZoomBase: "https://pakistanpropertyservices.com.pk/wp-content/uploads/deepzoom/",
} as const;

export const DHAPLUS_SOURCE = {
  name: "DHA Plus",
  url: "https://dhaplus.com/maps",
  imageBase: "https://assets.dhaplus.com/map_imgs/",
} as const;

export type DeepZoomMapGroup = "bahria" | "other";

export interface DeepZoomSocietyMap {
  /** Our URL slug: /maps/<slug>. Mirrors the source page slug. */
  slug: string;
  /** Menu label (matches the source site's menu wording). */
  label: string;
  title: string;
  society: string;
  city: string;
  group: DeepZoomMapGroup;
  /** DZI base name on the source server, e.g. "Lake-City" → Lake-City.dzi + Lake-City_files/. */
  dzi: string;
  sourceUrl: string;
  description: string;
}

export const DEEP_ZOOM_MAPS: DeepZoomSocietyMap[] = [
  {
    slug: "bahria-town-lahore-map",
    label: "Bahria Town Lahore Map",
    title: "Bahria Town Lahore Map",
    society: "Bahria Town Lahore",
    city: "Lahore",
    group: "bahria",
    dzi: "Bahria-Town-Lahore",
    sourceUrl: "https://pakistanpropertyservices.com.pk/bahria-town-lahore-map/",
    description:
      "Zoomable high-resolution map of Bahria Town Lahore covering Sectors A to F, blocks, main boulevards and landmarks such as the Grand Jamia Masjid and Eiffel Tower.",
  },
  {
    slug: "bahria-orchard-lahore-map",
    label: "Bahria Orchard Lahore Map",
    title: "Bahria Orchard Lahore Map",
    society: "Bahria Orchard Lahore",
    city: "Lahore",
    group: "bahria",
    dzi: "BahriaOrchard",
    sourceUrl: "https://pakistanpropertyservices.com.pk/bahria-orchard-lahore-map/",
    description:
      "Zoomable high-resolution map of Bahria Orchard Lahore with phase boundaries, blocks and plot layout on Raiwind Road.",
  },
  {
    slug: "lda-avenue-map",
    label: "LDA Avenue Map",
    title: "LDA Avenue 1 Lahore Map",
    society: "LDA Avenue 1",
    city: "Lahore",
    group: "other",
    dzi: "LDAAVENUE",
    sourceUrl: "https://pakistanpropertyservices.com.pk/lda-avenue-map/",
    description: "Zoomable map of LDA Avenue 1 Lahore with blocks and plot layout.",
  },
  {
    slug: "lake-city-map",
    label: "Lake City Map",
    title: "Lake City Lahore Map",
    society: "Lake City Lahore",
    city: "Lahore",
    group: "other",
    dzi: "Lake-City",
    sourceUrl: "https://pakistanpropertyservices.com.pk/lake-city-map/",
    description: "Zoomable map of Lake City Lahore on Raiwind Road with sectors, blocks and plot layout.",
  },
  {
    slug: "al-kabir-town-map",
    label: "Al Kabir Town Map",
    title: "Al Kabir Town Lahore Map",
    society: "Al Kabir Town",
    city: "Lahore",
    group: "other",
    dzi: "AlKabirTown",
    sourceUrl: "https://pakistanpropertyservices.com.pk/al-kabir-town-map/",
    description: "Zoomable map of Al Kabir Town Lahore with phases, blocks and plot layout.",
  },
];

export const DEEP_ZOOM_DZI_NAMES = new Set(DEEP_ZOOM_MAPS.map((map) => map.dzi));

export function getDeepZoomMap(slug: string) {
  return DEEP_ZOOM_MAPS.find((map) => map.slug === slug);
}

/** Same-origin DZI URL; OpenSeadragon resolves tiles relative to it (…/<name>_files/<level>/<x>_<y>.jpg). */
export function deepZoomProxyUrl(map: Pick<DeepZoomSocietyMap, "dzi">) {
  return `/api/map-proxy/pps/${map.dzi}.dzi`;
}

export function deepZoomMapsInGroup(group: DeepZoomMapGroup) {
  return DEEP_ZOOM_MAPS.filter((map) => map.group === group);
}

/* -------------------------------------------------------------------------- */
/* DHA society maps (dhaplus.com/maps)                                         */
/* -------------------------------------------------------------------------- */

export interface DhaSocietyMap {
  /** Our URL slug: /maps/dha-societies/<slug>. Mirrors the DHA Plus slug. */
  slug: string;
  name: string;
  city: string;
  blocks: number;
  /** File name under assets.dhaplus.com/map_imgs/, or null when no HD map is published yet. */
  image: string | null;
}

export const DHA_SOCIETY_CITIES = [
  "Lahore",
  "Islamabad",
  "Karachi",
  "Multan",
  "Bahawalpur",
  "Gujranwala",
  "Quetta",
  "Peshawar",
] as const;

export const DHA_SOCIETY_MAPS: DhaSocietyMap[] = [
  // Lahore
  { slug: "phase-1-lahore", name: "DHA Phase 1 Lahore", city: "Lahore", blocks: 25, image: "wgPBrr00yZuAwcLtUWzYy4QTHPwQI1RuFfUCz4SF.jpg" },
  { slug: "phase-2-lahore", name: "DHA Phase 2 Lahore", city: "Lahore", blocks: 11, image: "kewq5DssJlKlXCdgY9sEi7wAgTUzp0QPm1cdg3Yo.jpg" },
  { slug: "phase-3-lahore", name: "DHA Phase 3 Lahore", city: "Lahore", blocks: 10, image: "eOVEuBUexGCF8lsUiF5MVyOnZHBAyn6twweR22xP.jpg" },
  { slug: "phase-4-lahore", name: "DHA Phase 4 Lahore", city: "Lahore", blocks: 16, image: "6wLS5XSwAdZfrKujU8kTYZ3k2GjQ1Mqyshk40QXS.jpg" },
  { slug: "phase-5-lahore", name: "DHA Phase 5 Lahore", city: "Lahore", blocks: 20, image: "rgfufZPEWDEtO47RdrzBivu1Tu3qPyVTpsEkKWDS.jpg" },
  { slug: "phase-6-lahore", name: "DHA Phase 6 Lahore", city: "Lahore", blocks: 33, image: "8VXBF7653ciCBot1eEcsnGE0RhnEeBI6eGC8Vuo5.jpg" },
  { slug: "phase-7-lahore", name: "DHA Phase 7 Lahore", city: "Lahore", blocks: 20, image: "r9JsBkhCOkvcm7NMpfkmiC4M3rpbmkQTXJ2gOh9Y.jpg" },
  { slug: "phase-8-lahore", name: "DHA Phase 8 Lahore", city: "Lahore", blocks: 21, image: "Takq7cOzafg1ER4p9W7HelAaMxBriVnwLT3ulMbY.jpg" },
  { slug: "phase-8-ex-air-avenue-lahore", name: "DHA Phase 8 – Ex Air Avenue Lahore", city: "Lahore", blocks: 12, image: "9Q9SWRhyt0kwrpwr9MCWcZ0e8gZ0j9dG0hC98a9P.jpg" },
  { slug: "phase-8-ex-park-view-lahore", name: "DHA Phase 8 – Ex Park View Lahore", city: "Lahore", blocks: 14, image: "sZ7tEatPOpv7v6zKYjK3YrhtYwY6KuQVLVPiHJJF.jpg" },
  { slug: "phase-8-ivy-green-lahore", name: "DHA Phase 8 – Ivy Green Lahore", city: "Lahore", blocks: 9, image: "y257ICCVmX53HJk5Pw0ZRD16VUP1TnFyOAnY1uvm.jpg" },
  { slug: "phase-9-town-lahore", name: "DHA Phase 9 Town Lahore", city: "Lahore", blocks: 11, image: "IMVVwu67cL8DJICI8NCvXxkH5vcxPVCR5Ym3hGky.jpg" },
  { slug: "phase-9-prism-lahore", name: "DHA Phase 9 Prism Lahore", city: "Lahore", blocks: 35, image: "VHNKxuglRCHlDYya7oyGEXUC1OpiZYtl1LvqDxG3.jpg" },
  { slug: "phase-10-lahore", name: "DHA Phase 10 Lahore", city: "Lahore", blocks: 2, image: "PZZyrsx1mmkL3mbJnL9qiFGDD2mwFbQLyTBYCnEX.jpg" },
  { slug: "phase-11-rahbar-lahore", name: "DHA Phase 11 Rahbar Lahore", city: "Lahore", blocks: 39, image: "RKBr5TdQGBMblQPHtZRdpw9HaNQ4A0DQovWTNIHq.jpg" },
  { slug: "phase-12-eme-lahore", name: "DHA Phase 12 EME Lahore", city: "Lahore", blocks: 16, image: "VArY8tNi9SVJwaSh9PcOg9JhUQHuSVQIBnsgFowS.jpg" },
  { slug: "phase-13-dha-city-lahore", name: "DHA Phase 13 DHA City Lahore", city: "Lahore", blocks: 0, image: "GlWZg1BGamfD6ck5NGH2AJhg27QHgdl4owZHCkhf.jpg" },
  { slug: "askari-11-lahore", name: "Askari 11 Lahore", city: "Lahore", blocks: 4, image: "a8ck8Msa8Y14QCVdQ6HkW4gr6QlUwRDgQ6vwUlWg.jpg" },
  // Islamabad
  { slug: "phase-1-islamabad", name: "DHA Phase 1 Islamabad", city: "Islamabad", blocks: 11, image: "zagAkWdcX0goGENS55aaTlZQmyjFP0kbYlwt4b6C.jpg" },
  { slug: "phase-2-islamabad", name: "DHA Phase 2 Islamabad", city: "Islamabad", blocks: 9, image: "YZD9YNKAoKUhn2RKCN29Ff3Xs2tZTovAVcY2SdOx.jpg" },
  { slug: "phase-3-islamabad", name: "DHA Phase 3 Islamabad", city: "Islamabad", blocks: 11, image: "P2niJSc3wegJffRLlpIokHrTBbdHs5hauP2Fi7r1.jpg" },
  { slug: "phase-4-islamabad", name: "DHA Phase 4 Islamabad", city: "Islamabad", blocks: 5, image: "awhWyKu3SlTEUwQJKKfGiKaaKdbXKKrnITz0a71O.jpg" },
  { slug: "phase-5-islamabad", name: "DHA Phase 5 Islamabad", city: "Islamabad", blocks: 14, image: "4V9GB0MGa9yzsMStvOU4WTElZwMsOBv1TjVWqPhY.jpg" },
  { slug: "phase-6-islamabad", name: "DHA Phase 6 Islamabad", city: "Islamabad", blocks: 0, image: "2ZPCtRgw53FdkQAtvvVAD7jWfKEPrDdzZyTDPyKf.jpg" },
  { slug: "dha-valley-islamabad", name: "DHA Phase 7 (DHA Valley) Islamabad", city: "Islamabad", blocks: 21, image: "tqrY2V3OTaH0b5v3RfrCDkhNHmoiwod3dgMYF2ic.jpg" },
  { slug: "emaar-canyon-views-islamabad", name: "Emaar Canyon Views Islamabad", city: "Islamabad", blocks: 12, image: null },
  { slug: "dha-margalla-enclave-islamabad", name: "DHA Margalla Enclave Islamabad", city: "Islamabad", blocks: 10, image: null },
  { slug: "dha-margalla-orchard-islamabad", name: "DHA Margalla Orchard Islamabad", city: "Islamabad", blocks: 8, image: null },
  { slug: "dha-river-view-north-islamabad", name: "DHA River View North Islamabad", city: "Islamabad", blocks: 4, image: null },
  { slug: "dha-river-view-south-islamabad", name: "DHA River View South Islamabad", city: "Islamabad", blocks: 11, image: null },
  // Karachi
  { slug: "dha-city-karachi", name: "DHA City Karachi", city: "Karachi", blocks: 69, image: "JxJ6siIEAvLbGbAffqaXgYXNwWr3sRJfDcQPFmV3.jpg" },
  { slug: "dha-defence-karachi", name: "DHA Karachi (Defence)", city: "Karachi", blocks: 14, image: "LsrVMMCyuSy0YXtn7lOE3vg6AJwhXSXIhdkqOxuD.png" },
  // Other cities
  { slug: "dha-multan-multan", name: "DHA Multan", city: "Multan", blocks: 33, image: "AuXr7d1YV3Zve9lDgMC9Kg6CjV6W9w2Zd7WJ7vEm.jpg" },
  { slug: "dha-bahawalpur-bahawalpur", name: "DHA Bahawalpur", city: "Bahawalpur", blocks: 17, image: "9ShRGow93RtdqTOyRX7fr6dMEX7gg8IHb4EpQIvX.jpg" },
  { slug: "dha-gujranwala-gujranwala", name: "DHA Gujranwala", city: "Gujranwala", blocks: 0, image: "4GGQoc67PWQOOFjFes3mlz0i6uwlSsFgDZbVXJyH.jpg" },
  { slug: "dha-quetta-quetta", name: "DHA Quetta", city: "Quetta", blocks: 2, image: "RQuQJWPKBQfiZdCQM8QkWXiSkYCW6vHGsMYASeA1.jpg" },
  { slug: "dha-peshawar-peshawar", name: "DHA Peshawar", city: "Peshawar", blocks: 0, image: "4BLCgSk3jZqQUqNjM6cAIAHtLy58WdHvIgheNL9e.jpg" },
];

export const DHA_SOCIETY_IMAGE_NAMES = new Set(
  DHA_SOCIETY_MAPS.map((society) => society.image).filter((image): image is string => Boolean(image)),
);

export function getDhaSocietyMap(slug: string) {
  return DHA_SOCIETY_MAPS.find((society) => society.slug === slug);
}

export function dhaSocietyImageUrl(society: Pick<DhaSocietyMap, "image">) {
  return society.image ? `/api/map-proxy/dhaplus/${society.image}` : null;
}

export function dhaSocietySourceUrl(society: Pick<DhaSocietyMap, "slug">) {
  return `https://dhaplus.com/maps/${society.slug}`;
}

/* -------------------------------------------------------------------------- */
/* Header "Maps" and "Tools" menus                                             */
/* -------------------------------------------------------------------------- */

export interface NavMenuLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavMenuItem extends Partial<NavMenuLink> {
  label: string;
  children?: NavMenuLink[];
}

const deepZoomLinks = (group: DeepZoomMapGroup): NavMenuLink[] =>
  deepZoomMapsInGroup(group).map((map) => ({ label: map.label, href: `/maps/${map.slug}` }));

/** "DHA Maps" flyout: DHA Plus society maps grouped by city (dhaplus.com/maps). */
function dhaCityLinks(): NavMenuLink[] {
  return DHA_SOCIETY_CITIES.map((city) => ({
    label: `DHA ${city} Maps`,
    href: `/maps/dha-societies?city=${encodeURIComponent(city)}`,
  }));
}

export const MAPS_MENU: NavMenuItem[] = [
  { label: "PDF Maps", href: "/maps", description: "57+ downloadable society PDF maps" },
  { label: "DHA Societies Maps", href: "/maps/dha-societies", description: "HD maps of 37 DHA societies" },
  { label: "Bahria Town Maps", children: deepZoomLinks("bahria") },
  { label: "DHA Maps", children: dhaCityLinks() },
  ...deepZoomLinks("other"),
];

export const TOOLS_MENU: NavMenuLink[] = [
  { label: "Area Unit Converter", href: "/tools/area-converter", description: "Marla, Kanal, Sq Ft, Sq Yd, Acre" },
  { label: "Plot Size & Price Calculator", href: "/tools/plot-size-calculator", description: "Dimensions to area and plot value" },
  { label: "Islamic Home Financing", href: "/tools/islamic-financing-calculator", description: "Diminishing Musharakah plan" },
  { label: "Mortgage Calculator", href: "/tools/mortgage-calculator", description: "Monthly instalment and interest" },
  { label: "Affordability Calculator", href: "/tools/affordability-calculator", description: "Price range for your budget" },
  { label: "Rental Yield Calculator", href: "/tools/rental-yield-calculator", description: "Gross and net rental return" },
  { label: "ROI Calculator", href: "/tools/roi-calculator", description: "Total and annualised return" },
  { label: "Investment Projection", href: "/tools/investment-calculator", description: "Appreciation plus rent scenario" },
  { label: "Rent vs Buy Calculator", href: "/tools/rent-vs-buy-calculator", description: "Which costs less over time" },
  { label: "Construction Cost Calculator", href: "/tools/construction-cost-calculator", description: "Build budget per sq ft" },
  { label: "Property Tax Calculator", href: "/tools/property-tax-calculator", description: "Buying, holding and selling taxes" },
];


/** Same-origin proxy template for a DHA Plus plot-layout tile layer (see /api/map-proxy/bplus). */
export function proxiedLayoutTiles(tiles: string): string | null {
  const match = /^https:\/\/(maps-cdn|maps)\.bahriaplus\.com\/(.+\/\{z\}\/\{x\}\/\{y\}\.png)$/.exec(tiles);
  return match ? `/api/map-proxy/bplus/${match[1] === "maps-cdn" ? "cdn" : "maps"}/${match[2]}` : null;
}

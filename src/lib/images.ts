/**
 * Curated, licence-free architectural photography (Pexels CDN) plus the
 * product's own generated hero artwork. Helpers build correctly sized URLs so
 * cards, grids and the hero never download more pixels than they render.
 */
export function photo(id: number, width = 1200, height?: number): string {
  const h = height ?? Math.round((width * 2) / 3);
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${h}`;
}

export const photos = {
  villas: [36676879, 28054849, 27626185, 36394726, 19075389, 19075387, 31817157, 24805054, 28915352, 19075392],
  interiors: [8082227, 6444249, 6580381, 7546213, 8141959, 6899354, 7174113, 7045919, 7546230, 7546321],
  bedrooms: [6585757, 7031879, 8135496, 35021550, 34818802, 6538888, 8146212, 6587896],
  commercial: [1313534, 38247895, 267501, 2040476, 13437132, 8310949, 4534504, 18468708, 13762569, 13219418],
  dev: [36422828, 38524594, 11680715, 25310909, 15370209, 30505108, 31249549, 7937746],
  retail: [30929605, 31573705, 31853833, 15054264, 19193275, 12547325],
  cities: {
    lahore: 34619221,
    islamabad: 27698081,
    karachi: 31552071,
    rawalpindi: 12938380,
    faisalabad: 30505108,
    multan: 13659051,
    gujranwala: 14934001,
    peshawar: 35428531,
    lahoreAlt: 13659051,
    karachiAlt: 19896048,
    islamabadAlt: 39372652,
  },
} as const;

/**
 * Gallery used when an owner submits a listing without photos, by category.
 * Seeded listings never reuse these, so an approved submission never looks
 * like another listing.
 */
export const submissionFallbackPhotos: Record<string, readonly number[]> = {
  house: [36676879, 8082227, 6585757, 7546213],
  apartment: [8082227, 6585757, 7546213, 7031879],
  plot: [36422828, 30505108, 31249549, 11680715],
  land: [31249549, 30505108, 11680715, 7937746],
  office: [1313534, 267501, 13437132, 8310949],
  shop: [30929605, 31573705, 15054264, 12547325],
  building: [2040476, 4534504, 18468708, 1313534],
  warehouse: [7937746, 11680715, 38524594, 25310909],
  farmhouse: [36394726, 28915352, 19075392, 8135496],
  penthouse: [7546321, 8141959, 7045919, 34818802],
};

export const HERO_PHOTO_ID = 31817157;
/**
 * Hero: contemporary luxury villa with an infinity pool at sunset by Ahmet
 * Çötür (Pexels photo 31817157), shot at 7688 × 5128. It is served straight
 * from the Pexels image CDN, which resizes from that full-resolution original,
 * so every width in the srcset is a true downscale — including 3840px for 4K
 * and retina desktops. Portrait mobile crops are cut at 3:4 by the CDN. The
 * hero component preconnects to images.pexels.com so the first byte is not
 * delayed. The villa sits on the right of the frame, leaving the sunset sky and
 * the pool behind the headline.
 */
export const heroImage = {
  origin: "",
  /** Premium villa at dusk, shipped locally so the hero no longer depends on a remote photo CDN. */
  desktop: "/images/hero-premium.jpg",
  desktopSrcSet: "/images/hero-premium.jpg 1376w",
  mobileSrcSet: "/images/hero-premium.jpg 1376w",
  /** Local, real-JPEG social card (WhatsApp / Facebook / X previews). */
  og: "/images/residence-social.jpg",
  alt: "Contemporary luxury villa with floor-to-ceiling glass and an infinity pool at sunset",
};

export const investmentImage = {
  src: "/images/investment-1440.webp",
  alt: "Residential development courtyard with reflecting pool lit at blue hour",
};

export const ogImage = heroImage.og;

const OG_CARD_PATH = "/api/og";

/**
 * Title-aware social card served by the OG image route (`/api/og`). Pages
 * without their own photography use it so shared links stay branded and
 * readable in search results, WhatsApp, Facebook and X.
 */
export function ogCard(input: { title: string; subtitle?: string; kicker?: string; footer?: string }): string {
  const params = new URLSearchParams();
  params.set("title", input.title);
  if (input.subtitle) params.set("subtitle", input.subtitle);
  if (input.kicker) params.set("kicker", input.kicker);
  if (input.footer) params.set("footer", input.footer);
  return `${OG_CARD_PATH}?${params.toString()}`;
}

/**
 * Fixed photos used by page sections (homepage discovery tiles, the commercial
 * page feature). Seeded listings never reuse these, so a listing card never
 * repeats a section image.
 */
export const sectionPhotos = {
  buy: 36676879,
  rent: 8082227,
  newProjects: 38524594,
  commercial: 1313534,
  luxury: 28054849,
  apartments: 7546321,
  plots: 36422828,
  land: 31249549,
  offices: 267501,
  typeHomes: 28054849,
  typeApartments: 8082227,
  typePlots: 11680715,
  typeLand: 25310909,
  typeCommercial: 267501,
  commercialFeature: 18468708,
} as const;

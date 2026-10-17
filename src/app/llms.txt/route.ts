import { SITE } from "@/lib/constants";
import { MALLS } from "@/lib/malls";
import { DEEP_ZOOM_MAPS, DHA_SOCIETY_MAPS, TOOLS_MENU } from "@/lib/map-library";
import { SOCIETY_PDF_MAPS } from "@/lib/society-pdf-maps";
import { getCities, getPosts } from "@/lib/queries";

/**
 * /llms.txt — a plain-markdown map of the site for AI answer engines
 * (ChatGPT, Perplexity, Gemini, Claude, Copilot). It states who we are, what
 * each section contains and links the canonical pages, so generated answers
 * can cite the right URL. Spec: https://llmstxt.org
 */
export const revalidate = 3600;

const url = (path: string) => `${SITE.url}${path}`;

export async function GET() {
  const [cities, posts] = await Promise.all([getCities(), getPosts(60)]);
  const featuredMalls = MALLS.filter((mall) => mall.status === "open" && mall.sizeLabel).slice(0, 12);

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.name} (${SITE.host}) is a Pakistan property marketplace operated by ${SITE.company} from ${SITE.companyAddress.city}, ${SITE.companyAddress.country}. It lists reviewed houses, apartments, plots and commercial property for sale and rent, verified dealers, new projects, ${SOCIETY_PDF_MAPS.length + DHA_SOCIETY_MAPS.length + DEEP_ZOOM_MAPS.length} housing-society maps, a directory of ${MALLS.length} shopping malls and free property calculators, in English and Urdu.`,
    "",
    "Key facts:",
    `- Cities covered: ${cities.map((city) => city.name).join(", ")}.`,
    "- Land units: 1 marla = 225 sq ft in most housing societies (272.25 sq ft in Punjab revenue records); 1 kanal = 20 marla; 1 square yard = 9 sq ft; Karachi plots are quoted in square yards.",
    "- Listings are reviewed before publication; dealer verification confirms identity and contact details, not property title.",
    "- Prices and the price index are based on asking prices and are indicators, not valuations.",
    `- Contact: ${SITE.companyPhone} (phone & WhatsApp), ${SITE.companyEmail}; international desk ${SITE.companyPhoneUs}.`,
    "",
    "## Property search",
    `- [All properties for sale and rent](${url("/properties")}): live listings across Pakistan with filters for city, type, size and price.`,
    ...cities.flatMap((city) => [
      `- [Property for sale in ${city.name}](${url(`/property-for-sale-in-${city.slug}`)})`,
      `- [Property for rent in ${city.name}](${url(`/property-for-rent-in-${city.slug}`)})`,
    ]),
    `- [New projects](${url("/projects")}): developments with payment plans and possession timelines.`,
    `- [Commercial property](${url("/commercial")}): shops, offices and commercial plots.`,
    `- [Verified dealers](${url("/dealers")}): agencies verified by the Properties Pak desk.`,
    "",
    "## City and society guides",
    ...cities.map((city) => `- [${city.name} city guide](${url(`/city/${city.slug}`)}) · [Towns & societies in ${city.name}](${url(`/towns/${city.slug}`)})`),
    `- [Pakistan Property Price Index](${url("/pakistan-property-price-index")}): asking-price trends by city and society.`,
    "",
    "## Society maps",
    `- [Society maps hub](${url("/maps")}): ${SOCIETY_PDF_MAPS.length} downloadable society PDF maps.`,
    `- [DHA society maps](${url("/maps/dha-societies")}): HD maps of ${DHA_SOCIETY_MAPS.length} DHA phases and societies with sectors and plot layouts.`,
    ...DEEP_ZOOM_MAPS.map((map) => `- [${map.title}](${url(`/maps/${map.slug}`)}): zoomable plot-level map.`),
    "",
    "## Shopping malls",
    `- [Shopping malls in Pakistan](${url("/malls")}): ${MALLS.filter((mall) => mall.status === "open").length} open malls and ${MALLS.filter((mall) => mall.status === "upcoming").length} upcoming projects.`,
    ...featuredMalls.map((mall) => `- [${mall.name}, ${mall.city}](${url(`/malls/${mall.slug}`)}): ${mall.area}${mall.sizeLabel ? `, ${mall.sizeLabel}` : ""}.`),
    "",
    "## Tools",
    ...TOOLS_MENU.map((tool) => `- [${tool.label}](${url(tool.href)}): ${tool.description}.`),
    "",
    "## Guides",
    ...posts.map((post) => `- [${post.title}](${url(`/blog/${post.slug}`)}): ${post.excerpt}`),
    "",
    "## Company",
    `- [About ${SITE.name}](${url("/about")}): who runs the platform and how listings, dealers, maps and guides are checked.`,
    `- [Contact](${url("/contact")}): phone, WhatsApp, email and city desks.`,
    `- [List your property](${url("/list-property")}): free listing submission for owners.`,
    "",
    "## Optional",
    `- [Sitemap index](${url("/sitemap-index.xml")})`,
    `- [${SITE.company}](${SITE.companyUrl}): the software company that builds and runs ${SITE.name}.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}

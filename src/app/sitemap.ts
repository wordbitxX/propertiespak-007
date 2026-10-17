import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getAllDealerSlugs, getAllPostSlugs, getAllProjectSlugs, getAllPropertySlugs, getCities } from "@/lib/queries";
import { getAllLandingSlugs, getAllSocietySlugs } from "@/lib/landing-pages";
import { getAllKeywordLandingSlugs } from "@/lib/keyword-landings";
import { TOWNS, getAllTownSlugs } from "@/lib/towns";
import { getAllMallSlugs } from "@/lib/malls";
import { DEEP_ZOOM_MAPS, DHA_SOCIETY_MAPS } from "@/lib/map-library";
import { BLOG_POSTS_2026_BY_SLUG } from "@/lib/blog-content-2026";

export const dynamic = "force-dynamic";

/** Only real, curated, indexable URLs. Filter and utility pages are excluded. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/properties", priority: 0.9, changeFrequency: "daily" },
  { path: "/properties/for-sale", priority: 0.9, changeFrequency: "daily" },
  { path: "/properties/for-rent", priority: 0.9, changeFrequency: "daily" },
  { path: "/properties/commercial", priority: 0.8, changeFrequency: "weekly" },
  { path: "/properties/new-projects", priority: 0.8, changeFrequency: "weekly" },
  { path: "/commercial", priority: 0.8, changeFrequency: "weekly" },
  { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
  { path: "/maps", priority: 0.9, changeFrequency: "weekly" },
  { path: "/maps/dha-societies", priority: 0.85, changeFrequency: "weekly" },
  ...DEEP_ZOOM_MAPS.map((map) => ({ path: `/maps/${map.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
  ...DHA_SOCIETY_MAPS.map((society) => ({
    path: `/maps/dha-societies/${society.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/pakistan-property-price-index", priority: 0.9, changeFrequency: "weekly" },
  { path: "/keywords-for-pakistan", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/mortgage-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/affordability-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/rental-yield-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/roi-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/investment-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/construction-cost-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/property-tax-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/rent-vs-buy-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/area-converter", priority: 0.75, changeFrequency: "monthly" },
  { path: "/tools/plot-size-calculator", priority: 0.75, changeFrequency: "monthly" },
  { path: "/tools/islamic-financing-calculator", priority: 0.75, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/advertise", priority: 0.6, changeFrequency: "monthly" },
  { path: "/list-property", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sitemap", priority: 0.8, changeFrequency: "daily" },
  { path: "/dealers", priority: 0.9, changeFrequency: "daily" },
  { path: "/malls", priority: 0.85, changeFrequency: "weekly" },
  { path: "/towns", priority: 0.9, changeFrequency: "weekly" },
  ...Array.from(new Set(TOWNS.map((town) => town.citySlug))).map((city) => ({
    path: `/towns/${city}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  })),
];

function uniqueCanonicalUrls(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route.path === "/" ? "" : route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const landing: MetadataRoute.Sitemap = [
    ...getAllLandingSlugs(),
    ...getAllKeywordLandingSlugs(),
  ].map((slug) => ({
    url: `${SITE.url}/${slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const society: MetadataRoute.Sitemap = [...getAllSocietySlugs(), ...getAllTownSlugs()].map((slug) => ({
    url: `${SITE.url}/property-for-sale/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const malls: MetadataRoute.Sitemap = getAllMallSlugs().map((slug) => ({
    url: `${SITE.url}/malls/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  try {
    const [properties, projects, posts, cities, dealers] = await Promise.all([
      getAllPropertySlugs(),
      getAllProjectSlugs(),
      getAllPostSlugs(),
      getCities(),
      getAllDealerSlugs(),
    ]);

    const entries: MetadataRoute.Sitemap = [
      ...base,
      ...landing,
      ...society,
      ...malls,
      ...cities.map((item) => ({
        url: `${SITE.url}/city/${item.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...properties.map((item) => ({
        url: `${SITE.url}/property/${item.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...projects.map((item) => ({
        url: `${SITE.url}/projects/${item.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...posts.map((item) => {
        const updated = BLOG_POSTS_2026_BY_SLUG.get(item.slug)?.updatedAt;
        return {
          url: `${SITE.url}/blog/${item.slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          ...(updated ? { lastModified: new Date(updated) } : {}),
        };
      }),
      ...dealers
        .filter((dealer) => dealer.slug)
        .map((dealer) => ({
          url: `${SITE.url}/dealers/${dealer.slug}`,
          changeFrequency: "weekly" as const,
          priority: dealer.verified ? 0.8 : 0.6,
        })),
    ];
    return uniqueCanonicalUrls(entries);
  } catch {
    return uniqueCanonicalUrls([...base, ...landing, ...society]);
  }
}

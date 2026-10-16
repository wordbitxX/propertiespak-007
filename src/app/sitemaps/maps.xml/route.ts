import { getAllSocietySlugs } from "@/lib/landing-pages";
import { getAllKeywordLandingSlugs } from "@/lib/keyword-landings";
import { TOWNS, getAllTownSlugs } from "@/lib/towns";
import { renderUrlSet, xmlResponse, type SitemapEntry } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

/**
 * Dedicated Society PDF Maps, Plot-Grid Maps, DHA/Bahria/Smart City/LDA Landing Pages
 * & Town Guides Sitemap — submit `/sitemaps/maps.xml` in Google Search Console.
 */
export async function GET() {
  const mapAndSocietyLandingSlugs = getAllKeywordLandingSlugs().filter(
    (slug) =>
      slug.includes("map") ||
      slug.includes("dha-") ||
      slug.includes("bahria-") ||
      slug.includes("smart-city") ||
      slug.includes("lda-city") ||
      slug.includes("lake-city") ||
      slug.includes("park-view-city") ||
      slug.includes("etihad-town") ||
      slug.includes("gulberg-") ||
      slug.includes("plots-for-sale") ||
      slug.includes("marla-") ||
      slug.includes("kanal-"),
  );

  const townCities = Array.from(new Set(TOWNS.map((t) => t.citySlug)));

  const entries: SitemapEntry[] = [
    { path: "/maps", changeFrequency: "daily", priority: 1.0 },
    { path: "/towns", changeFrequency: "weekly", priority: 0.9 },
    ...townCities.map((city) => ({
      path: `/towns/${city}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...mapAndSocietyLandingSlugs.map((slug) => ({
      path: `/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...[...getAllSocietySlugs(), ...getAllTownSlugs()].map((slug) => ({
      path: `/property-for-sale/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  // Deduplicate by path
  const seen = new Set<string>();
  const uniqueEntries = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });

  return xmlResponse(renderUrlSet(uniqueEntries));
}

import { renderUrlSet, xmlResponse, type SitemapEntry } from "@/lib/sitemap-xml";
import { MALLS } from "@/lib/malls";

export const dynamic = "force-dynamic";

/** Mall directory: the /malls hub plus every mall landing page. */
export async function GET() {
  const entries: SitemapEntry[] = [
    { path: "/malls", changeFrequency: "weekly", priority: 0.85 },
    ...MALLS.map((mall) => ({
      path: `/malls/${mall.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
  return xmlResponse(renderUrlSet(entries));
}

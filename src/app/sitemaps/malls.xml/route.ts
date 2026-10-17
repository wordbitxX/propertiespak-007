import { getAllMallSlugs } from "@/lib/malls";
import { renderUrlSet, xmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

/** Mall directory: the /malls hub plus one page per open or upcoming mall. */
export async function GET() {
  return xmlResponse(
    renderUrlSet([
      { path: "/malls", changeFrequency: "weekly" as const, priority: 0.85 },
      ...getAllMallSlugs().map((slug) => ({
        path: `/malls/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ]),
  );
}

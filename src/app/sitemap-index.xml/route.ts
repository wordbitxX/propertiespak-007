import { renderSitemapIndex, xmlResponse } from "@/lib/sitemap-xml";
import { getSitemapRegistry } from "@/lib/sitemap-registry";

export const dynamic = "force-dynamic";

export async function GET() {
  // The index lists every published sitemap file (master + topic + city
  // children), so a single submission in Search Console discovers them all.
  const entries = getSitemapRegistry().filter((entry) => entry.path !== "/sitemap-index.xml");
  return xmlResponse(renderSitemapIndex(entries.map((entry) => entry.path)));
}

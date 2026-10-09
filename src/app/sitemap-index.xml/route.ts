import { renderSitemapIndex, xmlResponse } from "@/lib/sitemap-xml";
import { getSitemapRegistry } from "@/lib/sitemap-registry";

export const dynamic = "force-dynamic";

export async function GET() {
  const master = getSitemapRegistry().find((entry) => entry.path === "/sitemap.xml");
  return xmlResponse(renderSitemapIndex(master ? [master.path] : []));
}

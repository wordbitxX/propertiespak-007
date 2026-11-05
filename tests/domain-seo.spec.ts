import { test, expect } from "@playwright/test";
import { SITE } from "../src/lib/constants";

// Keep the portal's explicitly preserved DHA host out of this company-domain check.
const OLD_DOMAIN = /wordbitxtech\.com|(?<!dha\.)wordbitx\.pk/i;
const CANONICAL_PATHS = ["/", "/about", "/contact", "/sample", "/samples", "/admin/login", "/properties/for-sale"];

test("WordbitX links, email, sitemap and canonical URLs use the current domains", async ({ request }) => {
  const wordbitxLinks = new Set<string>();

  for (const path of CANONICAL_PATHS) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();

    expect(html, `legacy domain in ${path}`).not.toMatch(OLD_DOMAIN);
    const canonicalTag = html.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0];
    expect(canonicalTag, `missing canonical on ${path}`).toBeTruthy();
    const canonical = canonicalTag?.match(/\bhref="([^"]+)"/i)?.[1];
    const expectedUrl = `${SITE.url}${path === "/" ? "" : path}`;
    expect(canonical).toBe(expectedUrl);
    expect(canonical).toMatch(/^https:\/\//);

    const openGraphTag = html.match(/<meta\b[^>]*property="og:url"[^>]*>/i)?.[0];
    expect(openGraphTag, `missing og:url on ${path}`).toBeTruthy();
    expect(openGraphTag).toContain(`content="${expectedUrl}"`);

    for (const match of html.matchAll(/\bhref="([^"]+)"/gi)) {
      if (/wordbitx\.com/i.test(match[1])) wordbitxLinks.add(match[1]);
    }
  }

  expect([...wordbitxLinks].length).toBeGreaterThan(0);
  expect([...wordbitxLinks]).toEqual(["https://wordbitx.com/"]);

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  expect(sitemap).not.toMatch(OLD_DOMAIN);
  const locations = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  expect(locations.length).toBeGreaterThan(0);
  for (const location of locations) {
    expect(location).toMatch(/^https:\/\/propertiespak\.com(?:\/|$)/);
  }

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  expect(await robotsResponse.text()).not.toMatch(OLD_DOMAIN);
});

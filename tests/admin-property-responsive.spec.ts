import { test, expect } from "@playwright/test";

for (const width of [320, 390, 640, 768, 1440]) {
  test(`admin property cards fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const login = await page.request.post("/api/admin/login", {
      data: { password: process.env.ADMIN_PASSWORD || "propertiespak@2026" },
    });
    expect(login.ok()).toBeTruthy();

    // Keep the test read-only and exercise unusually long owner-entered text.
    const response = await page.request.get("/api/admin/properties");
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    expect(payload.items.length).toBeGreaterThan(0);
    const property = {
      ...payload.items[0],
      title: `Spacious family home ${"LongPropertyTitle".repeat(8)}`,
      locationArea: `Phase 9 ${"LongLocationName".repeat(8)}`,
      propertyType: "Commercial Building",
      featured: true,
      listedByName: "Test owner",
      coverImage: "/images/fallbacks/property-1-hd.webp",
    };
    await page.route("**/api/admin/properties?*", (route) => route.fulfill({
      json: { ok: true, items: [property], total: 1 },
    }));

    await page.goto("/admin?tab=properties");
    const list = page.getByRole("list", { name: "Published properties" });
    const card = list.getByRole("listitem");
    await expect(card).toHaveCount(1);
    await expect(card.getByText(property.title, { exact: true })).toBeVisible();

    // Check real content bounds, not just an overflow-hidden page wrapper.
    const overflowing = await list.evaluate((element) => {
      const viewportWidth = document.documentElement.clientWidth;
      return [element, ...element.querySelectorAll("*")].filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1
          || node.scrollWidth > node.clientWidth + 1);
      }).map((node) => ({ tag: node.tagName, className: node.getAttribute("class") }));
    });
    expect(overflowing).toEqual([]);
    for (const name of ["View", "Edit", "Delete"]) {
      const action = name === "View" ? card.getByRole("link", { name }) : card.getByRole("button", { name, exact: true });
      await action.scrollIntoViewIfNeeded();
      await expect(action).toBeInViewport();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  });
}

import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  const response = await page.request.post("/api/admin/login", {
    data: { password: process.env.ADMIN_PASSWORD || "propertiespak@2026" },
  });
  expect(response.ok()).toBeTruthy();
}

for (const width of [390, 1440]) {
  test(`admin shows profile photos and public agency logos at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await login(page);
    const response = await page.request.get("/api/admin/users");
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    expect(payload.items.length).toBeGreaterThan(0);
    const base = payload.items[0];
    const items = [
      { ...base, id: 10001, name: "Uploaded Picture", avatarUrl: "/images/agents/agent-2.webp", companyLogo: "/images/agents/agent-3.webp" },
      { ...base, id: 10002, name: "Logo Only", avatarUrl: "", companyLogo: "/images/agents/agent-3.webp" },
      { ...base, id: 10003, name: "No Upload", avatarUrl: "", companyLogo: "" },
      { ...base, id: 10004, name: "Broken Upload", avatarUrl: "/images/missing-avatar-test.webp", companyLogo: "/images/agents/agent-3.webp" },
      { ...base, id: 10005, name: "Broken Logo", avatarUrl: "", companyLogo: "/images/missing-avatar-test.webp" },
    ];
    await page.route("**/images/missing-avatar-test.webp", (route) => route.fulfill({ status: 404, body: "" }));
    await page.route("**/api/admin/users", (route) => route.fulfill({ json: { ...payload, items } }));
    await page.goto("/admin?tab=users");

    for (const user of items) {
      const avatar = page.getByTestId(`admin-user-avatar-${user.id}`);
      await avatar.scrollIntoViewIfNeeded();
      if (user.name === "No Upload" || user.name === "Broken Logo") {
        await expect(avatar.locator(".agx-logo--mark svg")).toBeVisible();
        await expect(avatar.locator("img")).toHaveCount(0);
      } else {
        const image = avatar.locator("img");
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute("src", user.name === "Broken Upload" ? user.companyLogo : user.avatarUrl || user.companyLogo);
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
      }
    }

    // Filtering must not change the default agency identity for an account.
    const defaultAvatar = page.getByTestId("admin-user-avatar-10003");
    const mark = await defaultAvatar.locator(".agx-logo svg").evaluate((element) => element.outerHTML);
    await page.getByPlaceholder("Search name, email or city").fill("No Upload");
    expect(await defaultAvatar.locator(".agx-logo svg").evaluate((element) => element.outerHTML)).toBe(mark);
    await expect(defaultAvatar.locator("xpath=ancestor::article")).toContainText("Default agency logo");
    await page.getByRole("button", { name: "Edit full profile", exact: true }).click();
    // A generated logo is not an uploaded account photo or a removable upload.
    await expect(page.locator("#admin-user-edit-10003").getByRole("button", { name: "Remove picture", exact: true })).toHaveCount(0);
  });
}

test("admin and homepage show the same default agency branding", async ({ page }) => {
  await login(page);
  const response = await page.request.get("/api/admin/users");
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  const user = payload.items.find((item: { isVerified: boolean; avatarUrl: string; companyLogo: string; slug: string }) =>
    item.isVerified && !item.avatarUrl && !item.companyLogo && item.slug);
  expect(user).toBeTruthy();
  await page.goto("/");
  const publicLogo = page.locator(`.agx-p1-card[href="/dealers/${user.slug}"] .agx-logo svg`).first();
  await expect(publicLogo).toBeAttached();
  const mark = await publicLogo.evaluate((element) => element.outerHTML);
  await page.goto("/admin?tab=users");
  const adminLogo = page.getByTestId(`admin-user-avatar-${user.id}`).locator(".agx-logo svg");
  await expect(adminLogo).toBeAttached();
  expect(await adminLogo.evaluate((element) => element.outerHTML)).toBe(mark);
});

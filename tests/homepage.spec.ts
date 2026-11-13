import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop homepage, images, service details and enquiry preview", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Specialist care.");
  await expect(page.locator(".service-item")).toHaveCount(8);
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  for (const service of await page.locator(".service-item").all()) {
    await service.locator("summary").click();
    await expect(service.locator(".service-detail")).toBeVisible();
    await service.locator("summary").click();
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.locator("body").click({ position: { x: 2, y: 2 } });
  await page.screenshot({ path: "docs/homepage-desktop-hero.png" });
  await page.screenshot({ path: "docs/homepage-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Make an enquiry", exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Full name").fill("Preview Tester");
  await dialog.getByLabel("Email address").fill("preview@example.com");
  await dialog.getByLabel("Your message").fill("I would like to learn about your care model.");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Check enquiry details" }).click();
  await expect(dialog.getByRole("status")).toContainText("Nothing has been sent or saved");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.getByRole("button", { name: "Discuss a referral", exact: true }).click();
  await expect(dialog.getByLabel("Enquiry type")).toHaveValue("Professional referral");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Privacy policy", exact: true }).click();
  await expect(dialog).toContainText("draft privacy notice");
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("responsive layouts and mobile navigation remain usable", async ({ page }) => {
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    const nav = page.getByRole("dialog", { name: "Mobile navigation", exact: true });
    await expect(nav).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    await nav.getByRole("link", { name: "Our services", exact: true }).click();
    await expect(nav).not.toBeVisible();
    await expect(page).toHaveURL(/#services$/);
    if (width === 390) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.locator("body").click({ position: { x: 2, y: 2 } });
      await page.screenshot({ path: "docs/homepage-mobile-hero.png" });
      await page.screenshot({ path: "docs/homepage-mobile.png", fullPage: true });
    }
  }
});

test("skip link and reduced motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  expect(await page.locator("html").evaluate(el => getComputedStyle(el).scrollBehavior)).toBe("auto");
});

test("automated homepage and enquiry accessibility checks", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const scan = () => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect((await scan()).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, issue: n.failureSummary })) }))).toEqual([]);
  await page.getByRole("button", { name: "Make an enquiry", exact: true }).first().click();
  expect((await scan()).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, issue: n.failureSummary })) }))).toEqual([]);
});

import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 430, 768, 1024, 1440]) {
  test(`privacy and enquiry dialogs at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    for (const name of ["Privacy policy", "Discuss a referral"]) {
      const trigger = page.getByRole("button", { name, exact: true });
      await trigger.click();
      const dialog = page.locator(".enquiry-dialog");
      await expect(dialog).toBeVisible();
      await expect.poll(async () => dialog.evaluate(el => getComputedStyle(el).transform)).toBe("none");
      const box = (await dialog.boundingBox())!;
      expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(2);
      expect(Math.abs(box.y + box.height / 2 - 422)).toBeLessThan(2);
      expect(box.x).toBeGreaterThanOrEqual(15);
      expect(box.height).toBeLessThanOrEqual(844 * .88 + 1);
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
      const scrollY = await page.evaluate(() => window.scrollY);
      await page.mouse.move(3, 3);
      await page.mouse.wheel(0, 300);
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      await dialog.locator(".dialog-close").focus();
      await page.keyboard.press("Shift+Tab");
      expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      if (name === "Discuss a referral") {
        await dialog.getByLabel("Full name").fill("Preview Tester");
        await dialog.getByLabel("Email address").fill("preview@example.com");
        await dialog.getByLabel("Your message").fill("Please tell me about the care service.");
        await dialog.getByRole("checkbox").check();
        await dialog.getByRole("button", { name: "Check enquiry details" }).click();
        await expect(dialog.getByRole("status")).toContainText("Nothing has been sent or saved");
      } else {
        await expect(dialog.getByRole("heading", { name: "Privacy Policy", exact: true })).toBeVisible();
        await expect(dialog.locator(".privacy-policy h3")).toHaveCount(14);
        await expect(dialog.getByRole("table")).toBeVisible();
        expect(await dialog.getByRole("table").evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
        await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
        await expect(dialog.getByRole("heading", { name: "14. Contact us", exact: true })).toBeInViewport();
        await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeInViewport();
        await dialog.evaluate(el => { el.scrollTop = 0; });
      }
      await page.screenshot({ path: `test-results/dialog-${width}-${name.replaceAll(" ", "-")}.png` });
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
      await trigger.click();
      await dialog.getByRole("button", { name: "Close dialog" }).click();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.mouse.click(3, 3);
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
    expect(await page.context().cookies()).toEqual([]);
  });
}

test("long policy scrolls internally and reduced motion disables animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.getByRole("button", { name: "Privacy policy", exact: true }).click();
  const dialog = page.locator(".enquiry-dialog");
  await expect(dialog).toHaveCSS("animation-name", "none");
  await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
  expect(await dialog.evaluate(el => el.scrollTop > 0 && Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 2)).toBe(true);
  await page.keyboard.press("Escape");
});

test("policy disclosures, contact links and privacy accessibility", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Privacy policy", exact: true }).click();
  const policy = page.locator(".privacy-policy");
  const dialog = page.locator(".enquiry-dialog");
  await expect(dialog).not.toContainText("DRAFT");
  await expect(dialog.locator(".policy-draft-note")).toHaveCount(0);
  await expect(policy).not.toContainText("[");
  await expect(policy).not.toContainText("Resend");
  await expect(policy).toContainText("has not yet been implemented or activated");
  await expect(policy).toContainText("planned retention period for enquiry messages is 12 months");
  await expect(policy).toContainText("does not send your enquiry to us or save it on a server");
  await expect(policy.locator('a[href="mailto:enquiries@curabelcomplexcare.co.uk"]')).toHaveCount(3);
  await expect(policy.getByRole("link", { name: "0333 880 5696" })).toHaveAttribute("href", "tel:+443338805696");
  await expect(policy.getByRole("link", { name: "ICO website (opens in a new tab)" })).toHaveAttribute("href", "https://ico.org.uk/");
  await expect(policy.getByRole("link", { name: "0303 123 1113" })).toHaveAttribute("href", "tel:03031231113");
  await expect(policy.locator("mark")).toHaveCount(0);
  const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(scan.violations).toEqual([]);
});

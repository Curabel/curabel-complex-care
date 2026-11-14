import { expect, test } from "@playwright/test";
import { directorStatement, differentiators, joelBiography } from "../src/lib/client-content";

test("client sections preserve full content and fit requested viewport sizes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("#leadership")).toHaveCount(1);
    await expect(page.locator(".hero-description")).toHaveText("Personalised complex care for children and young people, combining clinical expertise with compassionate support and comfort in their own home.");
    for (const email of ["caroline.mcknight@curabelcomplexcare.co.uk", "joel.alter@curabelcomplexcare.co.uk", "enquiries@curabelcomplexcare.co.uk"]) {
      await expect(page.getByRole("link", { name: email, exact: true })).toHaveAttribute("href", `mailto:${email}`);
    }
    await expect(page.locator(".footer-phone + .footer-email")).toHaveText("enquiries@curabelcomplexcare.co.uk");
    if (width === 1440) {
      expect(await page.locator(".hero-figure figcaption span").first().evaluate(el => {
        const range = document.createRange(); range.selectNodeContents(el);
        return range.getClientRects().length;
      })).toBe(1);
    }
    await expect(page.locator(".director-profile").first().locator(".director-statement p")).toHaveText(directorStatement);
    await expect(page.locator(".director-profile").last().locator(".director-statement p")).toHaveText(joelBiography);
    for (const [name, url] of [["Caroline McKnight", "https://www.linkedin.com/in/caroline-mcknight-31a1abb1/"], ["Joel Alter", "https://www.linkedin.com/in/joel-alter-46a8486a/"]]) {
      const link = page.getByRole("link", { name: `${name} on LinkedIn (opens in a new tab)` });
      await expect(link).toHaveAttribute("href", url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toHaveText("LinkedIn");
    }
    await expect(page.locator(".difference-item h3")).toHaveText(differentiators.map(item => item.title));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("footer address")).toContainText("Hickman Building, Runway East");
    await expect(page.locator("footer address")).toContainText("London, E1 1EW");
    await expect(page.getByRole("link", { name: "0333 880 5696" })).toHaveAttribute("href", "tel:+443338805696");
    await expect(page.locator(".footer-social-link")).toHaveCount(0);
    const first = await page.locator(".director-profile").first().boundingBox();
    const second = await page.locator(".director-profile").last().boundingBox();
    if (width < 701) expect(first!.y + first!.height).toBeLessThan(second!.y);
    else expect(first!.x + first!.width).toBeLessThan(second!.x);
    for (const profile of await page.locator(".director-profile").all()) {
      const image = profile.locator("img");
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      await profile.locator("summary").click();
      await expect(profile.locator(".director-statement")).toBeVisible();
      await profile.locator("summary").click();
    }
    if (width === 375 || width === 1440) {
      await page.locator("#leadership").screenshot({ path: `test-results/director-${width}.png`, style: ".site-header, .skip-link { visibility: hidden !important; }" });
      await page.locator("#why-curabel").screenshot({ path: `test-results/why-${width}.png`, style: ".site-header, .skip-link { visibility: hidden !important; }" });
      await page.locator("footer").screenshot({ path: `test-results/footer-${width}.png`, style: ".site-header, .skip-link { visibility: hidden !important; }" });
    }
  }
});

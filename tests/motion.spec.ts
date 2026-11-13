import { expect, test } from "@playwright/test";

test("reveals run once and reduced motion cancels movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero-line")).toHaveCount(3);
  const step = page.locator(".care-steps article").first();
  await step.scrollIntoViewIfNeeded();
  await expect(step).toHaveClass(/journey-revealed/);
  await page.waitForTimeout(900);
  await page.locator("#home").scrollIntoViewIfNeeded();
  await step.scrollIntoViewIfNeeded();
  expect(await step.evaluate(el => el.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(await page.locator(".hero-line").first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await expect(page.locator(".official-logo").first()).toBeVisible();
});

test("content remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000");
  await expect(page.locator("#services h2")).toBeVisible();
  await expect(page.locator(".care-steps article").first()).toBeVisible();
  expect(await page.locator("#services h2").evaluate(el => getComputedStyle(el).opacity)).toBe("1");
  await context.close();
});

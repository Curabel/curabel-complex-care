import { expect, test } from "@playwright/test";

test("public sitemap, robots and homepage indexing metadata", async ({ page, request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("application/xml");
  expect(sitemap.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
  const xml = await sitemap.text();
  await page.goto("/");
  const parsed = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    return { errors: doc.querySelectorAll("parsererror").length, namespace: doc.documentElement.namespaceURI, urls: [...doc.querySelectorAll("loc")].map(el => el.textContent), dates: doc.querySelectorAll("lastmod").length };
  }, xml);
  expect(parsed).toEqual({ errors: 0, namespace: "http://www.sitemaps.org/schemas/sitemap/0.9", urls: ["https://www.curabelcomplexcare.co.uk/"], dates: 0 });
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  expect((await robots.text()).trim()).toBe("User-Agent: *\nAllow: /\n\nSitemap: https://www.curabelcomplexcare.co.uk/sitemap.xml");
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  expect(home.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
  // Next.js normalises a root canonical by removing its trailing slash.
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!).href).toBe("https://www.curabelcomplexcare.co.uk/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
});

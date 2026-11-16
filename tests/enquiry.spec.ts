import { test, expect } from "@playwright/test";

test("enquiry endpoint rejects invalid and cross-origin submissions", async ({ request }) => {
  const wrongOrigin = await request.post("/api/enquiry", { headers: { origin: "https://example.org" }, data: {} });
  expect(wrongOrigin.status()).toBe(403);
  const invalid = await request.post("/api/enquiry", { headers: { origin: "http://127.0.0.1:3000" }, data: { email: "invalid" } });
  expect(invalid.status()).toBe(400);
});

test("form preserves input on server error and reports confirmed submission", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Discuss a referral", exact: true }).click();
  const dialog = page.locator(".enquiry-dialog");
  await dialog.getByLabel("Full name").fill("Synthetic Tester");
  await dialog.getByLabel("Email address").fill("test@example.com");
  await dialog.getByLabel("Your message").fill("This is a synthetic enquiry for testing.");
  await dialog.getByRole("checkbox").check();
  await page.route("**/api/enquiry", route => route.fulfill({ status: 503, json: { error: "Service unavailable. Please email us." } }));
  await dialog.getByRole("button", { name: "Submit details" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Service unavailable");
  await expect(dialog.getByLabel("Full name")).toHaveValue("Synthetic Tester");
  await page.route("**/api/enquiry", route => route.fulfill({ json: { success: true } }));
  await dialog.getByRole("button", { name: "Submit details" }).click();
  await expect(dialog.getByRole("status")).toContainText("Your enquiry has been submitted");
});

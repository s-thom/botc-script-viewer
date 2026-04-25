import { expect, test } from "@playwright/test";

test.describe("Home page form submissions", () => {
  test("JSON text submission renders script viewer", async ({ page }) => {
    await page.goto("/");
    await page.fill('textarea[name="script"]', '[{"id":"washerwoman"}]');
    await page.click('#script-form button[type="submit"]');
    await expect(page.locator("h1#script")).toBeVisible();
  });

  test("URL submission redirects to matching script page", async ({ page }) => {
    await page.goto("/");
    await page.fill(
      'textarea[name="script"]',
      "http://localhost:4321/base3/tb/",
    );
    await page.click('#script-form button[type="submit"]');
    await expect(page).toHaveURL(/\/base3\/tb\//);
    await expect(page.locator("h1#script")).toContainText("Trouble Brewing");
  });

  test("file upload submission renders script viewer", async ({ page }) => {
    await page.goto("/");
    await page.setInputFiles("#file", {
      name: "script.json",
      mimeType: "application/json",
      buffer: Buffer.from('[{"id":"washerwoman"}]'),
    });
    // The change event on the file input triggers automatic form submission
    await expect(page.locator("h1#script")).toBeVisible();
  });
});

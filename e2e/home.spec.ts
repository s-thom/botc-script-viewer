import { expect, test } from "@playwright/test";

test.describe("Home page form submissions", () => {
  test("JSON text submission renders script viewer", async ({ page }) => {
    await page.goto("/");
    await page.fill('textarea[name="script"]', '[{"id":"washerwoman"}]');
    await expect(page.locator('textarea[name="script"]')).toHaveValue(
      '[{"id":"washerwoman"}]',
    );
    await page.click('#script-form button[type="submit"]');
    await expect(page).toHaveURL(/\/ns\/.*\//);
    await expect(page.locator("#script")).toBeVisible();
  });

  test("URL submission redirects to matching script page", async ({ page }) => {
    await page.goto("/");
    await page.fill(
      'textarea[name="script"]',
      "http://localhost:4321/base3/tb/",
    );
    await expect(page.locator('textarea[name="script"]')).toHaveValue(
      "http://localhost:4321/base3/tb/",
    );
    await page.click('#script-form button[type="submit"]');
    await expect(page).toHaveURL(/\/base3\/tb\//);
    await expect(page.locator("#script")).toContainText("Trouble Brewing");
  });

  test("file upload submission renders script viewer", async ({ page }) => {
    await page.goto("/");
    await page.setInputFiles("#file", {
      name: "script.json",
      mimeType: "application/json",
      buffer: Buffer.from('[{"id":"washerwoman"}]'),
    });
    // The change event on the file input triggers automatic form submission
    await expect(page.locator("#script")).toBeVisible();
  });
});

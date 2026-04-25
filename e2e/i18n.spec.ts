import { expect, test } from "@playwright/test";

test.describe("i18n URL correctness", () => {
  test.describe("locale-prefixed pages exist", () => {
    test("German Trouble Brewing page loads", async ({ page }) => {
      await page.goto("/de/base3/tb/");
      await expect(page.locator("h3#townsfolk")).toBeVisible();
    });

    test("French home page loads", async ({ page }) => {
      await page.goto("/fr/");
      await expect(page.locator('textarea[name="script"]')).toBeVisible();
    });

    test("Simplified Chinese Trouble Brewing page loads", async ({ page }) => {
      await page.goto("/zh-hans/base3/tb/");
      await expect(page.locator("h1#script")).toBeVisible();
    });
  });

  test.describe("language selector links on /base3/tb/", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/base3/tb/");
    });

    // Exact string matches catch locale-stacking bugs (e.g. /fr/de/base3/tb/)
    // because getRelativeLocaleUrl produces a relative path like /de/base3/tb/
    test("German link is exactly /de/base3/tb/", async ({ page }) => {
      await expect(
        page.locator('#language-selector a[hreflang="de"]'),
      ).toHaveAttribute("href", "/de/base3/tb/");
    });

    test("French link is exactly /fr/base3/tb/", async ({ page }) => {
      await expect(
        page.locator('#language-selector a[hreflang="fr"]'),
      ).toHaveAttribute("href", "/fr/base3/tb/");
    });

    test("English link is exactly /base3/tb/ (no locale prefix)", async ({
      page,
    }) => {
      await expect(
        page.locator('#language-selector a[hreflang="en"]'),
      ).toHaveAttribute("href", "/base3/tb/");
    });
  });

  test.describe("hreflang in <head> on /base3/tb/", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/base3/tb/");
    });

    test("has 13 alternate links (one per enabled locale)", async ({
      page,
    }) => {
      await expect(
        page.locator('head > link[rel="alternate"]'),
      ).toHaveCount(13);
    });

    // Anchored regex: matches ://host/de/base3/tb/ but not ://host/fr/de/base3/tb/
    test("German alternate href path starts at /de/base3/tb/", async ({
      page,
    }) => {
      await expect(
        page.locator('head > link[rel="alternate"][hreflang="de"]'),
      ).toHaveAttribute("href", /^https?:\/\/[^/]+\/de\/base3\/tb\/$/);
    });

    test("French alternate href path starts at /fr/base3/tb/", async ({
      page,
    }) => {
      await expect(
        page.locator('head > link[rel="alternate"][hreflang="fr"]'),
      ).toHaveAttribute("href", /^https?:\/\/[^/]+\/fr\/base3\/tb\/$/);
    });

    test("has canonical link", async ({ page }) => {
      await expect(page.locator('head > link[rel="canonical"]')).toBeAttached();
    });
  });
});

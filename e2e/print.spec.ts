import { expect, test } from "@playwright/test";

const MM_TO_PX = 96 / 25.4;

test.describe("Print page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/base3/tb/print/");
    await expect(page.locator(".paper").first()).toBeVisible();
  });

  test("is not indexed", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );
  });

  test("prints A4 sheets at physical size", async ({ page }) => {
    await page.getByLabel("A4").check();
    await page.emulateMedia({ media: "print" });

    const papers = page.locator(".paper");
    const count = await papers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = (await papers.nth(i).boundingBox())!;
      expect(box.width).toBeCloseTo(210 * MM_TO_PX, 0);
      expect(box.height).toBeCloseTo(297 * MM_TO_PX, 0);
    }
  });

  test("prints Letter sheets at physical size", async ({ page }) => {
    await page.getByLabel("Letter").check();
    await page.emulateMedia({ media: "print" });

    const box = (await page.locator(".paper").first().boundingBox())!;
    expect(box.width).toBeCloseTo(215.9 * MM_TO_PX, 0);
    expect(box.height).toBeCloseTo(279.4 * MM_TO_PX, 0);
  });

  test("hides the controls when printing", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".controls")).toBeHidden();
  });

  test("detailed night order uses two sheets", async ({ page }) => {
    await page.getByLabel("Back of the script sheet").waitFor();
    await page.getByLabel("Blank (not printed)").check();
    await page.getByLabel("Printing double-sided").uncheck();

    await page.getByLabel(/^Simple/).check();
    await expect(page.locator(".paper")).toHaveCount(2);

    await page.getByLabel(/^Detailed/).check();
    await expect(page.locator(".paper")).toHaveCount(3);
  });

  test("Trouble Brewing fits on its sheets", async ({ page }) => {
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
});

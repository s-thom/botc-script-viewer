import { expect, test } from "@playwright/test";

test.describe("Trouble Brewing script page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/base3/tb/");
  });

  test("renders script title", async ({ page }) => {
    await expect(page.locator("h1#script")).toContainText("Trouble Brewing");
  });

  test("renders all character section headings", async ({ page }) => {
    await expect(page.locator("h3#townsfolk")).toBeVisible();
    await expect(page.locator("h3#outsiders")).toBeVisible();
    await expect(page.locator("h3#minions")).toBeVisible();
    await expect(page.locator("h3#demons")).toBeVisible();
  });

  test("renders at least one townsfolk character", async ({ page }) => {
    const items = page.locator(
      "#townsfolk ~ ul.character-list .character-list-item",
    );
    await expect(items.first()).toBeVisible();
  });

  test("renders Washerwoman with name and icon", async ({ page }) => {
    const washerwoman = page.locator("li#washerwoman");
    await expect(washerwoman.locator(".character-title")).toContainText(
      "Washerwoman",
    );
    await expect(washerwoman.locator(".character-icon-offset")).toBeVisible();
  });

  test("renders night order section", async ({ page }) => {
    await expect(page.locator("h2#night-order")).toBeVisible();
  });
});

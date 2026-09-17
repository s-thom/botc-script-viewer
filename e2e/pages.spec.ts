import { expect, test } from "@playwright/test";

test.describe("Pages", () => {
  test.describe("Local collections", () => {
    for (const { collectionId, scriptId } of [
      { collectionId: "base3", scriptId: "tb" },
      { collectionId: "carousel", scriptId: "anonymous-dishonesty" },
      { collectionId: "month", scriptId: "2026-01" },
      { collectionId: "v", scriptId: "nfm" },
      { collectionId: "v", scriptId: "whalebuffet" },
      { collectionId: "s2", scriptId: "switchcraft" },
      { collectionId: "wc25", scriptId: "seat7" },
    ]) {
      test(`Loads ${scriptId} from the ${collectionId} collection`, async ({
        page,
      }) => {
        await page.goto(`/${collectionId}/${scriptId}/`);
        await expect(page.locator("#script")).toBeVisible();
      });
    }
  });

  test.describe("Number Store URLs", () => {
    for (const ns of [
      "YwQA",
      "-89gVq2UmaJkpZSopKOUl5ibCmWWpCbmKlkpleSX5xWn5edkK-koJSZl5mSWVIIV1AIA",
    ]) {
      test(`Loads a script from ${ns}`, async ({ page }) => {
        await page.goto(`/ns/${ns}/`);
        await expect(page.locator("#script")).toBeVisible();
      });
    }
  });

  test.describe("BotC Scripts", () => {
    test(`Loads a script from BotC Scripts`, async ({ page }) => {
      await page.goto(`/sw/133/1.0.0/`);
      await expect(page.locator("#script")).toBeVisible();
    });
  });

  test.describe("Klutzbanana", () => {
    test(`Loads a script from Klutzbanana`, async ({ page }) => {
      await page.goto(`/kb/krfyxgdb7i/`);
      await expect(page.locator("#script")).toBeVisible();
    });
  });
});

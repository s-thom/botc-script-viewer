import { expect, test } from "@playwright/test";

test("Local script og:image resolves to a 1200x630 PNG", async ({
  page,
  request,
}) => {
  await page.goto("/base3/tb/");

  const imageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(imageUrl).toBeTruthy();

  const response = await request.get(new URL(imageUrl!).pathname);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toBe("image/png");

  const body = await response.body();
  expect(body.subarray(1, 4).toString("ascii")).toBe("PNG");
  expect(body.readUInt32BE(16)).toBe(1200);
  expect(body.readUInt32BE(20)).toBe(630);
});

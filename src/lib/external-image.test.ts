import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAllowedImageUrl } from "./external-image.ts";

describe("getAllowedImageUrl", () => {
  it("allows images on allowed hosts", () => {
    const url = "https://i.imgur.com/logo.png";
    assert.equal(getAllowedImageUrl(url), url);
  });

  it("rejects images on other hosts", () => {
    assert.equal(getAllowedImageUrl("https://example.com/logo.png"), undefined);
  });

  it("rejects malformed URLs", () => {
    assert.equal(getAllowedImageUrl("not a url"), undefined);
  });

  it("rejects missing URLs", () => {
    assert.equal(getAllowedImageUrl(undefined), undefined);
    assert.equal(getAllowedImageUrl(""), undefined);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createTranslator } from "./t.ts";
import type { MessageSegment } from "./types.ts";

const t = createTranslator({ locale: "en" });

describe("createTranslator — strings", () => {
  it("returns a plain string for a simple key", () => {
    assert.equal(t("script.edition.base-three"), "Base");
  });

  it("returns singular form with count=1", () => {
    assert.equal(t("script.keyword.player", { count: 1 }), "Player");
  });

  it("returns plural form with count=5", () => {
    assert.equal(t("script.keyword.player", { count: 5 }), "Players");
  });

  it("substitutes a named variable", () => {
    assert.equal(
      t("script.analysis.maximum-character-recommendation", { number: 25 }),
      "The recommended maximum number of characters is 25.",
    );
  });

  it("returns the key for a missing translation", () => {
    assert.equal(t("nonexistent.key.here"), "nonexistent.key.here");
  });

  it("returns the key for an invalid namespace", () => {
    assert.equal(t("invalid.key"), "invalid.key");
  });
});

describe("createTranslator — tagged messages (MessageSegment[])", () => {
  it("returns MessageSegment[] for a tagged message", () => {
    const result = t("script.tour.welcome-01");
    assert.ok(Array.isArray(result), "expected an array");
  });

  it("welcome-01 contains a bold tag wrapping 'Blood on the Clocktower'", () => {
    const result = t("script.tour.welcome-01") as MessageSegment[];
    const boldTag = result.find(
      (s): s is { type: "tag"; name: string; children: MessageSegment[] } =>
        s.type === "tag" && s.name === "bold",
    );
    assert.ok(boldTag, "expected a bold tag segment");
    const innerText = boldTag.children
      .filter((c): c is { type: "text"; value: string } => c.type === "text")
      .map((c) => c.value)
      .join("");
    assert.equal(innerText, "Blood on the Clocktower");
  });

  it("autosort-01 has nested tags and resolves sortIcon variable", () => {
    const result = t("script.tour.autosort-01", {
      sortIcon: "X",
    }) as MessageSegment[];
    assert.ok(Array.isArray(result));

    // Outermost tag should be 'link'
    const linkTag = result.find(
      (s): s is { type: "tag"; name: string; children: MessageSegment[] } =>
        s.type === "tag" && s.name === "link",
    );
    assert.ok(linkTag, "expected a link tag");

    // Inside link, there should be a 'block' tag
    const blockTag = linkTag.children.find(
      (s): s is { type: "tag"; name: string; children: MessageSegment[] } =>
        s.type === "tag" && s.name === "block",
    );
    assert.ok(blockTag, "expected a nested block tag");

    // sortIcon variable should have been resolved to text "X"
    const allText = (segs: MessageSegment[]): string =>
      segs
        .map((s) => {
          if (s.type === "text") return s.value;
          if (s.type === "tag") return allText(s.children);
          return "";
        })
        .join("");

    assert.ok(allText(result).includes("X"), "expected resolved sortIcon");
  });

  it("returns a string (not array) for a message with only variables, no tags", () => {
    const result = t("script.analysis.maximum-character-recommendation", {
      number: 10,
    });
    assert.equal(typeof result, "string");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createTranslator } from "./t.ts";
import type { TagMessageSegment, UnresolvedMessageSegment } from "./types.ts";

const t = createTranslator({ locale: "en" });

const textOf = (segments: UnresolvedMessageSegment[]): string =>
  segments
    .map((s) => {
      if (s.type === "text") return s.value;
      if (s.type === "tag") return textOf(s.children);
      return "";
    })
    .join("");

describe("createTranslator — plain strings", () => {
  it("returns a text segment for a simple key", () => {
    assert.deepEqual(t("script.edition.base-three"), [
      { type: "text", value: "Base" },
    ]);
  });

  it("returns singular form with count=1", () => {
    assert.deepEqual(t("script.keyword.player", { count: 1 }), [
      { type: "text", value: "Player" },
    ]);
  });

  it("returns plural form with count=5", () => {
    assert.deepEqual(t("script.keyword.player", { count: 5 }), [
      { type: "text", value: "Players" },
    ]);
  });

  it("substitutes a named variable", () => {
    const segments = t("script.analysis.maximum-character-recommendation", { number: 25 });
    assert.equal(textOf(segments), "The recommended maximum number of characters is 25.");
  });

  it("returns the key as a text segment for a missing translation", () => {
    assert.deepEqual(t("nonexistent.key.here"), [
      { type: "text", value: "nonexistent.key.here" },
    ]);
  });

  it("returns the key for an invalid namespace", () => {
    assert.deepEqual(t("invalid.key"), [
      { type: "text", value: "invalid.key" },
    ]);
  });
});

describe("createTranslator — tagged messages", () => {
  it("welcome-01 contains a bold tag wrapping 'Blood on the Clocktower'", () => {
    const segments = t("script.tour.welcome-01");
    const boldTag = segments.find(
      (s): s is TagMessageSegment => s.type === "tag" && s.name === "bold",
    );
    assert.ok(boldTag, "expected a bold tag segment");
    assert.equal(textOf(boldTag.children), "Blood on the Clocktower");
  });

  it("autosort-01 has nested tags and resolves sortIcon variable", () => {
    const segments = t("script.tour.autosort-01", { sortIcon: "X" });

    const linkTag = segments.find(
      (s): s is TagMessageSegment => s.type === "tag" && s.name === "link",
    );
    assert.ok(linkTag, "expected a link tag");

    const blockTag = linkTag.children.find(
      (s): s is TagMessageSegment => s.type === "tag" && s.name === "block",
    );
    assert.ok(blockTag, "expected a nested block tag");

    assert.ok(textOf(segments).includes("X"), "expected resolved sortIcon");
  });

  it("no variable segments remain after translation", () => {
    const segments = t("script.tour.autosort-01", { sortIcon: "X" });
    const hasVariable = (segs: UnresolvedMessageSegment[]): boolean =>
      segs.some(
        (s) =>
          s.type === "variable" ||
          (s.type === "tag" && hasVariable(s.children)),
      );
    assert.equal(hasVariable(segments), false);
  });
});

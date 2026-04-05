import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createTranslator } from "./t.ts";
import type { MessageSegment, TagMessageSegment } from "./types.ts";

const t = createTranslator({ locale: "en" });

const textOf = (segments: MessageSegment[]): string =>
  segments
    .map((s) => {
      if (s.type === "text") return s.value;
      return textOf(s.children);
    })
    .join("");

describe("createTranslator — plain strings", () => {
  it("returns a text segment for a simple key", () => {
    assert.deepEqual(t("script.edition.base-three").value, [
      { type: "text", value: "Base" },
    ]);
  });

  it("returns singular form with count=1", () => {
    assert.deepEqual(t("script.keyword.player", { count: 1 }).value, [
      { type: "text", value: "Player" },
    ]);
  });

  it("returns plural form with count=5", () => {
    assert.deepEqual(t("script.keyword.player", { count: 5 }).value, [
      { type: "text", value: "Players" },
    ]);
  });

  it("returns plural form with count=Infinity", () => {
    assert.deepEqual(t("script.keyword.player", { count: Infinity }).value, [
      { type: "text", value: "Players" },
    ]);
  });

  it("substitutes a named variable", () => {
    assert.equal(
      t.string("script.analysis.maximum-character-recommendation", { number: 25 }).value,
      "The recommended maximum number of characters is 25.",
    );
  });

  it("returns the key as a text segment for a missing translation", () => {
    assert.deepEqual(t("nonexistent.key.here").value, [
      { type: "text", value: "nonexistent.key.here" },
    ]);
  });

  it("returns the key for an invalid namespace", () => {
    assert.deepEqual(t("invalid.key").value, [
      { type: "text", value: "invalid.key" },
    ]);
  });

  it("no fallbackLocale for a key found in primary locale", () => {
    assert.equal(t("script.edition.base-three").fallbackLocale, undefined);
  });
});

describe("createTranslator — tagged messages", () => {
  it("welcome-01 contains a bold tag wrapping 'Blood on the Clocktower'", () => {
    const segments = t("script.tour.welcome-01").value;
    const boldTag = segments.find(
      (s): s is TagMessageSegment => s.type === "tag" && s.name === "bold",
    );
    assert.ok(boldTag, "expected a bold tag segment");
    assert.equal(textOf(boldTag.children), "Blood on the Clocktower");
  });

  it("autosort-01 has nested tags and resolves sortIcon variable", () => {
    const segments = t("script.tour.autosort-01", { sortIcon: "X" }).value;

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
});

describe("createTranslator — t.string", () => {
  it("returns a plain string", () => {
    assert.equal(t.string("script.edition.base-three").value, "Base");
  });

  it("strips tags to inner text", () => {
    assert.ok(
      t.string("script.tour.welcome-01").value.includes("Blood on the Clocktower"),
    );
  });
});

describe("createTranslator — t.raw / t.rawString", () => {
  it("t.raw parses a raw string", () => {
    const segments = t.raw("Hello {bold}world{/bold}");
    const tag = segments.find((s): s is TagMessageSegment => s.type === "tag");
    assert.ok(tag);
    assert.equal(tag.name, "bold");
  });

  it("t.rawString renders a raw string to plain text", () => {
    assert.equal(t.rawString("Hello {bold}world{/bold}"), "Hello world");
  });
});

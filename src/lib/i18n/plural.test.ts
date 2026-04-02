import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPluralMessage, selectPluralForm } from "./plural.ts";

describe("isPluralMessage", () => {
  it("returns true for pipe-delimited strings", () => {
    assert.equal(isPluralMessage("Player|Players"), true);
  });

  it("returns false for plain strings", () => {
    assert.equal(isPluralMessage("Player"), false);
  });
});

describe("selectPluralForm — 2 forms", () => {
  it("returns first form for count=1", () => {
    assert.equal(selectPluralForm("Player|Players", 1, "en"), "Player");
  });

  it("returns second form for count=0", () => {
    assert.equal(selectPluralForm("Player|Players", 0, "en"), "Players");
  });

  it("returns second form for count=5", () => {
    assert.equal(selectPluralForm("Player|Players", 5, "en"), "Players");
  });

  it("returns second form for count=Infinity", () => {
    assert.equal(selectPluralForm("Player|Players", Infinity, "en"), "Players");
  });
});

describe("selectPluralForm — 3+ forms (CLDR)", () => {
  it("uses Intl.PluralRules for 3+ forms", () => {
    // 3-form string: zero|one|other
    const msg = "zero form|one form|other form";
    // English: 0 → "other", 1 → "one", 5 → "other"
    // CLDR index: zero=0, one=1, other=5 → clamped to forms.length-1=2
    assert.equal(selectPluralForm(msg, 1, "en"), "one form");
    assert.equal(selectPluralForm(msg, 5, "en"), "other form");
  });

  it("clamps index to available forms", () => {
    // Only 3 forms; 'many' (index 4) should clamp to index 2
    const msg = "a|b|c";
    // Any count, result must be one of the forms
    const result = selectPluralForm(msg, 1000000, "en");
    assert.ok(["a", "b", "c"].includes(result));
  });
});

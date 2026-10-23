import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createTranslator } from "../i18n/t.ts";
import { toPrintSegments } from "./segments.ts";

const t = await createTranslator({ locale: "en" });
const convert = (raw: string) =>
  toPrintSegments(t.raw(raw, { formatReplacements: true }));

describe("toPrintSegments", () => {
  it("keeps plain text", () => {
    assert.deepEqual(convert("Just text"), [
      { type: "text", value: "Just text" },
    ]);
  });

  it("converts *card text* to bold", () => {
    assert.deepEqual(convert("You learn *this* thing"), [
      { type: "text", value: "You learn " },
      { type: "bold", children: [{ type: "text", value: "this" }] },
      { type: "text", value: " thing" },
    ]);
  });

  it("converts [setup ability] to bold", () => {
    assert.deepEqual(convert("Ability. [+1 Outsider]"), [
      { type: "text", value: "Ability. " },
      { type: "bold", children: [{ type: "text", value: "[+1 Outsider]" }] },
    ]);
  });

  it("converts :reminder: to a reminder token without its text", () => {
    assert.deepEqual(convert("Mark them :reminder:"), [
      { type: "text", value: "Mark them " },
      { type: "reminder" },
    ]);
  });

  it("flattens unsupported tags to their text", () => {
    assert.deepEqual(convert("a {small}b{/small} c"), [
      { type: "text", value: "a " },
      { type: "text", value: "b" },
      { type: "text", value: " c" },
    ]);
  });
});

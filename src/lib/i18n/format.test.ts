import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveVariables } from "./format.ts";
import type { UnresolvedMessageSegment } from "./types.ts";

describe("resolveVariables", () => {
  it("resolves variable segments to text", () => {
    const segments: UnresolvedMessageSegment[] = [
      { type: "text", value: "Hello " },
      { type: "variable", name: "name" },
    ];
    const result = resolveVariables(segments, { name: "World" });
    assert.deepEqual(result, [
      { type: "text", value: "Hello " },
      { type: "text", value: "World" },
    ]);
  });

  it("preserves placeholder text for missing variable", () => {
    const segments: UnresolvedMessageSegment[] = [
      { type: "variable", name: "x" },
    ];
    const result = resolveVariables(segments, {});
    assert.deepEqual(result, [{ type: "text", value: "{x}" }]);
  });

  it("recurses into tag children", () => {
    const segments: UnresolvedMessageSegment[] = [
      {
        type: "tag",
        name: "bold",
        children: [{ type: "variable", name: "title" }],
      },
    ];
    const result = resolveVariables(segments, { title: "BotC" });
    assert.equal(result[0].type, "tag");
    const tag = result[0] as {
      type: "tag";
      name: string;
      children: UnresolvedMessageSegment[];
    };
    assert.deepEqual(tag.children, [{ type: "text", value: "BotC" }]);
  });

  it("preserves tag structure", () => {
    const segments: UnresolvedMessageSegment[] = [
      {
        type: "tag",
        name: "link",
        children: [{ type: "text", value: "click" }],
      },
    ];
    const result = resolveVariables(segments, {});
    assert.equal(result[0].type, "tag");
    assert.equal((result[0] as { type: "tag"; name: string }).name, "link");
  });
});

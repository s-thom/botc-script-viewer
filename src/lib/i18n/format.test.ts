import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatMessage, resolveVariables } from "./format.ts";
import type { MessageSegment } from "./types.ts";

describe("formatMessage", () => {
  it("returns plain text as-is", () => {
    const segments: MessageSegment[] = [{ type: "text", value: "Hello" }];
    assert.equal(formatMessage(segments, {}), "Hello");
  });

  it("substitutes a named variable", () => {
    const segments: MessageSegment[] = [
      { type: "text", value: "Count: " },
      { type: "variable", name: "n" },
    ];
    assert.equal(formatMessage(segments, { n: 42 }), "Count: 42");
  });

  it("preserves placeholder for missing variable", () => {
    const segments: MessageSegment[] = [{ type: "variable", name: "missing" }];
    assert.equal(formatMessage(segments, {}), "{missing}");
  });

  it("degrades tag to inner text when no renderer provided", () => {
    const segments: MessageSegment[] = [
      {
        type: "tag",
        name: "bold",
        children: [{ type: "text", value: "inner" }],
      },
    ];
    assert.equal(formatMessage(segments, {}), "inner");
  });
});

describe("resolveVariables", () => {
  it("resolves variable segments to text", () => {
    const segments: MessageSegment[] = [
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
    const segments: MessageSegment[] = [{ type: "variable", name: "x" }];
    const result = resolveVariables(segments, {});
    assert.deepEqual(result, [{ type: "text", value: "{x}" }]);
  });

  it("recurses into tag children", () => {
    const segments: MessageSegment[] = [
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
      children: MessageSegment[];
    };
    assert.deepEqual(tag.children, [{ type: "text", value: "BotC" }]);
  });

  it("preserves tag structure", () => {
    const segments: MessageSegment[] = [
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

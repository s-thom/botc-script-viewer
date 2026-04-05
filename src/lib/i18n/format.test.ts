import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatToPlainText, resolveVariables } from "./format.ts";
import type { MessageSegment, TagMessageSegment, UnresolvedMessageSegment } from "./types.ts";

describe("resolveVariables", () => {
  it("resolves variable segments to text", () => {
    const segments: UnresolvedMessageSegment[] = [
      { type: "text", value: "Hello " },
      { type: "variable", name: "name" },
    ];
    assert.deepEqual(resolveVariables(segments, { name: "World" }), [
      { type: "text", value: "Hello " },
      { type: "text", value: "World" },
    ]);
  });

  it("preserves placeholder text for missing variable", () => {
    const segments: UnresolvedMessageSegment[] = [{ type: "variable", name: "x" }];
    assert.deepEqual(resolveVariables(segments, {}), [
      { type: "text", value: "{x}" },
    ]);
  });

  it("recurses into tag children and resolves variables within", () => {
    const segments: UnresolvedMessageSegment[] = [
      { type: "tag", name: "bold", children: [{ type: "variable", name: "title" }] },
    ];
    const result = resolveVariables(segments, { title: "BotC" });
    const tag = result[0] as TagMessageSegment;
    assert.equal(tag.type, "tag");
    assert.equal(tag.name, "bold");
    assert.deepEqual(tag.children, [{ type: "text", value: "BotC" }]);
  });

  it("attaches params to resolved tag segments", () => {
    const segments: UnresolvedMessageSegment[] = [
      { type: "tag", name: "link", children: [{ type: "text", value: "click" }] },
    ];
    const params = { count: 1 };
    const result = resolveVariables(segments, params);
    const tag = result[0] as TagMessageSegment;
    assert.equal(tag.type, "tag");
    assert.equal(tag.name, "link");
    assert.equal(tag.params, params);
  });
});

describe("formatToPlainText", () => {
  it("returns text segment values", () => {
    const segments: MessageSegment[] = [{ type: "text", value: "Hello" }];
    assert.equal(formatToPlainText(segments), "Hello");
  });

  it("strips tags to inner text", () => {
    const segments: MessageSegment[] = [
      { type: "text", value: "See " },
      { type: "tag", name: "bold", children: [{ type: "text", value: "this" }], params: {} },
      { type: "text", value: "." },
    ];
    assert.equal(formatToPlainText(segments), "See this.");
  });

  it("handles nested tags", () => {
    const segments: MessageSegment[] = [
      {
        type: "tag",
        name: "link",
        params: {},
        children: [
          { type: "tag", name: "bold", children: [{ type: "text", value: "inner" }], params: {} },
        ],
      },
    ];
    assert.equal(formatToPlainText(segments), "inner");
  });
});

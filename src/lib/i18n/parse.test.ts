import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseMessage } from "./parse.ts";

describe("parseMessage", () => {
  it("parses plain text", () => {
    assert.deepEqual(parseMessage("Hello world"), [
      { type: "text", value: "Hello world" },
    ]);
  });

  it("parses a named variable", () => {
    assert.deepEqual(parseMessage("Hello {name}"), [
      { type: "text", value: "Hello " },
      { type: "variable", name: "name" },
    ]);
  });

  it("parses an indexed variable", () => {
    assert.deepEqual(parseMessage("{0} and {1}"), [
      { type: "variable", name: "0" },
      { type: "text", value: " and " },
      { type: "variable", name: "1" },
    ]);
  });

  it("treats {name} without a closing tag as a variable", () => {
    const segments = parseMessage("{menuIcon} text");
    assert.equal(segments[0].type, "variable");
    assert.equal(
      (segments[0] as { type: "variable"; name: string }).name,
      "menuIcon",
    );
  });

  it("parses a tag containing text", () => {
    assert.deepEqual(parseMessage("{bold}hello{/bold}"), [
      {
        type: "tag",
        name: "bold",
        children: [{ type: "text", value: "hello" }],
      },
    ]);
  });

  it("parses text before and after a tag", () => {
    const segments = parseMessage("See {bold}this{/bold} now");
    assert.equal(segments.length, 3);
    assert.deepEqual(segments[0], { type: "text", value: "See " });
    assert.equal(segments[1].type, "tag");
    assert.deepEqual(segments[2], { type: "text", value: " now" });
  });

  it("parses a variable inside a tag", () => {
    assert.deepEqual(parseMessage("{bold}{name}{/bold}"), [
      {
        type: "tag",
        name: "bold",
        children: [{ type: "variable", name: "name" }],
      },
    ]);
  });

  it("parses nested tags", () => {
    const segments = parseMessage("{link}{block}inner{/block}{/link}");
    assert.equal(segments.length, 1);
    assert.equal(segments[0].type, "tag");
    const outer = segments[0] as {
      type: "tag";
      name: string;
      children: typeof segments;
    };
    assert.equal(outer.name, "link");
    assert.equal(outer.children.length, 1);
    assert.equal(outer.children[0].type, "tag");
  });

  it("parses the autosort-01 pattern", () => {
    const msg = "{link}{sortIcon} {block}SAO sorted{/block}{/link}";
    const segments = parseMessage(msg);
    assert.equal(segments.length, 1);
    assert.equal(segments[0].type, "tag");
  });

  it("degrades mismatched close tags to text (stops parsing)", () => {
    // {/unknown} has no open — parseUntilClose() returns when it hits an unknown close
    const segments = parseMessage("hello{/unknown}world");
    // Should contain the text before the mismatched tag and stop
    assert.ok(segments.some((s) => s.type === "text"));
  });
});

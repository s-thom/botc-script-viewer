import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_PRINT_OPTIONS, parsePrintOptions } from "./options.ts";

describe("parsePrintOptions", () => {
  it("falls back to defaults for junk", () => {
    assert.deepEqual(parsePrintOptions(null), DEFAULT_PRINT_OPTIONS);
    assert.deepEqual(parsePrintOptions("x"), DEFAULT_PRINT_OPTIONS);
  });

  it("keeps valid values and drops invalid ones", () => {
    const parsed = parsePrintOptions({
      style: "fancy",
      paper: "tabloid",
      jinxes: true,
      qrPage: "yes",
    });
    assert.equal(parsed.style, "fancy");
    assert.equal(parsed.paper, "a4");
    assert.equal(parsed.qrPage, true);
  });
});

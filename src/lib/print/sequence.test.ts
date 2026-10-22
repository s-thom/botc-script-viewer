import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_PRINT_OPTIONS, parsePrintOptions } from "./options.ts";
import { buildSheetSequence, type PrintScriptContent } from "./sequence.ts";

const NOTHING: PrintScriptContent = {
  hasTravellers: false,
  hasFabled: false,
  hasLoric: false,
  hasJinxes: false,
  hasBootlegger: false,
};

const kinds = (
  content: PrintScriptContent,
  options: Partial<typeof DEFAULT_PRINT_OPTIONS>,
) =>
  buildSheetSequence(content, {
    ...DEFAULT_PRINT_OPTIONS,
    ...options,
  }).sheets.map((sheet) => sheet.kind);

describe("buildSheetSequence", () => {
  it("omits the back when there is nothing to put on it", () => {
    assert.deepEqual(kinds(NOTHING, { doubleSided: false }), [
      "script",
      "night-simple",
    ]);
  });

  it("pads one-sided sheets when double-sided", () => {
    assert.deepEqual(kinds(NOTHING, { doubleSided: true }), [
      "script",
      "blank",
      "night-simple",
    ]);
  });

  it("includes an info back when there are travellers", () => {
    assert.deepEqual(
      kinds({ ...NOTHING, hasTravellers: true }, { night: "detailed" }),
      ["script", "back-info", "night-first", "night-other"],
    );
  });

  it("ignores jinxes on the back unless enabled", () => {
    const content = { ...NOTHING, hasJinxes: true };
    assert.equal(
      kinds(content, { jinxes: false }).includes("back-info"),
      false,
    );
    assert.equal(kinds(content, { jinxes: true }).includes("back-info"), true);
  });

  it("bootlegger rules alone create a back", () => {
    assert.equal(
      kinds({ ...NOTHING, hasBootlegger: true }, {}).includes("back-info"),
      true,
    );
  });

  it("always prints a fancy back, never a blank one", () => {
    assert.equal(kinds(NOTHING, { back: "fancy" })[1], "back-fancy");
    assert.equal(
      kinds({ ...NOTHING, hasFabled: true }, { back: "blank" }).includes(
        "back-info",
      ),
      false,
    );
  });

  it("puts the QR page last without trailing padding", () => {
    const kindList = kinds(NOTHING, { qrPage: true });
    assert.equal(kindList.at(-1), "qr");
    const plain = kinds(NOTHING, { qrPage: false, night: "simple" });
    assert.equal(plain.at(-1), "night-simple");
  });

  it("computes player and storyteller page ranges", () => {
    const sequence = buildSheetSequence(
      { ...NOTHING, hasFabled: true },
      { ...DEFAULT_PRINT_OPTIONS, night: "detailed" },
    );
    assert.deepEqual(sequence.playerPages, { from: 1, to: 2 });
    assert.deepEqual(sequence.storytellerPages, { from: 3, to: 4 });
    assert.equal(sequence.paperCount, 2);
  });
});

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
    assert.equal(parsed.jinxes, true);
    assert.equal(parsed.qrPage, false);
  });
});

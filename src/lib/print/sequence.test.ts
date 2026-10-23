import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_PRINT_OPTIONS } from "./options.ts";
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
    assert.deepEqual(kinds(NOTHING, {}), [
      "script",
      "night-first",
      "night-other",
      "qr",
    ]);
  });

  it("includes an info back when there are travellers", () => {
    assert.deepEqual(
      kinds({ ...NOTHING, hasTravellers: true }, { night: "detailed" }),
      ["script", "back-info", "night-first", "night-other", "qr"],
    );
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
    assert.deepEqual(sequence.storytellerPages, { from: 3, to: 5 });
    assert.equal(sequence.paperCount, 3);
  });
});

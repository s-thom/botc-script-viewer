import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeScript, encodeScript } from "./index.ts";
import { sliceTLV } from "./util.ts";

describe("sliceTLV", () => {
  it("extracts the value slice from a TLV buffer", () => {
    const bytes = new Uint8Array([0x00, 0x00, 0x03, 0xaa, 0xbb, 0xcc]);
    const { slice, length, nextPointer } = sliceTLV(bytes, 0);
    assert.deepEqual(slice, new Uint8Array([0xaa, 0xbb, 0xcc]));
    assert.equal(length, 3);
    assert.equal(nextPointer, 6);
  });

  it("reads length as big-endian", () => {
    const valueBytes = new Uint8Array(257).fill(0x42);
    const bytes = new Uint8Array([0x00, 0x01, 0x01, ...valueBytes]);
    const { length } = sliceTLV(bytes, 0);
    assert.equal(length, 257);
  });

  it("handles a zero-length value", () => {
    const bytes = new Uint8Array([0x05, 0x00, 0x00]);
    const { slice, length, nextPointer } = sliceTLV(bytes, 0);
    assert.equal(length, 0);
    assert.equal(slice.length, 0);
    assert.equal(nextPointer, 3);
  });

  it("throws when declared length exceeds buffer", () => {
    // length field says 16 but buffer only has 2 bytes of data after the header
    const bytes = new Uint8Array([0x00, 0x00, 0x10, 0x01, 0x02]);
    assert.throws(() => sliceTLV(bytes, 0));
  });

  it("reads TLV at a non-zero pointer offset", () => {
    const bytes = new Uint8Array([0x99, 0x99, 0x00, 0x00, 0x02, 0x01, 0x02]);
    const { slice, nextPointer } = sliceTLV(bytes, 2);
    assert.deepEqual(slice, new Uint8Array([0x01, 0x02]));
    assert.equal(nextPointer, 7);
  });
});

describe("encodeScript", () => {
  it("encodes a single official character to its byte value", () => {
    assert.deepEqual(encodeScript(["washerwoman"]), new Uint8Array([0x01]));
  });

  it("encodes a single official character with a dash in the name", () => {
    assert.deepEqual(encodeScript(["scarlet-woman"]), new Uint8Array([0x14]));
  });

  it("encodes a single official character with an underscore in the name", () => {
    assert.deepEqual(encodeScript(["scarlet_woman"]), new Uint8Array([0x14]));
  });

  it("encodes multiple official characters in order", () => {
    assert.deepEqual(
      encodeScript(["washerwoman", "librarian", "investigator"]),
      new Uint8Array([0x01, 0x02, 0x03]),
    );
  });

  it("assigns correct byte to first SnV character (clockmaker = 0x17)", () => {
    assert.deepEqual(encodeScript(["clockmaker"]), new Uint8Array([0x17]));
  });

  it("encodes an official character object the same as its string ID", () => {
    assert.deepEqual(
      encodeScript([{ id: "imp", name: "Imp" }]),
      encodeScript(["imp"]),
    );
  });

  it("encodes a custom character as a 0xFF TLV block", () => {
    const result = encodeScript([{ id: "customchar", name: "Custom Char" }]);
    assert.equal(result[0], 0xff);
  });

  it("encodes script metadata as a 0x00 TLV block", () => {
    const result = encodeScript([{ id: "_meta" as const, name: "My Script" }]);
    assert.equal(result[0], 0x00);
  });

  it("throws for an unrecognised string character ID", () => {
    assert.throws(() => encodeScript(["notacharacter"]));
  });
});

describe("decodeScript", () => {
  it("decodes a single character byte", () => {
    assert.deepEqual(decodeScript(new Uint8Array([0x01])), ["washerwoman"]);
  });

  it("decodes multiple character bytes", () => {
    assert.deepEqual(decodeScript(new Uint8Array([0x01, 0x16])), [
      "washerwoman",
      "imp",
    ]);
  });

  it("decodes a manually constructed JSON TLV block", () => {
    const char = { id: "customid", name: "Custom" };
    const jsonBytes = new TextEncoder().encode(JSON.stringify(char));
    const bytes = new Uint8Array([
      0xff,
      (jsonBytes.length >> 8) & 0xff,
      jsonBytes.length & 0xff,
      ...jsonBytes,
    ]);
    assert.deepEqual(decodeScript(bytes), [char]);
  });

  it("throws when a JSON TLV block contains invalid JSON", () => {
    const badJson = new TextEncoder().encode("{not valid json");
    const bytes = new Uint8Array([0xff, 0x00, badJson.length, ...badJson]);
    assert.throws(() => decodeScript(bytes));
  });
});

describe("encode/decode round-trips", () => {
  it("round-trips official characters", () => {
    const script = ["washerwoman", "librarian", "imp", "baron", "spy"];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips a custom homebrew character", () => {
    const custom = { id: "customchar", name: "Custom Char" };
    assert.deepEqual(decodeScript(encodeScript([custom])), [custom]);
  });

  it("round-trips a mix of official and homebrew characters", () => {
    const script = [
      "washerwoman",
      { id: "homebrew1", name: "Homebrew" },
      "imp",
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips metadata with name and author", () => {
    const script = [
      { id: "_meta" as const, name: "Test Script", author: "Alice" },
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips metadata with hideTitle: true", () => {
    const script = [{ id: "_meta" as const, name: "Hidden", hideTitle: true }];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips metadata with logo, background, and almanac URLs", () => {
    const script = [
      {
        id: "_meta" as const,
        name: "URL Script",
        logo: "https://example.com/logo.png",
        background: "https://example.com/bg.png",
        almanac: "https://example.com/almanac",
      },
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips metadata with multiple bootlegger rules", () => {
    const script = [
      {
        id: "_meta" as const,
        name: "Bootleg",
        bootlegger: ["Rule one.", "Rule two."],
      },
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips metadata with firstNight of official characters", () => {
    const script = [
      {
        id: "_meta" as const,
        name: "Night Script",
        firstNight: ["washerwoman", "poisoner", "imp"],
      },
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips metadata with otherNight of official characters", () => {
    const script = [
      {
        id: "_meta" as const,
        name: "Night Script",
        otherNight: ["imp", "monk"],
      },
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips night order containing a homebrew character ID", () => {
    const script = [
      {
        id: "_meta" as const,
        name: "Homebrew Nights",
        firstNight: ["washerwoman", "mycustomcharid", "imp"],
      },
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips special night order entries (dawn, dusk, minioninfo, demoninfo)", () => {
    const script = [
      {
        id: "_meta" as const,
        name: "Special",
        firstNight: ["dawn", "dusk", "minioninfo", "demoninfo"],
      },
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });

  it("round-trips a full script with metadata and characters", () => {
    const script = [
      {
        id: "_meta" as const,
        name: "Trouble Brewing",
        author: "Pandemonium Institute",
        firstNight: [
          "dawn",
          "washerwoman",
          "librarian",
          "investigator",
          "poisoner",
        ],
        otherNight: ["imp", "monk", "ravenkeeper", "undertaker"],
      },
      "washerwoman",
      "librarian",
      "investigator",
      "chef",
      "empath",
      "fortuneteller",
      "undertaker",
      "monk",
      "ravenkeeper",
      "imp",
      "baron",
      "spy",
      "poisoner",
      "scarletwoman",
      "butler",
      "drunk",
      "recluse",
      "saint",
    ];
    assert.deepEqual(decodeScript(encodeScript(script)), script);
  });
});

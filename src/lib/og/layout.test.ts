import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CharacterTeam } from "../../generated/script-schema.ts";
import {
  chooseLayout,
  fitTitle,
  getHeaderHeight,
  getIconRows,
  getMaxIconRows,
  splitBalanced,
  TITLE_MAX_FONT_SIZE,
  TITLE_MAX_WIDTH,
  TITLE_MIN_FONT_SIZE,
} from "./layout.ts";

function range(count: number, prefix = ""): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}${i}`);
}

function teams(
  counts: Partial<Record<CharacterTeam, number>>,
): Record<CharacterTeam, string[]> {
  return {
    townsfolk: range(counts.townsfolk ?? 0, "t"),
    outsider: range(counts.outsider ?? 0, "o"),
    minion: range(counts.minion ?? 0, "m"),
    demon: range(counts.demon ?? 0, "d"),
    traveller: range(counts.traveller ?? 0, "tr"),
    fabled: range(counts.fabled ?? 0, "f"),
    loric: range(counts.loric ?? 0, "l"),
  };
}

function rowSizes<T>(rows: T[][]): number[] {
  return rows.map((row) => row.length);
}

describe("splitBalanced", () => {
  it("returns no rows for no items", () => {
    assert.deepEqual(splitBalanced([]), []);
  });

  it("keeps up to 12 items on one row", () => {
    assert.deepEqual(rowSizes(splitBalanced(range(12))), [12]);
  });

  it("splits 13 items into balanced rows", () => {
    assert.deepEqual(rowSizes(splitBalanced(range(13))), [7, 6]);
  });

  it("splits 25 items into three balanced rows", () => {
    assert.deepEqual(rowSizes(splitBalanced(range(25))), [9, 8, 8]);
  });

  it("keeps item order", () => {
    assert.deepEqual(splitBalanced(range(13)).flat(), range(13));
  });
});

describe("getIconRows", () => {
  it("orders teams with travellers, fabled and loric sharing a row", () => {
    const rows = getIconRows(
      teams({
        townsfolk: 2,
        outsider: 1,
        minion: 1,
        demon: 1,
        traveller: 1,
        fabled: 1,
        loric: 1,
      }),
    );

    assert.deepEqual(rows, [
      ["t0", "t1"],
      ["o0"],
      ["m0"],
      ["d0"],
      ["tr0", "f0", "l0"],
    ]);
  });

  it("lays out Trouble Brewing in six rows", () => {
    const rows = getIconRows(
      teams({ townsfolk: 13, outsider: 4, minion: 4, demon: 1 }),
    );

    assert.deepEqual(rowSizes(rows), [7, 6, 4, 4, 1]);
  });

  it("skips empty teams", () => {
    const rows = getIconRows(teams({ townsfolk: 3, demon: 1 }));

    assert.deepEqual(rowSizes(rows), [3, 1]);
  });

  it("wraps the shared row at 12", () => {
    const rows = getIconRows(teams({ traveller: 10, fabled: 4, loric: 1 }));

    assert.deepEqual(rowSizes(rows), [8, 7]);
  });
});

describe("fitTitle", () => {
  it("uses the maximum size for short titles", () => {
    assert.deepEqual(fitTitle(300, 100), {
      fontSize: TITLE_MAX_FONT_SIZE,
      lineCount: 1,
    });
  });

  it("uses the maximum size for empty measurements", () => {
    assert.deepEqual(fitTitle(0, 100), {
      fontSize: TITLE_MAX_FONT_SIZE,
      lineCount: 1,
    });
  });

  it("shrinks titles that are too wide at the maximum size", () => {
    const fit = fitTitle(TITLE_MAX_WIDTH * 2, 100);

    assert.deepEqual(fit, { fontSize: 50, lineCount: 1 });
  });

  it("shrinks to exactly the minimum size on one line", () => {
    const fit = fitTitle(TITLE_MAX_WIDTH, TITLE_MIN_FONT_SIZE);

    assert.deepEqual(fit, { fontSize: TITLE_MIN_FONT_SIZE, lineCount: 1 });
  });

  it("wraps onto two lines at the minimum size when shrinking isn't enough", () => {
    const fit = fitTitle(TITLE_MAX_WIDTH * 3, 100);

    assert.deepEqual(fit, { fontSize: TITLE_MIN_FONT_SIZE, lineCount: 2 });
  });
});

describe("getMaxIconRows", () => {
  it("fits 7 rows under a one-line title with a byline", () => {
    const header = getHeaderHeight(
      { fontSize: TITLE_MAX_FONT_SIZE, lineCount: 1 },
      true,
    );

    assert.equal(getMaxIconRows(header), 7);
  });

  it("fits 6 rows under a two-line title with a byline", () => {
    const header = getHeaderHeight(
      { fontSize: TITLE_MIN_FONT_SIZE, lineCount: 2 },
      true,
    );

    assert.equal(getMaxIconRows(header), 6);
  });

  it("gives a taller header to two-line titles", () => {
    const oneLine = getHeaderHeight(
      { fontSize: TITLE_MAX_FONT_SIZE, lineCount: 1 },
      true,
    );
    const twoLines = getHeaderHeight(
      { fontSize: TITLE_MIN_FONT_SIZE, lineCount: 2 },
      true,
    );

    assert.ok(twoLines > oneLine);
  });

  it("never returns a negative row count", () => {
    assert.equal(getMaxIconRows(10_000), 0);
  });
});

describe("chooseLayout", () => {
  const oneLineHeader = getHeaderHeight(
    { fontSize: TITLE_MAX_FONT_SIZE, lineCount: 1 },
    true,
  );
  const twoLineHeader = getHeaderHeight(
    { fontSize: TITLE_MIN_FONT_SIZE, lineCount: 2 },
    true,
  );

  it("shows icons when the rows fit", () => {
    assert.equal(chooseLayout(7, oneLineHeader), "icons");
  });

  it("switches to title-only when the rows don't fit", () => {
    assert.equal(chooseLayout(8, oneLineHeader), "title-only");
  });

  it("allows one fewer row under a two-line title", () => {
    assert.equal(chooseLayout(6, twoLineHeader), "icons");
    assert.equal(chooseLayout(7, twoLineHeader), "title-only");
  });

  it("uses title-only when there are no icons", () => {
    assert.equal(chooseLayout(0, oneLineHeader), "title-only");
  });
});

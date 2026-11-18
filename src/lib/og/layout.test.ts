import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CharacterTeam } from "../../generated/script-schema.ts";
import {
  EMPTY_RING_SEATS,
  fitTitle,
  getHeaderHeight,
  layoutGrimoire,
  OG_HEIGHT,
  OG_WIDTH,
  RING_MIN_TOKEN_SIZE,
  sampleGroups,
  TITLE_MAX_FONT_SIZE,
  TITLE_MAX_WIDTH,
  TITLE_MIN_FONT_SIZE,
  type GrimoireLayout,
  type PlacedToken,
} from "./layout.ts";

const HEADER = getHeaderHeight(TITLE_MAX_FONT_SIZE, true);
const CCC_LOGO = { left: 987, top: 535 };

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

function layout(
  counts: Partial<Record<CharacterTeam, number>>,
  options: { featured?: string[]; logoAspectRatio?: number } = {},
) {
  return layoutGrimoire({
    teams: teams(counts),
    featured: options.featured ?? [],
    headerHeight: HEADER,
    logoAspectRatio: options.logoAspectRatio,
  });
}

function ids(tokens: PlacedToken<string>[]): string[] {
  return tokens.flatMap((token) =>
    token.kind === "character" ? [token.character] : [],
  );
}

function centreTokens(result: GrimoireLayout<string>) {
  return result.tokens.filter(
    (token) =>
      Math.hypot(token.x - OG_WIDTH / 2, token.y - ringCentreY()) <
      ringTokenRadius(result) / 2,
  );
}

function ringCentreY() {
  return HEADER + (OG_HEIGHT - HEADER) / 2;
}

function ringTokenRadius(result: GrimoireLayout<string>) {
  return Math.max(
    ...result.tokens.map((token) =>
      Math.hypot(token.x - OG_WIDTH / 2, token.y - ringCentreY()),
    ),
  );
}

function assertNoOverlaps(result: GrimoireLayout<string>) {
  const { tokens } = result;
  for (let i = 0; i < tokens.length; i++) {
    const a = tokens[i];
    assert.ok(a.x - a.size / 2 >= 0 && a.x + a.size / 2 <= OG_WIDTH);
    assert.ok(a.y - a.size / 2 >= HEADER && a.y + a.size / 2 <= OG_HEIGHT);
    assert.ok(
      a.x + a.size / 2 <= CCC_LOGO.left || a.y + a.size / 2 <= CCC_LOGO.top,
      "token overlaps the CCC logo",
    );
    for (let j = i + 1; j < tokens.length; j++) {
      const b = tokens[j];
      assert.ok(
        Math.hypot(a.x - b.x, a.y - b.y) >= (a.size + b.size) / 2,
        `tokens ${i} and ${j} overlap`,
      );
    }
  }

  if (result.logo) {
    const { x, y, width, height } = result.logo;
    for (const token of tokens) {
      const nearestX = Math.max(x, Math.min(token.x, x + width));
      const nearestY = Math.max(y, Math.min(token.y, y + height));
      assert.ok(
        Math.hypot(token.x - nearestX, token.y - nearestY) >= token.size / 2,
        "token overlaps the logo",
      );
    }
  }
}

describe("fitTitle", () => {
  it("uses the maximum size for short titles", () => {
    assert.equal(fitTitle(300, 100), TITLE_MAX_FONT_SIZE);
  });

  it("uses the maximum size for empty measurements", () => {
    assert.equal(fitTitle(0, 100), TITLE_MAX_FONT_SIZE);
  });

  it("shrinks titles that are too wide at the maximum size", () => {
    assert.equal(fitTitle(TITLE_MAX_WIDTH * 2, 100), 50);
  });

  it("stops shrinking at the minimum size", () => {
    assert.equal(fitTitle(TITLE_MAX_WIDTH * 3, 100), TITLE_MIN_FONT_SIZE);
  });
});

describe("getHeaderHeight", () => {
  it("is taller with a byline", () => {
    assert.ok(
      getHeaderHeight(TITLE_MAX_FONT_SIZE, true) >
        getHeaderHeight(TITLE_MAX_FONT_SIZE, false),
    );
  });
});

describe("sampleGroups", () => {
  it("keeps team proportions", () => {
    const sampled = sampleGroups([range(60), range(20), range(20)], 10);

    assert.deepEqual(
      sampled.map((group) => group.length),
      [6, 2, 2],
    );
  });

  it("keeps at least one from every group", () => {
    const sampled = sampleGroups([range(100), range(1)], 10);

    assert.deepEqual(
      sampled.map((group) => group.length),
      [9, 1],
    );
  });

  it("takes items in order", () => {
    assert.deepEqual(sampleGroups([range(10, "a")], 3), [["a0", "a1", "a2"]]);
  });
});

describe("layoutGrimoire", () => {
  it("puts four demons in the centre of a full script", () => {
    const result = layout({ townsfolk: 13, outsider: 4, minion: 4, demon: 4 });
    const centre = centreTokens(result);

    assert.deepEqual(ids(centre).sort(), ["d0", "d1", "d2", "d3"]);
    assert.ok(centre.every((token) => token.size >= 90));
    assert.equal(result.tokens.length, 25);
    assertNoOverlaps(result);
  });

  it("orders the ring by team", () => {
    const result = layout({ townsfolk: 2, outsider: 1, minion: 1, demon: 1 });

    assert.deepEqual(ids(result.tokens), ["t0", "t1", "o0", "m0", "d0"]);
  });

  it("uses large tokens for teensies", () => {
    const result = layout({ townsfolk: 6, outsider: 2, minion: 2, demon: 2 });
    const ring = result.tokens.filter(
      (token) => !ids([token])[0]?.startsWith("d"),
    );

    assert.equal(ring.length, 10);
    assert.ok(ring.every((token) => token.size >= 80));
    assertNoOverlaps(result);
  });

  it("moves demons into the ring when there is a logo", () => {
    const result = layout(
      { townsfolk: 13, outsider: 4, minion: 4, demon: 4 },
      { logoAspectRatio: 1 },
    );

    assert.equal(centreTokens(result).length, 0);
    assert.equal(ids(result.tokens).length, 25);
    assert.ok(result.logo);
    assertNoOverlaps(result);
  });

  it("fits wide logos inside the ring", () => {
    const result = layout(
      { townsfolk: 13, outsider: 4, minion: 4, demon: 1 },
      { logoAspectRatio: 4 },
    );

    assert.ok(result.logo!.width > 3.9 * result.logo!.height);
    assertNoOverlaps(result);
  });

  it("puts featured characters in the centre and nowhere else", () => {
    const result = layout(
      { townsfolk: 13, outsider: 4, minion: 4, demon: 4, fabled: 1 },
      { featured: ["t3", "f0"] },
    );

    assert.deepEqual(ids(centreTokens(result)).sort(), ["f0", "t3"]);
    assert.equal(ids(result.tokens).filter((id) => id === "t3").length, 1);
    assert.equal(ids(result.tokens).filter((id) => id === "f0").length, 1);
    assert.ok(ids(result.tokens).includes("d3"));
    assertNoOverlaps(result);
  });

  it("prefers a logo over featured characters", () => {
    const result = layout(
      { townsfolk: 13, outsider: 4, minion: 4, demon: 1 },
      { featured: ["t3"], logoAspectRatio: 1 },
    );

    assert.equal(centreTokens(result).length, 0);
    assert.ok(result.logo);
  });

  it("features at most five characters", () => {
    const result = layout(
      { townsfolk: 13, outsider: 4, minion: 4, demon: 1 },
      { featured: ["t0", "t1", "t2", "t3", "t4", "t5"] },
    );

    assert.equal(centreTokens(result).length, 5);
    assertNoOverlaps(result);
  });

  for (const demon of [1, 2, 3, 5]) {
    it(`arranges ${demon} centre demons without overlaps`, () => {
      const result = layout({ townsfolk: 13, outsider: 4, minion: 4, demon });

      assert.equal(centreTokens(result).length, demon);
      assertNoOverlaps(result);
    });
  }

  it("keeps six or more demons in the ring", () => {
    const result = layout({ townsfolk: 8, outsider: 2, minion: 2, demon: 6 });

    assert.equal(centreTokens(result).length, 0);
    assert.equal(ids(result.tokens).length, 18);
    assertNoOverlaps(result);
  });

  it("puts travellers on the left and fabled and loric on the right", () => {
    const result = layout({
      townsfolk: 13,
      outsider: 4,
      minion: 4,
      demon: 4,
      traveller: 5,
      fabled: 3,
      loric: 2,
    });
    const ringLeft = OG_WIDTH / 2 - ringTokenRadius(result);

    for (const token of result.tokens) {
      if (token.kind !== "character") continue;
      if (token.character.startsWith("tr")) {
        assert.ok(token.x < OG_WIDTH / 2 - 250);
      } else if (/^[fl]/.test(token.character)) {
        assert.ok(token.x > OG_WIDTH / 2 + 250);
      }
    }
    assert.ok(ringLeft > 0);
    assertNoOverlaps(result);
  });

  it("collapses extra side tokens into a count", () => {
    const result = layout({ townsfolk: 13, outsider: 4, traveller: 7 });
    const travellers = ids(result.tokens).filter((id) => id.startsWith("tr"));
    const more = result.tokens.filter((token) => token.kind === "more");

    assert.equal(travellers.length, 4);
    assert.deepEqual(
      more.map((token) => token.kind === "more" && token.count),
      [3],
    );
    assertNoOverlaps(result);
  });

  it("samples scripts too large for the ring", () => {
    const result = layout({
      townsfolk: 70,
      outsider: 25,
      minion: 25,
      demon: 20,
    });
    const more = result.tokens.find((token) => token.kind === "more");
    const shown = ids(result.tokens).length;

    assert.ok(more && more.kind === "more");
    assert.equal(shown + more.count, 140);
    assert.ok(
      result.tokens.every((token) => token.size >= RING_MIN_TOKEN_SIZE),
    );
    assertNoOverlaps(result);
  });

  it("shows empty seats for scripts with no characters", () => {
    const result = layout({});

    assert.equal(result.tokens.length, EMPTY_RING_SEATS);
    assert.ok(result.tokens.every((token) => token.kind === "blank"));
    assertNoOverlaps(result);
  });

  it("keeps a typical full script above the minimum size with a logo", () => {
    const result = layout(
      { townsfolk: 14, outsider: 4, minion: 4, demon: 5 },
      { logoAspectRatio: 1 },
    );

    assert.ok(!result.tokens.some((token) => token.kind === "more"));
    assertNoOverlaps(result);
  });
});

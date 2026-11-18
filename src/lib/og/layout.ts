import type { CharacterTeam } from "../../generated/script-schema.ts";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const HEADER_PADDING_TOP = 20;
export const HEADER_PADDING_BOTTOM = 20;
export const HEADER_PADDING_INLINE = 48;
export const HEADER_PAPER_EDGE = 12;

export const TITLE_MAX_FONT_SIZE = 64;
export const TITLE_MIN_FONT_SIZE = 40;
export const TITLE_LINE_HEIGHT = 1.1;
export const TITLE_MAX_WIDTH = OG_WIDTH - 2 * HEADER_PADDING_INLINE;

export const BYLINE_FONT_SIZE = 28;
export const BYLINE_LINE_HEIGHT = 1.2;
export const BYLINE_GAP = 4;

export const GRIMOIRE_PADDING = 8;
export const TOKEN_GAP = 3;
export const TEAM_GAP_UNITS = 0.35;
export const RING_MAX_TOKEN_SIZE = 96;
export const RING_MIN_TOKEN_SIZE = 36;
export const EMPTY_RING_SEATS = 12;

export const CENTRE_PADDING = 8;
export const MAX_CENTRE_TOKENS = 5;
const CENTRE_MAX_TOKEN_SIZES = [170, 130, 115, 105, 90];

export const SIDE_MAX_TOKEN_SIZE = 64;
export const SIDE_MAX_TOKENS = 5;
export const SIDE_RING_GAP = 32;

export const OG_ICON_SIZE = CENTRE_MAX_TOKEN_SIZES[0];

export type PlacedToken<T> = { x: number; y: number; size: number } & (
  | { kind: "character"; character: T }
  | { kind: "more"; count: number }
  | { kind: "blank" }
);

export interface LogoBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GrimoireLayout<T> {
  tokens: PlacedToken<T>[];
  logo?: LogoBox;
}

export interface GrimoireInput<T> {
  teams: Record<CharacterTeam, T[]>;
  featured: T[];
  headerHeight: number;
  logoAspectRatio?: number;
}

type RingEntry<T> =
  | { kind: "character"; character: T }
  | { kind: "more"; count: number }
  | { kind: "blank" };

export function fitTitle(naturalWidth: number, measuredFontSize: number) {
  if (naturalWidth <= 0) {
    return TITLE_MAX_FONT_SIZE;
  }

  const fittingSize = Math.floor(
    (TITLE_MAX_WIDTH * measuredFontSize) / naturalWidth,
  );
  return Math.min(
    Math.max(fittingSize, TITLE_MIN_FONT_SIZE),
    TITLE_MAX_FONT_SIZE,
  );
}

export function getHeaderHeight(titleFontSize: number, hasByline: boolean) {
  const bylineHeight = hasByline
    ? BYLINE_GAP + BYLINE_FONT_SIZE * BYLINE_LINE_HEIGHT
    : 0;

  return (
    HEADER_PADDING_TOP +
    titleFontSize * TITLE_LINE_HEIGHT +
    bylineHeight +
    HEADER_PADDING_BOTTOM +
    HEADER_PAPER_EDGE
  );
}

export function getRingTokenSize(
  diameter: number,
  tokenCount: number,
  groupCount: number,
): number {
  const units = tokenCount + (groupCount > 1 ? groupCount * TEAM_GAP_UNITS : 0);
  if (units <= 1) {
    return RING_MAX_TOKEN_SIZE;
  }
  const sine = Math.sin(Math.PI / units);
  return Math.min(
    RING_MAX_TOKEN_SIZE,
    Math.floor((diameter * sine - TOKEN_GAP) / (1 + sine)),
  );
}

export function sampleGroups<T>(groups: T[][], capacity: number): T[][] {
  const total = groups.reduce((sum, group) => sum + group.length, 0);
  const counts = groups.map((group) =>
    Math.max(1, Math.floor((group.length * capacity) / total)),
  );

  let remaining = capacity - counts.reduce((sum, count) => sum + count, 0);
  const byRemainder = groups
    .map((group, i) => ({
      i,
      remainder: (group.length * capacity) / total - counts[i],
    }))
    .sort((a, b) => b.remainder - a.remainder);
  for (const { i } of byRemainder) {
    if (remaining <= 0) break;
    if (counts[i] < groups[i].length) {
      counts[i]++;
      remaining--;
    }
  }

  return groups.map((group, i) => group.slice(0, counts[i]));
}

function fitRing<T>(
  groups: T[][],
  diameter: number,
): { groups: RingEntry<T>[][]; size: number } {
  const asEntries = (items: T[]): RingEntry<T>[] =>
    items.map((character) => ({ kind: "character", character }));

  if (groups.length === 0) {
    const blanks: RingEntry<T>[] = Array.from(
      { length: EMPTY_RING_SEATS },
      () => ({ kind: "blank" }),
    );
    return {
      groups: [blanks],
      size: getRingTokenSize(diameter, EMPTY_RING_SEATS, 1),
    };
  }

  const total = groups.reduce((sum, group) => sum + group.length, 0);
  const size = getRingTokenSize(diameter, total, groups.length);
  if (size >= RING_MIN_TOKEN_SIZE) {
    return { groups: groups.map(asEntries), size };
  }

  for (let capacity = total - 1; capacity >= groups.length; capacity--) {
    const ringSize = getRingTokenSize(
      diameter,
      capacity + 1,
      groups.length + 1,
    );
    if (ringSize >= RING_MIN_TOKEN_SIZE) {
      return {
        groups: [
          ...sampleGroups(groups, capacity).map(asEntries),
          [{ kind: "more", count: total - capacity }],
        ],
        size: ringSize,
      };
    }
  }

  return {
    groups: [
      ...groups.map((group) => asEntries(group.slice(0, 1))),
      [{ kind: "more", count: total - groups.length }],
    ],
    size: RING_MIN_TOKEN_SIZE,
  };
}

function placeRing<T>(
  groups: RingEntry<T>[][],
  size: number,
  cx: number,
  cy: number,
  radius: number,
): PlacedToken<T>[] {
  const gap = groups.length > 1 ? TEAM_GAP_UNITS : 0;
  const tokenCount = groups.reduce((sum, group) => sum + group.length, 0);
  const step = (2 * Math.PI) / (tokenCount + groups.length * gap);

  const placed: PlacedToken<T>[] = [];
  let units = groups.length > 1 ? gap / 2 + 0.5 : 0;
  for (const group of groups) {
    for (const entry of group) {
      const angle = -Math.PI / 2 + units * step;
      placed.push({
        ...entry,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        size,
      });
      units++;
    }
    units += gap;
  }
  return placed;
}

export function getCentreTokenSize(count: number, innerRadius: number) {
  const max = CENTRE_MAX_TOKEN_SIZES[count - 1];
  let fitting: number;
  switch (count) {
    case 1:
      fitting = 2 * innerRadius;
      break;
    case 2:
      fitting = innerRadius - TOKEN_GAP / 2;
      break;
    case 3:
      fitting =
        (innerRadius - TOKEN_GAP / Math.sqrt(3)) / (1 / Math.sqrt(3) + 0.5);
      break;
    case 4:
      fitting = (innerRadius - TOKEN_GAP / Math.SQRT2) / (1 / Math.SQRT2 + 0.5);
      break;
    default:
      fitting = (innerRadius - TOKEN_GAP) / 1.5;
  }
  return Math.max(0, Math.min(max, Math.floor(fitting)));
}

function centreOffsets(count: number, size: number): [number, number][] {
  const pitch = size + TOKEN_GAP;
  switch (count) {
    case 1:
      return [[0, 0]];
    case 2:
      return [
        [-pitch / 2, 0],
        [pitch / 2, 0],
      ];
    case 3: {
      const r = pitch / Math.sqrt(3);
      return [-90, 30, 150].map((degrees) => {
        const angle = (degrees * Math.PI) / 180;
        return [r * Math.cos(angle), r * Math.sin(angle)];
      });
    }
    case 4:
      return [
        [-pitch / 2, -pitch / 2],
        [pitch / 2, -pitch / 2],
        [-pitch / 2, pitch / 2],
        [pitch / 2, pitch / 2],
      ];
    default: {
      const d = pitch / Math.SQRT2;
      return [
        [-d, -d],
        [d, -d],
        [0, 0],
        [-d, d],
        [d, d],
      ];
    }
  }
}

function placeSide<T>(
  items: T[],
  side: "left" | "right",
  size: number,
  cx: number,
  cy: number,
  radius: number,
): PlacedToken<T>[] {
  const entries: RingEntry<T>[] =
    items.length > SIDE_MAX_TOKENS
      ? [
          ...items
            .slice(0, SIDE_MAX_TOKENS - 1)
            .map((character) => ({ kind: "character" as const, character })),
          { kind: "more", count: items.length - (SIDE_MAX_TOKENS - 1) },
        ]
      : items.map((character) => ({ kind: "character", character }));

  const step = (size + TOKEN_GAP) / radius;
  const middle = (entries.length - 1) / 2;
  return entries.map((entry, i) => {
    const angle =
      side === "left" ? Math.PI + (middle - i) * step : (i - middle) * step;
    return {
      ...entry,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      size,
    };
  });
}

export function layoutGrimoire<T>({
  teams,
  featured,
  headerHeight,
  logoAspectRatio,
}: GrimoireInput<T>): GrimoireLayout<T> {
  let centre: T[] = [];
  if (logoAspectRatio === undefined) {
    if (featured.length > 0) {
      centre = featured.slice(0, MAX_CENTRE_TOKENS);
    } else if (teams.demon.length <= MAX_CENTRE_TOKENS) {
      centre = teams.demon;
    }
  }
  const outside = (items: T[]) =>
    items.filter((item) => !centre.includes(item));

  const ringGroups = [
    teams.townsfolk,
    teams.outsider,
    teams.minion,
    teams.demon,
  ]
    .map(outside)
    .filter((group) => group.length > 0);
  const left = outside(teams.traveller);
  const right = outside([...teams.fabled, ...teams.loric]);

  const diameter = OG_HEIGHT - headerHeight - 2 * GRIMOIRE_PADDING;
  const cx = OG_WIDTH / 2;
  const cy = headerHeight + GRIMOIRE_PADDING + diameter / 2;

  const ring = fitRing(ringGroups, diameter);
  const ringRadius = (diameter - ring.size) / 2;
  const innerRadius = ringRadius - ring.size / 2 - CENTRE_PADDING;

  const tokens = placeRing(ring.groups, ring.size, cx, cy, ringRadius);

  const sideSize = Math.min(ring.size, SIDE_MAX_TOKEN_SIZE);
  const sideRadius = diameter / 2 + SIDE_RING_GAP + sideSize / 2;
  tokens.push(
    ...placeSide(left, "left", sideSize, cx, cy, sideRadius),
    ...placeSide(right, "right", sideSize, cx, cy, sideRadius),
  );

  if (centre.length > 0) {
    const size = getCentreTokenSize(centre.length, innerRadius);
    centreOffsets(centre.length, size).forEach(([dx, dy], i) => {
      tokens.push({
        kind: "character",
        character: centre[i],
        x: cx + dx,
        y: cy + dy,
        size,
      });
    });
  }

  let logo: LogoBox | undefined;
  if (logoAspectRatio !== undefined) {
    const hypotenuse = Math.hypot(logoAspectRatio, 1);
    const width = (2 * innerRadius * logoAspectRatio) / hypotenuse;
    const height = (2 * innerRadius) / hypotenuse;
    logo = { x: cx - width / 2, y: cy - height / 2, width, height };
  }

  return { tokens, logo };
}

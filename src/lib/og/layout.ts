import type { CharacterTeam } from "../../generated/script-schema.ts";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const ICON_SIZE = 56;
export const ICON_GAP = 8;
export const MAX_ICONS_PER_ROW = 12;
export const ICON_AREA_PADDING = 12;

export const HEADER_PADDING_TOP = 20;
export const HEADER_PADDING_BOTTOM = 20;
export const HEADER_PADDING_INLINE = 48;
export const HEADER_PAPER_EDGE = 12;

export const TITLE_MAX_FONT_SIZE = 64;
export const TITLE_MIN_FONT_SIZE = 44;
export const TITLE_LINE_HEIGHT = 1.1;
export const TITLE_MAX_WIDTH = OG_WIDTH - 2 * HEADER_PADDING_INLINE;

export const BYLINE_FONT_SIZE = 28;
export const BYLINE_LINE_HEIGHT = 1.2;
export const BYLINE_GAP = 4;

const ROW_GROUPS: CharacterTeam[][] = [
  ["townsfolk"],
  ["outsider"],
  ["minion"],
  ["demon"],
  ["traveller", "fabled", "loric"],
];

export interface TitleFit {
  fontSize: number;
  lineCount: 1 | 2;
}

export type OgLayoutType = "icons" | "title-only";

export function splitBalanced<T>(
  items: T[],
  maxPerRow = MAX_ICONS_PER_ROW,
): T[][] {
  const rowCount = Math.ceil(items.length / maxPerRow);
  const rows: T[][] = [];
  let start = 0;
  for (let i = 0; i < rowCount; i++) {
    const size = Math.ceil((items.length - start) / (rowCount - i));
    rows.push(items.slice(start, start + size));
    start += size;
  }
  return rows;
}

export function getIconRows<T>(teams: Record<CharacterTeam, T[]>): T[][] {
  return ROW_GROUPS.flatMap((group) =>
    splitBalanced(group.flatMap((team) => teams[team])),
  );
}

export function fitTitle(
  naturalWidth: number,
  measuredFontSize: number,
): TitleFit {
  if (naturalWidth <= 0) {
    return { fontSize: TITLE_MAX_FONT_SIZE, lineCount: 1 };
  }

  const fittingSize = Math.floor(
    (TITLE_MAX_WIDTH * measuredFontSize) / naturalWidth,
  );
  if (fittingSize >= TITLE_MIN_FONT_SIZE) {
    return {
      fontSize: Math.min(fittingSize, TITLE_MAX_FONT_SIZE),
      lineCount: 1,
    };
  }

  return { fontSize: TITLE_MIN_FONT_SIZE, lineCount: 2 };
}

export function getHeaderHeight(title: TitleFit, hasByline: boolean): number {
  const titleHeight = title.lineCount * title.fontSize * TITLE_LINE_HEIGHT;
  const bylineHeight = hasByline
    ? BYLINE_GAP + BYLINE_FONT_SIZE * BYLINE_LINE_HEIGHT
    : 0;

  return (
    HEADER_PADDING_TOP +
    titleHeight +
    bylineHeight +
    HEADER_PADDING_BOTTOM +
    HEADER_PAPER_EDGE
  );
}

export function getMaxIconRows(headerHeight: number): number {
  const available = OG_HEIGHT - headerHeight - 2 * ICON_AREA_PADDING;
  return Math.max(
    0,
    Math.floor((available + ICON_GAP) / (ICON_SIZE + ICON_GAP)),
  );
}

export function chooseLayout(
  rowCount: number,
  headerHeight: number,
): OgLayoutType {
  return rowCount > 0 && rowCount <= getMaxIconRows(headerHeight)
    ? "icons"
    : "title-only";
}

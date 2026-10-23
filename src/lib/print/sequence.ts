import type { PrintOptions } from "./options";

/** What a script has available to print. */
export interface PrintScriptContent {
  hasTravellers: boolean;
  hasFabled: boolean;
  hasLoric: boolean;
  hasJinxes: boolean;
  hasBootlegger: boolean;
}

export type SheetKind =
  | "script"
  | "back-info"
  | "back-fancy"
  | "night-simple"
  | "night-first"
  | "night-other"
  | "qr"
  | "blank";

export interface Sheet {
  kind: SheetKind;
  /** Automatically inserted so the next sheet starts on a fresh piece of paper when printing double-sided. */
  padding?: boolean;
}

export interface SheetSequence {
  sheets: Sheet[];
  /** Number of one-sided sheets of paper in the output. */
  paperCount: number;
  /** 1-indexed inclusive page ranges that every player should get a copy of. */
  playerPages: PageRange | undefined;
  /** 1-indexed inclusive page ranges for the storyteller only (one copy). */
  storytellerPages: PageRange | undefined;
}

export interface PageRange {
  from: number;
  to: number;
}

export function hasBackInfo(content: PrintScriptContent): boolean {
  return (
    content.hasTravellers ||
    content.hasFabled ||
    content.hasLoric ||
    content.hasBootlegger ||
    content.hasJinxes
  );
}

/**
 * Work out the ordered list of printed pages for the options chosen.
 *
 * Every sheet is a single printed page. Double-sided printing pairs pages (1,2), (3,4)...
 * so one-sided sheets get a blank page after them when `doubleSided` is set.
 */
export function buildSheetSequence(
  content: PrintScriptContent,
  options: PrintOptions,
): SheetSequence {
  // Each entry is a "piece of paper": a front, and optionally a back.
  const papers: { front: Sheet; back?: Sheet }[] = [];

  const scriptBack: Sheet | undefined =
    options.back === "fancy"
      ? { kind: "back-fancy" }
      : options.back === "info" && hasBackInfo(content)
        ? { kind: "back-info" }
        : undefined;
  papers.push({ front: { kind: "script" }, back: scriptBack });

  if (options.night === "detailed") {
    papers.push({
      front: { kind: "night-first" },
      back: { kind: "night-other" },
    });
  } else {
    papers.push({ front: { kind: "night-simple" } });
  }

  if (options.qrPage) {
    papers.push({ front: { kind: "qr" } });
  }

  const sheets: Sheet[] = [];
  let storytellerFrom: number | undefined;
  for (const paper of papers) {
    // Night sheets are the storyteller's, everything before is for players.
    if (storytellerFrom === undefined && paper.front.kind.startsWith("night")) {
      storytellerFrom = sheets.length + 1;
    }

    sheets.push(paper.front);
    if (paper.back) {
      sheets.push(paper.back);
    }
  }

  // A trailing padding page is pointless.
  const last = sheets.at(-1);
  if (last?.padding) {
    sheets.pop();
  }

  const playerEnd = (storytellerFrom ?? sheets.length + 1) - 1;
  return {
    sheets,
    paperCount: papers.length,
    playerPages: playerEnd >= 1 ? { from: 1, to: playerEnd } : undefined,
    storytellerPages:
      storytellerFrom !== undefined
        ? { from: storytellerFrom, to: sheets.length }
        : undefined,
  };
}

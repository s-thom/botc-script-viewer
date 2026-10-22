/** Serialisable data handed from the Astro page to the Svelte print island. */

export interface PrintIcon {
  src: string;
  /** Used if `src` fails to load. */
  fallback: string;
}

export interface PrintCharacter {
  id: string;
  name: string;
  ability: string;
  icon: PrintIcon;
}

export interface PrintNightEntry {
  name: string;
  text?: string;
  icon: PrintIcon;
}

export interface PrintJinx {
  names: string;
  reason: string;
  icons: PrintIcon[];
}

export type PrintTeamId =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon"
  | "traveller"
  | "fabled"
  | "loric";

export interface PrintBootleggerRule {
  text: string;
  icon: PrintIcon;
}

export interface PrintData {
  title: string;
  author?: string;
  teams: Record<PrintTeamId, PrintCharacter[]>;
  jinxes: PrintJinx[];
  bootlegger: PrintBootleggerRule[];
  firstNight: PrintNightEntry[];
  otherNight: PrintNightEntry[];
  qr: { src: string; url: string };
  /** Pre-translated strings. Placeholders such as `{range}` are left in for the island to fill in. */
  strings: Record<string, string>;
}

export const PRINT_STRING_KEYS = [
  "viewer.print.printButton",
  "viewer.print.printHint",
  "viewer.print.optionsHeading",
  "viewer.print.style.label",
  "viewer.print.style.plain",
  "viewer.print.style.fancy",
  "viewer.print.paper.label",
  "viewer.print.paper.a4",
  "viewer.print.paper.letter",
  "viewer.print.back.label",
  "viewer.print.back.info",
  "viewer.print.back.fancy",
  "viewer.print.back.blank",
  "viewer.print.night.label",
  "viewer.print.night.simple",
  "viewer.print.night.detailed",
  "viewer.print.jinxes",
  "viewer.print.qrPage",
  "viewer.print.doubleSided",
  "viewer.print.doubleSidedHint",
  "viewer.print.copies.heading",
  "viewer.print.copies.players",
  "viewer.print.copies.storyteller",
  "viewer.print.copies.pages",
  "viewer.print.copies.page",
  "viewer.print.preview.heading",
  "viewer.print.preview.page",
  "viewer.print.preview.blankBack",
  "viewer.print.preview.overflow",
  "viewer.script.nightOrder",
  "viewer.navigation.qrCode",
  "app.grimoire.phases.first_night",
  "app.grimoire.phases.other_nights",
  "app.tabs.character.jinxes",
] as const;

export const PRINT_TEAM_STRING_KEYS: Record<PrintTeamId, string> = {
  townsfolk: "app.grimoire.townsfolk",
  outsider: "app.grimoire.outsider",
  minion: "app.grimoire.minion",
  demon: "app.grimoire.demon",
  traveller: "app.grimoire.traveller",
  fabled: "app.grimoire.fabled",
  loric: "app.grimoire.loric",
};

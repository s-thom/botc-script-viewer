import type { LocalScriptDefinition } from "../../types/botc";

export const BASE_3: LocalScriptDefinition[] = [
  {
    id: "tb",
    title: "Trouble Brewing",
    character: "imp",
    getScript: {
      en: () =>
        import("../../generated/edition-scripts/en/tb.json").then(
          (m) => m.default,
        ),
      fr: () =>
        import("../../generated/edition-scripts/fr/tb.json").then(
          (m) => m.default,
        ),
    },
  },
  {
    id: "snv",
    title: "Sects and Violets",
    character: "pithag",
    getScript: {
      en: () =>
        import("../../generated/edition-scripts/en/snv.json").then(
          (m) => m.default,
        ),
      fr: () =>
        import("../../generated/edition-scripts/fr/snv.json").then(
          (m) => m.default,
        ),
    },
  },
  {
    id: "bmr",
    title: "Bad Moon Rising",
    character: "godfather",
    getScript: {
      en: () =>
        import("../../generated/edition-scripts/en/bmr.json").then(
          (m) => m.default,
        ),
      fr: () =>
        import("../../generated/edition-scripts/fr/bmr.json").then(
          (m) => m.default,
        ),
    },
  },
];

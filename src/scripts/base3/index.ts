import type { LocalScriptDefinition } from "../../types/botc";

export const BASE_3: LocalScriptDefinition[] = [
  {
    id: "tb",
    title: "Trouble Brewing",
    character: "imp",
    getScript: () =>
      import("../../generated/edition-scripts/en/tb.json").then(
        (m) => m.default,
      ),
    localeOverrides: {
      "en-7c": () =>
        import("../../generated/edition-scripts/en-7c/tb.json").then(
          (m) => m.default,
        ),
      fr: () =>
        import("../../generated/edition-scripts/fr/tb.json").then(
          (m) => m.default,
        ),
      de: () =>
        import("../../generated/edition-scripts/de/tb.json").then(
          (m) => m.default,
        ),
      "de-ch": () =>
        import("../../generated/edition-scripts/de-ch/tb.json").then(
          (m) => m.default,
        ),
      es: () =>
        import("../../generated/edition-scripts/es/tb.json").then(
          (m) => m.default,
        ),
      "es-mx": () =>
        import("../../generated/edition-scripts/es-mx/tb.json").then(
          (m) => m.default,
        ),
      "es-419": () =>
        import("../../generated/edition-scripts/es-419/tb.json").then(
          (m) => m.default,
        ),
      nl: () =>
        import("../../generated/edition-scripts/nl/tb.json").then(
          (m) => m.default,
        ),
      pl: () =>
        import("../../generated/edition-scripts/pl/tb.json").then(
          (m) => m.default,
        ),
      "zh-hans": () =>
        import("../../generated/edition-scripts/zh-hans/tb.json").then(
          (m) => m.default,
        ),
      pt: () =>
        import("../../generated/edition-scripts/pt/tb.json").then(
          (m) => m.default,
        ),
      "pt-br": () =>
        import("../../generated/edition-scripts/pt-br/tb.json").then(
          (m) => m.default,
        ),
    },
  },
  {
    id: "snv",
    title: "Sects and Violets",
    character: "pithag",
    getScript: () =>
      import("../../generated/edition-scripts/en/snv.json").then(
        (m) => m.default,
      ),
    localeOverrides: {
      "en-7c": () =>
        import("../../generated/edition-scripts/en-7c/snv.json").then(
          (m) => m.default,
        ),
      fr: () =>
        import("../../generated/edition-scripts/fr/snv.json").then(
          (m) => m.default,
        ),
      de: () =>
        import("../../generated/edition-scripts/de/snv.json").then(
          (m) => m.default,
        ),
      "de-ch": () =>
        import("../../generated/edition-scripts/de-ch/snv.json").then(
          (m) => m.default,
        ),
      es: () =>
        import("../../generated/edition-scripts/es/snv.json").then(
          (m) => m.default,
        ),
      "es-mx": () =>
        import("../../generated/edition-scripts/es-mx/snv.json").then(
          (m) => m.default,
        ),
      "es-419": () =>
        import("../../generated/edition-scripts/es-419/snv.json").then(
          (m) => m.default,
        ),
      nl: () =>
        import("../../generated/edition-scripts/nl/snv.json").then(
          (m) => m.default,
        ),
      pl: () =>
        import("../../generated/edition-scripts/pl/snv.json").then(
          (m) => m.default,
        ),
      "zh-hans": () =>
        import("../../generated/edition-scripts/zh-hans/snv.json").then(
          (m) => m.default,
        ),
      pt: () =>
        import("../../generated/edition-scripts/pt/snv.json").then(
          (m) => m.default,
        ),
      "pt-br": () =>
        import("../../generated/edition-scripts/pt-br/snv.json").then(
          (m) => m.default,
        ),
    },
  },
  {
    id: "bmr",
    title: "Bad Moon Rising",
    character: "godfather",
    getScript: () =>
      import("../../generated/edition-scripts/en/bmr.json").then(
        (m) => m.default,
      ),
    localeOverrides: {
      "en-7c": () =>
        import("../../generated/edition-scripts/en-7c/bmr.json").then(
          (m) => m.default,
        ),
      fr: () =>
        import("../../generated/edition-scripts/fr/bmr.json").then(
          (m) => m.default,
        ),
      de: () =>
        import("../../generated/edition-scripts/de/bmr.json").then(
          (m) => m.default,
        ),
      "de-ch": () =>
        import("../../generated/edition-scripts/de-ch/bmr.json").then(
          (m) => m.default,
        ),
      es: () =>
        import("../../generated/edition-scripts/es/bmr.json").then(
          (m) => m.default,
        ),
      "es-mx": () =>
        import("../../generated/edition-scripts/es-mx/bmr.json").then(
          (m) => m.default,
        ),
      "es-419": () =>
        import("../../generated/edition-scripts/es-419/bmr.json").then(
          (m) => m.default,
        ),
      nl: () =>
        import("../../generated/edition-scripts/nl/bmr.json").then(
          (m) => m.default,
        ),
      pl: () =>
        import("../../generated/edition-scripts/pl/bmr.json").then(
          (m) => m.default,
        ),
      "zh-hans": () =>
        import("../../generated/edition-scripts/zh-hans/bmr.json").then(
          (m) => m.default,
        ),
      pt: () =>
        import("../../generated/edition-scripts/pt/bmr.json").then(
          (m) => m.default,
        ),
      "pt-br": () =>
        import("../../generated/edition-scripts/pt-br/bmr.json").then(
          (m) => m.default,
        ),
    },
  },
];

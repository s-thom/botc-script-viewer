import type { HostedScriptDefinition } from "../../types/botc";

export const BASE_3: HostedScriptDefinition[] = [
  {
    id: "tb",
    title: "Trouble Brewing",
    character: "imp",
    getScript: () =>
      import("../../generated/edition-scripts/tb.json").then((m) => m.default),
  },
  {
    id: "snv",
    title: "Sects and Violets",
    character: "pithag",
    getScript: () =>
      import("../../generated/edition-scripts/snv.json").then((m) => m.default),
  },
  {
    id: "bmr",
    title: "Bad Moon Rising",
    character: "godfather",
    getScript: () =>
      import("../../generated/edition-scripts/bmr.json").then((m) => m.default),
  },
];

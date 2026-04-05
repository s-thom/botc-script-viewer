import type { LocalScriptDefinition } from "../../types/botc";

export const RANDOM_SCRIPTS: LocalScriptDefinition[] = [
  {
    id: "nfm",
    title: "Nobody FUCKING MOVE!",
    character: "ojo",
    getScript: {
      en: () => import("./NobodyFUCKINGMOVE.json").then((m) => m.default),
      fr: () => import("./NobodyFUCKINGMOVE.json").then((m) => m.default),
    },
  },
  {
    id: "tb+1",
    title: "Trouble Brewing Plus 1",
    character: "imp",
    getScript: {
      en: () => import("./TroubleBrewingPlus1.json").then((m) => m.default),
      fr: () => import("./TroubleBrewingPlus1.json").then((m) => m.default),
    },
  },
  {
    id: "muppets",
    title: "Muppets on a Clocktower",
    character: "bootlegger",
    getScript: {
      en: () => import("./Muppets_on_a_Clocktower.json").then((m) => m.default),
      fr: () => import("./Muppets_on_a_Clocktower.json").then((m) => m.default),
    },
  },
  {
    id: "moonup",
    title: "moon Up",
    character: "zombuul",
    getScript: {
      en: () => import("./moonUp.json").then((m) => m.default),
      fr: () => import("./moonUp.json").then((m) => m.default),
    },
  },
  {
    id: "GaslightGatekeepGiggle",
    title: "Gaslight, Gatekeep, Giggle",
    character: "marionette",
    getScript: {
      en: () => import("./GaslightGatekeepGiggle.json").then((m) => m.default),
      fr: () => import("./GaslightGatekeepGiggle.json").then((m) => m.default),
    },
  },
  {
    id: "Regalia",
    title: "Regalia",
    character: "king",
    getScript: {
      en: () => import("./Regalia.json").then((m) => m.default),
      fr: () => import("./Regalia.json").then((m) => m.default),
    },
  },
];

import type { LocalScriptDefinition } from "../../types/botc";

export const RANDOM_SCRIPTS: LocalScriptDefinition[] = [
  {
    id: "nfm",
    title: "Nobody FUCKING MOVE!",
    character: "ojo",
    getScript: () => import("./NobodyFUCKINGMOVE.json").then((m) => m.default),
  },
  {
    id: "tb+1",
    title: "Trouble Brewing Plus 1",
    character: "imp",
    getScript: () =>
      import("./TroubleBrewingPlus1.json").then((m) => m.default),
  },
  {
    id: "muppets",
    title: "Muppets on a Clocktower",
    character: "bootlegger",
    getScript: () =>
      import("./Muppets_on_a_Clocktower.json").then((m) => m.default),
  },
  {
    id: "moonup",
    title: "moon Up",
    character: "zombuul",
    getScript: () => import("./moonUp.json").then((m) => m.default),
  },
  {
    id: "GaslightGatekeepGiggle",
    title: "Gaslight, Gatekeep, Giggle",
    character: "marionette",
    getScript: () =>
      import("./GaslightGatekeepGiggle.json").then((m) => m.default),
  },
  {
    id: "regalia",
    title: "Regalia",
    character: "king",
    getScript: () => import("./Regalia.json").then((m) => m.default),
  },
  {
    id: "onion-pies",
    title: "Onion Pies",
    character: "ogre",
    getScript: () => import("./OnionPies.json").then((m) => m.default),
  },
  {
    id: "extension-cord",
    title: "Extension Cord",
    character: "nodashii",
    getScript: () =>
      import("./Extension Cord_5_1_0.json").then((m) => m.default),
  },
  {
    id: "trust",
    title: "Trust",
    character: "mayor",
    getScript: () => import("./Trust_2_0_0.json").then((m) => m.default),
  },
  {
    id: "uncertain-death",
    title: "Uncertain Death",
    character: "oracle",
    getScript: () =>
      import("./Uncertain Death_1_0_1.json").then((m) => m.default),
  },
];

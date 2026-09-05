import type { LocalScriptDefinition } from "../../types/site";

export const RANDOM_SCRIPTS: LocalScriptDefinition[] = [
  {
    id: "nfm",
    title: "Nobody FUCKING MOVE!",
    character: "ojo",
    botcScripts: { scriptId: 4669, versionId: "1.0.1", pk: 21028 },
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
    botcScripts: { scriptId: 3191, versionId: "1.0.0", pk: 5517 },
    getScript: () =>
      import("./GaslightGatekeepGiggle.json").then((m) => m.default),
  },
  {
    id: "regalia",
    title: "Regalia",
    character: "king",
    botcScripts: { scriptId: 3582, versionId: "1.0.0", pk: 6151 },
    getScript: () => import("./Regalia.json").then((m) => m.default),
  },
  {
    id: "onion-pies",
    title: "Onion Pies",
    character: "ogre",
    botcScripts: { scriptId: 4008, versionId: "1.0.0", pk: 6852 },
    getScript: () => import("./OnionPies.json").then((m) => m.default),
  },
  {
    id: "extension-cord",
    title: "Extension Cord",
    character: "nodashii",
    botcScripts: { scriptId: 42, versionId: "5.1.0", pk: 947 },
    getScript: () =>
      import("./Extension Cord_5_1_0.json").then((m) => m.default),
  },
  {
    id: "trust",
    title: "Trust",
    character: "mayor",
    botcScripts: { scriptId: 754, versionId: "2.0.0", pk: 3078 },
    getScript: () => import("./Trust_2_0_0.json").then((m) => m.default),
  },
  {
    id: "uncertain-death",
    title: "Uncertain Death",
    character: "oracle",
    botcScripts: { scriptId: 68, versionId: "1.0.1", pk: 344 },
    getScript: () =>
      import("./Uncertain Death_1_0_1.json").then((m) => m.default),
  },
  {
    id: "whalebuffet",
    title: "Whalebuffet",
    character: "fisherman",
    getScript: () => import("./whalebuffet").then((m) => m.default),
  },
];

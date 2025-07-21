import type { HostedScriptDefinition } from "../../types/botc";

export const RANDOM_SCRIPTS: HostedScriptDefinition[] = [
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
];

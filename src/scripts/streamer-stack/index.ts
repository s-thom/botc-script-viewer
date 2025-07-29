import type { LocalScriptDefinition } from "../../types/botc";

export const STREAMER_STACK: LocalScriptDefinition[] = [
  {
    id: "luigi",
    title: "Luigi's Mansion",
    character: "bountyhunter",
    getScript: () => import("./Luigi's Mansion.json").then((m) => m.default),
  },
  {
    id: "switchcraft",
    title: "Switchcraft",
    character: "hermit",
    getScript: () => import("./Switchcraft.json").then((m) => m.default),
  },
  {
    id: "red-blue",
    title: "Red Stick, Blue Stick",
    character: "marionette",
    getScript: () =>
      import("./Red Stick, Blue Stick.json").then((m) => m.default),
  },
  {
    id: "conclusions",
    title: "Jumping to Conclusions",
    character: "heretic",
    getScript: () =>
      import("./Jumping to Conclusions.json").then((m) => m.default),
  },
  {
    id: "keening",
    title: "The Keeping Call",
    character: "banshee",
    getScript: () => import("./The Keening Call.json").then((m) => m.default),
  },
  {
    id: "custodiet",
    title: "Quis Custodiet Ipsos Custodes",
    character: "nightwatchman",
    getScript: () =>
      import("./Quis Custodiet Ipsos Custodes.json").then((m) => m.default),
  },
  {
    id: "fizzy",
    title: "Fizzy Vizzy",
    character: "vizier",
    getScript: () => import("./Fizzy Vizzy.json").then((m) => m.default),
  },
  {
    id: "birthday",
    title: "Birthday Feast!",
    character: "cannibal",
    getScript: () => import("./Birthday Feast!.json").then((m) => m.default),
  },
  {
    id: "midnight",
    title: "Midnight Sun",
    character: "leviathan",
    getScript: () => import("./Midnight Sun.json").then((m) => m.default),
  },
  {
    id: "psychosocial",
    title: "Psychosocial",
    character: "psychopath",
    getScript: () => import("./Psychosocial.json").then((m) => m.default),
  },
  {
    id: "cyborg",
    title: "Clockwork Cyborg",
    character: "kazali",
    getScript: () => import("./Clockwork Cyborg.json").then((m) => m.default),
  },
  {
    id: "damned",
    title: "Dusk in the House of the Damned",
    character: "legion",
    getScript: () =>
      import("./Dusk in the House of the Damned.json").then((m) => m.default),
  },
];

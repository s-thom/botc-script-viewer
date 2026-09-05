import type { LocalScriptDefinition } from "../../types/site";

export const STREAMER_STACK: LocalScriptDefinition[] = [
  {
    id: "luigi",
    title: "Luigi's Mansion",
    character: "bountyhunter",
    botcScripts: { scriptId: 6202, versionId: "1.3.0", pk: 13722 },
    getScript: () => import("./Luigi's Mansion.json").then((m) => m.default),
  },
  {
    id: "switchcraft",
    title: "Switchcraft",
    character: "hermit",
    botcScripts: { scriptId: 2169, versionId: "4.0.0", pk: 13682 },
    getScript: () => import("./Switchcraft.json").then((m) => m.default),
  },
  {
    id: "red-blue",
    title: "Red Stick, Blue Stick",
    character: "marionette",
    botcScripts: { scriptId: 2633, versionId: "1.0.1", pk: 21907 },
    getScript: () =>
      import("./Red Stick, Blue Stick.json").then((m) => m.default),
  },
  {
    id: "conclusions",
    title: "Jumping to Conclusions",
    character: "heretic",
    botcScripts: { scriptId: 3717, versionId: "4.4.0", pk: 6364 },
    getScript: () =>
      import("./Jumping to Conclusions.json").then((m) => m.default),
  },
  {
    id: "keening",
    title: "The Keening Call",
    character: "banshee",
    botcScripts: { scriptId: 3177, versionId: "2.0.0", pk: 20852 },
    getScript: () => import("./The Keening Call.json").then((m) => m.default),
  },
  {
    id: "custodiet",
    title: "Quis Custodiet Ipsos Custodes",
    character: "nightwatchman",
    botcScripts: { scriptId: 2618, versionId: "2.2.0", pk: 13879 },
    getScript: () =>
      import("./Quis Custodiet Ipsos Custodes.json").then((m) => m.default),
  },
  {
    id: "fizzy",
    title: "Fizzy Vizzy",
    character: "vizier",
    botcScripts: { scriptId: 1115, versionId: "4.0.0", pk: 13627 },
    getScript: () => import("./Fizzy Vizzy.json").then((m) => m.default),
  },
  {
    id: "birthday",
    title: "Birthday Feast!",
    character: "cannibal",
    botcScripts: { scriptId: 172, versionId: "1.4.0", pk: 10665 },
    getScript: () => import("./Birthday Feast.json").then((m) => m.default),
  },
  {
    id: "midnight",
    title: "Midnight Sun",
    character: "leviathan",
    botcScripts: { scriptId: 3431, versionId: "1.0.0", pk: 5916 },
    getScript: () => import("./Midnight Sun.json").then((m) => m.default),
  },
  {
    id: "psychosocial",
    title: "Psychosocial",
    character: "psychopath",
    botcScripts: { scriptId: 3562, versionId: "2.0.0", pk: 15442 },
    getScript: () => import("./Psychosocial.json").then((m) => m.default),
  },
  {
    id: "cyborg",
    title: "Clockwork Cyborg",
    character: "kazali",
    botcScripts: { scriptId: 3936, versionId: "5.2.0", pk: 9523 },
    getScript: () => import("./Clockwork Cyborg.json").then((m) => m.default),
  },
  {
    id: "damned",
    title: "Dusk in the House of the Damned",
    character: "legion",
    botcScripts: { scriptId: 181, versionId: "3.0.2", pk: 19510 },
    getScript: () =>
      import("./Dusk in the House of the Damned.json").then((m) => m.default),
  },
];

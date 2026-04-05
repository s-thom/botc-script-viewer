import type { LocalScriptDefinition } from "../../types/botc";

export const STREAMER_STACK: LocalScriptDefinition[] = [
  {
    id: "luigi",
    title: "Luigi's Mansion",
    character: "bountyhunter",
    getScript: {
      en: () => import("./Luigi's Mansion.json").then((m) => m.default),
      fr: () => import("./Luigi's Mansion.json").then((m) => m.default),
    },
  },
  {
    id: "switchcraft",
    title: "Switchcraft",
    character: "hermit",
    getScript: {
      en: () => import("./Switchcraft.json").then((m) => m.default),
      fr: () => import("./Switchcraft.json").then((m) => m.default),
    },
  },
  {
    id: "red-blue",
    title: "Red Stick, Blue Stick",
    character: "marionette",
    getScript: {
      en: () => import("./Red Stick, Blue Stick.json").then((m) => m.default),
      fr: () => import("./Red Stick, Blue Stick.json").then((m) => m.default),
    },
  },
  {
    id: "conclusions",
    title: "Jumping to Conclusions",
    character: "heretic",
    getScript: {
      en: () => import("./Jumping to Conclusions.json").then((m) => m.default),
      fr: () => import("./Jumping to Conclusions.json").then((m) => m.default),
    },
  },
  {
    id: "keening",
    title: "The Keening Call",
    character: "banshee",
    getScript: {
      en: () => import("./The Keening Call.json").then((m) => m.default),
      fr: () => import("./The Keening Call.json").then((m) => m.default),
    },
  },
  {
    id: "custodiet",
    title: "Quis Custodiet Ipsos Custodes",
    character: "nightwatchman",
    getScript: {
      en: () =>
        import("./Quis Custodiet Ipsos Custodes.json").then((m) => m.default),
      fr: () =>
        import("./Quis Custodiet Ipsos Custodes.json").then((m) => m.default),
    },
  },
  {
    id: "fizzy",
    title: "Fizzy Vizzy",
    character: "vizier",
    getScript: {
      en: () => import("./Fizzy Vizzy.json").then((m) => m.default),
      fr: () => import("./Fizzy Vizzy.json").then((m) => m.default),
    },
  },
  {
    id: "birthday",
    title: "Birthday Feast!",
    character: "cannibal",
    getScript: {
      en: () => import("./Birthday Feast!.json").then((m) => m.default),
      fr: () => import("./Birthday Feast!.json").then((m) => m.default),
    },
  },
  {
    id: "midnight",
    title: "Midnight Sun",
    character: "leviathan",
    getScript: {
      en: () => import("./Midnight Sun.json").then((m) => m.default),
      fr: () => import("./Midnight Sun.json").then((m) => m.default),
    },
  },
  {
    id: "psychosocial",
    title: "Psychosocial",
    character: "psychopath",
    getScript: {
      en: () => import("./Psychosocial.json").then((m) => m.default),
      fr: () => import("./Psychosocial.json").then((m) => m.default),
    },
  },
  {
    id: "cyborg",
    title: "Clockwork Cyborg",
    character: "kazali",
    getScript: {
      en: () => import("./Clockwork Cyborg.json").then((m) => m.default),
      fr: () => import("./Clockwork Cyborg.json").then((m) => m.default),
    },
  },
  {
    id: "damned",
    title: "Dusk in the House of the Damned",
    character: "legion",
    getScript: {
      en: () =>
        import("./Dusk in the House of the Damned.json").then((m) => m.default),
      fr: () =>
        import("./Dusk in the House of the Damned.json").then((m) => m.default),
    },
  },
];

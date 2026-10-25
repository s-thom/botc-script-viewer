import type { LocalScriptDefinition } from "../../types/site";

export const MY_SCRIPTS: LocalScriptDefinition[] = [
  {
    id: "out-of-hand",
    title: "This is Getting Out of Hand",
    character: "knaves",
    color: "#5e712f",
    botcScripts: { scriptId: 11723, versionId: "1.1.1", pk: 20507 },
    getScript: () =>
      import("./This is Getting Out of Hand.json").then((m) => m.default),
  },
  {
    id: "be-hind-u-teensy",
    title: "Be-hind-u (teensy)",
    character: "hindu",
    color: "#5e712f",
    seeAlsoRefs: [{ collectionId: "me", scriptId: "be-hind-u" }],
    botcScripts: { scriptId: 13518, versionId: "1.0.0", pk: 23611 },

    getScript: () => import("./Be-hind-u (teensy).json").then((m) => m.default),
  },
  {
    id: "be-hind-u",
    title: "Be-hind-u (full)",
    character: "hindu",
    color: "#5e712f",
    seeAlsoRefs: [{ collectionId: "me", scriptId: "be-hind-u-teensy" }],
    botcScripts: { scriptId: 13519, versionId: "1.0.0", pk: 23612 },
    getScript: () => import("./Be-hind-u (full).json").then((m) => m.default),
  },
];

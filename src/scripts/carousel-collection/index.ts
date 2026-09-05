import type { LocalScriptDefinition } from "../../types/site";

export const CAROUSEL_COLLECTION: LocalScriptDefinition[] = [
  {
    id: "anonymous-dishonesty",
    title: "Anonymous Dishonesty",
    character: "ojo",
    botcScripts: { scriptId: 3728, versionId: "1.0.1", pk: 6391 },
    getScript: () =>
      import("./Anonymous Dishonesty.json").then((m) => m.default),
  },
  {
    id: "contempt",
    title: "Contempt",
    character: "vizier",
    botcScripts: { scriptId: 6772, versionId: "1.0.0", pk: 11420 },
    getScript: () => import("./Contempt.json").then((m) => m.default),
  },
  {
    id: "devout-theists",
    title: "Devout Theists",
    character: "highpriestess",
    botcScripts: { scriptId: 1880, versionId: "6.0.0", pk: 5729 },
    getScript: () => import("./Devout Theists.json").then((m) => m.default),
  },
  {
    id: "harold-holts-revenge",
    title: "Harold Holt’s Revenge",
    character: "leviathan",
    botcScripts: { scriptId: 372, versionId: "1.1.0", pk: 5078 },
    getScript: () =>
      import("./Harold Holt's Revenge.json").then((m) => m.default),
  },
  {
    id: "insanity-intuition",
    title: "Insanity & Intuition",
    character: "harpy",
    botcScripts: { scriptId: 2128, versionId: "1.2.0", pk: 3695 },
    getScript: () =>
      import("./Insanity and Intuition.json").then((m) => m.default),
  },
  {
    id: "irrational-behaviour",
    title: "Irrational Behaviour",
    character: "wizard",
    botcScripts: { scriptId: 7918, versionId: "1.0.0", pk: 13443 },
    getScript: () =>
      import("./Irrational Behaviour.json").then((m) => m.default),
  },
  {
    id: "midnight-oasis",
    title: "The Midnight Oasis",
    character: "atheist",
    botcScripts: { scriptId: 104, versionId: "3.8.0", pk: 148 },
    getScript: () => import("./The Midnight Oasis.json").then((m) => m.default),
  },
  {
    id: "monkey-do-math",
    title: "Monkey Do Math",
    character: "organgrinder",
    botcScripts: { scriptId: 7967, versionId: "1.0.1", pk: 22312 },
    getScript: () => import("./Monkey Do Math.json").then((m) => m.default),
  },
  {
    id: "the-ones-you-least-expect",
    title: "The Ones You Least Expect",
    character: "summoner",
    botcScripts: { scriptId: 2939, versionId: "1.0.0", pk: 5085 },
    getScript: () =>
      import("./The Ones You Least Expect.json").then((m) => m.default),
  },
  {
    id: "punchy",
    title: "Punchy",
    character: "princess",
    botcScripts: { scriptId: 7712, versionId: "3.8.0", pk: 13007 },
    getScript: () => import("./Punchy v3.8 copy.json").then((m) => m.default),
  },
  {
    id: "quick-maths",
    title: "Quick Maths",
    character: "riot",
    botcScripts: { scriptId: 7434, versionId: "1.0.0", pk: 12516 },
    getScript: () => import("./Quick Maths.json").then((m) => m.default),
  },
  {
    id: "martian-vampires",
    title: "Revenge of the Martian Vampires",
    character: "heretic",
    botcScripts: { scriptId: 20, versionId: "2.0.2", pk: 22326 },
    getScript: () =>
      import("./Revenge of the Martian Vampires.json").then((m) => m.default),
  },
  {
    id: "whose-cult",
    title: "Whose Cult Is It Anyway?",
    character: "cultleader",
    botcScripts: { scriptId: 78, versionId: "2.5.2", pk: 10209 },
    getScript: () =>
      import("./Whose Cult Is It Anyway.json").then((m) => m.default),
  },
];

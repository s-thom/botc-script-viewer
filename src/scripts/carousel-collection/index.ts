import type { LocalScriptDefinition } from "../../types/botc";

export const CAROUSEL_COLLECTION: LocalScriptDefinition[] = [
  {
    id: "anonymous-dishonesty",
    title: "Anonymous Dishonesty",
    character: "ojo",
    getScript: {
      en: () => import("./Anonymous Dishonesty.json").then((m) => m.default),
    },
  },
  {
    id: "contempt",
    title: "Contempt",
    character: "vizier",
    getScript: { en: () => import("./Contempt.json").then((m) => m.default) },
  },
  {
    id: "devout-theists",
    title: "Devout Theists",
    character: "highpriestess",
    getScript: {
      en: () => import("./Devout Theists.json").then((m) => m.default),
    },
  },
  {
    id: "harold-holts-revenge",
    title: "Harold Holt’s Revenge",
    character: "goblin",
    getScript: {
      en: () => import("./Harold Holt's Revenge.json").then((m) => m.default),
    },
  },
  {
    id: "insanity-intuition",
    title: "Insanity & Intuition",
    character: "harpy",
    getScript: {
      en: () => import("./Insanity and Intuition.json").then((m) => m.default),
    },
  },
  {
    id: "irrational-behaviour",
    title: "Irrational Behaviour",
    character: "wizard",
    getScript: {
      en: () => import("./Irrational Behaviour.json").then((m) => m.default),
    },
  },
  {
    id: "midnight-oasis",
    title: "The Midnight Oasis",
    character: "alhadikhia",
    getScript: {
      en: () => import("./The Midnight Oasis.json").then((m) => m.default),
    },
  },
  {
    id: "monkey-do-math",
    title: "Monkey Do Math",
    character: "organgrinder",
    getScript: {
      en: () => import("./Monkey Do Math.json").then((m) => m.default),
    },
  },
  {
    id: "the-ones-you-least-expect",
    title: "The Ones You Least Expect",
    character: "summoner",
    getScript: {
      en: () =>
        import("./The Ones You Least Expect.json").then((m) => m.default),
    },
  },
  {
    id: "punchy",
    title: "Punchy",
    character: "princess",
    getScript: {
      en: () => import("./Punchy v3.8 copy.json").then((m) => m.default),
    },
  },
  {
    id: "quick-maths",
    title: "Quick Maths",
    character: "riot",
    getScript: {
      en: () => import("./Quick Maths.json").then((m) => m.default),
    },
  },
  {
    id: "martian-vampires",
    title: "Revenge of the Martian Vampires",
    character: "heretic",
    getScript: {
      en: () =>
        import("./Revenge of the Martian Vampires.json").then((m) => m.default),
    },
  },
  {
    id: "whose-cult",
    title: "Whose Cult Is It Anyway?",
    character: "cultleader",
    getScript: {
      en: () => import("./Whose Cult Is It Anyway.json").then((m) => m.default),
    },
  },
];

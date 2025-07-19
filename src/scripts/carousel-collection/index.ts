import type { HostedScriptDefinition } from "../../types/botc";

export const CAROUSEL_COLLECTION: HostedScriptDefinition[] = [
  {
    id: "anonymous-dishonesty",
    title: "Anonymous Dishonesty",
    character: "ojo",
    getScript: () =>
      import(
        "../../scripts/carousel-collection/Anonymous Dishonesty.json"
      ).then((m) => m.default),
  },
  {
    id: "contempt",
    title: "Contempt",
    character: "vizier",
    getScript: () =>
      import("../../scripts/carousel-collection/Contempt.json").then(
        (m) => m.default,
      ),
  },
  {
    id: "devout-theists",
    title: "Devout Theists",
    character: "highpriestess",
    getScript: () =>
      import("../../scripts/carousel-collection/Devout Theists.json").then(
        (m) => m.default,
      ),
  },
  {
    id: "harold-holts-revenge",
    title: "Harold Holt’s Revenge",
    character: "goblin",
    getScript: () =>
      import(
        "../../scripts/carousel-collection/Harold Holt's Revenge.json"
      ).then((m) => m.default),
  },
  {
    id: "insanity-intuition",
    title: "Insanity & Intuition",
    character: "harpy",
    getScript: () =>
      import(
        "../../scripts/carousel-collection/Insanity and Intuition.json"
      ).then((m) => m.default),
  },
  {
    id: "irrational-behaviour",
    title: "Irrational Behaviour",
    character: "wizard",
    getScript: () =>
      import(
        "../../scripts/carousel-collection/Irrational Behaviour.json"
      ).then((m) => m.default),
  },
  {
    id: "midnight-oasis",
    title: "The Midnight Oasis",
    character: "alhadikhia",
    getScript: () =>
      import("../../scripts/carousel-collection/The Midnight Oasis.json").then(
        (m) => m.default,
      ),
  },
  {
    id: "monkey-do-math",
    title: "Monkey Do Math",
    character: "organgrinder",
    getScript: () =>
      import("../../scripts/carousel-collection/Monkey Do Math.json").then(
        (m) => m.default,
      ),
  },
  {
    id: "the-ones-you-least-expect",
    title: "The Ones You Least Expect",
    character: "summoner",
    getScript: () =>
      import(
        "../../scripts/carousel-collection/The Ones You Least Expect.json"
      ).then((m) => m.default),
  },
  {
    id: "punchy",
    title: "Punchy",
    character: "princess",
    getScript: () =>
      import("../../scripts/carousel-collection/Punchy v3.8 copy.json").then(
        (m) => m.default,
      ),
  },
  {
    id: "quick-maths",
    title: "Quick Maths",
    character: "riot",
    getScript: () =>
      import("../../scripts/carousel-collection/Quick Maths.json").then(
        (m) => m.default,
      ),
  },
  {
    id: "martian-vampires",
    title: "Revenge of the Martian Vampires",
    character: "heretic",
    getScript: () =>
      import(
        "../../scripts/carousel-collection/Revenge of the Martian Vampires.json"
      ).then((m) => m.default),
  },
  {
    id: "whose-cult",
    title: "Whose Cult Is It Anyway?",
    character: "cultleader",
    getScript: () =>
      import(
        "../../scripts/carousel-collection/Whose Cult Is It Anyway.json"
      ).then((m) => m.default),
  },
];

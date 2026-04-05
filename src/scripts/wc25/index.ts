import type { LocalScriptDefinition } from "../../types/botc";

export const WORLD_CUP_25: LocalScriptDefinition[] = [
  {
    id: "1daymore",
    title: "1 Day More",
    character: "nightwatchman",
    getScript: { en: () => import("./1daymore.json").then((m) => m.default) },
  },
  {
    id: "beautifulhouse",
    title: "This Is Not My Beautiful House",
    character: "amnesiac",
    getScript: {
      en: () => import("./beautifulhouse.json").then((m) => m.default),
    },
  },
  {
    id: "binarysupernovae",
    title: "Binary Supernovae",
    character: "summoner",
    getScript: {
      en: () => import("./binarysupernovae.json").then((m) => m.default),
    },
  },
  {
    id: "buyersremorse",
    title: "Buyer's Remorse",
    character: "noble",
    getScript: {
      en: () => import("./buyersremorse.json").then((m) => m.default),
    },
  },
  {
    id: "deadcouncil",
    title: "Council of the Dead",
    character: "oracle",
    getScript: {
      en: () => import("./deadcouncil.json").then((m) => m.default),
    },
  },
  {
    id: "deadpeople",
    title: "I see dead people",
    character: "sage",
    getScript: { en: () => import("./deadpeople.json").then((m) => m.default) },
  },
  {
    id: "djinnsbargain",
    title: "The Djinn's Bargain",
    character: "djinn",
    getScript: {
      en: () => import("./djinnsbargain.json").then((m) => m.default),
    },
  },
  {
    id: "offwizard",
    title: "Off to see the Wizard",
    character: "wizard",
    getScript: { en: () => import("./offwizard.json").then((m) => m.default) },
  },
  {
    id: "phantomdetectives",
    title: "The Phantom Detectives",
    character: "banshee",
    getScript: {
      en: () => import("./phantomdetectives.json").then((m) => m.default),
    },
  },
  {
    id: "riverstyx",
    title: "The River Styx",
    character: "ferryman",
    getScript: { en: () => import("./riverstyx.json").then((m) => m.default) },
  },
  {
    id: "seat7",
    title: "The Ballad of Seat 7",
    character: "scarletwoman",
    getScript: { en: () => import("./seat7.json").then((m) => m.default) },
  },
  {
    id: "stowedaway",
    title: "Stowed Away",
    character: "apprentice",
    getScript: { en: () => import("./stowedaway.json").then((m) => m.default) },
  },
  {
    id: "trainedkiller",
    title: "Trained Killer",
    character: "lilmonsta",
    getScript: {
      en: () => import("./trainedkiller.json").then((m) => m.default),
    },
  },
  {
    id: "warrens",
    title: "The Warrens",
    character: "undertaker",
    getScript: { en: () => import("./warrens.json").then((m) => m.default) },
  },
  {
    id: "witchhunt",
    title: "Witch Hunt",
    character: "witch",
    getScript: { en: () => import("./witchhunt.json").then((m) => m.default) },
  },
  {
    id: "wonders",
    title: "show me wonders",
    character: "alhadikhia",
    getScript: { en: () => import("./wonders.json").then((m) => m.default) },
  },
];

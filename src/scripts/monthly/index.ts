import type { LocalScriptDefinition } from "../../types/botc";

const ALL_MONTHLY_SCRIPTS: (LocalScriptDefinition & { date: Date })[] = [
  {
    date: new Date("2026-01-01T00:00:00.000Z"),
    id: "2026-01",
    title: "January 2026",
    character: "drunk",
    getScript: {
      en: () => import("./2026-01.json").then((m) => m.default),
      fr: () => import("./2026-01.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-02-01T00:00:00.000Z"),
    id: "2026-02",
    title: "February 2026",
    character: "goblin",
    getScript: {
      en: () => import("./2026-02.json").then((m) => m.default),
      fr: () => import("./2026-02.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-03-01T00:00:00.000Z"),
    id: "2026-03",
    title: "March 2026",
    character: "ogre",
    getScript: {
      en: () => import("./2026-03.json").then((m) => m.default),
      fr: () => import("./2026-03.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-04-01T00:00:00.000Z"),
    id: "2026-04",
    title: "April 2026",
    character: "clockmaker",
    getScript: {
      en: () => import("./2026-04.json").then((m) => m.default),
      fr: () => import("./2026-04.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-05-01T00:00:00.000Z"),
    id: "2026-05",
    title: "May 2026",
    character: "hatter",
    getScript: {
      en: () => import("./2026-05.json").then((m) => m.default),
      fr: () => import("./2026-05.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-06-01T00:00:00.000Z"),
    id: "2026-06",
    title: "June 2026",
    character: "savant",
    getScript: {
      en: () => import("./2026-06.json").then((m) => m.default),
      fr: () => import("./2026-06.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-07-01T00:00:00.000Z"),
    id: "2026-07",
    title: "July 2026",
    character: "scarletwoman",
    getScript: {
      en: () => import("./2026-07.json").then((m) => m.default),
      fr: () => import("./2026-07.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-08-01T00:00:00.000Z"),
    id: "2026-08",
    title: "August 2026",
    character: "marionette",
    getScript: {
      en: () => import("./2026-08.json").then((m) => m.default),
      fr: () => import("./2026-08.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-09-01T00:00:00.000Z"),
    id: "2026-09",
    title: "September 2026",
    character: "legion",
    getScript: {
      en: () => import("./2026-09.json").then((m) => m.default),
      fr: () => import("./2026-09.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-10-01T00:00:00.000Z"),
    id: "2026-10",
    title: "October 2026",
    character: "kazali",
    getScript: {
      en: () => import("./2026-10.json").then((m) => m.default),
      fr: () => import("./2026-10.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-11-01T00:00:00.000Z"),
    id: "2026-11",
    title: "November 2026",
    character: "mayor",
    getScript: {
      en: () => import("./2026-11.json").then((m) => m.default),
      fr: () => import("./2026-11.json").then((m) => m.default),
    },
  },
  {
    date: new Date("2026-12-01T00:00:00.000Z"),
    id: "2026-12",
    title: "December 2026",
    character: "magician",
    getScript: {
      en: () => import("./2026-12.json").then((m) => m.default),
      fr: () => import("./2026-12.json").then((m) => m.default),
    },
  },
];

export const MONTHLY_SCRIPTS = ALL_MONTHLY_SCRIPTS.filter(
  (script) => script.date.getTime() <= Date.now(),
);

import type { LocalScriptDefinition } from "../../types/botc";

const ALL_MONTHLY_SCRIPTS: (LocalScriptDefinition & { date: Date })[] = [
  {
    date: new Date("2026-01-01T00:00:00.000Z"),
    id: "2026-01",
    title: "Jan 2026",
    character: "drunk",
    getScript: () => import("./2026-01.json").then((m) => m.default),
  },
  {
    date: new Date("2026-02-01T00:00:00.000Z"),
    id: "2026-02",
    title: "Feb 2026",
    character: "goblin",
    getScript: () => import("./2026-02.json").then((m) => m.default),
  },
  {
    date: new Date("2026-03-01T00:00:00.000Z"),
    id: "2026-03",
    title: "Mar 2026",
    character: "ogre",
    getScript: () => import("./2026-03.json").then((m) => m.default),
  },
  {
    date: new Date("2026-04-01T00:00:00.000Z"),
    id: "2026-04",
    title: "Apr 2026",
    character: "clockmaker",
    getScript: () => import("./2026-04.json").then((m) => m.default),
  },
  {
    date: new Date("2026-05-01T00:00:00.000Z"),
    id: "2026-05",
    title: "May 2026",
    character: "hatter",
    getScript: () => import("./2026-05.json").then((m) => m.default),
  },
  {
    date: new Date("2026-06-01T00:00:00.000Z"),
    id: "2026-06",
    title: "Jun 2026",
    character: "savant",
    getScript: () => import("./2026-06.json").then((m) => m.default),
  },
  {
    date: new Date("2026-07-01T00:00:00.000Z"),
    id: "2026-07",
    title: "Jul 2026",
    character: "scarletwoman",
    getScript: () => import("./2026-07.json").then((m) => m.default),
  },
  {
    date: new Date("2026-08-01T00:00:00.000Z"),
    id: "2026-08",
    title: "Aug 2026",
    character: "marionette",
    getScript: () => import("./2026-08.json").then((m) => m.default),
  },
  {
    date: new Date("2026-09-01T00:00:00.000Z"),
    id: "2026-09",
    title: "Sep 2026",
    character: "legion",
    getScript: () => import("./2026-09.json").then((m) => m.default),
  },
  {
    date: new Date("2026-10-01T00:00:00.000Z"),
    id: "2026-10",
    title: "Oct 2026",
    character: "kazali",
    getScript: () => import("./2026-10.json").then((m) => m.default),
  },
  {
    date: new Date("2026-11-01T00:00:00.000Z"),
    id: "2026-11",
    title: "Nov 2026",
    character: "mayor",
    getScript: () => import("./2026-11.json").then((m) => m.default),
  },
  {
    date: new Date("2026-12-01T00:00:00.000Z"),
    id: "2026-12",
    title: "Dec 2026",
    character: "magician",
    getScript: () => import("./2026-12.json").then((m) => m.default),
  },
];

export const MONTHLY_SCRIPTS = ALL_MONTHLY_SCRIPTS.filter(
  (script) => script.date.getDate() <= Date.now(),
);

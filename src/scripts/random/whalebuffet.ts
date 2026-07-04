import data from "../../data/data.json";
import type {
  BloodOnTheClocktowerCustomScript,
  ScriptCharacter,
} from "../../generated/script-schema";

function shouldAllowCharacter(character: ScriptCharacter): boolean {
  switch (character.team) {
    case "townsfolk":
    case "outsider":
    case "minion":
    case "demon":
      break;
    case "traveller":
      switch (character.id) {
        case "bureaucrat":
        case "thief":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }

  switch (character.id) {
    case "atheist":
    case "engineer":
    case "pithag":
      return false;
  }

  return true;
}

const characters = data.roles.filter((character) =>
  shouldAllowCharacter(character as never),
);

export default [
  {
    id: "_meta",
    name: "Whalebuffet",
    author: "",
    bootlegger: [
      "On the 1st night, all players choose a character (of their assigned character type) to become",
      "The Storyteller may offer you the chance to reconsider if they think your choice will be unfun for you or others. Evil learns which character(s) this happened for.",
      "The Atheist, Engineer & Pit-Hag are banned. The Drunk, Lunatic and Marionette cannot be chosen.",
      "Only a Demon may choose to become the Summoner. If so, the summoned player chooses which Demon they become.",
      "If there is more than 1 of the same character, 1 or more of the extras might be drunk.",
      "The only character with a setup effect that applies is the Bounty Hunter",
    ],
  },
  {
    id: "choose_your_own_tf",
    name: "Choose a Townsfolk",
    team: "townsfolk",
    ability: "On the 1st night, choose a Townsfolk character to become.",
    special: [
      {
        name: "bag-duplicate",
        type: "selection",
      },
      {
        type: "signal",
        name: "card",
        value: "Reconsider?",
      },
    ],
    remindersGlobal: ["Drunk", "Drunk", "Drunk"],
    firstNight: 1,
    firstNightReminder: "The Townsfolk player chooses a character.",
  },
  {
    id: "choose_your_own_out",
    name: "Choose an Outsider",
    team: "outsider",
    ability: "On the 1st night, choose an Outsider character to become.",
    special: [
      {
        name: "bag-duplicate",
        type: "selection",
      },
      {
        type: "signal",
        name: "card",
        value: "Reconsider?",
      },
    ],
    remindersGlobal: ["Drunk", "Drunk", "Drunk"],
    firstNight: 1,
    firstNightReminder: "The Outsider player chooses a character.",
  },
  {
    id: "choose_your_own_min",
    name: "Choose a Minion",
    team: "minion",
    ability: "On the 1st night, choose a Minion character to become.",
    special: [
      {
        name: "bag-duplicate",
        type: "selection",
      },
      {
        type: "signal",
        name: "card",
        value: "Reconsider?",
      },
    ],
    remindersGlobal: ["Drunk", "Drunk", "Drunk"],
    firstNight: 1,
    firstNightReminder: "The Minion player chooses a character.",
  },
  {
    id: "choose_your_own_dem",
    name: "Choose a Demon",
    team: "demon",
    ability: "On the 1st night, choose a Demon character to become.",
    special: [
      {
        name: "bag-duplicate",
        type: "selection",
      },
      {
        type: "signal",
        name: "card",
        value: "Reconsider?",
      },
    ],
    remindersGlobal: ["Drunk", "Drunk", "Drunk"],
    firstNight: 1,
    firstNightReminder: "The Demon player chooses a character.",
  },
  {
    id: "choose_your_own_trv",
    name: "Choose a Traveller",
    team: "traveller",
    ability: "On the 1st night, choose a Traveller character to become.",
    special: [
      {
        name: "bag-duplicate",
        type: "selection",
      },
      {
        type: "signal",
        name: "card",
        value: "Reconsider?",
      },
    ],
    remindersGlobal: ["Drunk", "Drunk", "Drunk"],
    firstNight: 1,
    firstNightReminder: "The Traveller player chooses a character.",
  },
  ...characters,
] as BloodOnTheClocktowerCustomScript;

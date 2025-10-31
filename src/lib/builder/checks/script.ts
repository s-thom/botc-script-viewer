import type { ScriptCharacter } from "../../../generated/script-schema";
import { normaliseCharacterId } from "../characters";
import type { Check } from "./types";
import {
  getAllRegularCharacters,
  hasCharacters,
  shouldEnableMostChecks,
  withCondition,
} from "./util";

const checks: Check[] = [
  function numEvilTurn(state) {
    const allRegular = getAllRegularCharacters(state);
    const extraEvils = allRegular.filter(({ meta }) => {
      return meta.causesExtraEvil;
    }, 0);

    return extraEvils.length > 1 && !hasCharacters(state, "spiritofivory")
      ? {
          id: "abilities/extra-evil",
          level: "warning",
          description: `There are multiple ways for players to be turned evil: ${extraEvils.map(({ character }) => character.name).join(", ")}`,
          remarks: [
            "Having multiple evil-turned players can result in an unbeatable voting majority for evil.",
            "The Spirit of Ivory fabled prevents more than one extra player from being evil at a time.",
          ],
          actions: [{ type: "add-character", id: "spiritofivory" }],
        }
      : [];
  },
  function bluffDeaths(state) {
    const allRegular = getAllRegularCharacters(state);
    const { good, evil } = allRegular.reduce<{
      good: ScriptCharacter[];
      evil: ScriptCharacter[];
    }>(
      (acc, { character, meta }) => {
        if (meta.causesExtraNightDeaths) {
          switch (character.team) {
            case "townsfolk":
            case "outsider":
              acc.good.push(character);
              break;
            case "minion":
            case "demon":
              acc.evil.push(character);
              break;
          }
        }

        return acc;
      },
      { good: [], evil: [] },
    );

    if (evil.length > 0 && good.length === 0) {
      return {
        id: "abilities/extra-deaths",
        level: "warning",
        description: `There are evil characters that cause additional deaths at night, but no good characters: ${evil.map((character) => character.name).join(", ")}`,
        remarks: [
          "Only having one source of extra deaths can confirm that ability is in play.",
          "Adding good characters that cause extra deaths can give evil characters alibis that help obfuscate information.",
        ],
      };
    }
    if (good.length > 0 && evil.length === 0) {
      return {
        id: "abilities/extra-deaths",
        level: "warning",
        description: `There are good characters that cause additional deaths at night, but no evil characters: ${good.map((character) => character.name).join(", ")}`,
        remarks: [
          "Only having one source of extra deaths can confirm that ability is in play.",
          "Adding evil characters that cause extra deaths can help the evil team make good players look suspicious.",
        ],
      };
    }

    return [];
  },
  function bluffResurrection(state) {
    const allRegular = getAllRegularCharacters(state);
    const { good, evil } = allRegular.reduce<{
      good: ScriptCharacter[];
      evil: ScriptCharacter[];
    }>(
      (acc, { character, meta }) => {
        if (meta.causesResurrection) {
          switch (character.team) {
            case "townsfolk":
            case "outsider":
              acc.good.push(character);
              break;
            case "minion":
            case "demon":
              acc.evil.push(character);
              break;
          }
        }

        return acc;
      },
      { good: [], evil: [] },
    );

    if (evil.length > 0 && good.length === 0) {
      return {
        id: "abilities/resurrection",
        level: "warning",
        description: `There are evil characters that cause resurrections, but no good characters: ${evil.map((character) => character.name).join(", ")}`,
        remarks: [
          "Only having one source of resurrections can confirm that ability is in play.",
          "Adding good characters that cause resurrections can give evil characters alibis that help obfuscate information.",
        ],
      };
    }
    if (good.length > 0 && evil.length === 0) {
      return {
        id: "abilities/resurrection",
        level: "warning",
        description: `There are good characters that cause resurrections, but no evil characters that could have caused them: ${good.map((character) => character.name).join(", ")}`,
        remarks: [
          "Only having one source of resurrections can confirm that ability is in play.",
          "Adding evil characters that cause resurrections can help the evil team make good players look suspicious.",
        ],
      };
    }

    return [];
  },
  function outsiderMod(state) {
    const allRegular = getAllRegularCharacters(state);
    const numOutsiderMod = allRegular.reduce(
      (sum, { meta }) => sum + (meta.outsiderModification ? 1 : 0),
      0,
    );

    if (numOutsiderMod === 0 && !hasCharacters(state, "sentinel")) {
      return {
        id: "abilities/outsider-mod",
        level: "warning",
        description:
          "There are no abilities that modify the number of outsiders",
        remarks: [
          "Having a known number of outsiders makes it harder for evil to bluff as outsiders.",
          "The Sentinel fabled allows the outsider count to be modified when building a game.",
        ],
        actions: [{ type: "add-character", id: "sentinel" }],
      };
    }

    return [];
  },
  function droisoning(state) {
    const allRegular = getAllRegularCharacters(state);
    const numDroisoning = allRegular.reduce(
      (sum, { meta }) => sum + (meta.causesDroison ? 1 : 0),
      0,
    );

    if (numDroisoning === 0 && !hasCharacters(state, "fibbin")) {
      return {
        id: "abilities/droison",
        level: "warning",
        description:
          "There are no abilities that cause drunkenness or poisoning",
        remarks: [
          "Misinformation is an important part of evil's ability to steer the game.",
          "The Fibbin fabled allows the storyteller to give misinformation once per game.",
        ],
        actions: [{ type: "add-character", id: "fibbin" }],
      };
    }

    return [];
  },
  function startsKnowing(state) {
    const allRegular = getAllRegularCharacters(state);
    const numStartKnowing = allRegular.reduce(
      (sum, { character, meta }) =>
        sum +
        (character.team === "townsfolk" && meta.actionType === "start-knowing"
          ? 1
          : 0),
      0,
    );

    if (numStartKnowing === 0) {
      return {
        id: "abilities/starts-knowing",
        level: "warning",
        description:
          "There are no townsfolk abilities that start knowing information.",
      };
    }

    return [];
  },
  function ongoing(state) {
    const allRegular = getAllRegularCharacters(state);
    const numStartKnowing = allRegular.reduce(
      (sum, { character, meta }) =>
        sum +
        (character.team === "townsfolk" &&
        (meta.actionType === "each-night-all" ||
          meta.actionType === "each-night-star")
          ? 1
          : 0),
      0,
    );

    if (numStartKnowing === 0 && !hasCharacters(state, "duchess")) {
      return {
        id: "abilities/ongoing",
        level: "warning",
        description:
          "There are no townsfolk abilities that learn information throughout the game",
        remarks: [
          "The Duchess fabled provides information each night to a small number of players that choose to receive it.",
        ],
        actions: [{ type: "add-character", id: "duchess" }],
      };
    }

    return [];
  },
  function numJinxes(state) {
    const allRegular = getAllRegularCharacters(state);

    let numJinxes = 0;
    for (const { character } of allRegular) {
      if (character.jinxes) {
        for (const jinx of character.jinxes) {
          if (hasCharacters(state, normaliseCharacterId(jinx.id))) {
            numJinxes++;
          }
        }
      }
    }

    if (numJinxes > 5) {
      return {
        id: "abilities/jinxes",
        level: "warning",
        description: `Script has ${numJinxes} jinxes`,
        remarks: [
          "Too many jinxes can lead to confusion around rules and interactions between characters on the script.",
        ],
      };
    }

    return [];
  },
];

export const SCRIPT_CHECKS: Check[] = withCondition(
  checks,
  shouldEnableMostChecks,
);

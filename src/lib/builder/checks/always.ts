import type { ScriptCharacter } from "../../../generated/script-schema";
import { CHARACTERS_BY_ID } from "../../characters";
import type { Check, CheckResult } from "./types";
import {
  getAllRegularCharacters,
  hasCharacters,
  isLikelyTeensySize,
} from "./util";

export const ALWAYS_CHECKS: Check[] = [
  function unknownCharacters(state) {
    if (state.unknownCharacters.length > 0) {
      return {
        id: "app/unknown",
        level: "error",
        description: `Imported script has official characters that this script builder does not know about: ${state.unknownCharacters.map((character) => character.id).join(", ")}`,
      };
    }

    return [];
  },
  function title(state) {
    return state.meta.name === "" && !state.meta.hideTitle
      ? {
          id: "meta/title",
          level: "info",
          description: "Script does not have a title",
          remarks: [
            "Giving the script a title is not required.",
            "A good title can give players and storytellers an idea of how the script is intended to play out.",
            'If you do not want the title to be shown in the official Blood on the Clocktower app, you can enable the "Hide title" option in the script options.',
          ],
        }
      : [];
  },
  function author(state) {
    return state.meta.author === "" && !state.meta.hideTitle
      ? {
          id: "meta/author",
          level: "info",
          description: "Script does not have an author",
          remarks: [
            "Adding your name to a script is not required.",
            "If you add your name to the script, storytellers can find other scripts you've made that have been uploaded to a script sharing website.",
            "All scripts are the intellectual property of The Pandemonium Institute. Adding your name to a script does not give you any ownership over it.",
          ],
        }
      : [];
  },
  function townsfolkCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numTownsfolk = state.characters.townsfolk.length;
    const baseTownsfolkCount = isTeensy ? 6 : 13;

    switch (numTownsfolk) {
      case 0:
        return {
          id: "teams/townsfolk",
          level: "error",
          description: "Script has no townsfolk",
        };
      case baseTownsfolkCount:
        return [];
      default:
        return {
          id: "teams/townsfolk",
          level: "warning",
          description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseTownsfolkCount} townsfolk`,
        };
    }
  },
  function outsiderCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numOutsiders = state.characters.outsider.length;
    const baseOutsiderCount = isTeensy ? 2 : 4;

    switch (numOutsiders) {
      case 0:
        return {
          id: "teams/outsider",
          level: "error",
          description: "Script has no outsiders",
        };
      case baseOutsiderCount:
        return [];
      default:
        return {
          id: "teams/outsider",
          level: "warning",
          description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseOutsiderCount} outsiders`,
        };
    }
  },
  function minionCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numMinions = state.characters.minion.length;
    const baseMinionCount = isTeensy ? 2 : 4;

    const extraMinionDemonCount =
      !isTeensy && state.characters.demon.length < 4;

    const extraMinionCharacters: ScriptCharacter[] = [];
    const allRegular = getAllRegularCharacters(state);
    for (const { character, meta } of allRegular) {
      if (meta.needsExtraMinion) {
        extraMinionCharacters.push(character);
      }
    }

    const shouldHaveExtraMinion =
      !isTeensy && (extraMinionCharacters.length > 0 || extraMinionDemonCount);

    const actualExpectedNumMinions =
      baseMinionCount + (shouldHaveExtraMinion ? 1 : 0);

    if (numMinions === 0) {
      return {
        id: "teams/minion",
        level: "error",
        description: "Script has no minions",
      };
    }

    if (numMinions === actualExpectedNumMinions) {
      return [];
    }

    if (shouldHaveExtraMinion) {
      const remarks = extraMinionCharacters.map((character) => {
        switch (character.id) {
          case "alchemist":
            return "The Alchemist puts an extra minion ability into play, so adding another minion type provides ambiguity as to which minions are in play.";
          case "lilmonsta":
            return "Lil' Monsta puts an extra minion ability into play, so adding another minion type provides ambiguity as to which minions are in play.";
          case "lordoftyphon":
            return "The Lord of Typhon puts an extra minion ability into play, so adding another minion type provides ambiguity as to which minions are in play.";
          default:
            return `${character.name} has indicated that an extra minion might be helpful.`;
        }
      });

      if (extraMinionDemonCount) {
        remarks.push(
          "Scripts with fewer demons might benefit from having an extra minion type.",
        );
      }

      return {
        id: "teams/minion",
        level: numMinions === baseMinionCount ? "info" : "warning", // Downgrade to info if at base number
        description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseMinionCount} minions, but an extra minion might help the evil team`,
        remarks,
      };
    }

    return {
      id: "teams/minion",
      level: "warning",
      description: `A ${isTeensy ? "teensy " : ""}script usually has ${baseMinionCount} minions`,
    };
  },
  function demonCount(state) {
    const isTeensy = isLikelyTeensySize(state);
    const numDemons = state.characters.demon.length;
    const baseDemonCount = isTeensy ? 2 : 4;

    if (numDemons === 0) {
      return {
        id: "teams/demon",
        level: "error",
        description: "Script has no demons",
      };
    }

    if (numDemons > baseDemonCount) {
      return {
        id: "teams/demon",
        level: "warning",
        description: `A ${isTeensy ? "teensy " : ""}script usually has ${isTeensy ? "1 to 2 " : "up to 4"} demons`,
      };
    }

    return [];
  },
  function characterNeeds(state) {
    const results: CheckResult[] = [];

    const allRegular = getAllRegularCharacters(state);
    for (const { character, meta } of allRegular) {
      if (meta.requiresCharacters) {
        for (const requiredCharacterId of meta.requiresCharacters) {
          if (hasCharacters(state, requiredCharacterId)) {
            continue;
          }

          const requiredCharacterData =
            CHARACTERS_BY_ID.get(requiredCharacterId);

          results.push({
            id: `abilities/needs:${character.id}+${requiredCharacterId}`,
            level: "error",
            description: `The ${character.name} needs ${requiredCharacterData ? requiredCharacterData.name : `"${requiredCharacterId}"`} to also be on the script`,
            actions: requiredCharacterData
              ? [{ type: "add-character", id: requiredCharacterData.id }]
              : undefined,
          });
        }
      }
    }

    return results;
  },
];

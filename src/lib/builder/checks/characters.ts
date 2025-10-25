import type { Check } from "./types";
import {
  getCharacter,
  hasCharacters,
  shouldEnableMostChecks,
  withCondition,
} from "./util";

const BOFFIN_DAMSEL_LEARNING = ["dreamer"];
const BOFFIN_DAMSEL_STORYTELLER = ["librarian", "grandmother"];

const checks: Check[] = [
  ...BOFFIN_DAMSEL_LEARNING.map<Check>(
    (id) =>
      function unfortunateBoffinDamsel(state) {
        if (
          hasCharacters(state, "boffin", "damsel", id) &&
          !hasCharacters(state, "heretic")
        ) {
          const character = getCharacter(state, id);
          if (!character) {
            console.warn(
              `Unable to get data for character ${id} even though it should exist`,
            );
            return [];
          }

          return {
            id: `unfortunate/boffin+damsel+${id}`,
            level: "warning",
            description: `A demon that has the ${character.character.name} ability from the boffin might learn the damsel`,
            remarks: [
              "The Damsel is a social character that forces the good team to hide information from itself.",
              "The evil team learning the Damsel through mechanical information undermines the Damsel and can lead to unsatisfying game conclusions.",
              "Interactions between the Damsel and a single other character type have jinxes, but this interaction involves more characters.",
              "If the script also has a Heretic, then this interaction is less dangerous as the evil team might lose by guessing the Damsel. However, adding the Heretic might cause other problems in your script.",
            ],
          };
        }

        return [];
      },
  ),
  ...BOFFIN_DAMSEL_STORYTELLER.map<Check>(
    (id) =>
      function unfortunateBoffinDamsel(state) {
        if (
          hasCharacters(state, "boffin", "damsel", id) &&
          !hasCharacters(state, "heretic")
        ) {
          const character = getCharacter(state, id);
          if (!character) {
            console.warn(
              `Unable to get data for character ${id} even though it should exist`,
            );
            return [];
          }

          return {
            id: `unfortunate/boffin+damsel+${id}`,
            level: "info",
            description: `A demon that has the ${character.character.name} ability from the boffin might learn the damsel`,
            remarks: [
              `As the information learned by the ${character.character.name} is chosen by the storyteller, this situation is unlikely to happen.`,
            ],
          };
        }

        return [];
      },
  ),
  function stormcatcherDamsel(state) {
    if (hasCharacters(state, "stormcatcher", "damsel")) {
      return {
        id: "unfortunate/stormcatcher+damsel",
        level: "info",
        description: "The Damsel must not be caught by the Storm Catcher",
        remarks: [
          "If the Damsel is caught, then the evil team immediately knows which player is the Damsel.",
        ],
      };
    }

    return [];
  },
  function hermitDrunkSaint(state) {
    if (hasCharacters(state, "hermit", "drunk", "saint")) {
      return {
        id: "unfortunate/hermit+drunk+saint",
        level: "warning",
        description:
          "A Hermit with the Drunk and Saint abilities might be executed without knowing their true role",
        remarks: [
          "This combination of abilities leads the town to be paranoid and cagey with executions.",
          "The good team does not win if they do not execute.",
        ],
      };
    }

    return [];
  },
  function publicMinionsTownCrier(state) {
    const publicMinions = ["psychopath", "vizier"]
      .filter((id) => hasCharacters(state, id))
      .map((id) => getCharacter(state, id)!);

    if (hasCharacters(state, "towncrier") && publicMinions.length > 0) {
      return {
        id: "unfortunate/outed-minions+towncrier",
        level: "warning",
        description: `Publicly-known minions can ruin town crier information: ${publicMinions.map(({ character }) => character.name).join(", ")}`,
      };
    }

    return [];
  },
];

export const CHARACTER_CHECKS: Check[] = withCondition(
  checks,
  shouldEnableMostChecks,
);

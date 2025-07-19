import type {
  BloodOnTheClocktowerCustomScript,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import type { NormalisedScript } from "../types/botc";
import { CHARACTERS_BY_ID } from "./characters";

function getNightOrderArrays(
  charactersById: Map<string, ScriptCharacter>,
  meta: ScriptMetadata,
) {
  let firstNight: NormalisedScript["firstNight"];
  let otherNight: NormalisedScript["otherNight"];
  const missingCharacters: ScriptCharacter[] = [];

  if (meta.firstNight) {
    firstNight = meta.firstNight.map((id) => {
      if (
        id === "dusk" ||
        id === "dawn" ||
        id === "minioninfo" ||
        id === "demoninfo"
      ) {
        return {
          type: "special",
          name: id,
        };
      }

      if (!charactersById.has(id)) {
        // If the night order refers to a traveller not on the script, add it.
        if (CHARACTERS_BY_ID.has(id)) {
          const candidateCharacter = CHARACTERS_BY_ID.get(id)!;
          if (candidateCharacter.team === "traveller") {
            charactersById.set(id, candidateCharacter);
            missingCharacters.push(candidateCharacter);
          } else {
            throw new Error(
              `Script's night order has a character with id ${id}, but this is not a traveller`,
            );
          }
        } else {
          throw new Error(`Script doesn't have a character with id ${id}`);
        }
      }

      const character = charactersById.get(id)!;
      return {
        type: "character",
        character,
        reminderText: character.firstNightReminder,
      };
    });
  } else {
    firstNight = Array.from(charactersById.values())
      .map((character) => ({ character, index: character.firstNight ?? 0 }))
      .filter((item) => item.index > 0)
      .sort((a, b) => a.index - b.index)
      .map((item) => ({
        type: "character",
        character: item.character,
        reminderText: item.character.firstNightReminder,
      }));
  }

  if (meta.otherNight) {
    otherNight = meta.otherNight.map((id) => {
      if (
        id === "dusk" ||
        id === "dawn" ||
        id === "minioninfo" ||
        id === "demoninfo"
      ) {
        return {
          type: "special",
          name: id,
        };
      }
      if (!charactersById.has(id)) {
        // If the night order refers to a traveller not on the script, add it.
        if (CHARACTERS_BY_ID.has(id)) {
          const candidateCharacter = CHARACTERS_BY_ID.get(id)!;
          if (candidateCharacter.team === "traveller") {
            charactersById.set(id, candidateCharacter);
            missingCharacters.push(candidateCharacter);
          } else {
            throw new Error(
              `Script's night order has a character with id ${id}, but this is not a traveller`,
            );
          }
        } else {
          throw new Error(`Script doesn't have a character with id ${id}`);
        }
      }

      const character = charactersById.get(id)!;
      return {
        type: "character",
        character,
        reminderText: character.otherNightReminder,
      };
    });
  } else {
    otherNight = Array.from(charactersById.values())
      .map((character) => ({ character, index: character.otherNight ?? 0 }))
      .filter((item) => item.index > 0)
      .sort((a, b) => a.index - b.index)
      .map((item) => ({
        type: "character",
        character: item.character,
        reminderText: item.character.otherNightReminder,
      }));
  }

  return { firstNight, otherNight, missingCharacters };
}

function normaliseCharacterId(id: string): string {
  return id.replace(/_/g, "");
}

export function normaliseScript(
  script: BloodOnTheClocktowerCustomScript,
): NormalisedScript {
  let meta: ScriptMetadata | undefined;
  const newScript: NormalisedScript = {
    name: "",
    firstNight: [],
    otherNight: [],
    characters: [],
    charactersById: new Map(),
    teams: {
      townsfolk: [],
      outsider: [],
      minion: [],
      demon: [],
      traveller: [],
      fabled: [],
    },
    jinxes: [],
  };

  function addCharacter(character: ScriptCharacter) {
    newScript.characters.push(character);
    newScript.charactersById.set(character.id, character);
    newScript.teams[character.team].push(character);
  }

  // Collect characters
  for (const item of script) {
    if (typeof item === "string") {
      const normalisedId = normaliseCharacterId(item);

      const character = CHARACTERS_BY_ID.get(normalisedId);
      if (character === undefined) {
        throw new Error(
          `Unknown character literal: ${normalisedId}${item !== normalisedId ? `(mapped from ${item})` : ""}`,
        );
      }

      addCharacter(character);
      continue;
    }

    if (item.id === "_meta") {
      meta = item as ScriptMetadata;
      continue;
    }

    if (Object.keys(item).length === 1) {
      const normalisedId = normaliseCharacterId(item.id);

      const character = CHARACTERS_BY_ID.get(normalisedId);
      if (character === undefined) {
        throw new Error(
          `Unknown official character (deprecated) ${normalisedId}${item.id !== normalisedId ? `(mapped from ${item})` : ""}`,
        );
      }

      addCharacter(character);
      continue;
    }

    addCharacter(item as ScriptCharacter);
  }

  if (meta === undefined) {
    throw new Error("Metadata not found in script");
  }

  newScript.name = meta.name;
  newScript.author = meta.author;
  newScript.logo = meta.logo;
  newScript.almanac = meta.almanac;

  if (meta.bootlegger && meta.bootlegger.length) {
    newScript.bootlegger = meta.bootlegger;
    // Ensure bootlegger is in play if there are bootlegger rules
    if (!newScript.charactersById.has("bootlegger")) {
      addCharacter(CHARACTERS_BY_ID.get("bootlegger")!);
    }
  }

  const { firstNight, otherNight, missingCharacters } = getNightOrderArrays(
    newScript.charactersById,
    meta,
  );
  newScript.firstNight = firstNight;
  newScript.otherNight = otherNight;
  for (const missingCharacter of missingCharacters) {
    addCharacter(missingCharacter);
  }

  for (const character of newScript.characters) {
    if (character.jinxes) {
      for (const jinx of character.jinxes) {
        if (newScript.charactersById.has(jinx.id)) {
          newScript.jinxes.push({
            character1: character,
            character2: newScript.charactersById.get(jinx.id)!,
            reason: jinx.reason,
          });

          if (!newScript.charactersById.has("djinn")) {
            addCharacter(CHARACTERS_BY_ID.get("djinn")!);
          }
        }
      }
    }
  }

  return newScript;
}

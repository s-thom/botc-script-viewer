import data from "../data/data.json";
import type {
  BloodOnTheClocktowerCustomScript,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import type { NormalisedScript, SpecialNightInfo } from "../types/botc";
import { CHARACTERS_BY_ID } from "./characters";

const FIRST_NIGHT_LOOKUP = data.nightOrder.firstNight.reduce<
  Map<string, number>
>((map, id, index) => {
  map.set(id, index);
  return map;
}, new Map());
const OTHER_NIGHT_LOOKUP = data.nightOrder.otherNight.reduce<
  Map<string, number>
>((map, id, index) => {
  map.set(id, index);
  return map;
}, new Map());

function getSpecialNightInfo(id: string): SpecialNightInfo | null {
  switch (id) {
    case "dusk":
      return {
        type: "special",
        id,
        name: "Dusk",
        reminderText:
          "Check that all eyes are closed. Some Travellers, Fabled, & Loric act.",
      };
    case "dawn":
      return {
        type: "special",
        id,
        name: "Dawn",
        reminderText: "Wait a few seconds. Call for eyes open.",
      };
    case "minioninfo":
      return {
        type: "special",
        id,
        name: "Minion Info",
        reminderText:
          "If there are 7 or more players, wake all Minions: Show the *THIS IS THE DEMON* token. Point to the demon.",
      };
    case "demoninfo":
      return {
        type: "special",
        id,
        name: "Demon Info",
        reminderText:
          "If there are 7 or more players, wake the Demon: Show the *THESE ARE YOUR MINIONS* token. Point to all Minions. Show the *THESE CHARACTERS ARE NOT IN PLAY* token. Show 3 not-in-play good character tokens.",
      };
    default:
      return null;
  }
}

function getNightOrderArrays(
  charactersById: Map<string, ScriptCharacter>,
  meta: ScriptMetadata,
) {
  let firstNight: NormalisedScript["firstNight"];
  let otherNight: NormalisedScript["otherNight"];
  const missingCharacters: ScriptCharacter[] = [];
  const invalidCharacterIds = new Set<string>();

  const hasSpecialId = (arr: NormalisedScript["firstNight"], id: string) =>
    arr.some((item) => item.type === "special" && item.id === id);

  if (meta.firstNight) {
    firstNight = [];
    for (const id of meta.firstNight) {
      const special = getSpecialNightInfo(id);
      if (special) {
        firstNight.push(special);
        continue;
      }

      if (!charactersById.has(id)) {
        // If the night order refers to a traveller not on the script, add it.
        if (CHARACTERS_BY_ID.has(id)) {
          const candidateCharacter = CHARACTERS_BY_ID.get(id)!;
          if (candidateCharacter.team === "traveller") {
            charactersById.set(id, candidateCharacter);
            missingCharacters.push(candidateCharacter);
          } else {
            invalidCharacterIds.add(id);
            continue;
          }
        } else {
          invalidCharacterIds.add(id);
          continue;
        }
      }

      const character = charactersById.get(id)!;
      firstNight.push({
        type: "character",
        character,
        reminderText: character.firstNightReminder,
      });
    }
  } else {
    firstNight = Array.from(charactersById.values())
      .map((character) => ({
        character,
        index:
          character.firstNight ?? FIRST_NIGHT_LOOKUP.get(character.id) ?? 0,
      }))
      .filter((item) => item.index > 0)
      .sort((a, b) => a.index - b.index)
      .map((item) => ({
        type: "character",
        character: item.character,
        reminderText: item.character.firstNightReminder,
      }));
  }

  if (!hasSpecialId(firstNight, "dusk")) {
    firstNight.unshift(getSpecialNightInfo("dusk")!);
  }
  if (!hasSpecialId(firstNight, "minioninfo")) {
    const duskIndex = firstNight.findIndex(
      (item) => item.type === "special" && item.id === "dusk",
    );
    firstNight.splice(duskIndex + 1, 0, getSpecialNightInfo("minioninfo")!);
  }
  if (!hasSpecialId(firstNight, "demoninfo")) {
    const minionInfoIndex = firstNight.findIndex(
      (item) => item.type === "special" && item.id === "minioninfo",
    );
    firstNight.splice(
      minionInfoIndex + 1,
      0,
      getSpecialNightInfo("demoninfo")!,
    );
  }
  if (!hasSpecialId(firstNight, "dawn")) {
    firstNight.push(getSpecialNightInfo("dawn")!);
  }

  if (meta.otherNight) {
    otherNight = [];
    for (const id of meta.otherNight) {
      const special = getSpecialNightInfo(id);
      if (special) {
        otherNight.push(special);
        continue;
      }

      if (!charactersById.has(id)) {
        // If the night order refers to a traveller not on the script, add it.
        if (CHARACTERS_BY_ID.has(id)) {
          const candidateCharacter = CHARACTERS_BY_ID.get(id)!;
          if (candidateCharacter.team === "traveller") {
            charactersById.set(id, candidateCharacter);
            missingCharacters.push(candidateCharacter);
          } else {
            invalidCharacterIds.add(id);
            continue;
          }
        } else {
          invalidCharacterIds.add(id);
          continue;
        }
      }

      const character = charactersById.get(id)!;
      otherNight.push({
        type: "character",
        character,
        reminderText: character.otherNightReminder,
      });
    }
  } else {
    otherNight = Array.from(charactersById.values())
      .map((character) => ({
        character,
        index:
          character.otherNight ?? OTHER_NIGHT_LOOKUP.get(character.id) ?? 0,
      }))
      .filter((item) => item.index > 0)
      .sort((a, b) => a.index - b.index)
      .map((item) => ({
        type: "character",
        character: item.character,
        reminderText: item.character.otherNightReminder,
      }));
  }

  // Ensure other night has the required special markers
  if (!hasSpecialId(otherNight, "dusk")) {
    otherNight.unshift(getSpecialNightInfo("dusk")!);
  }
  if (!hasSpecialId(otherNight, "dawn")) {
    otherNight.push(getSpecialNightInfo("dawn")!);
  }

  return {
    firstNight,
    otherNight,
    missingCharacters,
    invalidCharacterIds: Array.from(invalidCharacterIds).sort(),
  };
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
      loric: [],
    },
    jinxes: [],
    warnings: [],
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

    // Custom character check
    const normalisedId = normaliseCharacterId(item.id);
    if (!CHARACTERS_BY_ID.has(normalisedId)) {
      // Ensure bootlegger is in play if there are custom characters
      if (!newScript.charactersById.has("bootlegger")) {
        addCharacter(CHARACTERS_BY_ID.get("bootlegger")!);
      }
    }
  }

  if (meta === undefined) {
    meta = { id: "_meta", name: "" };
  }

  newScript.name = meta.name;
  newScript.author = meta.author;
  newScript.hideTitle = meta.hideTitle;
  newScript.logo = meta.logo;
  newScript.background = meta.background;
  newScript.almanac = meta.almanac;

  if (meta.bootlegger && meta.bootlegger.length) {
    newScript.bootlegger = meta.bootlegger;
    // Ensure bootlegger is in play if there are bootlegger rules
    if (!newScript.charactersById.has("bootlegger")) {
      addCharacter(CHARACTERS_BY_ID.get("bootlegger")!);
    }
  }

  const { firstNight, otherNight, missingCharacters, invalidCharacterIds } =
    getNightOrderArrays(newScript.charactersById, meta);
  newScript.firstNight = firstNight;
  newScript.otherNight = otherNight;
  for (const missingCharacter of missingCharacters) {
    addCharacter(missingCharacter);
  }
  if (invalidCharacterIds.length > 0) {
    newScript.warnings.push({
      type: "extra-night-order-characters",
      characters: invalidCharacterIds,
    });
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

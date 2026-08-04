import type {
  BloodOnTheClocktowerCustomScript,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import { nightOrder } from "../lib/data";
import type {
  CharacterNightInfo,
  NormalisedScript,
  NormalisedScriptCharacter,
  NormalisedScriptFallbacks,
  SpecialNightInfo,
} from "../types/botc";
import { AppError } from "../types/site";
import { CHARACTERS_BY_ID, getTranslatedScriptCharacter } from "./characters";
import type { Translator } from "./i18n/types";
import { getInteractionsForCharacters } from "./interactions";
import { normaliseCharacterId } from "./number-store/characters";

const FIRST_NIGHT_LOOKUP = nightOrder.firstNight.reduce<Map<string, number>>(
  (map, id, index) => {
    map.set(id, index);
    return map;
  },
  new Map(),
);
const OTHER_NIGHT_LOOKUP = nightOrder.otherNight.reduce<Map<string, number>>(
  (map, id, index) => {
    map.set(id, index);
    return map;
  },
  new Map(),
);

function getSpecialNightInfo(
  t: Translator,
  id: string,
): SpecialNightInfo | null {
  switch (id) {
    case "dusk":
      return {
        type: "special",
        id,
        name: t.string("game.roles.dusk.name").value,
        reminderText: t.string("game.roles.dusk.first").value,
      };
    case "dawn":
      return {
        type: "special",
        id,
        name: t.string("game.roles.dawn.name").value,
        reminderText: t.string("game.roles.dawn.first").value,
      };
    case "minioninfo":
      return {
        type: "special",
        id,
        name: t.string("game.roles.minioninfo.name").value,
        reminderText: t.string("game.roles.minioninfo.first").value,
      };
    case "demoninfo":
      return {
        type: "special",
        id,
        name: t.string("game.roles.demoninfo.name").value,
        reminderText: t.string("game.roles.demoninfo.first").value,
      };
    default:
      return null;
  }
}

function getNightOrderArrays(
  t: Translator,
  charactersById: Map<string, NormalisedScriptCharacter>,
  meta: ScriptMetadata,
) {
  let firstNight: NormalisedScript["firstNight"];
  let otherNight: NormalisedScript["otherNight"];
  const missingCharacters: NormalisedScriptCharacter[] = [];
  const invalidCharacterIds = new Set<string>();

  const characters = Array.from(charactersById.values());

  function hasSpecialId(arr: NormalisedScript["firstNight"], id: string) {
    return arr.some((item) => item.type === "special" && item.id === id);
  }

  function insertSpecialAtPosition(
    arr: NormalisedScript["firstNight"],
    specialId: string,
    lookup: Map<string, number>,
    getCharacterOrder: (
      character: NormalisedScriptCharacter,
    ) => number | undefined,
  ) {
    const specialOrder = lookup.get(specialId) ?? 0;
    const insertIndex = arr.findIndex((item) => {
      if (item.type === "special") return false;
      const charOrder =
        getCharacterOrder(item.character) ?? lookup.get(item.character.id) ?? 0;
      return charOrder > specialOrder;
    });
    const position = insertIndex === -1 ? arr.length : insertIndex;
    arr.splice(position, 0, getSpecialNightInfo(t, specialId)!);
  }

  if (meta.firstNight) {
    firstNight = [];
    for (const id of meta.firstNight) {
      const special = getSpecialNightInfo(t, id);
      if (special) {
        firstNight.push(special);
        continue;
      }

      if (!charactersById.has(id)) {
        invalidCharacterIds.add(id);
        continue;
      }

      const character = charactersById.get(id)!;
      firstNight.push({
        type: "character",
        character,
        reminderText: character.firstNightReminder,
      });
    }
  } else {
    firstNight = characters
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
    firstNight.unshift(getSpecialNightInfo(t, "dusk")!);
  }
  if (!hasSpecialId(firstNight, "minioninfo")) {
    insertSpecialAtPosition(
      firstNight,
      "minioninfo",
      FIRST_NIGHT_LOOKUP,
      (character) => character.firstNight,
    );
  }
  if (!hasSpecialId(firstNight, "demoninfo")) {
    insertSpecialAtPosition(
      firstNight,
      "demoninfo",
      FIRST_NIGHT_LOOKUP,
      (character) => character.firstNight,
    );
  }
  if (!hasSpecialId(firstNight, "dawn")) {
    firstNight.push(getSpecialNightInfo(t, "dawn")!);
  }

  if (meta.otherNight) {
    otherNight = [];
    for (const id of meta.otherNight) {
      const special = getSpecialNightInfo(t, id);
      if (special) {
        otherNight.push(special);
        continue;
      }

      if (!charactersById.has(id)) {
        invalidCharacterIds.add(id);
        continue;
      }

      const character = charactersById.get(id)!;
      otherNight.push({
        type: "character",
        character,
        reminderText: character.otherNightReminder,
      });
    }
  } else {
    otherNight = characters
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
    otherNight.unshift(getSpecialNightInfo(t, "dusk")!);
  }
  if (!hasSpecialId(otherNight, "dawn")) {
    otherNight.push(getSpecialNightInfo(t, "dawn")!);
  }

  // Check to see whether the night order has been modified.
  // This only checks official characters, so if the script is heavily homebrewed then don't bother.
  // I've chosen a threshold of at least 3 official non-NPC/non-Traveller characters.
  // If I ever rewrite the night order logic, it'd be nice to properly compare the given night order to the official one
  // and do a diff, but this code is not set up to do that right now.
  let isFirstNightModified = false;
  let isOtherNightModified = false;
  if (
    (meta.firstNight || meta.otherNight) &&
    characters.filter(
      (character) =>
        !character.isHomebrew &&
        character.team !== "fabled" &&
        character.team !== "loric" &&
        character.team !== "traveller",
    ).length > 3
  ) {
    const officialFirstNightCharacters = firstNight.filter(
      (item): item is CharacterNightInfo =>
        item.type === "character" && !item.character.isHomebrew,
    );
    const officialOtherNightCharacters = otherNight.filter(
      (item): item is CharacterNightInfo =>
        item.type === "character" && !item.character.isHomebrew,
    );

    let currentFirstNightIndex = -1;
    for (const info of officialFirstNightCharacters) {
      const characterIndex = nightOrder.firstNight.indexOf(
        info.character.normalisedId,
      );
      if (characterIndex !== -1 && characterIndex < currentFirstNightIndex) {
        isFirstNightModified = true;
        break;
      }

      currentFirstNightIndex = characterIndex;
    }

    let currentOtherNightIndex = -1;
    for (const info of officialOtherNightCharacters) {
      const characterIndex = nightOrder.firstNight.indexOf(
        info.character.normalisedId,
      );
      if (characterIndex !== -1 && characterIndex < currentOtherNightIndex) {
        isOtherNightModified = true;
        break;
      }

      currentOtherNightIndex = characterIndex;
    }
  }

  return {
    firstNight,
    otherNight,
    missingCharacters,
    invalidCharacterIds: Array.from(invalidCharacterIds).sort(),
    isFirstNightModified,
    isOtherNightModified,
  };
}

export function normaliseScript(
  script: BloodOnTheClocktowerCustomScript,
  t: Translator,
): NormalisedScript {
  let meta: ScriptMetadata | undefined;
  const newScript: NormalisedScript = {
    name: "",
    firstNight: [],
    otherNight: [],
    hasModifiedNightOrder: false,
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
    interactions: [],
  };

  function addCharacter(character: NormalisedScriptCharacter) {
    if (newScript.charactersById.has(character.id)) {
      console.warn(
        `Trying to add character ${character.id}, but it has already been added.`,
      );
      return;
    }

    const translated = getTranslatedScriptCharacter(t, character);

    newScript.characters.push(translated);
    newScript.charactersById.set(translated.id, translated);
    newScript.teams[translated.team].push(translated);
  }

  // Collect characters
  for (const item of script) {
    if (typeof item === "string") {
      const normalisedId = normaliseCharacterId(item);

      const character = CHARACTERS_BY_ID.get(normalisedId);
      if (character === undefined) {
        throw new AppError(`Unknown character ${normalisedId}`, {
          status: 400,
          titleKey: "viewer.errors.unknownCharacter",
          descriptionKey: "viewer.errors.unknownCharacterDescription",
          descriptionParams: { id: item },
        });
      }

      addCharacter(character);
      continue;
    }

    if (item.id === "_meta") {
      meta = item as ScriptMetadata;
      continue;
    }

    const normalisedId = normaliseCharacterId(item.id);
    const character = CHARACTERS_BY_ID.get(normalisedId);
    if (character) {
      addCharacter(character);
      continue;
    }

    if (Object.keys(item).length === 1) {
      throw new AppError(`Unknown character ${normalisedId}`, {
        status: 400,
        titleKey: "viewer.errors.unknownCharacter",
        descriptionKey: "viewer.errors.unknownCharacterDescription",
        descriptionParams: { id: item.id },
      });
    }

    const newCharacter: NormalisedScriptCharacter = {
      ...(item as ScriptCharacter),
      normalisedId,
      isHomebrew: true,
    };

    addCharacter(newCharacter);

    // Ensure bootlegger is in play if there are custom characters
    if (!newScript.charactersById.has("bootlegger")) {
      addCharacter(CHARACTERS_BY_ID.get("bootlegger")!);
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

  // This website supports a non-standard `color` property to set the header colour.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newScript.color = (meta as any).color;

  if (meta.bootlegger && meta.bootlegger.length) {
    newScript.bootlegger = meta.bootlegger;
    // Ensure bootlegger is in play if there are bootlegger rules
    if (!newScript.charactersById.has("bootlegger")) {
      addCharacter(CHARACTERS_BY_ID.get("bootlegger")!);
    }
  }

  const {
    firstNight,
    otherNight,
    missingCharacters,
    invalidCharacterIds,
    isFirstNightModified,
    isOtherNightModified,
  } = getNightOrderArrays(t, newScript.charactersById, meta);
  newScript.firstNight = firstNight;
  newScript.otherNight = otherNight;
  newScript.hasModifiedNightOrder =
    isFirstNightModified || isOtherNightModified;
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

  newScript.interactions = getInteractionsForCharacters(newScript.characters);

  return newScript;
}

export function applyNormalisedScriptFallbacks(
  script: NormalisedScript,
  fallbacks: NormalisedScriptFallbacks,
) {
  if (!script.name && fallbacks.name !== undefined) {
    script.name = fallbacks.name;
  }
  if (!script.author && fallbacks.author !== undefined) {
    script.author = fallbacks.author;
  }
}

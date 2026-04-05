import data from "../data/data.json" with { type: "json" };
import type {
  OfficialCharacterDeprecated,
  OfficialCharacterID,
  ScriptCharacter,
  ScriptMetadata,
} from "../generated/script-schema";
import type { NormalisedScriptCharacter } from "../types/botc";
import type { Translator } from "./i18n/types";

export const CHARACTERS_BY_ID = data.roles.reduce<
  Map<string, NormalisedScriptCharacter>
>((map, character) => {
  map.set(character.id, {
    ...(character as ScriptCharacter),
    normalisedId: character.id.replace(/_/g, ""),
    isHomebrew: false,
  });
  return map;
}, new Map());

export function normaliseCharacterId(id: string): string {
  return id.toLowerCase().replace(/_/g, "");
}

export function getTranslatedScriptCharacter(
  t: Translator,
  character: NormalisedScriptCharacter,
) {
  const translatedCharacter: NormalisedScriptCharacter = {
    id: character.id,
    normalisedId: character.normalisedId,
    isHomebrew: character.isHomebrew,
    team: character.team,
    name: character.isHomebrew
      ? character.name
      : (t.resolve(`game.roles.${character.normalisedId}.name`).value ??
        character.name),
    ability: character.isHomebrew
      ? character.ability
      : (t.resolve(`game.roles.${character.normalisedId}.ability`).value ??
        character.ability),
    flavor: character.isHomebrew
      ? character.flavor
      : character.flavor
        ? (t.resolve(`game.roles.${character.normalisedId}.flavor`).value ??
          character.flavor)
        : undefined,
    firstNight: character.firstNight,
    firstNightReminder: character.isHomebrew
      ? character.firstNightReminder
      : character.firstNightReminder
        ? (t.resolve(`game.roles.${character.normalisedId}.first`).value ??
          character.firstNightReminder)
        : undefined,
    otherNight: character.otherNight,
    otherNightReminder: character.isHomebrew
      ? character.otherNightReminder
      : character.otherNightReminder
        ? (t.resolve(`game.roles.${character.normalisedId}.other`).value ??
          character.otherNightReminder)
        : undefined,
    image: character.image,
    edition: character.edition,
    setup: character.setup,
    special: character.special,
    reminders: character.reminders?.map((reminder) =>
      character.isHomebrew
        ? reminder
        : (t.resolve(
            `game.reminders.${reminder.toLowerCase().replace(/[^0-9a-z]/g, "")}`,
          ).value ?? reminder),
    ),
    remindersGlobal: character.remindersGlobal?.map((reminder) =>
      character.isHomebrew
        ? reminder
        : (t.resolve(
            `game.reminders.${reminder.toLowerCase().replace(/[^0-9a-z]/g, "")}`,
          ).value ?? reminder),
    ),
    jinxes: character.jinxes?.map((jinx) =>
      character.isHomebrew
        ? jinx
        : {
            id: jinx.id,
            reason:
              t.resolve(`game.jinxes.${character.id}-${jinx.id}`, true).value ??
              t.resolve(`game.jinxes.${jinx.id}-${character.id}`).value ??
              jinx.reason,
          },
    ),
  };

  return translatedCharacter;
}

export function getFullScriptCharacter(
  character:
    | ScriptCharacter
    | OfficialCharacterID
    | OfficialCharacterDeprecated,
): ScriptCharacter {
  if (typeof character === "object" && "team" in character) {
    return character;
  }

  const characterId = typeof character === "string" ? character : character.id;
  const officialCharacter = CHARACTERS_BY_ID.get(
    normaliseCharacterId(characterId),
  );

  if (officialCharacter) {
    return officialCharacter;
  }

  return {
    id: characterId,
    name: characterId,
    team: "<unknown>" as never,
    ability: `<unknown official character ${characterId}>`,
  };
}

export function getMinimalScriptCharacter(
  character: ScriptCharacter,
): ScriptCharacter | OfficialCharacterID {
  const officialCharacter = CHARACTERS_BY_ID.get(character.id);
  if (officialCharacter) {
    return officialCharacter.id;
  }

  return character;
}

export function isScriptMetadata(
  item:
    | ScriptCharacter
    | OfficialCharacterID
    | ScriptMetadata
    | OfficialCharacterDeprecated,
): item is ScriptMetadata {
  return typeof item === "object" && item.id === "_meta" && !("team" in item);
}

export function getEnforcedCharacters(state: {
  meta: ScriptMetadata;
  characters: Record<string, ScriptCharacter[]>;
}): Map<string, Set<string>> {
  const enforcedCharacters = new Map<string, Set<string>>();
  function addWithReason(id: string, reason: string) {
    if (!enforcedCharacters.has(id)) {
      enforcedCharacters.set(id, new Set());
    }
    enforcedCharacters.get(id)!.add(reason);
  }

  if (state.meta.bootlegger && state.meta.bootlegger.length > 0) {
    addWithReason("bootlegger", "Script contains custom rules");
  }

  const allCharactersMap = new Map<string, ScriptCharacter>();
  for (const characters of Object.values(state.characters)) {
    for (const character of characters) {
      allCharactersMap.set(character.id, character);
    }
  }

  for (const character of allCharactersMap.values()) {
    if (!CHARACTERS_BY_ID.has(character.id)) {
      addWithReason("bootlegger", "Script contains custom characters");
    }

    if (character.jinxes) {
      for (const jinx of character.jinxes) {
        if (allCharactersMap.has(normaliseCharacterId(jinx.id))) {
          addWithReason("djinn", "Script contains jinxes");
        }
      }
    }
  }

  return enforcedCharacters;
}

export function getAlmanacLink(character: ScriptCharacter): string | undefined {
  if (CHARACTERS_BY_ID.has(character.id)) {
    return `https://wiki.bloodontheclocktower.com/${encodeURIComponent(character.name)}`;
  }

  return undefined;
}

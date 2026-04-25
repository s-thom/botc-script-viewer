import data from "../data/data.json" with { type: "json" };
import type { ScriptCharacter } from "../generated/script-schema";
import type { NormalisedScriptCharacter } from "../types/botc";
import type { Translator } from "./i18n/types";
import { normaliseCharacterId } from "./number-store/characters";

export const CHARACTERS_BY_ID = data.roles.reduce<
  Map<string, NormalisedScriptCharacter>
>((map, character) => {
  map.set(character.id, {
    ...(character as ScriptCharacter),
    normalisedId: normaliseCharacterId(character.id),
    isHomebrew: false,
  });
  return map;
}, new Map());

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

export function getAlmanacLink(character: ScriptCharacter): string | undefined {
  if (CHARACTERS_BY_ID.has(character.id)) {
    return `https://wiki.bloodontheclocktower.com/${encodeURIComponent(character.name)}`;
  }

  return undefined;
}

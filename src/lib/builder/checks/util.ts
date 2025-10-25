import type { ScriptCharacter } from "../../../generated/script-schema";
import type { OfficialCharacterId } from "../../../generated/types";
import { CHARACTER_METADATA } from "../metadata/characters";
import type { CharacterMetadata } from "../metadata/types";
import type { GlobalState } from "../state/types";
import type { Check } from "./types";

interface CharacterCacheEntry {
  character: ScriptCharacter;
  meta: CharacterMetadata;
}

const regularCharactersCache = new WeakMap<
  GlobalState,
  CharacterCacheEntry[]
>();

const allCharactersCache = new WeakMap<GlobalState, CharacterCacheEntry[]>();
const allCharacterIdsCache = new WeakMap<GlobalState, Set<string>>();

function getCharacterMetadata(
  state: GlobalState,
  id: string,
): CharacterMetadata {
  return id in CHARACTER_METADATA
    ? CHARACTER_METADATA[id as OfficialCharacterId]
    : ({
        edition: "custom",
        actionType: "unknown",
      } satisfies CharacterMetadata);
}

export function getAllRegularCharacters(state: GlobalState) {
  if (!regularCharactersCache.has(state)) {
    regularCharactersCache.set(
      state,
      [
        ...state.characters.townsfolk,
        ...state.characters.outsider,
        ...state.characters.minion,
        ...state.characters.demon,
      ].map((character) => ({
        character,
        meta: getCharacterMetadata(state, character.id),
      })),
    );
  }
  return regularCharactersCache.get(state)!;
}

export function getAllCharacters(state: GlobalState) {
  if (!allCharactersCache.has(state)) {
    allCharactersCache.set(
      state,
      [
        ...state.characters.townsfolk,
        ...state.characters.outsider,
        ...state.characters.minion,
        ...state.characters.demon,
        ...state.characters.traveller,
        ...state.characters.fabled,
      ].map((character) => ({
        character,
        meta: getCharacterMetadata(state, character.id),
      })),
    );
  }
  return allCharactersCache.get(state)!;
}

export function hasCharacters(state: GlobalState, ...ids: string[]) {
  if (!allCharacterIdsCache.has(state)) {
    allCharacterIdsCache.set(
      state,
      new Set(
        [
          ...state.characters.townsfolk,
          ...state.characters.outsider,
          ...state.characters.minion,
          ...state.characters.demon,
          ...state.characters.traveller,
          ...state.characters.fabled,
        ].map((character) => character.id),
      ),
    );
  }

  const set = allCharacterIdsCache.get(state)!;

  return ids.every((id) => set.has(id));
}

export function getCharacter(state: GlobalState, id: string) {
  const allCharacters = getAllCharacters(state);
  return allCharacters.find((character) => character.character.id === id);
}

export function shouldEnableMostChecks(state: GlobalState) {
  const hasGood =
    state.characters.townsfolk.length > 0 ||
    state.characters.outsider.length > 0;
  const hasEvil =
    state.characters.minion.length > 0 || state.characters.demon.length > 0;
  return hasGood && hasEvil;
}

export function isLikelyTeensySize(state: GlobalState) {
  const size = getAllRegularCharacters(state).length;
  return (
    size <= 13 &&
    state.characters.townsfolk.length <= 8 &&
    state.characters.outsider.length <= 3 &&
    state.characters.minion.length <= 3 &&
    state.characters.demon.length <= 3
  );
}

export function withCondition(
  checks: Check[],
  predicate: (state: GlobalState) => boolean,
): Check[] {
  return checks.map(
    (check) =>
      function (state: GlobalState) {
        if (predicate(state)) {
          return check(state);
        }
        return [];
      },
  );
}

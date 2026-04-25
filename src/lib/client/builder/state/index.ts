import type {
  BloodOnTheClocktowerCustomScript,
  OfficialCharacterID,
  ScriptCharacter,
  ScriptMetadata,
} from "../../../../generated/script-schema";
import { CHARACTERS_BY_ID } from "../../../characters";
import { normaliseCharacterId } from "../../../number-store/characters";
import { type BuilderScriptSettingsLatest } from "./types";

export function getScriptFromScriptSettings(
  state: BuilderScriptSettingsLatest,
): BloodOnTheClocktowerCustomScript {
  const enforcedCharacters = getEnforcedCharacters(state).keys();

  return [
    state.meta,
    ...Object.values(state.characters).flatMap((characters) =>
      characters.map((character) => getMinimalScriptCharacter(character)),
    ),
    ...enforcedCharacters,
  ];
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

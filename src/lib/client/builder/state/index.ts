import type {
  BloodOnTheClocktowerCustomScript,
  CharacterTeam,
  ScriptCharacter,
  ScriptMetadata,
} from "../../../../generated/script-schema";
import {
  getFullScriptCharacter,
  isScriptMetadata,
  sortCharacters,
} from "../../../characters";
import { appState } from "./app.svelte";
import { scriptState } from "./script.svelte";
import { sessionState } from "./session.svelte";
import { getScriptFromScriptSettings } from "./types";

export { appState, scriptState, sessionState };

export function setScriptFromRaw(
  id: string,
  script: BloodOnTheClocktowerCustomScript,
) {
  let meta: ScriptMetadata | undefined;
  const characters: Record<CharacterTeam, ScriptCharacter[]> = {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
    loric: [],
  };
  const unknownCharacters: ScriptCharacter[] = [];

  const seenIds = new Set<string>();
  for (const character of script) {
    if (isScriptMetadata(character)) {
      if (meta === undefined) {
        meta = character;
      } else {
        console.warn("Script has multiple meta sections");
      }
      continue;
    }

    const fullCharacter = getFullScriptCharacter(character);

    if (seenIds.has(fullCharacter.id)) {
      console.warn(`Script has duplicate entries for ${fullCharacter.id}`);
      continue;
    }
    seenIds.add(fullCharacter.id);

    // @ts-expect-error `<unknown>` is used as a fallback if there's no way to know what team the character is on.
    // This happens if the script defines a character by string but this app doesn't know what it is.
    if (fullCharacter.team === "<unknown>") {
      unknownCharacters.push(fullCharacter);
    } else {
      characters[fullCharacter.team].push(fullCharacter);
    }
  }

  appState.currentScriptId = id;
  scriptState.meta = meta ?? { id: "_meta", name: "" };
  scriptState.characters = characters;
  scriptState.unknownCharacters = unknownCharacters;

  doSortScript();
}

export function getRawScript(): BloodOnTheClocktowerCustomScript {
  return getScriptFromScriptSettings(scriptState);
}

export function doSortScript() {
  if (appState.sorting.enabled) {
    scriptState.characters = sortCharacters(
      scriptState.characters,
      appState.sorting.fun,
    );
  }
}

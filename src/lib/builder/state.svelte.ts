import type {
  BloodOnTheClocktowerCustomScript,
  CharacterTeam,
  ScriptCharacter,
  ScriptMetadata,
} from "../../generated/script-schema";
import {
  getFullScriptCharacter,
  isScriptMetadata,
  sortCharacters,
} from "../characters";
import type { CheckResult } from "./checks/types";
import { getInitialState } from "./state";
import { getScriptFromState } from "./state-helper";
import type { GlobalState } from "./state/types";

export const globalState = $state<GlobalState>(getInitialState());

export function setScript(
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

  globalState.scriptId = id;
  globalState.meta = meta ?? { id: "_meta", name: "" };
  globalState.characters = characters;
  globalState.unknownCharacters = unknownCharacters;

  doSortScript();
}

export function getScript(): BloodOnTheClocktowerCustomScript {
  return getScriptFromState(globalState);
}

export interface ChecksState {
  loading: boolean;
  didError: boolean;
  errors: CheckResult[];
  warnings: CheckResult[];
  infos: CheckResult[];
}

export const checksState = $state<ChecksState>({
  loading: false,
  didError: false,
  errors: [],
  warnings: [],
  infos: [],
});

export function doSortScript() {
  if (globalState.options.useSortOrder) {
    globalState.characters = sortCharacters(
      globalState.characters,
      globalState.options.useSortOrderFun,
    );
  }
}

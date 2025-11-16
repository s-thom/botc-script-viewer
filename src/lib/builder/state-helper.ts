import { nanoid } from "nanoid";
import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import {
  getEnforcedCharacters,
  getMinimalScriptCharacter,
} from "../characters";
import {
  CURRENT_STATE_VERSION,
  type AllPastStateTypes,
  type GlobalState,
} from "./state/types";

export function getScriptFromState(
  state: GlobalState,
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

export function upgradeState(previous: AllPastStateTypes): GlobalState {
  if (previous.version > CURRENT_STATE_VERSION) {
    console.warn("State is newer than known version. Continuing anyway.");
  }

  const coerced = previous as unknown as GlobalState;
  if (previous.version >= CURRENT_STATE_VERSION) {
    return coerced;
  }

  coerced.version = 4;

  switch (true) {
    case previous.version <= 1:
      coerced.options.useSortOrderFun = true;
    // eslint-disable-next-line no-fallthrough
    case previous.version <= 2:
      coerced.characters.loric = [];
    // eslint-disable-next-line no-fallthrough
    case previous.version <= 3:
      coerced.scriptId = nanoid();
    // eslint-disable-next-line no-fallthrough
    case previous.version > CURRENT_STATE_VERSION:
      console.warn("State is newer than known version. Continuing anyway.");
  }

  return coerced;
}

import type { BloodOnTheClocktowerCustomScript } from "../../../../generated/script-schema";
import {
  getEnforcedCharacters,
  getMinimalScriptCharacter,
} from "../../../characters";
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

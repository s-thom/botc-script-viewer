import type {
  BloodOnTheClocktowerCustomScript,
  CharacterTeam,
  ScriptCharacter,
  ScriptMetadata,
} from "../../../../generated/script-schema";
import {
  getEnforcedCharacters,
  getMinimalScriptCharacter,
} from "../../../characters";
import type { CommonProperties } from "../../types";

export type AppScreen =
  | "script"
  | "options"
  | "select-characters"
  | "checks"
  | "checks:about"
  | "switcher"
  | "switcher:import";

export const APP_SETTINGS_KEY = "builder-app";
export const CURRENT_APP_SETTINGS_VERSION = 1;

export interface BuilderAppSettingsV1 {
  type: "builder-app";
  version: 1;
  currentScriptId: string;
  screen: AppScreen;
  prevScreen?: AppScreen;
  panels: {
    script: number;
    options: number;
    checks: number;
    isChecksOpen: boolean;
  };
  checks: {
    enabled: boolean;
  };
  sorting: {
    enabled: boolean;
    fun: boolean;
  };
}

export type BuilderAppSettingsAll = BuilderAppSettingsV1;
export type BuilderAppSettingsLatest = BuilderAppSettingsV1;

export const SCRIPT_SETTINGS_KEY = "builder-app";
export const CURRENT_SCRIPT_SETTINGS_VERSION = 1;

export interface BuilderScriptSettingsV1 {
  type: "builder-script";
  version: 1;
  meta: ScriptMetadata;
  characters: Record<CharacterTeam, ScriptCharacter[]>;
  unknownCharacters: ScriptCharacter[];
  ignoredChecks: string[];
  prompt?: string;
}

export type BuilderScriptSettingsAll = BuilderScriptSettingsV1;
export type BuilderScriptSettingsLatest = BuilderScriptSettingsV1;

export interface SavedScriptData extends CommonProperties {
  script: BuilderScriptSettingsAll;
}

export function getScriptFromScriptSettings(
  state: BuilderScriptSettingsV1,
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

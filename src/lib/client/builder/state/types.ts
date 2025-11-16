import type {
  CharacterTeam,
  ScriptCharacter,
  ScriptMetadata,
} from "../../../../generated/script-schema";
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
  id: "builder-app";
  version: 1;
  currentScriptId: string;
  screen: { current: AppScreen; previous?: AppScreen };
  panelSizes: {
    script: number;
    options: number;
    checks: number;
  };
  checks: {
    enabled: boolean;
    isChecksPanelOpen: boolean;
  };
  sorting: {
    enabled: boolean;
    fun: boolean;
  };
}

export type BuilderAppSettingsAll = BuilderAppSettingsV1;
export type BuilderAppSettingsLatest = BuilderAppSettingsV1;

export const CURRENT_SCRIPT_SETTINGS_VERSION = 1;

export interface BuilderScriptSettingsV1 {
  id: "builder-script";
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

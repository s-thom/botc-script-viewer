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

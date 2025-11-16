import type {
  CharacterTeam,
  ScriptCharacter,
  ScriptMetadata,
} from "../../../generated/script-schema";

export type AppTheme = "system" | "light" | "dark";

export type AppScreen =
  | "script"
  | "options"
  | "select-characters"
  | "checks"
  | "checks:about"
  | "switcher"
  | "switcher:import";

type CharacterTeamBeforeLoric =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon"
  | "traveller"
  | "fabled";

export interface GlobalStateV1 {
  version: 1;
  meta: ScriptMetadata;
  characters: Record<CharacterTeamBeforeLoric, ScriptCharacter[]>;
  unknownCharacters: ScriptCharacter[];
  options: {
    useSortOrder: boolean;
  };
  ui: {
    useChecks: boolean;
    isChecksDrawerOpen: boolean;
    ignoredChecks: string[];
    panelSizes: {
      script: number;
      options: number;
      checks: number;
    };
    screen: AppScreen;
    prevScreen?: AppScreen;
    prompt?: string;
  };
}

export interface GlobalStateV2 {
  version: 2;
  meta: ScriptMetadata;
  characters: Record<CharacterTeamBeforeLoric, ScriptCharacter[]>;
  unknownCharacters: ScriptCharacter[];
  options: {
    useSortOrder: boolean;
    useSortOrderFun: boolean;
  };
  ui: {
    theme: AppTheme;
    useChecks: boolean;
    isChecksDrawerOpen: boolean;
    ignoredChecks: string[];
    panelSizes: {
      script: number;
      options: number;
      checks: number;
    };
    screen: AppScreen;
    prevScreen?: AppScreen;
    prompt?: string;
  };
}

export interface GlobalStateV3 {
  version: 3;
  meta: ScriptMetadata;
  characters: Record<CharacterTeam, ScriptCharacter[]>;
  unknownCharacters: ScriptCharacter[];
  options: {
    useSortOrder: boolean;
    useSortOrderFun: boolean;
  };
  ui: {
    useChecks: boolean;
    isChecksDrawerOpen: boolean;
    ignoredChecks: string[];
    panelSizes: {
      script: number;
      options: number;
      checks: number;
    };
    screen: AppScreen;
    prevScreen?: AppScreen;
    prompt?: string;
  };
}

export interface GlobalStateV4 {
  version: 4;
  scriptId: string;
  meta: ScriptMetadata;
  characters: Record<CharacterTeam, ScriptCharacter[]>;
  unknownCharacters: ScriptCharacter[];
  options: {
    useSortOrder: boolean;
    useSortOrderFun: boolean;
  };
  ui: {
    useChecks: boolean;
    isChecksDrawerOpen: boolean;
    ignoredChecks: string[];
    panelSizes: {
      script: number;
      options: number;
      checks: number;
    };
    screen: AppScreen;
    prevScreen?: AppScreen;
    prompt?: string;
  };
}

export type AllPastStateTypes =
  | GlobalStateV1
  | GlobalStateV2
  | GlobalStateV3
  | GlobalStateV4;

export type GlobalState = GlobalStateV4;

export const CURRENT_STATE_VERSION: GlobalState["version"] = 4;

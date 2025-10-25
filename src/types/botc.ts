import type {
  BloodOnTheClocktowerCustomScript,
  CharacterTeam,
  ScriptCharacter,
} from "../generated/script-schema";

export type NightInfo = CharacterNightInfo | SpecialNightInfo;

export interface CharacterNightInfo {
  type: "character";
  character: ScriptCharacter;
  reminderText?: string;
}
export interface SpecialNightInfo {
  type: "special";
  id: string;
  name: string;
  reminderText?: string;
}

export interface JinxInfo {
  character1: ScriptCharacter;
  character2: ScriptCharacter;
  reason: string;
}

export interface ExtraNightOrderCharactersWarning {
  type: "extra-night-order-characters";
  characters: string[];
}

export type ScriptWarnings = ExtraNightOrderCharactersWarning;

export interface NormalisedScript {
  name: string;
  author?: string;
  hideTitle?: boolean;
  logo?: string;
  background?: string;
  almanac?: string;
  bootlegger?: string[];
  firstNight: NightInfo[];
  otherNight: NightInfo[];
  characters: ScriptCharacter[];
  charactersById: Map<string, ScriptCharacter>;
  teams: Record<CharacterTeam, ScriptCharacter[]>;
  jinxes: JinxInfo[];
  warnings: ScriptWarnings[];
}

export interface LocalScriptCollection {
  title: string;
  description: string;
  scripts: LocalScriptDefinition[];
  showOnHome?: boolean;
}

export interface LocalScriptDefinition {
  id: string;
  title: string;
  character: string;
  getScript: () => Promise<BloodOnTheClocktowerCustomScript>;
}

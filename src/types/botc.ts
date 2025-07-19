import type {
  BloodOnTheClocktowerCustomScript,
  CharacterTeam,
  ScriptCharacter,
} from "../generated/script-schema";

export type Alignment = "good" | "evil" | "neutral";

export type NightInfo = CharacterNightInfo | SpecialNightInfo;

export interface CharacterNightInfo {
  type: "character";
  character: ScriptCharacter;
  reminderText?: string;
}
export interface SpecialNightInfo {
  type: "special";
  name: string;
  reminderText?: string;
}

export interface JinxInfo {
  character1: ScriptCharacter;
  character2: ScriptCharacter;
  reason: string;
}

export interface NormalisedScript {
  name: string;
  author?: string;
  logo?: string;
  almanac?: string;
  bootlegger?: string[];
  firstNight: NightInfo[];
  otherNight: NightInfo[];
  characters: ScriptCharacter[];
  charactersById: Map<string, ScriptCharacter>;
  teams: Record<CharacterTeam, ScriptCharacter[]>;
  jinxes: JinxInfo[];
}

export interface HostedScriptDefinition {
  id: string;
  title: string;
  character: string;
  getScript: () => Promise<BloodOnTheClocktowerCustomScript>;
}

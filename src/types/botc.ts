import type {
  BloodOnTheClocktowerCustomScript,
  CharacterTeam,
  ScriptCharacter,
} from "../generated/script-schema";
import type { LocaleIds } from "../lib/i18n";

export interface NormalisedScriptCharacter extends ScriptCharacter {
  normalisedId: string;
  isHomebrew: boolean;
}

export type NightInfo = CharacterNightInfo | SpecialNightInfo;

export interface CharacterNightInfo {
  type: "character";
  character: NormalisedScriptCharacter;
  reminderText?: string;
}
export interface SpecialNightInfo {
  type: "special";
  id: string;
  name: string;
  reminderText?: string;
}

export interface JinxInfo {
  character1: NormalisedScriptCharacter;
  character2: NormalisedScriptCharacter;
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
  characters: NormalisedScriptCharacter[];
  charactersById: Map<string, NormalisedScriptCharacter>;
  teams: Record<CharacterTeam, NormalisedScriptCharacter[]>;
  jinxes: JinxInfo[];
  warnings: ScriptWarnings[];
}

export interface LocalScriptCollection {
  title: string;
  description: string;
  scripts: LocalScriptDefinition[];
  isOfficial?: boolean;
  showOnHome?: boolean;
}

export interface LocalScriptDefinition {
  id: string;
  title: string;
  character: string;
  getScript: Record<LocaleIds, () => Promise<BloodOnTheClocktowerCustomScript>>;
}

import type { CharacterTeam } from "../../../generated/script-schema";

export type CharacterEdition =
  | "tb"
  | "snv"
  | "bmr"
  | "kickstarter"
  | "carousel"
  | "custom";

export type RegularCharacterTeam = Exclude<
  CharacterTeam,
  "traveller" | "fabled"
>;

export interface EditionMetadata {
  name: string;
  icon: string;
}

export interface CharacterMetadata {
  edition: CharacterEdition;
  actionType:
    | "passive"
    | "start-knowing"
    | "first-night"
    | "each-night-all"
    | "each-night-star"
    | "on-death"
    | "once-per-game"
    | "public-claim"
    | "storyteller-consult"
    | "traveller"
    | "fabled"
    | "unknown";
  causesDroison?: boolean;
  causesMadness?: "character" | "evil";
  causesExtraEvil?: boolean;
  causesExtraNightDeaths?: boolean;
  causesResurrection?: boolean;
  preventsExecution?: boolean;
  preventsNightDeath?: boolean;
  needsExtraMinion?: boolean;
  addsExtraGoodWinCondition?: boolean;
  addsExtraEvilWinCondition?: boolean;
  outsiderModification?: boolean;
  evilWeight?: number;
  canChangeRules?: boolean;
  requiresCharacters?: string[];
}

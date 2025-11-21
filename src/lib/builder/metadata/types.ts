import type { CharacterTeam } from "../../../generated/script-schema";

export type CharacterEdition =
  | "tb"
  | "snv"
  | "bmr"
  | "kickstarter"
  | "carousel"
  | "recent-release"
  | "custom";

export type RegularCharacterTeam = Exclude<
  CharacterTeam,
  "traveller" | "fabled"
>;

export interface EditionMetadata {
  name: string;
  icon: string;
}

export const ACTION_TYPE_NAMES = {
  passive: "None",
  "start-knowing": "Start knowing",
  "first-night": "First night",
  "each-night-all": "Each night",
  "each-night-star": "Each night (except the first)",
  "on-death": "On death",
  "once-per-game": "Once per game",
  "public-claim": "Claim publicly",
  "storyteller-consult": "Ask the storyteller",
  traveller: "Traveller",
  fabled: "Non-player",
  unknown: "Unknown",
};

export interface CharacterMetadata {
  edition: CharacterEdition;
  actionType: keyof typeof ACTION_TYPE_NAMES;
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

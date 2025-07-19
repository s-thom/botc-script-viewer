import type { CharacterTeam } from "../generated/script-schema";
import type { Alignment } from "../types/botc";

export function defaultAlignmentForTeam(team: CharacterTeam): Alignment {
  switch (team) {
    case "townsfolk":
    case "outsider":
      return "good";
    case "minion":
    case "demon":
      return "evil";
    case "traveller":
    case "fabled":
      return "neutral";
  }
}

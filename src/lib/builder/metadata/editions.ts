import type { CharacterEdition, EditionMetadata } from "./types";

export const EDITIONS: Record<CharacterEdition, EditionMetadata> = {
  tb: { name: "Trouble Brewing", icon: "imp" },
  snv: { name: "Sects and Violets", icon: "pithag" },
  bmr: { name: "Bad Moon Rising", icon: "godfather" },
  kickstarter: { name: "Kickstarter", icon: "cannibal" },
  carousel: { name: "Carousel", icon: "villageidiot" },
  custom: { name: "Custom", icon: "amnesiac" },
};

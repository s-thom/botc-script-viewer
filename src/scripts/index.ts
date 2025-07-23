import type { LocalScriptCollection } from "../types/botc";
import { BASE_3 } from "./base3";
import { CAROUSEL_COLLECTION } from "./carousel-collection";
import { RANDOM_SCRIPTS } from "./random";
import { WORLD_CUP_25 } from "./wc25";

export const LOCAL_SCRIPT_COLLECTIONS: Record<
  "b3" | "cc" | "wc25" | "v",
  LocalScriptCollection
> = {
  b3: {
    title: "Base 3",
    description: "Official scripts provided by The Pandemonium Institute.",
    scripts: BASE_3,
  },
  cc: {
    title: "Carousel Collection",
    description:
      "Community-created scripts that show off the Carousel set of characters.",
    scripts: CAROUSEL_COLLECTION,
  },
  wc25: {
    title: "World Cup 2025",
    description:
      "Scripts included in the 2025 World Cup competition with special rules that change the game.",
    scripts: WORLD_CUP_25,
  },
  v: {
    title: "Various",
    description:
      "Scripts that I've collected on my travels. This is not in any way a “best of” list.",
    scripts: RANDOM_SCRIPTS,
  },
};

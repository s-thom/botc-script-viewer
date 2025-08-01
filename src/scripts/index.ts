import type { LocalScriptCollection } from "../types/botc";
import { BASE_3 } from "./base3";
import { CAROUSEL_COLLECTION } from "./carousel-collection";
import { RANDOM_SCRIPTS } from "./random";
import { STREAMER_STACK } from "./streamer-stack";
import { WORLD_CUP_25 } from "./wc25";

export const LOCAL_SCRIPT_COLLECTIONS: Record<
  "base3" | "carousel" | "wc25" | "s2" | "v",
  LocalScriptCollection
> = {
  base3: {
    title: "Base 3",
    description: "Official scripts provided by The Pandemonium Institute.",
    scripts: BASE_3,
  },
  carousel: {
    title: "Carousel Collection",
    description:
      "Community-created scripts that show off the characters released in the Carousel.",
    scripts: CAROUSEL_COLLECTION,
  },
  wc25: {
    title: "World Cup 2025",
    description:
      "Scripts included in the 2025 World Cup competition with special rules that change the game.",
    scripts: WORLD_CUP_25,
  },
  s2: {
    title: "Streamer Stack",
    description:
      "A collection of scripts from some of your favourite Clocktower streamers and their communities that utilizes many of the characters available since the Carousel has been released!",
    scripts: STREAMER_STACK,
  },
  v: {
    title: "Various",
    description:
      "Scripts that I've collected on my travels. This is not in any way a “best of” list.",
    scripts: RANDOM_SCRIPTS,
    showOnHome: false,
  },
};

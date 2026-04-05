import type { LocalScriptCollection } from "../types/botc";
import { BASE_3 } from "./base3";
import { CAROUSEL_COLLECTION } from "./carousel-collection";
import { MONTHLY_SCRIPTS } from "./monthly";
import { RANDOM_SCRIPTS } from "./random";
import { STREAMER_STACK } from "./streamer-stack";
import { WORLD_CUP_25 } from "./wc25";

export const LOCAL_SCRIPT_COLLECTIONS: Record<
  "base3" | "carousel" | "wc25" | "s2" | "v" | "month",
  LocalScriptCollection
> = {
  base3: {
    scripts: BASE_3,
    isOfficial: true,
  },
  carousel: {
    scripts: CAROUSEL_COLLECTION,
  },
  wc25: {
    scripts: WORLD_CUP_25,
  },
  s2: {
    scripts: STREAMER_STACK,
  },
  v: {
    scripts: RANDOM_SCRIPTS,
    showOnHome: false,
  },
  month: {
    scripts: MONTHLY_SCRIPTS,
  },
};

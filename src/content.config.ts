import { defineCollection } from "astro:content";
import { topScriptsLoader } from "./loaders/top-scripts";

export const collections = {
  botcTopScripts: defineCollection({
    loader: topScriptsLoader(),
  }),
};

// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "./src/lib/images";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  image: {
    domains: ALLOWED_EXTERNAL_HOSTNAMES,
  },

  scopedStyleStrategy: "class",

  adapter: node({
    mode: "standalone",
  }),
});
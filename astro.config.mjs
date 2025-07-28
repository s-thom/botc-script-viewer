// @ts-check
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "./src/lib/images";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  image: {
    domains: ALLOWED_EXTERNAL_HOSTNAMES,
  },
  scopedStyleStrategy: "class",
  adapter: cloudflare({ imageService: "cloudflare" }),
});

// @ts-check
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "./src/lib/images";

// https://astro.build/config
export default defineConfig({
  site:
    process.env.ENVIRONMENT === "production"
      ? `https://botc-script-viewer.sthom.kiwi`
      : undefined,
  integrations: [svelte()],
  image: {
    domains: ALLOWED_EXTERNAL_HOSTNAMES,
  },
  scopedStyleStrategy: "class",
  adapter: cloudflare({ imageService: "compile" }),
});

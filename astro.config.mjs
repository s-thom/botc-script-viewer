// @ts-check
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "./src/lib/images";

const isProd = process.env.ENVIRONMENT === "production";

// https://astro.build/config
export default defineConfig({
  site: isProd ? `https://botc-script-viewer.sthom.kiwi` : undefined,
  integrations: [svelte({ compilerOptions: { dev: !isProd } })],
  image: {
    domains: ALLOWED_EXTERNAL_HOSTNAMES,
  },
  scopedStyleStrategy: "class",
  adapter: cloudflare({ imageService: "compile" }),
  vite: { build: { cssCodeSplit: false } },
});

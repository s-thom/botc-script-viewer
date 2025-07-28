// @ts-check
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "./src/lib/images";

const { SITE_DOMAIN } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

console.log({ SITE_DOMAIN });

// https://astro.build/config
export default defineConfig({
  site: SITE_DOMAIN ? `https://${SITE_DOMAIN}` : undefined,
  integrations: [],
  image: {
    domains: ALLOWED_EXTERNAL_HOSTNAMES,
  },
  scopedStyleStrategy: "class",
  adapter: cloudflare({ imageService: "cloudflare" }),
});

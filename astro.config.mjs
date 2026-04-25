// @ts-check
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { defineConfig, fontProviders } from "astro/config";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "./src/lib/constants";
import { ENABLED_LOCALES } from "./src/lib/i18n/config";

import sitemap from "@astrojs/sitemap";

const isProd = process.env.ENVIRONMENT === "production";

// https://astro.build/config
export default defineConfig({
  site: isProd
    ? `https://botc-script-viewer.sthom.kiwi`
    : "http://localhost:4321",
  adapter: cloudflare({ imageService: "compile" }),
  integrations: [svelte({ compilerOptions: { dev: !isProd } }), sitemap()],
  image: {
    domains: ALLOWED_EXTERNAL_HOSTNAMES,
  },
  i18n: {
    defaultLocale:
      ENABLED_LOCALES.find((locale) => locale.isDefault)?.astroId ?? "en",
    locales: ENABLED_LOCALES.map((locale) => locale.astroId),
  },
  scopedStyleStrategy: "class",
  vite: {
    build: { cssCodeSplit: false },
    optimizeDeps: {
      exclude: ["language-icons"],
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Dumbledor",
      cssVariable: "--font-dumbledor",
      fallbacks: ["serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Dumbledor/Dumbledor-Regular.woff2"],
            weight: 400,
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/Dumbledor/Dumbledor-Italic.woff2"],
            weight: 400,
            style: "italic",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Sorts Mill Goudy",
      cssVariable: "--font-sorts-mill-goudy",
      fallbacks: ["serif"],
      optimizedFallbacks: false,
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/SortsMillGoudy/SortsMillGoudy-Regular.woff2",
            ],
            weight: 400,
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/SortsMillGoudy/SortsMillGoudy-Italic.woff2",
            ],
            weight: 400,
            style: "italic",
          },
        ],
      },
    },
  ],
});

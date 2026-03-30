// @ts-check
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import { defineConfig, fontProviders } from "astro/config";
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

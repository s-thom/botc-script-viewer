import type { APIRoute } from "astro";
import { createTranslator } from "../lib/i18n";
import { renderSvg } from "../lib/og";
import { getHomeBannerSvg } from "../lib/og/svg";

// TODO: Not have this as its own route and have it dynamic. Need to figure out route priority.

export const prerender = false;

export const GET: APIRoute = async ({ url, currentLocale }) => {
  const t = await createTranslator({ locale: currentLocale ?? "en" });

  const svg = getHomeBannerSvg(t);
  const buffer = await renderSvg(svg, url);

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};

import type { APIRoute } from "astro";
import { createTranslator, ENABLED_LOCALES } from "../../lib/i18n";
import { renderSvg } from "../../lib/og";
import { getHomeBannerSvg } from "../../lib/og/svg";

export const prerender = false;

export function getStaticPaths() {
  return ENABLED_LOCALES.map((locale) => ({
    params: {
      locale: locale.isDefault ? undefined : locale.astroId,
    },
  }));
}

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

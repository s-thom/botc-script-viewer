import type { APIRoute } from "astro";
import { decompressFromBase64 } from "../../../../lib/compression";
import { createTranslator } from "../../../../lib/i18n";
import { decodeScript } from "../../../../lib/number-store";
import { getOgImageResponse } from "../../../../lib/og/worker";

export const prerender = false;

export const GET: APIRoute = async ({
  params,
  rewrite,
  url,
  currentLocale,
}) => {
  const { b64 } = params;

  if (!b64) {
    return rewrite("/404");
  }

  return getOgImageResponse(url, async () => {
    const bytes = await decompressFromBase64(b64, "deflate-raw", true);
    return {
      t: await createTranslator({ locale: currentLocale ?? "en" }),
      rawScript: decodeScript(bytes),
    };
  });
};

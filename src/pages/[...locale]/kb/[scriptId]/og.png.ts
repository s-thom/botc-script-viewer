import type { APIRoute } from "astro";
import { createTranslator } from "../../../../lib/i18n";
import { fetchKlutzbananaScript } from "../../../../lib/import/klutzbanana";
import { getOgImageResponse } from "../../../../lib/og/worker";

export const prerender = false;

export const GET: APIRoute = async ({
  params,
  rewrite,
  url,
  currentLocale,
}) => {
  const { scriptId } = params;

  if (!scriptId) {
    return rewrite("/404");
  }

  return getOgImageResponse(url, async () => ({
    t: await createTranslator({ locale: currentLocale ?? "en" }),
    rawScript: await fetchKlutzbananaScript(scriptId, { userAgent: "user" }),
  }));
};

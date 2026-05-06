import type { APIRoute } from "astro";
import { fetchRawScript } from "../../../../../lib/botcscripts/fetch";
import { createTranslator } from "../../../../../lib/i18n";
import { getScriptBannerResponse } from "../../../../../lib/routes/banner";

export const prerender = false;

export const GET: APIRoute = async ({
  url,
  currentLocale,
  params,
  rewrite,
}) => {
  const { scriptId, versionId } = params;

  if (!(scriptId && versionId)) {
    return rewrite("/404");
  }

  const rawScript = await fetchRawScript(scriptId, versionId);
  const t = await createTranslator({ locale: currentLocale ?? "en" });

  return getScriptBannerResponse(t, rawScript, url);
};

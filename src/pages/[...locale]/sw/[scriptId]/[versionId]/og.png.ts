import type { APIRoute } from "astro";
import { createTranslator } from "../../../../../lib/i18n";
import {
  fetchScriptInstance,
  fetchVersionInstance,
} from "../../../../../lib/import/botcscripts";
import { getOgImageResponse } from "../../../../../lib/og/worker";

export const prerender = false;

export const GET: APIRoute = async ({
  params,
  rewrite,
  url,
  currentLocale,
}) => {
  const { scriptId, versionId } = params;

  if (!(scriptId && versionId)) {
    return rewrite("/404");
  }

  return getOgImageResponse(url, async () => {
    const scriptInstance = await fetchScriptInstance(scriptId, {
      userAgent: "user",
    });
    const scriptVersion = await fetchVersionInstance(
      scriptInstance,
      versionId,
      { userAgent: "user" },
    );
    return {
      t: await createTranslator({ locale: currentLocale ?? "en" }),
      rawScript: scriptVersion.content,
      fallbacks: { name: scriptVersion.name, author: scriptVersion.author },
    };
  });
};

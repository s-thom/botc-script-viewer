import type { APIRoute } from "astro";
import { createTranslator, ENABLED_LOCALES } from "../../../../lib/i18n";
import { getScriptBannerResponse } from "../../../../lib/routes/banner";
import { getCollectionRawScript } from "../../../../lib/routes/json";
import { LOCAL_SCRIPT_COLLECTIONS } from "../../../../scripts";

export const prerender = false;

export function getStaticPaths() {
  return ENABLED_LOCALES.flatMap((locale) =>
    Object.entries(LOCAL_SCRIPT_COLLECTIONS).flatMap(
      ([collectionId, collection]) =>
        collection.scripts.map((script) => ({
          params: {
            collectionId: collectionId as keyof typeof LOCAL_SCRIPT_COLLECTIONS,
            scriptId: script.id,
            locale: locale.isDefault ? undefined : locale.astroId,
          },
        })),
    ),
  );
}

export const GET: APIRoute = async ({ url, currentLocale, params }) => {
  const { collectionId, scriptId } = params;

  const rawScript = await getCollectionRawScript(
    currentLocale,
    collectionId,
    scriptId,
  );
  const t = await createTranslator({ locale: currentLocale ?? "en" });

  return getScriptBannerResponse(t, rawScript, url);
};

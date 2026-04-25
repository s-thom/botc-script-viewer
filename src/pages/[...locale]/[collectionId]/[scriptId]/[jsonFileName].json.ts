import type { APIRoute } from "astro";
import { ENABLED_LOCALES, type LocaleIds } from "../../../../lib/i18n";
import { getJsonHeaders, getOptionsResponse } from "../../../../lib/responses";
import { LOCAL_SCRIPT_COLLECTIONS } from "../../../../scripts";

export function getStaticPaths() {
  return ENABLED_LOCALES.flatMap((locale) =>
    Object.entries(LOCAL_SCRIPT_COLLECTIONS).flatMap(
      ([collectionId, collection]) =>
        collection.scripts.map((script) => ({
          params: {
            collectionId: collectionId as keyof typeof LOCAL_SCRIPT_COLLECTIONS,
            scriptId: script.id,
            jsonFileName: script.id,
            locale: locale.isDefault ? undefined : locale.astroId,
          },
        })),
    ),
  );
}

export const GET: APIRoute = async ({ params, rewrite, currentLocale }) => {
  const { collectionId, scriptId } = params;

  if (!collectionId || !scriptId) {
    return rewrite("/404");
  }

  if (!(collectionId in LOCAL_SCRIPT_COLLECTIONS)) {
    return rewrite("/404");
  }

  const collection =
    LOCAL_SCRIPT_COLLECTIONS[
      collectionId as keyof typeof LOCAL_SCRIPT_COLLECTIONS
    ];

  const scriptDefinition = collection.scripts.find(
    (script) => script.id === scriptId,
  );
  if (!scriptDefinition) {
    return rewrite("/404");
  }

  const resolvedLocale = (currentLocale ?? "en") as LocaleIds;

  const getScript =
    scriptDefinition.localeOverrides?.[resolvedLocale] ??
    scriptDefinition.getScript;
  const rawScript = await getScript();

  return new Response(JSON.stringify(rawScript), { headers: getJsonHeaders() });
};

export const OPTIONS: APIRoute = async () => {
  return getOptionsResponse();
};

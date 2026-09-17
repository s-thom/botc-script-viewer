import type { APIRoute } from "astro";
import { ENABLED_LOCALES, type LocaleIds } from "../../../../lib/i18n";
import { getJsonHeaders, getOptionsResponse } from "../../../../lib/responses";
import { getLocalScriptCollections } from "../../../../scripts";

export function getStaticPaths() {
  const localScriptCollections = getLocalScriptCollections();

  return ENABLED_LOCALES.flatMap((locale) =>
    Object.entries(localScriptCollections).flatMap(
      ([collectionId, collection]) =>
        collection.scripts.map((script) => ({
          params: {
            collectionId: collectionId as keyof typeof localScriptCollections,
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

  const localScriptCollections = getLocalScriptCollections();
  if (!(collectionId in localScriptCollections)) {
    return rewrite("/404");
  }

  const collection =
    localScriptCollections[collectionId as keyof typeof localScriptCollections];

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

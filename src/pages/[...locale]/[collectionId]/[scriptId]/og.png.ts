import type { APIRoute } from "astro";
import {
  createTranslator,
  ENABLED_LOCALES,
  type LocaleIds,
} from "../../../../lib/i18n";
import { getPrerenderedOgImageResponse } from "../../../../lib/og/prerender";
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

  const locale = (currentLocale ?? "en") as LocaleIds;
  const getScript =
    scriptDefinition.localeOverrides?.[locale] ?? scriptDefinition.getScript;

  return getPrerenderedOgImageResponse({
    t: await createTranslator({ locale }),
    rawScript: await getScript(),
    color: scriptDefinition.color,
  });
};

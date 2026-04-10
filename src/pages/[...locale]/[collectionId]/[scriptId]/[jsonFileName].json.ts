import type { APIRoute } from "astro";
import { ENABLED_LOCALES } from "../../../../lib/i18n";
import {
  getJsonResponse,
  getOptionsResponse,
} from "../../../../lib/routes/collectionJson";
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

  return getJsonResponse(currentLocale, collectionId, scriptId, rewrite);
};

export const OPTIONS: APIRoute = async () => {
  return getOptionsResponse();
};

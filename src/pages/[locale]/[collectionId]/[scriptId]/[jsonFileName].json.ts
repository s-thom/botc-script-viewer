import type { APIRoute } from "astro";
import { ENABLED_LOCALES } from "../../../../lib/i18n";
import {
  getJsonResponse,
  getOptionsResponse,
  getStaticPathsForLocale,
} from "../../../../lib/routes/collectionJson";

export function getStaticPaths() {
  return ENABLED_LOCALES.filter((locale) => !locale.isDefault).flatMap(
    (locale) => getStaticPathsForLocale(locale.slug),
  );
}

export const GET: APIRoute = async ({ params, rewrite, currentLocale }) => {
  const { collectionId, scriptId } = params;

  return getJsonResponse(currentLocale, collectionId, scriptId, rewrite);
};

export const OPTIONS: APIRoute = async () => {
  return getOptionsResponse();
};

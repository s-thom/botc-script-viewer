import type { APIContext } from "astro";
import { LOCAL_SCRIPT_COLLECTIONS } from "../../scripts";
import { MAX_AGE_SECONDS } from "../constants";
import type { LocaleIds } from "../i18n";

export async function getJsonResponse(
  locale: string | undefined,
  collectionId: string | undefined,
  scriptId: string | undefined,
  rewrite: APIContext["rewrite"],
): Promise<Response> {
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

  const resolvedLocale = (locale ?? "en") as LocaleIds;

  const getScript =
    scriptDefinition.localeOverrides?.[resolvedLocale] ??
    scriptDefinition.getScript;
  const rawScript = await getScript();

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(JSON.stringify(rawScript), { headers });
}

export function getOptionsResponse(): Response {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET");
  headers.set("Access-Control-Allow-Headers", "user-agent");
  return new Response(null, { headers, status: 204 });
}

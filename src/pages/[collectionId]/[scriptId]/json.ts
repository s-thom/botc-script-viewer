import type { APIRoute } from "astro";
import { MAX_AGE_SECONDS } from "../../../lib/constants";
import { LOCAL_SCRIPT_COLLECTIONS } from "../../../scripts";

export function getStaticPaths() {
  return Object.entries(LOCAL_SCRIPT_COLLECTIONS).flatMap(
    ([collectionId, collection]) =>
      collection.scripts.map((script) => ({
        params: {
          collectionId: collectionId as keyof typeof LOCAL_SCRIPT_COLLECTIONS,
          scriptId: script.id,
        },
      })),
  );
}

export const GET: APIRoute = async ({ params, rewrite }) => {
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

  const rawScript = await scriptDefinition.getScript();

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(JSON.stringify(rawScript), { headers });
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  if (!b64) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET");
  return new Response(null, { headers, status: 204 });
};

import type { APIRoute } from "astro";
import { fetchScriptVersionByIdVersion } from "../../../../../lib/import/botcscripts";
import {
  getJsonHeaders,
  getOptionsResponse,
} from "../../../../../lib/responses";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { scriptId, versionId } = params;

  if (!(scriptId && versionId)) {
    return rewrite("/404");
  }

  const scriptVersion = await fetchScriptVersionByIdVersion(
    scriptId,
    versionId,
  );
  const rawScriptString = JSON.stringify(scriptVersion.content);

  return new Response(rawScriptString, { headers: getJsonHeaders() });
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  if (!b64) {
    return new Response(null, { status: 404 });
  }

  return getOptionsResponse();
};

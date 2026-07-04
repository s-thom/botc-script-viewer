import type { APIRoute } from "astro";
import { fetchScriptByIdVersion } from "../../../../../lib/import/botcscripts";
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

  const rawScriptString = await fetchScriptByIdVersion(scriptId, versionId);

  return new Response(rawScriptString, { headers: getJsonHeaders() });
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  if (!b64) {
    return new Response(null, { status: 404 });
  }

  return getOptionsResponse();
};

import type { APIRoute } from "astro";
import { fetchRawScript } from "../../../../../lib/botcscripts/fetch";
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

  const rawScript = await fetchRawScript(scriptId, versionId);

  return new Response(JSON.stringify(rawScript), { headers: getJsonHeaders() });
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  if (!b64) {
    return new Response(null, { status: 404 });
  }

  return getOptionsResponse();
};

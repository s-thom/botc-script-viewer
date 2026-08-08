import type { APIRoute } from "astro";
import { fetchKlutzbananaScript } from "../../../../lib/import/klutzbanana";
import { getJsonHeaders, getOptionsResponse } from "../../../../lib/responses";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { scriptId } = params;

  if (!scriptId) {
    return rewrite("/404");
  }

  const script = await fetchKlutzbananaScript(scriptId);

  return new Response(JSON.stringify(script), { headers: getJsonHeaders() });
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  if (!b64) {
    return new Response(null, { status: 404 });
  }

  return getOptionsResponse();
};

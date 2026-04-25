import type { APIRoute } from "astro";
import {
  bytesToString,
  decompressFromBase64,
} from "../../../../lib/compression";
import { getJsonHeaders, getOptionsResponse } from "../../../../lib/responses";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { b64 } = params;

  if (!b64) {
    return rewrite("/404");
  }

  try {
    const bytes = await decompressFromBase64(b64, "deflate-raw", true);
    const rawScriptString = bytesToString(bytes);

    return new Response(rawScriptString, { headers: getJsonHeaders() });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return rewrite("/404");
  }
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  if (!b64) {
    return new Response(null, { status: 404 });
  }

  return getOptionsResponse();
};

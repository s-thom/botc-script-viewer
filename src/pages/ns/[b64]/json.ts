import type { APIRoute } from "astro";
import { decompressFromBase64 } from "../../../lib/compression";
import { MAX_AGE_SECONDS } from "../../../lib/constants";
import { decodeScript } from "../../../lib/number-store";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { b64 } = params;

  if (!b64) {
    return rewrite("/404");
  }

  try {
    const bytes = await decompressFromBase64(b64, "deflate-raw");
    const rawScript = decodeScript(bytes);
    const rawScriptString = JSON.stringify(rawScript);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
    return new Response(rawScriptString, { headers });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return rewrite("/404");
  }
};

import type { APIRoute } from "astro";
import { bytesToString, decompressFromBase64 } from "../../../lib/compression";
import { MAX_AGE_SECONDS } from "../../../lib/constants";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { b64 } = params;

  if (!b64) {
    return rewrite("/404");
  }

  try {
    const bytes = await decompressFromBase64(b64, "deflate-raw");
    const rawScriptString = bytesToString(bytes);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
    return new Response(rawScriptString, { headers });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return rewrite("/404");
  }
};

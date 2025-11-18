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
    const bytes = await decompressFromBase64(b64, "deflate-raw", true);
    const rawScript = decodeScript(bytes);
    const rawScriptString = JSON.stringify(rawScript);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
    headers.set("Access-Control-Allow-Origin", "*");
    return new Response(rawScriptString, { headers });
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

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET");
  headers.set("Access-Control-Allow-Headers", "user-agent");
  return new Response(null, { headers, status: 204 });
};

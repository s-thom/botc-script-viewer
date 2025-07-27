import type { APIRoute } from "astro";
import { bytesToString, decompressFromBase64 } from "../../../lib/compression";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { b64 } = params;

  if (!b64) {
    return rewrite("/404");
  }

  try {
    const bytes = await decompressFromBase64(b64, "gzip");
    const rawScriptString = bytesToString(bytes);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(rawScriptString, { headers });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return rewrite("/404");
  }
};

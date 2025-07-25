import type { APIRoute } from "astro";
import { decompressFromBase64 } from "../../../lib/compression";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { gz } = params;

  if (!gz) {
    return rewrite("/404");
  }

  try {
    const rawScriptString = await decompressFromBase64(gz);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(rawScriptString, { headers });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return rewrite("/404");
  }
};

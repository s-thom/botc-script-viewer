import type { APIRoute } from "astro";
import { MAX_AGE_SECONDS } from "../lib/constants";
import { scriptFromFormData } from "../lib/import.server";

export const prerender = false;

export const POST: APIRoute = async ({ request, rewrite, url: requestUrl }) => {
  const rawFormData = await request.formData();
  const result = await scriptFromFormData(requestUrl.hostname, rawFormData);

  if (result.ok) {
    try {
      const rawScriptString = JSON.stringify(result.script);

      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
      headers.set("Access-Control-Allow-Origin", "*");
      return new Response(rawScriptString, { headers });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return rewrite("/500");
    }
  }

  return rewrite("/500");
};

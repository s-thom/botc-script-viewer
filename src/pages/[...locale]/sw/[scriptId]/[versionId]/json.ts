import type { APIRoute } from "astro";
import { MAX_AGE_SECONDS } from "../../../../../lib/constants";
import { fetchScriptFromUrl } from "../../../../../lib/import";
import { AppError } from "../../../../../types/site";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { scriptId, versionId } = params;

  if (!(scriptId && versionId)) {
    return rewrite("/404");
  }

  let rawScriptString: string;
  try {
    const requestUrl = new URL(
      `https://www.botcscripts.com/script/${scriptId}/${versionId}/download`,
    );
    rawScriptString = await fetchScriptFromUrl(requestUrl);
  } catch (err) {
    throw new AppError("Error while requesting Scripts Website script", {
      cause: err,
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(rawScriptString, { headers });
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

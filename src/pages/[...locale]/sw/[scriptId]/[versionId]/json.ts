import type { APIRoute } from "astro";
import { fetchScriptFromUrl } from "../../../../../lib/import/fetch";
import {
  getJsonHeaders,
  getOptionsResponse,
} from "../../../../../lib/responses";
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

  return new Response(rawScriptString, { headers: getJsonHeaders() });
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  if (!b64) {
    return new Response(null, { status: 404 });
  }

  return getOptionsResponse();
};

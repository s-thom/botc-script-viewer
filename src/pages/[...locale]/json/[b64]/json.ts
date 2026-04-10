import type { APIRoute } from "astro";
import {
  getJsonOptionsResponse,
  getJsonRawScript,
  getJsonResponse,
} from "../../../../lib/routes/json";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { b64 } = params;

  const rawScript = await getJsonRawScript(b64);
  return getJsonResponse(rawScript);
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  // Make sure script can exist
  await getJsonRawScript(b64);

  return getJsonOptionsResponse();
};

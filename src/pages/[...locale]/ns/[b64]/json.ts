import type { APIRoute } from "astro";
import {
  getJsonOptionsResponse,
  getJsonResponse,
  getNSRawScript,
} from "../../../../lib/routes/json";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { b64 } = params;

  const rawScript = await getNSRawScript(b64);
  return getJsonResponse(rawScript);
};

export const OPTIONS: APIRoute = async ({ params }) => {
  const { b64 } = params;

  // Make sure script can exist
  await getNSRawScript(b64);

  return getJsonOptionsResponse();
};

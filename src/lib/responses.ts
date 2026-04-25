import { MAX_AGE_SECONDS } from "./constants";

export function getJsonHeaders() {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
  headers.set("Access-Control-Allow-Origin", "*");

  return headers;
}

export function getOptionsResponse(): Response {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET");
  headers.set("Access-Control-Allow-Headers", "user-agent");
  return new Response(null, { headers, status: 204 });
}

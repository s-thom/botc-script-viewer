import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import { MAX_AGE_SECONDS } from "../constants";
import type { Translator } from "../i18n";
import { normaliseScript } from "../normalise";
import { renderSvg } from "../og";
import { getScriptBannerSvg } from "../og/svg";

export async function getScriptBannerResponse(
  t: Translator,
  rawScript: BloodOnTheClocktowerCustomScript,
  currentUrl: URL,
): Promise<Response> {
  const script = normaliseScript(rawScript, t);

  const svg = await getScriptBannerSvg(t, script, currentUrl);

  const buffer = await renderSvg(svg, currentUrl);

  const headers = new Headers();
  headers.set("Content-Type", "image/png");
  headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(buffer, { headers });
}

export function getJsonOptionsResponse(): Response {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET");
  headers.set("Access-Control-Allow-Headers", "user-agent");
  return new Response(null, { headers, status: 204 });
}

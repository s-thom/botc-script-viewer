import type { APIRoute } from "astro";
import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";
import { compressToBase64, stringToBytes } from "../lib/compression";
import { scriptFromFormData } from "../lib/import.server";
import { encodeScript } from "../lib/number-store";

export const prerender = false;

/** A quick heuristic for  */
function shouldUseNumberStore(
  rawScript: BloodOnTheClocktowerCustomScript,
  jsonStringLength: number,
): boolean {
  if (jsonStringLength > 4096) {
    // Long JSON, the format is unlikely to be too helpful.
    return false;
  }

  let numHomebrews = 0;

  for (const item of rawScript) {
    if (
      typeof item === "object" &&
      item.id !== "_meta" &&
      Object.keys(item).length > 1
    ) {
      numHomebrews++;
    }
  }

  // An arbitrarily picked number.
  if (numHomebrews > 7) {
    return false;
  }

  return true;
}

export const POST: APIRoute = async ({
  request,
  rewrite,
  redirect,
  url: requestUrl,
}) => {
  async function handleRawScriptJson(
    rawScript: BloodOnTheClocktowerCustomScript,
  ): Promise<Response> {
    const minifiedScript = JSON.stringify(rawScript);

    if (shouldUseNumberStore(rawScript, minifiedScript.length)) {
      try {
        const bytes = encodeScript(rawScript);

        const base64 = await compressToBase64(bytes, "deflate-raw", true);
        return redirect(`/ns/${base64}`);
      } catch (err) {
        console.warn("Error while encoding script using Number Store", err);
      }
    }

    // Fall back to gzip
    const bytes = stringToBytes(minifiedScript);

    const base64 = await compressToBase64(bytes, "deflate-raw", true);
    return redirect(`/json/${base64}`);
  }

  const rawFormData = await request.formData();
  const result = await scriptFromFormData(requestUrl.hostname, rawFormData);

  if (result.ok) {
    try {
      return handleRawScriptJson(result.script);
    } catch (err) {
      console.error({ err });
      return rewrite("/500");
    }
  }

  return redirect(`/?error=${encodeURIComponent(result.message)}`);
};

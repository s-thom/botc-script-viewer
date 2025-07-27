import type { APIRoute } from "astro";
import { z } from "astro:schema";
import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";
import { compressToBase64, stringToBytes } from "../lib/compression";
import { encodeScript } from "../lib/number-store";
import { rawScriptValidator } from "../lib/parse";
import { KeyedRateLimit } from "../lib/rate-limits";

export const prerender = false;

const formSchema = z.object({ script: z.string() });

// Only allow 5 requests per second per hostname when requesting scripts.
const FETCH_QUEUE = new KeyedRateLimit({ intervalMs: 1000, intervalCap: 5 });

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
  if (numHomebrews > 5) {
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
    rawScriptJson: unknown,
  ): Promise<Response> {
    let minifiedScript: string;
    let rawScript: BloodOnTheClocktowerCustomScript;
    try {
      rawScript = rawScriptValidator.parse(rawScriptJson);
      minifiedScript = JSON.stringify(rawScript);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Error parsing script", JSON.stringify(err.format()));
      } else {
        console.error("Error parsing script (unknown)");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rawScript = rawScriptJson as any;

      // The script failed validation, but maybe it's OK. Send forth and see if the renderer will handle it.
      minifiedScript = JSON.stringify(rawScriptJson);
    }

    if (shouldUseNumberStore(rawScript, minifiedScript.length)) {
      try {
        const bytes = encodeScript(rawScript);

        const base64 = await compressToBase64(bytes, "deflate-raw");
        return redirect(`/ns/${base64}`);
      } catch (err) {
        console.warn("Error while encoding script using Number Store", err);
      }
    }

    // Fall back to gzip
    const bytes = stringToBytes(minifiedScript);

    const base64 = await compressToBase64(bytes, "deflate-raw");
    return redirect(`/json/${base64}`);
  }

  try {
    const rawFormData = await request.formData();
    const formData = formSchema.parse(
      Object.fromEntries(rawFormData.entries()),
    );

    const url = URL.parse(formData.script);
    if (url !== null) {
      // If it's the same hostname, then no need to do requests
      if (url.hostname === requestUrl.hostname) {
        const pathMatch = url.pathname.match(
          /^\/([^/]+)\/([^/]+)(?:\/(json))?$/,
        );
        if (pathMatch) {
          return redirect(`/${pathMatch[0]}/${pathMatch[1]}`);
        }

        return redirect(url.toString());
      }

      // Special handling for the scripts website
      if (url.hostname === "botc-scripts.azurewebsites.net") {
        // Replace normal HTML page with download link
        const htmlPathMatch = url.pathname.match(/^\/script\/(\d+)\/([^/]+)$/);
        if (htmlPathMatch) {
          url.pathname = `/script/${htmlPathMatch[1]}/${htmlPathMatch[2]}/download`;
        }
      }

      // Otherwise request URL and convert
      const jsonRequestHeaders = new Headers();
      jsonRequestHeaders.set("Accept", "application/json");
      jsonRequestHeaders.set(
        "User-Agent",
        "Mozilla/5.0 (compatible; Script Viewer/1.0; +https://github.com/s-thom/botc-script-viewer)",
      );

      let response: Response;
      try {
        response = await FETCH_QUEUE.enqueue(url.hostname, () =>
          fetch(url, { headers: jsonRequestHeaders }),
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return redirect(
          `/?error=${encodeURIComponent("Cannot find script at this URL.")}`,
        );
      }

      if (!response.ok) {
        return redirect(
          `/?error=${encodeURIComponent("Cannot find script at this URL.")}`,
        );
      }

      const responseType = response.headers.get("Content-Type");
      if (!(responseType === "application/json" || responseType === null)) {
        return redirect(`/?error=${encodeURIComponent("URL is not JSON.")}`);
      }

      let rawScriptJson: unknown;
      try {
        rawScriptJson = await response.json();

        if (!Array.isArray(rawScriptJson)) {
          return redirect(
            `/?error=${encodeURIComponent("Cannot find script at this URL.")}`,
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return redirect(
          `/?error=${encodeURIComponent("Cannot find script at this URL.")}`,
        );
      }

      return handleRawScriptJson(rawScriptJson);
    }

    // Script input is not a URL, try parse it as raw JSON.
    let rawScriptJson: string;
    try {
      rawScriptJson = JSON.parse(formData.script);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return redirect(`/?error=${encodeURIComponent("Invalid script JSON.")}`);
    }

    return handleRawScriptJson(rawScriptJson);
  } catch (err) {
    console.error({ err });
    return rewrite("/500");
  }
};

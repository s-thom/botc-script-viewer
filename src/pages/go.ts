import type { APIRoute } from "astro";
import { z } from "astro:schema";
import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";
import { compressToBase64 } from "../lib/compression";
import { rawScriptValidator } from "../lib/parse";
import { KeyedRateLimit } from "../lib/rate-limits";

export const prerender = false;

const formSchema = z.object({ script: z.string() });

// Only allow 5 requests per second per hostname when requesting scripts.
const FETCH_QUEUE = new KeyedRateLimit({ intervalMs: 1000, intervalCap: 5 });

export const POST: APIRoute = async ({
  request,
  rewrite,
  redirect,
  url: requestUrl,
}) => {
  async function handleRawScriptJson(
    rawScriptJson: unknown,
  ): Promise<Response> {
    let rawScript: BloodOnTheClocktowerCustomScript;
    try {
      rawScript = rawScriptValidator.parse(rawScriptJson);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Error parsing script", JSON.stringify(err.format()));
      } else {
        console.error("Error parsing script (unknown)");
      }

      // The script failed validation, but maybe it's OK. Send forth and see if the renderer will handle it.
      const minifiedScript = JSON.stringify(rawScriptJson);
      const gz = await compressToBase64(minifiedScript);

      return redirect(`/gz/${gz}`);
    }

    // Only gz is implemented right now.
    const minifiedScript = JSON.stringify(rawScript);
    const gz = await compressToBase64(minifiedScript);

    return redirect(`/gz/${gz}`);
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
        return redirect(
          `/?error=${encodeURIComponent("URL is not a script JSON.")}`,
        );
      }

      let rawScriptJson: unknown;
      try {
        rawScriptJson = await response.json();
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

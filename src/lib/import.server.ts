import z from "zod";
import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";
import { LOCAL_SCRIPT_COLLECTIONS } from "../scripts";
import { decompressFromBase64 } from "./compression";
import { decodeScript } from "./number-store";
import { rawScriptValidator } from "./parse";
import { KeyedRateLimit } from "./rate-limits";

type FormResult =
  | { ok: true; script: BloodOnTheClocktowerCustomScript }
  | { ok: false; message: string };

const formSchema = z.object({
  script: z.string().optional(),
  file: z
    .any()
    .refine((value) => typeof value === "object" && value instanceof File)
    .optional(),
});

// Only allow 5 requests per second per hostname when requesting scripts.
const FETCH_QUEUE = new KeyedRateLimit({ intervalMs: 1000, intervalCap: 5 });

export async function scriptFromFormData(
  serverHostname: string,
  rawFormData: FormData,
): Promise<FormResult> {
  function ok(json: unknown): FormResult {
    try {
      const script = rawScriptValidator.parse(json);
      return { ok: true, script };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return error("JSON is not a valid script.");
    }
  }

  function error(message: string): FormResult {
    return { ok: false, message };
  }

  try {
    const formData = formSchema.parse(
      Object.fromEntries(rawFormData.entries()),
    );

    if (!formData.file && !formData.script) {
      return error("Missing script.");
    }

    if (formData.file && formData.file.size > 0) {
      if (formData.file.type !== "application/json") {
        return error("File must be JSON.");
      }

      const content = await formData.file.text();

      let rawScriptJson: BloodOnTheClocktowerCustomScript;
      try {
        rawScriptJson = JSON.parse(content);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return error("File must be JSON.");
      }

      return ok(rawScriptJson);
    }

    const script = formData.script!;

    const url = URL.parse(script);
    if (url !== null) {
      // If it's the same hostname, then no need to do requests
      if (url.hostname === serverHostname) {
        const pathMatch = url.pathname.match(
          /^\/([^/]+)\/([^/]+)(?:\/(json))?$/,
        );
        if (pathMatch) {
          const [, scheme, data] = pathMatch;

          if (scheme in LOCAL_SCRIPT_COLLECTIONS) {
            const definition = LOCAL_SCRIPT_COLLECTIONS[
              scheme as keyof typeof LOCAL_SCRIPT_COLLECTIONS
            ].scripts.find((entry) => entry.id === data);
            if (definition) {
              const script = await definition.getScript();
              return ok(script);
            }
          }

          if (scheme === "ns") {
            const bytes = await decompressFromBase64(data, "deflate-raw");
            const rawScript = decodeScript(bytes);

            return ok(rawScript);
          }

          return error(
            `Cannot find script for for /${pathMatch[0]}/${pathMatch[1]}`,
          );
        }

        return error("Cannot find script at this URL.");
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
        return error("Cannot find script at this URL.");
      }

      if (!response.ok) {
        return error("Cannot find script at this URL.");
      }

      const responseType = response.headers.get("Content-Type");
      if (!(responseType === "application/json" || responseType === null)) {
        return error("URL is not JSON.");
      }

      let rawScriptJson: unknown;
      try {
        rawScriptJson = await response.json();

        if (!Array.isArray(rawScriptJson)) {
          return error("Cannot find script at this URL.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return error("Cannot find script at this URL.");
      }

      return ok(rawScriptJson);
    }

    return error("Cannot find script at this URL.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return error("Error while loading script");
  }
}

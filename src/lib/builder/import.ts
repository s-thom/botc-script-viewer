import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import { rawScriptValidator } from "../parse";

export async function parseOrFetchScript(str: string): Promise<unknown> {
  const url = URL.parse(str);
  if (url !== null) {
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

    const response = await fetch(url, { headers: jsonRequestHeaders });

    if (!response.ok) {
      throw new Error("Unable to request script");
    }

    const responseType = response.headers.get("Content-Type");
    if (!(responseType === "application/json" || responseType === null)) {
      throw new Error("Script was not JSON");
    }

    let rawScriptJson: unknown;
    try {
      rawScriptJson = await response.json();

      if (!Array.isArray(rawScriptJson)) {
        throw new Error("Script is not valid JSON");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new Error("Unable to request script");
    }

    return rawScriptValidator.parse(rawScriptJson);
  }

  // Script input is not a URL, try parse it as raw JSON.
  let rawScriptJson: unknown;
  try {
    rawScriptJson = JSON.parse(str);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Script is not valid JSON");
  }

  return rawScriptJson;
}

export function validateScriptJson(
  json: unknown,
): BloodOnTheClocktowerCustomScript {
  return rawScriptValidator.parse(json);
}

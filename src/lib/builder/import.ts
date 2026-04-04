import { AppError } from "../../types/site";
import { rawScriptValidator } from "../parse";

export async function parseOrFetchScript(str: string): Promise<unknown> {
  const url = URL.parse(str);
  if (url !== null) {
    // Special handling for the scripts website
    if (url.hostname === "www.botcscripts.com") {
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
      throw new AppError("Unable to request script", {
        status: 400,
        titleKey: "viewer.errors.requestFailed",
        descriptionKey: "viewer.errors.requestFailedDescription",
        descriptionParams: { url: str },
      });
    }

    const responseType = response.headers.get("Content-Type");
    if (!(responseType === "application/json" || responseType === null)) {
      throw new AppError("Script is not valid JSON", {
        status: 400,
        titleKey: "viewer.errors.invalidJson",
        descriptionKey: "viewer.errors.invalidJsonDescription",
      });
    }

    let rawScriptJson: unknown;
    try {
      rawScriptJson = await response.json();
    } catch (err) {
      throw new AppError("Unable to request script", {
        cause: err,
        status: 400,
        titleKey: "viewer.errors.requestFailed",
        descriptionKey: "viewer.errors.requestFailedDescription",
        descriptionParams: { url: str },
      });
    }

    if (!Array.isArray(rawScriptJson)) {
      throw new AppError("Script is not valid JSON", {
        status: 400,
        titleKey: "viewer.errors.invalidJson",
        descriptionKey: "viewer.errors.invalidJsonDescription",
      });
    }

    return rawScriptValidator.parse(rawScriptJson);
  }

  // Script input is not a URL, try parse it as raw JSON.
  let rawScriptJson: unknown;
  try {
    rawScriptJson = JSON.parse(str);
  } catch (err) {
    throw new AppError("Script is not valid JSON", {
      cause: err,
      status: 400,
      titleKey: "viewer.errors.invalidJson",
      descriptionKey: "viewer.errors.invalidJsonDescription",
    });
  }

  return rawScriptJson;
}

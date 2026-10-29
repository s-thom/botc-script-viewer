import { AppError } from "../../types/site";
import { MAX_SCRIPT_SIZE_BYTES } from "../constants";
import { KeyedRateLimit } from "./rate-limits";

// Only allow 5 requests per second per hostname when requesting scripts.
export const FETCH_QUEUE = new KeyedRateLimit({
  intervalMs: 1000,
  intervalCap: 5,
  concurrency: 3,
});
export const REQUEST_USR_AGENT =
  "Script Viewer/1.0; (compatible; +https://github.com/s-thom/botc-script-viewer)";

export type JSONFetchOptions = {
  userAgent?: "default" | "build" | "user";
  redactUrlReason?: "user" | "general";
};

const USER_AGENTS: Record<
  NonNullable<JSONFetchOptions["userAgent"]>,
  string
> = {
  default: "Script Viewer/1.0; (+https://github.com/s-thom/botc-script-viewer)",
  user: "Script Viewer/1.0; (user-requested; +https://github.com/s-thom/botc-script-viewer)",
  build:
    "Script Viewer/1.0; (static-build; +https://github.com/s-thom/botc-script-viewer)",
};

const REDACT_STRINGS: Record<
  NonNullable<JSONFetchOptions["redactUrlReason"]>,
  string
> = {
  user: "<user-entered>",
  general: "<redacted>",
};

export async function fetchJson(
  url: URL,
  options: JSONFetchOptions,
): Promise<string> {
  const logUrl =
    options.redactUrlReason === undefined
      ? url.toString()
      : REDACT_STRINGS[options.redactUrlReason];

  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("User-Agent", USER_AGENTS[options.userAgent ?? "default"]);

  let response: Response;
  try {
    response = await FETCH_QUEUE.enqueue(url.hostname, () =>
      fetch(url, { headers, signal: AbortSignal.timeout(10000) }),
    );
  } catch (err) {
    throw new AppError(`Unable to get response from URL (${logUrl})`, {
      cause: err,
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  if (!response.ok) {
    throw new AppError(
      `Error response from URL (${logUrl}, ${response.status})`,
      {
        status: 404,
        titleKey: "viewer.errors.notFound",
        descriptionKey: "viewer.errors.notFoundDescription",
      },
    );
  }

  const responseType = response.headers.get("Content-Type");
  if (
    responseType !== null &&
    !responseType.split(";")[0].trim().includes("application/json")
  ) {
    throw new AppError(`Response content type was not JSON (${logUrl})`, {
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new AppError(`Response could not be read (${logUrl})`, {
      status: 500,
      titleKey: "viewer.errors.genericError",
      descriptionKey: "viewer.errors.genericErrorDescription",
    });
  }

  let currentSize = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    currentSize += value.byteLength;
    if (currentSize > MAX_SCRIPT_SIZE_BYTES) {
      await reader.cancel("Response too large");
      throw new AppError(`Response was too large (${logUrl})`, {
        status: 500,
        titleKey: "viewer.errors.genericError",
        descriptionKey: "viewer.errors.genericErrorDescription",
      });
    }
    chunks.push(value);
  }

  const combined = new Uint8Array(currentSize);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const rawScript = new TextDecoder().decode(combined);

  return rawScript;
}

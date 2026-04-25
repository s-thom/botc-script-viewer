import { FETCH_QUEUE, REQUEST_USR_AGENT } from ".";
import { AppError } from "../../types/site";
import { MAX_SCRIPT_SIZE_BYTES } from "../constants";

export async function fetchScriptFromUrl(url: URL): Promise<string> {
  // Otherwise request URL and convert
  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("User-Agent", REQUEST_USR_AGENT);

  let response: Response;
  try {
    response = await FETCH_QUEUE.enqueue(url.hostname, () =>
      fetch(url, { headers, signal: AbortSignal.timeout(10000) }),
    );
  } catch (err) {
    throw new AppError("Unable to get response from URL", {
      cause: err,
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  if (!response.ok) {
    throw new AppError(`Error response from URL (${response.status})`, {
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  const responseType = response.headers.get("Content-Type");
  if (
    responseType !== null &&
    !responseType.split(";")[0].trim().includes("application/json")
  ) {
    throw new AppError("Response content type was not JSON", {
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new AppError("Response content type was not JSON", {
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
      throw new AppError("Response was too large", {
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

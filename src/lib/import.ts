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
const REQUEST_USR_AGENT =
  "Script Viewer/1.0; (compatible; +https://github.com/s-thom/botc-script-viewer)";

interface RawScriptData {
  type: "script";
  script: string;
}

interface UrlData {
  type: "url";
  url: URL;
}

interface FileData {
  type: "file";
  file: File;
}

interface ErrorData {
  type: "error";
  message: string;
}

type AllDataType = RawScriptData | UrlData | FileData | ErrorData;

function parseImportFormData(formData: FormData): AllDataType {
  const { script, file } = formSchema.parse(
    Object.fromEntries(formData.entries()),
  );

  if (file && file.size > 0) {
    if (file.type !== "application/json") {
      throw new Error("File must be JSON.");
    }

    return {
      type: "file",
      file,
    };
  }

  if (script) {
    const url = URL.parse(script);
    if (url != null) {
      return {
        type: "url",
        url,
      };
    }

    return {
      type: "script",
      script,
    };
  }

  return {
    type: "error",
    message: "No script data provided",
  };
}

function parseScriptJson(str: string): BloodOnTheClocktowerCustomScript {
  const json = JSON.parse(str);

  const result = rawScriptValidator.safeParse(json);
  if (result.success) {
    return result.data;
  }

  throw new Error("JSON is not a valid script.");
}

async function fetchScriptFromUrl(
  url: URL,
  serverHostname: string,
  allowRemote: boolean,
): Promise<RawScriptData | ErrorData> {
  // If it's the same hostname, then no need to do requests
  if (url.hostname === serverHostname) {
    const pathMatch = url.pathname.match(/^\/([^/]+)\/([^/]+)(?:\/(json))?$/);
    if (pathMatch) {
      const [, scheme, data] = pathMatch;

      if (scheme in LOCAL_SCRIPT_COLLECTIONS) {
        const definition = LOCAL_SCRIPT_COLLECTIONS[
          scheme as keyof typeof LOCAL_SCRIPT_COLLECTIONS
        ].scripts.find((entry) => entry.id === data);
        if (definition) {
          const script = await definition.getScript();
          return {
            type: "script",
            script: JSON.stringify(script),
          };
        }
      }

      if (scheme === "ns") {
        const bytes = await decompressFromBase64(data, "deflate-raw", true);
        const rawScript = decodeScript(bytes);

        return {
          type: "script",
          script: JSON.stringify(rawScript),
        };
      }

      return {
        type: "error",
        message: `Cannot find script for path /${pathMatch[0]}/${pathMatch[1]}`,
      };
    }

    return {
      type: "error",
      message: "Unknown path",
    };
  }

  if (!allowRemote) {
    return {
      type: "error",
      message: "Remote scripts not allowed",
    };
  }

  // Otherwise request URL and convert
  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("User-Agent", REQUEST_USR_AGENT);

  let response: Response;
  try {
    response = await FETCH_QUEUE.enqueue(url.hostname, () =>
      fetch(url, { headers }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return {
      type: "error",
      message: "Cannot find script at this URL",
    };
  }

  if (!response.ok) {
    return {
      type: "error",
      message: "Cannot find script at this URL",
    };
  }

  const responseType = response.headers.get("Content-Type");
  if (!(responseType === "application/json" || responseType === null)) {
    return {
      type: "error",
      message: "URL does not contain JSON",
    };
  }

  try {
    const rawScript = await response.text();

    return {
      type: "script",
      script: rawScript,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return {
      type: "error",
      message: "Error reading response",
    };
  }
}

export async function scriptFromFormData(
  formData: FormData,
  serverHostname: string,
  allowRemote: boolean,
): Promise<FormResult> {
  const formContents = parseImportFormData(formData);

  let scriptString: string;
  switch (formContents.type) {
    case "script":
      scriptString = formContents.script;
      break;
    case "url":
      {
        const result = await fetchScriptFromUrl(
          formContents.url,
          serverHostname,
          allowRemote,
        );
        if (result.type === "error") {
          return { ok: false, message: result.message };
        }
        scriptString = result.script;
      }
      break;
    case "file":
      {
        const content = await formContents.file.text();
        scriptString = content;
      }
      break;
    case "error":
      return { ok: false, message: formContents.message };
  }

  try {
    const script = parseScriptJson(scriptString);
    return { ok: true, script };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { ok: false, message: "Error while loading script" };
  }
}

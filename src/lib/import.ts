import z from "astro/zod";
import type {
  BloodOnTheClocktowerCustomScript,
  OfficialCharacterDeprecated,
  ScriptCharacter,
} from "../generated/script-schema";
import { LOCAL_SCRIPT_COLLECTIONS } from "../scripts";
import { AppError } from "../types/site";
import { decompressFromBase64 } from "./compression";
import type { LocaleIds } from "./i18n";
import { decodeScript } from "./number-store";
import { rawScriptValidator } from "./parse";
import { KeyedRateLimit } from "./rate-limits";

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

type AllDataType = RawScriptData | UrlData | FileData;

function parseImportFormData(formData: FormData): AllDataType {
  const schemaResult = formSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!schemaResult.success) {
    throw new AppError("Invalid form data", {
      cause: schemaResult.error,
      status: 400,
      titleKey: "viewer.errors.invalidJson",
      descriptionKey: "viewer.errors.invalidJsonDescription",
    });
  }

  const { script, file } = schemaResult.data;
  if (file && file.size > 0) {
    if (file.type !== "application/json") {
      throw new AppError("Uploaded file is not JSON", {
        status: 400,
        titleKey: "viewer.errors.invalidJson",
        descriptionKey: "viewer.errors.invalidJsonDescription",
      });
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

  throw new AppError("No script content given", {
    status: 400,
    titleKey: "viewer.errors.invalidJson",
    descriptionKey: "viewer.errors.invalidJsonDescription",
  });
}

function parseScriptJsonFromString(
  str: string,
): BloodOnTheClocktowerCustomScript {
  let json: unknown;
  try {
    json = JSON.parse(str);
  } catch (err) {
    throw new AppError("Script is not valid JSON", {
      cause: err,
      status: 400,
      titleKey: "viewer.errors.invalidJson",
      descriptionKey: "viewer.errors.invalidJsonDescription",
    });
  }

  const result = rawScriptValidator.safeParse(json);
  if (!result.success) {
    throw new AppError("Script is not valid JSON", {
      status: 400,
      titleKey: "viewer.errors.invalidScript",
      descriptionKey: "viewer.errors.invalidScriptDescription",
    });
  }

  const script = result.data;

  // If a homebrew character definition is incorrect, then it'll likely parse
  // to the legacy { id: string } format anyway.
  // This check is to ensure that all legacy objects in the parsed output don't
  // have an ability text defined in the original (which is a likely indicator).

  for (const item of script) {
    if (
      typeof item === "object" &&
      "id" in item &&
      item.id !== "_meta" &&
      !("ability" in item)
    ) {
      const original = (json as BloodOnTheClocktowerCustomScript).find(
        (originalItem) =>
          typeof originalItem === "object" && originalItem.id === item.id,
      ) as ScriptCharacter | OfficialCharacterDeprecated;

      if ("ability" in original) {
        throw new AppError(`Homebrew character ${item.id} parsed incorrectly`, {
          status: 500,
          titleKey: "viewer.errors.invalidScript",
          descriptionKey: "viewer.errors.invalidScriptDescription",
        });
      }
    }
  }

  return script;
}

async function fetchScriptFromUrl(
  url: URL,
  locale: LocaleIds,
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
          const script = await definition.getScript[locale]();
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
  locale: LocaleIds,
  serverHostname: string,
  allowRemote: boolean,
): Promise<BloodOnTheClocktowerCustomScript> {
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
          locale,
          serverHostname,
          allowRemote,
        );
        if (result.type === "error") {
          throw new AppError(result.message, {
            status: 400,
            titleKey: "viewer.errors.requestFailed",
            descriptionKey: "viewer.errors.requestFailedDescription",
          });
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
  }

  const script = parseScriptJsonFromString(scriptString);
  return script;
}

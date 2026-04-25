import z from "astro/zod";
import type {
  BloodOnTheClocktowerCustomScript,
  OfficialCharacterDeprecated,
  ScriptCharacter,
} from "../../generated/script-schema";
import { AppError } from "../../types/site";
import { fetchScriptFromUrl } from "./fetch";
import { KeyedRateLimit } from "./rate-limits";
import { rawScriptValidator } from "./schema";

const formSchema = z.object({
  locale: z.string(),
  script: z.string().optional(),
  file: z
    .any()
    .refine((value) => typeof value === "object" && value instanceof File)
    .optional(),
});

// Only allow 5 requests per second per hostname when requesting scripts.
export const FETCH_QUEUE = new KeyedRateLimit({
  intervalMs: 1000,
  intervalCap: 5,
});
export const REQUEST_USR_AGENT =
  "Script Viewer/1.0; (compatible; +https://github.com/s-thom/botc-script-viewer)";

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
      cause: result.error,
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

export async function scriptFromFormData(
  formData: FormData,
): Promise<BloodOnTheClocktowerCustomScript> {
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
  let scriptString: string | undefined;
  if (file && file.size > 0) {
    if (file.type !== "application/json") {
      throw new AppError("Uploaded file is not JSON", {
        status: 400,
        titleKey: "viewer.errors.invalidJson",
        descriptionKey: "viewer.errors.invalidJsonDescription",
      });
    }

    scriptString = await file.text();
  } else if (script) {
    const url = URL.parse(script);
    if (url != null) {
      scriptString = await fetchScriptFromUrl(url);
    }

    scriptString = script;
  }

  if (!scriptString) {
    throw new AppError("No script content given", {
      status: 400,
      titleKey: "viewer.errors.invalidJson",
      descriptionKey: "viewer.errors.invalidJsonDescription",
    });
  }

  const parsedScript = parseScriptJsonFromString(scriptString);
  return parsedScript;
}

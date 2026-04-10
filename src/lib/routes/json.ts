import { getRelativeLocaleUrl } from "astro:i18n";
import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import { LOCAL_SCRIPT_COLLECTIONS } from "../../scripts";
import { AppError } from "../../types/site";
import { bytesToString, decompressFromBase64 } from "../compression";
import { MAX_AGE_SECONDS } from "../constants";
import type { LocaleIds } from "../i18n";
import { decodeScript } from "../number-store";

export async function getCollectionRawScript(
  locale: string | undefined,
  collectionId: string | undefined,
  scriptId: string | undefined,
): Promise<BloodOnTheClocktowerCustomScript> {
  const resolvedLocale = (locale ?? "en") as LocaleIds;

  if (!collectionId || !scriptId) {
    throw new AppError("Script not found", {
      titleKey: "viewer.errors.genericError",
      descriptionKey: "viewer.errors.genericErrorDescription",
      status: 500,
    });
  }

  if (!(collectionId in LOCAL_SCRIPT_COLLECTIONS)) {
    throw new AppError(`Collection ${collectionId} not found`, {
      titleKey: "viewer.errors.notFoundHeading",
      descriptionKey: "viewer.errors.notFoundDescription",
      descriptionParams: {
        link: getRelativeLocaleUrl(resolvedLocale, "/"),
      },
      status: 404,
    });
  }

  const collection =
    LOCAL_SCRIPT_COLLECTIONS[
      collectionId as keyof typeof LOCAL_SCRIPT_COLLECTIONS
    ];

  const scriptDefinition = collection.scripts.find(
    (script) => script.id === scriptId,
  );
  if (!scriptDefinition) {
    throw new AppError(
      `Script ${scriptId} not found in collection ${collectionId}`,
      {
        titleKey: "viewer.errors.notFoundHeading",
        descriptionKey: "viewer.errors.notFoundDescription",
        descriptionParams: {
          link: getRelativeLocaleUrl(resolvedLocale, "/"),
        },
        status: 404,
      },
    );
  }

  const getScript =
    scriptDefinition.localeOverrides?.[resolvedLocale] ??
    scriptDefinition.getScript;
  const rawScript = await getScript();

  return rawScript;
}

export async function getJsonRawScript(
  b64: string | undefined,
): Promise<BloodOnTheClocktowerCustomScript> {
  if (!b64) {
    throw new AppError("Script not found", {
      titleKey: "viewer.errors.genericError",
      descriptionKey: "viewer.errors.genericErrorDescription",
      status: 500,
    });
  }

  const bytes = await decompressFromBase64(b64, "deflate-raw", true);
  const rawScriptString = bytesToString(bytes);
  const rawScript: BloodOnTheClocktowerCustomScript =
    JSON.parse(rawScriptString);

  return rawScript;
}

export async function getNSRawScript(
  b64: string | undefined,
): Promise<BloodOnTheClocktowerCustomScript> {
  if (!b64) {
    throw new AppError("Script not found", {
      titleKey: "viewer.errors.genericError",
      descriptionKey: "viewer.errors.genericErrorDescription",
      status: 500,
    });
  }

  const bytes = await decompressFromBase64(b64, "deflate-raw", true);
  const rawScript = decodeScript(bytes);

  return rawScript;
}

export async function getJsonResponse(
  rawScript: BloodOnTheClocktowerCustomScript,
): Promise<Response> {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(JSON.stringify(rawScript), { headers });
}

export function getJsonOptionsResponse(): Response {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET");
  headers.set("Access-Control-Allow-Headers", "user-agent");
  return new Response(null, { headers, status: 204 });
}

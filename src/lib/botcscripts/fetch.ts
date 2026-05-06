import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import { AppError } from "../../types/site";
import { fetchScriptFromUrl } from "../import/fetch";

export async function fetchRawScript(
  scriptId: string,
  versionId: string,
): Promise<BloodOnTheClocktowerCustomScript> {
  let rawScriptString: string;
  try {
    const requestUrl = new URL(
      `https://www.botcscripts.com/script/${scriptId}/${versionId}/download`,
    );
    rawScriptString = await fetchScriptFromUrl(requestUrl);
  } catch (err) {
    throw new AppError("Error while requesting script from BotC Scripts", {
      cause: err,
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  let rawScript: BloodOnTheClocktowerCustomScript;
  try {
    rawScript = JSON.parse(rawScriptString);
  } catch (err) {
    throw new AppError("Error while requesting script from BotC Scripts", {
      cause: err,
      status: 500,
      titleKey: "viewer.errors.genericError",
      descriptionKey: "viewer.errors.genericErrorDescription",
    });
  }

  return rawScript;
}

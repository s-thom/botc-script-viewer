import { AppError } from "../../types/site";
import { fetchScriptFromUrl } from "./fetch";

// TODO: Replace this with fetching by primary key as soon as there's an API to resolve
// script ID and version into a PK.
export async function fetchScriptByIdVersion(
  scriptId: string,
  versionId: string,
): Promise<string> {
  let rawScriptString: string;
  try {
    const requestUrl = new URL(
      `https://www.botcscripts.com/script/${scriptId}/${versionId}/download`,
    );
    rawScriptString = await fetchScriptFromUrl(requestUrl);
  } catch (err) {
    throw new AppError("Error while requesting Scripts Website script", {
      cause: err,
      status: 404,
      titleKey: "viewer.errors.notFound",
      descriptionKey: "viewer.errors.notFoundDescription",
    });
  }

  return rawScriptString;
}

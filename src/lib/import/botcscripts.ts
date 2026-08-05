import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import { AppError } from "../../types/site";
import { fetchJson } from "./fetch";

const ALLOWED_HOSTS = new Set(["www.botcscripts.com"]);

interface ScriptInstance {
  pk: number;
  name: string;
  versions: Record<string, string>;
  latest_version: string;
}

interface VersionInstance {
  pk: number;
  script_id: number;
  name: string;
  version: string;
  script_type: "Full" | "Teensyville";
  author: string;
  content: BloodOnTheClocktowerCustomScript;
  score: number;
}

export async function fetchScriptInstance(
  scriptId: string,
): Promise<ScriptInstance> {
  const requestUrl = new URL(
    `https://www.botcscripts.com/api/script_ids/${scriptId}/`,
  );
  const responseStr = await fetchJson(requestUrl);

  try {
    const instance: ScriptInstance = JSON.parse(responseStr);

    return instance;
  } catch (err) {
    throw new AppError(
      `Error while parsing BotC Scripts script instance ${scriptId}`,
      {
        cause: err,
        status: 500,
        titleKey: "viewer.errors.genericError",
        descriptionKey: "viewer.errors.genericErrorDescription",
      },
    );
  }
}

export async function fetchVersionInstance(
  scriptInstance: ScriptInstance,
  versionId: string,
): Promise<VersionInstance> {
  const versionUrl = scriptInstance.versions[versionId];
  if (!versionUrl) {
    throw new AppError(
      `Version ${versionId} not found for script id ${scriptInstance.pk}`,
      {
        status: 404,
        titleKey: "viewer.errors.notFound",
        descriptionKey: "viewer.errors.notFoundDescription",
      },
    );
  }

  const parsedUrl = new URL(versionUrl);
  if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    throw new AppError(
      `Version ${versionId} of script ${scriptInstance.pk} has a URL with a disallowed hostname: ${parsedUrl.hostname}`,
      {
        status: 500,
        titleKey: "viewer.errors.genericError",
        descriptionKey: "viewer.errors.genericErrorDescription",
      },
    );
  }

  const responseStr = await fetchJson(parsedUrl);

  try {
    const instance: VersionInstance = JSON.parse(responseStr);

    return instance;
  } catch (err) {
    throw new AppError(
      `Error while parsing BotC Scripts version instance ${versionId} of script ${scriptInstance.pk}`,
      {
        cause: err,
        status: 500,
        titleKey: "viewer.errors.genericError",
        descriptionKey: "viewer.errors.genericErrorDescription",
      },
    );
  }
}

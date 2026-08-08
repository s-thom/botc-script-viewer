import type {
  BloodOnTheClocktowerCustomScript,
  ScriptCharacter,
  ScriptMetadata,
} from "../../generated/script-schema";
import { AppError } from "../../types/site";
import { KLUTZBANANA_HOSTNAME } from "../constants";
import { fetchJson } from "./fetch";

interface KlutzbananaMetadata {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  saveName: string;
  name: string;
  author: string;
  logo: string | null;
  visibility: "public";
  hideTitle: boolean | null;
  background: string | null;
  almanac: string | null;
  bootlegger: string[] | null;
  firstNight: string[] | null;
  otherNight: string[] | null;
  almanacIntroduction: string | null;
}

async function fetchKlutzbananaMetadata(
  scriptId: string,
): Promise<KlutzbananaMetadata> {
  const responseStr = await fetchJson(
    new URL(`https://${KLUTZBANANA_HOSTNAME}/api/public/scripts/${scriptId}`),
  );

  try {
    const instance: KlutzbananaMetadata = JSON.parse(responseStr);

    return instance;
  } catch (err) {
    throw new AppError(
      `Error while parsing Klutzbanana script metadata ${scriptId}`,
      {
        cause: err,
        status: 500,
        titleKey: "viewer.errors.genericError",
        descriptionKey: "viewer.errors.genericErrorDescription",
      },
    );
  }
}

async function fetchKlutzbananaCharacters(
  scriptId: string,
): Promise<ScriptCharacter[]> {
  const responseStr = await fetchJson(
    new URL(
      `https://${KLUTZBANANA_HOSTNAME}/api/public/scripts/${scriptId}/characters`,
    ),
  );

  try {
    const instance: ScriptCharacter[] = JSON.parse(responseStr);

    return instance;
  } catch (err) {
    throw new AppError(
      `Error while parsing Klutzbanana script characters ${scriptId}`,
      {
        cause: err,
        status: 500,
        titleKey: "viewer.errors.genericError",
        descriptionKey: "viewer.errors.genericErrorDescription",
      },
    );
  }
}

export async function fetchKlutzbananaScript(
  scriptId: string,
): Promise<BloodOnTheClocktowerCustomScript> {
  const [metadata, characters] = await Promise.all([
    fetchKlutzbananaMetadata(scriptId),
    fetchKlutzbananaCharacters(scriptId),
  ]);

  const meta: ScriptMetadata = {
    id: "_meta",
    name: metadata.name ?? metadata.saveName,
    author: metadata.author,
    hideTitle: metadata.hideTitle ?? false,
    logo: metadata.logo ?? undefined,
    background: metadata.background ?? undefined,
    almanac:
      metadata.almanac ??
      `https://${KLUTZBANANA_HOSTNAME}/scripts/${scriptId}/_`,
    bootlegger: metadata.bootlegger ?? undefined,
    firstNight: metadata.firstNight ?? undefined,
    otherNight: metadata.otherNight ?? undefined,
  };

  return [meta, ...characters];
}

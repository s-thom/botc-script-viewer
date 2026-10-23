import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import type {
  NightInfo,
  NormalisedScript,
  NormalisedScriptCharacter,
} from "../../types/botc";
import { getCharacterIcon, getFallbackIcon } from "../character-icon";
import { CHARACTERS_BY_ID } from "../characters";
import type { Translator } from "../i18n/types";
import {
  PRINT_STRING_KEYS,
  PRINT_TEAM_STRING_KEYS,
  type PrintCharacter,
  type PrintData,
  type PrintIcon,
  type PrintNightEntry,
  type PrintTeamId,
} from "./data";
import { toPrintSegments } from "./segments";

/** Pixel size icons are rendered at: about 300dpi at the largest printed size. */
const ICON_PX = 192;

const TEAM_IDS = Object.keys(PRINT_TEAM_STRING_KEYS) as PrintTeamId[];

/**
 * Resolve a character's icon to a print-resolution URL.
 * Images are resolved here, on the server, so that the client never has to run Astro's image pipeline.
 */
function createIconResolver() {
  const cache = new Map<string, Promise<string>>();

  function resolveUrl(src: string | ImageMetadata) {
    const key = typeof src === "string" ? src : src.src;
    let result = cache.get(key);
    if (!result) {
      result = getImage({ src, width: ICON_PX, height: ICON_PX }).then(
        (image) => image.src,
      );
      cache.set(key, result);
    }
    return result;
  }

  return async function resolveIcon(
    character: NormalisedScriptCharacter,
  ): Promise<PrintIcon> {
    const [src, fallback] = await Promise.all([
      resolveUrl(getCharacterIcon(character)),
      resolveUrl(getFallbackIcon(character.team)),
    ]);
    return { src, fallback };
  };
}

function nightInfoCharacter(info: NightInfo): NormalisedScriptCharacter {
  if (info.type === "character") {
    return info.character;
  }
  return {
    edition: "special",
    team: "fabled",
    id: info.id,
    name: info.name,
    ability: info.reminderText ?? "",
    normalisedId: info.id,
    isHomebrew: false,
  };
}

export async function buildPrintData(
  t: Translator,
  script: NormalisedScript,
  qr: { src: string; url: string },
): Promise<PrintData> {
  const resolveIcon = createIconResolver();
  const plain = (text: string) =>
    t.rawString(text, { formatReplacements: true });
  const formatted = (text: string) =>
    toPrintSegments(t.raw(text, { formatReplacements: true }));

  const jinxedWith = new Map<string, NormalisedScriptCharacter[]>();
  for (const { character1, character2 } of script.jinxes) {
    for (const [a, b] of [
      [character1, character2],
      [character2, character1],
    ]) {
      jinxedWith.set(a.id, [...(jinxedWith.get(a.id) ?? []), b]);
    }
  }

  const teamEntries = await Promise.all(
    TEAM_IDS.map(async (team) => {
      const characters: PrintCharacter[] = await Promise.all(
        script.teams[team].map(async (character) => ({
          id: character.id,
          name: t.rawString(character.name),
          ability: formatted(character.ability ?? ""),
          icon: await resolveIcon(character),
          jinxIcons: await Promise.all(
            (jinxedWith.get(character.id) ?? []).map(resolveIcon),
          ),
        })),
      );
      return [team, characters] as const;
    }),
  );

  const nightEntries = (info: NightInfo[]): Promise<PrintNightEntry[]> =>
    Promise.all(
      info.map(async (entry) => {
        const character = nightInfoCharacter(entry);
        return {
          name: t.rawString(
            entry.type === "character" ? entry.character.name : entry.name,
          ),
          text: entry.reminderText ? formatted(entry.reminderText) : undefined,
          icon: await resolveIcon(character),
          special: entry.type === "special",
          traveller:
            entry.type === "character" && entry.character.team === "traveller",
        };
      }),
    );

  const bootleggerCharacter = CHARACTERS_BY_ID.get("bootlegger");
  const bootleggerIcon =
    bootleggerCharacter && (await resolveIcon(bootleggerCharacter));

  const strings: Record<string, string> = {};
  for (const key of PRINT_STRING_KEYS) {
    strings[key] = t.string(key).value;
  }
  for (const key of Object.values(PRINT_TEAM_STRING_KEYS)) {
    strings[key] = t.string(key, { count: Infinity }).value;
  }

  return {
    title: script.name || t.string("viewer.script.untitledScript").value,
    author: script.author
      ? t.string("viewer.script.byAuthor", { author: script.author }).value
      : undefined,
    teams: Object.fromEntries(teamEntries) as PrintData["teams"],
    jinxes: await Promise.all(
      script.jinxes.map(async (jinx) => ({
        names: t
          .ListFormat()
          .format([jinx.character1.name, jinx.character2.name]),
        reason: plain(jinx.reason),
        icons: await Promise.all([
          resolveIcon(jinx.character1),
          resolveIcon(jinx.character2),
        ]),
      })),
    ),
    bootlegger: bootleggerIcon
      ? (script.bootlegger ?? []).map((rule) => ({
          text: plain(rule),
          icon: bootleggerIcon,
        }))
      : [],
    firstNight: await nightEntries(script.firstNight),
    otherNight: await nightEntries(script.otherNight),
    qr,
    strings,
  };
}

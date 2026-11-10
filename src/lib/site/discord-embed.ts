import { formatHex, parse } from "culori";
import type { NormalisedScript } from "../../types/botc.ts";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "../constants.ts";
import type { Translator } from "../i18n/types.ts";

const MAX_PAYLOAD_BYTES = 3000;
const MAX_BUTTON_URL_LENGTH = 512;
const MAX_MEDIA_URL_LENGTH = 2048;

const TEAM_ORDER = [
  "townsfolk",
  "outsider",
  "minion",
  "demon",
  "traveller",
  "fabled",
  "loric",
] as const satisfies (keyof NormalisedScript["teams"])[];

export interface DiscordEmbedOptions {
  color?: string;
  viewUrl: string;
  printUrl: string;
}

export function getDiscordEmbedJson(
  t: Translator,
  script: NormalisedScript,
  options: DiscordEmbedOptions,
): string | undefined {
  const encoder = new TextEncoder();
  const largestTeamSize = Math.max(
    ...TEAM_ORDER.map((team) => script.teams[team].length),
  );

  for (let limit = largestTeamSize; limit >= 0; limit--) {
    const json = serialise(buildPayload(t, script, options, limit));
    if (encoder.encode(json).byteLength <= MAX_PAYLOAD_BYTES) {
      return json;
    }
  }

  return undefined;
}

function buildPayload(
  t: Translator,
  script: NormalisedScript,
  options: DiscordEmbedOptions,
  namesPerTeam: number,
) {
  const title = script.name || t.string("viewer.script.untitledScript").value;
  let headerContent = `# ${escapeMarkdown(title)}`;
  if (script.author) {
    headerContent += `\n${t.string("viewer.script.byAuthor", { author: escapeMarkdown(script.author) }).value}`;
  }

  const header = { type: 10, content: headerContent };
  const logoUrl = getLogoUrl(script.logo);

  const components: object[] = [
    logoUrl
      ? {
          type: 9,
          components: [header],
          accessory: { type: 11, media: { url: logoUrl } },
        }
      : header,
    { type: 14 },
    { type: 10, content: getTeamsContent(t, script, namesPerTeam) },
  ];

  const buttons = [
    { label: t.string("viewer.discord.view").value, url: options.viewUrl },
    {
      label: t.string("viewer.navigation.print").value,
      url: options.printUrl,
    },
  ]
    .filter(({ url }) => url.length <= MAX_BUTTON_URL_LENGTH)
    .map(({ label, url }) => ({ type: 2, style: 5, label, url }));

  if (buttons.length > 0) {
    components.push({ type: 1, components: buttons });
  }

  const accentColor = getAccentColor(options.color);

  return {
    component: {
      type: 17,
      ...(accentColor !== undefined && { accent_color: accentColor }),
      components,
    },
  };
}

function getTeamsContent(
  t: Translator,
  script: NormalisedScript,
  namesPerTeam: number,
): string {
  const listFormat = t.ListFormat();

  return TEAM_ORDER.filter((team) => script.teams[team].length > 0)
    .map((team) => {
      const characters = script.teams[team];
      const label = t.string(`app.grimoire.${team}`, {
        count: characters.length,
      }).value;

      const names = characters
        .slice(0, namesPerTeam)
        .map((character) => escapeMarkdown(character.name));
      const remaining = characters.length - names.length;
      if (remaining > 0) {
        names.push(
          t.string("viewer.discord.moreCharacters", { count: remaining }).value,
        );
      }

      return `**${label}**\n${listFormat.format(names)}`;
    })
    .join("\n");
}

function getLogoUrl(logo: string | undefined): string | undefined {
  if (!logo || logo.length > MAX_MEDIA_URL_LENGTH) {
    return undefined;
  }

  try {
    const url = new URL(logo);
    return ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname) ? logo : undefined;
  } catch {
    return undefined;
  }
}

function getAccentColor(color: string | undefined): number | undefined {
  if (color === undefined) {
    return undefined;
  }
  const parsed = parse(color);
  return parsed ? parseInt(formatHex(parsed).slice(1), 16) : undefined;
}

function escapeMarkdown(text: string): string {
  return text.replace(/[\\*_~`|<>#[\]()-]/g, "\\$&");
}

function serialise(payload: object): string {
  // Stops the JSON from closing the inline script tag it's embedded in.
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

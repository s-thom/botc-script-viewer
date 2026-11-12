import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import { getCharacterIcon } from "../lib/character-icon";
import { roles } from "../lib/data";
import { createTranslator } from "../lib/i18n";
import { normaliseScript } from "../lib/normalise";
import type { OgIconManifest } from "../lib/og/icons";
import { ICON_SIZE } from "../lib/og/layout";

export const prerender = true;

export const GET: APIRoute = async () => {
  const t = await createTranslator({ locale: "en" });
  const script = normaliseScript(
    roles.map((character) => character.id),
    t,
  );

  const entries = await Promise.all(
    script.characters.map(async (character) => {
      const image = await getImage({
        src: getCharacterIcon(character),
        width: ICON_SIZE,
        height: ICON_SIZE,
        format: "png",
      });
      return [character.id, image.src] as const;
    }),
  );

  const manifest: OgIconManifest = Object.fromEntries(entries);
  return Response.json(manifest);
};

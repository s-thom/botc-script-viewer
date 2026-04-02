import enApp from "../../generated/i18n/en/app.json";
import enGame from "../../generated/i18n/en/game.json";
import enScript from "../../generated/i18n/en/script.json";
import { ENABLED_LOCALES, LOCALE_MAP, type LocaleIds } from "./config";

// NOTE: If the size of these JSON files combined starts being an issue for Cloudflare Workers' size limits,
// these JSON files are probably rather compressible, so they could be streamed during execution.
// If it ends up being memory limits then lazy loading is probably the way to go, but I'll need to figure that out.

export const LANGUAGE_DATA: Record<LocaleIds, unknown> = {
  en: {
    app: enApp,
    enGame: enGame,
    enScript: enScript,
  },
};

export const LOCALE_STACKS: Record<LocaleIds, unknown[]> =
  ENABLED_LOCALES.reduce(
    (map, locale) => {
      map[locale.slug] = locale.fallbacks.map(
        (fallback) => LOCALE_MAP[fallback],
      );
      return map;
    },
    {} as Record<LocaleIds, unknown[]>,
  );

import frGameCommunity from "../../generated/i18n/community/fr_community.json" with { type: "json" };
import deApp from "../../generated/i18n/de/app.json" with { type: "json" };
import deGame from "../../generated/i18n/de/game.json" with { type: "json" };
import deScript from "../../generated/i18n/de/script.json" with { type: "json" };
import de_chApp from "../../generated/i18n/de_CH/app.json" with { type: "json" };
import de_chGame from "../../generated/i18n/de_CH/game.json" with { type: "json" };
import de_chScript from "../../generated/i18n/de_CH/script.json" with { type: "json" };
import enApp from "../../generated/i18n/en/app.json" with { type: "json" };
import enGame from "../../generated/i18n/en/game.json" with { type: "json" };
import enScript from "../../generated/i18n/en/script.json" with { type: "json" };
import frApp from "../../generated/i18n/fr/app.json" with { type: "json" };
import frGame from "../../generated/i18n/fr/game.json" with { type: "json" };
import frScript from "../../generated/i18n/fr/script.json" with { type: "json" };
import de_chViewer from "../../i18n/de-ch.json" with { type: "json" };
import deViewer from "../../i18n/de.json" with { type: "json" };
import enViewer from "../../i18n/en.json" with { type: "json" };
import frViewer from "../../i18n/fr.json" with { type: "json" };
import { ENABLED_LOCALES, LOCALE_MAP, type LocaleIds } from "./config.ts";
import type { LocaleData } from "./types.ts";

// NOTE: If the size of these JSON files combined starts being an issue for Cloudflare Workers' size limits,
// these JSON files are probably rather compressible, so they could be streamed during execution.
// If it ends up being memory limits then lazy loading is probably the way to go, but I'll need to figure that out.

export const LANGUAGE_DATA: Record<LocaleIds, LocaleData> = {
  en: {
    app: enApp,
    game: enGame,
    script: enScript,
    viewer: enViewer,
  },
  fr: {
    app: frApp,
    game: frGame,
    script: frScript,
    viewer: frViewer,
  },
  fr_community: {
    app: {},
    game: frGameCommunity,
    script: {},
    viewer: {},
  },
  de: {
    app: deApp,
    game: deGame,
    script: deScript,
    viewer: deViewer,
  },
  "de-ch": {
    app: de_chApp,
    game: de_chGame,
    script: de_chScript,
    viewer: de_chViewer,
  },
};

export const LOCALE_STACKS: Record<LocaleIds, unknown[]> =
  ENABLED_LOCALES.reduce(
    (map, locale) => {
      map[locale.astroId] = locale.fallbacks.map(
        (fallback) => LOCALE_MAP[fallback],
      );
      return map;
    },
    {} as Record<LocaleIds, unknown[]>,
  );

import esGameCommunity from "../../generated/i18n/community/es_community.json" with { type: "json" };
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
import enPirateApp from "../../generated/i18n/en@pirate/app.json" with { type: "json" };
import enPirateGame from "../../generated/i18n/en@pirate/game.json" with { type: "json" };
import enPirateScript from "../../generated/i18n/en@pirate/script.json" with { type: "json" };
import esApp from "../../generated/i18n/es/app.json" with { type: "json" };
import esGame from "../../generated/i18n/es/game.json" with { type: "json" };
import esScript from "../../generated/i18n/es/script.json" with { type: "json" };
import es_419App from "../../generated/i18n/es_419/app.json" with { type: "json" };
import es_419Game from "../../generated/i18n/es_419/game.json" with { type: "json" };
import es_419Script from "../../generated/i18n/es_419/script.json" with { type: "json" };
import es_mxApp from "../../generated/i18n/es_mx/app.json" with { type: "json" };
import es_mxGame from "../../generated/i18n/es_mx/game.json" with { type: "json" };
import es_mxScript from "../../generated/i18n/es_mx/script.json" with { type: "json" };
import frApp from "../../generated/i18n/fr/app.json" with { type: "json" };
import frGame from "../../generated/i18n/fr/game.json" with { type: "json" };
import frScript from "../../generated/i18n/fr/script.json" with { type: "json" };
import de_chViewer from "../../i18n/de-ch.json" with { type: "json" };
import deViewer from "../../i18n/de.json" with { type: "json" };
import enPirateViewer from "../../i18n/en-7c.json" with { type: "json" };
import enViewer from "../../i18n/en.json" with { type: "json" };
import es_419Viewer from "../../i18n/es-419.json" with { type: "json" };
import es_mxViewer from "../../i18n/es-mx.json" with { type: "json" };
import esViewer from "../../i18n/es.json" with { type: "json" };
import frViewer from "../../i18n/fr.json" with { type: "json" };
import { type LocaleIds } from "./config.ts";
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
  "en-7c": {
    app: enPirateApp,
    game: enPirateGame,
    script: enPirateScript,
    viewer: enPirateViewer,
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
  es: {
    app: esApp,
    game: esGame,
    script: esScript,
    viewer: esViewer,
  },
  es_community: {
    app: {},
    game: esGameCommunity,
    script: {},
    viewer: {},
  },
  "es-mx": {
    app: es_mxApp,
    game: es_mxGame,
    script: es_mxScript,
    viewer: es_mxViewer,
  },
  "es-419": {
    app: es_419App,
    game: es_419Game,
    script: es_419Script,
    viewer: es_419Viewer,
  },
};

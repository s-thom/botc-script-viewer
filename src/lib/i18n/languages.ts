import { type LocaleIds } from "./config.ts";
import type { LocaleData } from "./types.ts";

export const LANGUAGE_DATA: Record<LocaleIds, () => Promise<LocaleData>> = {
  en: () =>
    Promise.all([
      import("../../generated/i18n/en/app.json"),
      import("../../generated/i18n/en/game.json"),
      import("../../generated/i18n/en/script.json"),
      import("../../i18n/en.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "en-7c": () =>
    Promise.all([
      import("../../generated/i18n/en@pirate/app.json"),
      import("../../generated/i18n/en@pirate/game.json"),
      import("../../generated/i18n/en@pirate/script.json"),
      import("../../i18n/en-7c.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  fr: () =>
    Promise.all([
      import("../../generated/i18n/fr/app.json"),
      import("../../generated/i18n/fr/game.json"),
      import("../../generated/i18n/fr/script.json"),
      import("../../i18n/fr.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  fr_community: () =>
    import("../../generated/i18n/community/fr_community.json").then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
  de: () =>
    Promise.all([
      import("../../generated/i18n/de/app.json"),
      import("../../generated/i18n/de/game.json"),
      import("../../generated/i18n/de/script.json"),
      import("../../i18n/de.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "de-ch": () =>
    Promise.all([
      import("../../generated/i18n/de_CH/app.json"),
      import("../../generated/i18n/de_CH/game.json"),
      import("../../generated/i18n/de_CH/script.json"),
      import("../../i18n/de-ch.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  es: () =>
    Promise.all([
      import("../../generated/i18n/es/app.json"),
      import("../../generated/i18n/es/game.json"),
      import("../../generated/i18n/es/script.json"),
      import("../../i18n/es.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  es_community: () =>
    import("../../generated/i18n/community/es_community.json").then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
  "es-mx": () =>
    Promise.all([
      import("../../generated/i18n/es_MX/app.json"),
      import("../../generated/i18n/es_MX/game.json"),
      import("../../generated/i18n/es_MX/script.json"),
      import("../../i18n/es-mx.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "es-419": () =>
    Promise.all([
      import("../../generated/i18n/es_419/app.json"),
      import("../../generated/i18n/es_419/game.json"),
      import("../../generated/i18n/es_419/script.json"),
      import("../../i18n/es-419.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  nl: () =>
    Promise.all([
      import("../../generated/i18n/nl/app.json"),
      import("../../generated/i18n/nl/game.json"),
      import("../../generated/i18n/nl/script.json"),
      import("../../i18n/nl.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  nl_community: () =>
    import("../../generated/i18n/community/nl_community.json").then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
  pl: () =>
    Promise.all([
      import("../../generated/i18n/pl/app.json"),
      import("../../generated/i18n/pl/game.json"),
      import("../../generated/i18n/pl/script.json"),
      import("../../i18n/pl.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "zh-hans": () =>
    Promise.all([
      import("../../generated/i18n/zh_Hans/app.json"),
      import("../../generated/i18n/zh_Hans/game.json"),
      import("../../generated/i18n/zh_Hans/script.json"),
      import("../../i18n/zh-hans.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  pt: () =>
    Promise.all([
      import("../../generated/i18n/pt_PT/app.json"),
      import("../../generated/i18n/pt_PT/game.json"),
      import("../../generated/i18n/pt_PT/script.json"),
      import("../../i18n/pt.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  pt_community: () =>
    import("../../generated/i18n/community/pt_community.json").then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
  "pt-br": () =>
    Promise.all([
      import("../../generated/i18n/pt_BR/app.json"),
      import("../../generated/i18n/pt_BR/game.json"),
      import("../../generated/i18n/pt_BR/script.json"),
      import("../../i18n/pt-br.json"),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "pt-br_community": () =>
    import("../../generated/i18n/community/pt-br_community.json").then(
      (game) => ({
        app: {},
        game: game.default,
        script: {},
        viewer: {},
      }),
    ),
};

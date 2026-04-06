import { type LocaleIds } from "./config.ts";
import type { LocaleData } from "./types.ts";

export const LANGUAGE_DATA: Record<LocaleIds, () => Promise<LocaleData>> = {
  en: () =>
    Promise.all([
      import("../../generated/i18n/en/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/en/game.json", { with: { type: "json" } }),
      import("../../generated/i18n/en/script.json", { with: { type: "json" } }),
      import("../../i18n/en.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "en-7c": () =>
    Promise.all([
      import("../../generated/i18n/en@pirate/app.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/en@pirate/game.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/en@pirate/script.json", {
        with: { type: "json" },
      }),
      import("../../i18n/en-7c.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  fr: () =>
    Promise.all([
      import("../../generated/i18n/fr/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/fr/game.json", { with: { type: "json" } }),
      import("../../generated/i18n/fr/script.json", { with: { type: "json" } }),
      import("../../i18n/fr.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  fr_community: () =>
    import("../../generated/i18n/community/fr_community.json", {
      with: { type: "json" },
    }).then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
  de: () =>
    Promise.all([
      import("../../generated/i18n/de/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/de/game.json", { with: { type: "json" } }),
      import("../../generated/i18n/de/script.json", { with: { type: "json" } }),
      import("../../i18n/de.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "de-ch": () =>
    Promise.all([
      import("../../generated/i18n/de_CH/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/de_CH/game.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/de_CH/script.json", {
        with: { type: "json" },
      }),
      import("../../i18n/de-ch.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  es: () =>
    Promise.all([
      import("../../generated/i18n/es/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/es/game.json", { with: { type: "json" } }),
      import("../../generated/i18n/es/script.json", { with: { type: "json" } }),
      import("../../i18n/es.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  es_community: () =>
    import("../../generated/i18n/community/es_community.json", {
      with: { type: "json" },
    }).then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
  "es-mx": () =>
    Promise.all([
      import("../../generated/i18n/es_MX/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/es_MX/game.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/es_MX/script.json", {
        with: { type: "json" },
      }),
      import("../../i18n/es-mx.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "es-419": () =>
    Promise.all([
      import("../../generated/i18n/es_419/app.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/es_419/game.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/es_419/script.json", {
        with: { type: "json" },
      }),
      import("../../i18n/es-419.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  pt: () =>
    Promise.all([
      import("../../generated/i18n/pt_PT/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/pt_PT/game.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/pt_PT/script.json", {
        with: { type: "json" },
      }),
      import("../../i18n/pt.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  pt_community: () =>
    import("../../generated/i18n/community/pt_community.json", {
      with: { type: "json" },
    }).then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
  "pt-br": () =>
    Promise.all([
      import("../../generated/i18n/pt_BR/app.json", { with: { type: "json" } }),
      import("../../generated/i18n/pt_BR/game.json", {
        with: { type: "json" },
      }),
      import("../../generated/i18n/pt_BR/script.json", {
        with: { type: "json" },
      }),
      import("../../i18n/pt-br.json", { with: { type: "json" } }),
    ]).then(([app, game, script, viewer]) => ({
      app: app.default,
      game: game.default,
      script: script.default,
      viewer: viewer.default,
    })),
  "pt-br_community": () =>
    import("../../generated/i18n/community/pt-br_community.json", {
      with: { type: "json" },
    }).then((game) => ({
      app: {},
      game: game.default,
      script: {},
      viewer: {},
    })),
};

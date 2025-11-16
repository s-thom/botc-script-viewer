import type {
  BuilderAppSettingsAll,
  BuilderAppSettingsLatest,
  BuilderScriptSettingsAll,
  BuilderScriptSettingsLatest,
} from "./types";

export function getDefaultAppSettings(): BuilderAppSettingsLatest {
  return {
    type: "builder-app",
    version: 1,
    currentScriptId: "default",
    screen: "script",
    prevScreen: undefined,
    panels: {
      script: 350,
      options: 350,
      checks: 300,
      isChecksOpen: false,
    },
    checks: {
      enabled: true,
    },
    sorting: {
      enabled: true,
      fun: true,
    },
  };
}

export function upgradeAppSettings(
  settings: BuilderAppSettingsAll,
): BuilderAppSettingsLatest {
  switch (true) {
    case settings.version <= 1:
      break;
  }

  return settings;
}

export function getDefaultScriptSettings(): BuilderScriptSettingsLatest {
  return {
    type: "builder-script",
    version: 1,
    meta: { id: "_meta", name: "" },
    characters: {
      townsfolk: [],
      outsider: [],
      minion: [],
      demon: [],
      traveller: [],
      fabled: [],
      loric: [],
    },
    unknownCharacters: [],
    ignoredChecks: [],
    prompt: undefined,
  };
}

export function upgradeScriptSettings(
  settings: BuilderScriptSettingsAll,
): BuilderScriptSettingsLatest {
  switch (true) {
    case settings.version <= 1:
      break;
  }

  return settings;
}

import type {
  BuilderAppSettingsAll,
  BuilderAppSettingsLatest,
  BuilderScriptSettingsAll,
  BuilderScriptSettingsLatest,
} from "./types";

export function getDefaultAppSettings(): BuilderAppSettingsLatest {
  return {
    id: "builder-app",
    version: 2,
    currentScriptId: "default",
    screen: {
      stack: [{ id: "script" }],
    },
    panelSizes: {
      script: 350,
      options: 350,
      checks: 300,
    },
    checks: {
      enabled: true,
      isChecksPanelOpen: false,
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
    case settings.version === 1: {
      const navStack: BuilderAppSettingsLatest["screen"]["stack"] = [];
      if (settings.screen.previous) {
        navStack.push({ id: settings.screen.previous });
      }
      navStack.push({ id: settings.screen.current });

      return {
        ...settings,
        version: 2,
        screen: { stack: navStack },
      };
    }
  }

  return settings;
}

export function getDefaultScriptSettings(): BuilderScriptSettingsLatest {
  return {
    id: "builder-script",
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

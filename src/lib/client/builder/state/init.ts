import { nanoid } from "nanoid";
import {
  appState,
  getScriptSettingsFromRawScript,
  scriptState,
  sessionState,
} from ".";
import type { BloodOnTheClocktowerCustomScript } from "../../../../generated/script-schema";
import { rawScriptValidator } from "../../../parse";
import { getAppSettings, getScriptSettings } from "../../storage/builder";
import type { SessionState } from "./session.svelte";
import type {
  BuilderAppSettingsLatest,
  BuilderScriptSettingsLatest,
} from "./types";
import {
  getDefaultAppSettings,
  getDefaultScriptSettings,
  upgradeAppSettings,
  upgradeScriptSettings,
} from "./upgrade";

function readRawScriptFromDocument():
  | BloodOnTheClocktowerCustomScript
  | undefined {
  if (typeof document !== "undefined") {
    const dataElement = document.querySelector("script#post-data");
    if (!dataElement) {
      return undefined;
    }

    let script: BloodOnTheClocktowerCustomScript;
    try {
      const json = JSON.parse(dataElement.textContent);
      script = rawScriptValidator.parse(json);
    } catch (err) {
      console.error("Error while parsing script content", err);
      return undefined;
    }

    // Whenever state is stored, we also mark it on the current entry of the history stack.
    // Without this or similar, then refreshing the page would cause the POSTed script to be loaded again.
    if (history.state?.hasStoredScript === "true") {
      return undefined;
    }

    return script;
  }
}

async function getInitialisedState(): Promise<{
  app: BuilderAppSettingsLatest;
  script: BuilderScriptSettingsLatest;
  session: SessionState;
  isNewScript: boolean;
}> {
  let app: BuilderAppSettingsLatest;
  const storedAppSettings = await getAppSettings();
  if (storedAppSettings) {
    app = upgradeAppSettings(storedAppSettings);
  } else {
    app = getDefaultAppSettings();
  }

  let script: BuilderScriptSettingsLatest;
  let isNewScript: boolean;
  const domScript = readRawScriptFromDocument();
  if (domScript) {
    script = getScriptSettingsFromRawScript(domScript);
    isNewScript = true;
  } else {
    const storedScriptSettings = await getScriptSettings(app.currentScriptId);
    if (storedScriptSettings) {
      script = upgradeScriptSettings(storedScriptSettings);
      isNewScript = false;
    } else {
      script = getDefaultScriptSettings();
      isNewScript = true;
    }
  }

  const session: SessionState = {
    checks: {
      loading: false,
      didError: false,
      errors: [],
      warnings: [],
      infos: [],
    },
  };

  return { app, script, session, isNewScript };
}

export async function initialiseScriptBuilderState() {
  const { app, script, session, isNewScript } = await getInitialisedState();

  for (const [key, value] of Object.entries(app)) {
    // @ts-expect-error Since we can't assign to state directly, we have to override all of its properties.
    appState[key] = value;
  }
  if (isNewScript) {
    appState.currentScriptId = nanoid();
  }

  for (const [key, value] of Object.entries(script)) {
    // @ts-expect-error Since we can't assign to state directly, we have to override all of its properties.
    scriptState[key] = value;
  }

  for (const [key, value] of Object.entries(session)) {
    // @ts-expect-error Since we can't assign to state directly, we have to override all of its properties.
    sessionState[key] = value;
  }
}

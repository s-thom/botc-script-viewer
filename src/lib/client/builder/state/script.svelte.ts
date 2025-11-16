import type { BuilderScriptSettingsLatest } from "./types";
import { getDefaultScriptSettings } from "./upgrade";

export const scriptState = $state<BuilderScriptSettingsLatest>(
  getDefaultScriptSettings(),
);

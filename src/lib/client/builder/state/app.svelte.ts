import type { BuilderAppSettingsLatest } from "./types";
import { getDefaultAppSettings } from "./upgrade";

export const appState = $state<BuilderAppSettingsLatest>(
  getDefaultAppSettings(),
);

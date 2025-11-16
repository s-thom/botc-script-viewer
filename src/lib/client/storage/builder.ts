import {
  APP_SETTINGS_KEY,
  SCRIPT_SETTINGS_KEY,
  type BuilderAppSettingsAll,
  type BuilderAppSettingsLatest,
  type BuilderScriptSettingsAll,
  type BuilderScriptSettingsLatest,
  type BuilderScriptSettingsV1,
  type SavedScriptData,
} from "../builder/state/types";
import {
  upgradeAppSettings,
  upgradeScriptSettings,
} from "../builder/state/upgrade";
import {
  BUILDER_SCRIPTS_KEY,
  BUILDER_SCRIPTS_UPDATED_INDEX_KEY,
  BUILDER_SETTINGS_KEY,
  withDatabase,
} from "./indexeddb";

export async function getAppSettings(): Promise<
  BuilderAppSettingsLatest | undefined
> {
  const stored = await withDatabase(async (db) => {
    const result = await db.get(BUILDER_SETTINGS_KEY, APP_SETTINGS_KEY);
    return result as BuilderAppSettingsAll | undefined;
  });

  if (!stored) {
    return undefined;
  }

  const upgraded = upgradeAppSettings(stored);
  return upgraded;
}

export async function setAppSettings(
  settings: BuilderAppSettingsLatest,
): Promise<void> {
  await withDatabase(async (db) => {
    await db.put(BUILDER_SETTINGS_KEY, settings, APP_SETTINGS_KEY);
  });
}

export async function getScriptSettings(): Promise<
  BuilderScriptSettingsLatest | undefined
> {
  const stored = await withDatabase(async (db) => {
    const result = await db.get(BUILDER_SETTINGS_KEY, SCRIPT_SETTINGS_KEY);
    return result as BuilderScriptSettingsAll | undefined;
  });

  if (!stored) {
    return undefined;
  }

  const upgraded = upgradeScriptSettings(stored);
  return upgraded;
}

export async function setScriptSettings(
  settings: BuilderScriptSettingsLatest,
): Promise<void> {
  await withDatabase(async (db) => {
    await db.put(BUILDER_SETTINGS_KEY, settings, SCRIPT_SETTINGS_KEY);
  });
}

export async function listScripts(): Promise<SavedScriptData[]> {
  return withDatabase(async (db) => {
    const allEntries = await db.getAllFromIndex(
      BUILDER_SCRIPTS_KEY,
      BUILDER_SCRIPTS_UPDATED_INDEX_KEY,
    );
    return allEntries.reverse();
  });
}

export async function saveScriptSettings(
  id: string,
  script: BuilderScriptSettingsV1,
): Promise<void> {
  return withDatabase(async (db) => {
    const now = Date.now();

    const tx = db.transaction(BUILDER_SCRIPTS_KEY, "readwrite");

    let toUpdate = await tx.store.get("id");
    if (!toUpdate) {
      toUpdate = {
        id,
        script,
        createdTimestamp: now,
        updatedTimestamp: now,
      };
    }

    toUpdate.script = script;
    toUpdate.updatedTimestamp = now;

    await tx.store.put(toUpdate);
    await tx.done;
  });
}

export async function deleteScriptSettings(id: string): Promise<void> {
  return withDatabase(async (db) => {
    await db.delete(BUILDER_SCRIPTS_KEY, id);
  });
}

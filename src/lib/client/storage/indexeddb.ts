import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type {
  BuilderAppSettingsAll,
  SavedScriptData,
} from "../builder/state/types";

export const APP_DATABASE_KEY = "script-viewer";
export const BUILDER_SCRIPTS_KEY = "builder-scripts";
export const BUILDER_SCRIPTS_UPDATED_INDEX_KEY = "by-updated";
export const BUILDER_SETTINGS_KEY = "builder-settings";

interface ScriptBuilderDatabase extends DBSchema {
  [BUILDER_SCRIPTS_KEY]: {
    key: string;
    value: SavedScriptData;
    indexes: { [BUILDER_SCRIPTS_UPDATED_INDEX_KEY]: number };
  };
  [BUILDER_SETTINGS_KEY]: {
    key: string;
    value: BuilderAppSettingsAll;
  };
}

export async function withDatabase<T>(
  fn: (db: IDBPDatabase<ScriptBuilderDatabase>) => Promise<T>,
) {
  const db = await openDB<ScriptBuilderDatabase>(APP_DATABASE_KEY, 1, {
    upgrade(database, oldVersion /*, newVersion, transaction, event*/) {
      switch (oldVersion) {
        default: {
          const builderScriptsStore = database.createObjectStore(
            BUILDER_SCRIPTS_KEY,
            { keyPath: "id" },
          );
          builderScriptsStore.createIndex(
            BUILDER_SCRIPTS_UPDATED_INDEX_KEY,
            "updatedTimestamp",
          );

          database.createObjectStore(BUILDER_SETTINGS_KEY, { keyPath: "id" });
        }
      }
    },
  });

  try {
    return fn(db);
  } finally {
    db.close();
  }
}

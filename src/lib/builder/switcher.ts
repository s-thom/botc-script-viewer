import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";

// #region IndexedDB
const SCRIPTS_STORE_KEY = "scripts-v1";

export interface SavedScriptData {
  id: string;
  script: BloodOnTheClocktowerCustomScript;
  createdTimestamp: number;
  updatedTimestamp: number;
}

interface ScriptBuilderDatabase extends DBSchema {
  [SCRIPTS_STORE_KEY]: {
    key: string;
    value: SavedScriptData;
    indexes: { "by-updated": number };
  };
}

async function withDatabase<T>(
  fn: (db: IDBPDatabase<ScriptBuilderDatabase>) => Promise<T>,
) {
  const db = await openDB<ScriptBuilderDatabase>("script-builder", 1, {
    upgrade(database, oldVersion /*, newVersion, transaction, event*/) {
      switch (oldVersion) {
        default: {
          const scriptStore = database.createObjectStore(SCRIPTS_STORE_KEY, {
            keyPath: "id",
          });
          scriptStore.createIndex("by-updated", "updatedTimestamp");
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

export async function listScripts(): Promise<SavedScriptData[]> {
  return withDatabase(async (db) => {
    const allEntries = await db.getAllFromIndex(
      SCRIPTS_STORE_KEY,
      "by-updated",
    );
    return allEntries.reverse();
  });
}

export async function getScript(
  id: string,
): Promise<SavedScriptData | undefined> {
  return withDatabase(async (db) => {
    const entry = await db.get(SCRIPTS_STORE_KEY, id);

    return entry;
  });
}

export async function saveScript(
  id: string,
  script: BloodOnTheClocktowerCustomScript,
): Promise<void> {
  return withDatabase(async (db) => {
    const now = Date.now();

    const tx = db.transaction(SCRIPTS_STORE_KEY, "readwrite");

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

export async function deleteScript(id: string): Promise<void> {
  return withDatabase(async (db) => {
    await db.delete(SCRIPTS_STORE_KEY, id);
  });
}
// #endregion

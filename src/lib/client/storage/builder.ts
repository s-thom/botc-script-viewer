import { type SavedScriptData } from "../builder/state/types";
import {
  BUILDER_SCRIPTS_KEY,
  BUILDER_SCRIPTS_UPDATED_INDEX_KEY,
  withDatabase,
} from "./indexeddb";

export async function listScripts(): Promise<SavedScriptData[]> {
  return withDatabase(async (db) => {
    const allEntries = await db.getAllFromIndex(
      BUILDER_SCRIPTS_KEY,
      BUILDER_SCRIPTS_UPDATED_INDEX_KEY,
    );
    return allEntries.reverse();
  });
}

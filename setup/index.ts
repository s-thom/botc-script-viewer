import { downloadData } from "./download-data.ts";
import { downloadInteractions } from "./download-interactions.ts";
import { downloadTranslations } from "./download-translations.ts";
import { generateCommunityTranslations } from "./generate-community-translations.ts";
import { generateEditionScripts } from "./generate-edition-scripts.ts";
import { generateOfficialCharacterIds } from "./generate-official-character-ids.ts";
import { generateScriptSchema } from "./generate-script-schema.ts";

async function run() {
  console.log("[Setup] Generating Typescript schema for scripts");
  await generateScriptSchema();
  console.log("[Setup] Downloading data");
  await downloadData();
  console.log("[Setup] Downloading official translations");
  await downloadTranslations();
  console.log("[Setup] Downloading community translations");
  await generateCommunityTranslations();
  console.log("[Setup] Downloading interactions data");
  await downloadInteractions();
  console.log("[Setup] Generating official scripts JSON");
  await generateEditionScripts();
  console.log("[Setup] Generating official character IDs type");
  await generateOfficialCharacterIds();
}

await run();

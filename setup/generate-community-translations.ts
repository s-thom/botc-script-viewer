import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import { LOCALE_MAP } from "../src/lib/i18n/config.ts";

const DESTINATION_DIR = "src/generated/i18n/community";
const SHEET_ID = "1aAJdqSTafHnw01w-WZ94UPx1Me70Kz-EG1NFfBht2tA";

interface SheetData {
  id: string;
  name?: string;
  ability?: string;
  flavor?: string;
  firstNightReminder?: string;
  otherNightReminder?: string;
}

interface TranslatedInfo {
  name?: string;
  ability?: string;
  flavor?: string;
  first?: string;
  other?: string;
}

await mkdir(DESTINATION_DIR, { recursive: true });

const communityLanguages = Object.entries(LOCALE_MAP).filter(
  ([, locale]) => locale.communitySheetId !== undefined,
);

for (const [id, locale] of communityLanguages) {
  console.log(`Fetching sheet ${locale.communitySheetId} for ${id}`);
  const parser = new PublicGoogleSheetsParser(SHEET_ID, {
    sheetId: locale.communitySheetId,
  });

  const sheet: SheetData[] = await parser.parse();
  const characterInfo: Record<string, TranslatedInfo> = {};

  for (const character of sheet) {
    if (!character.id) {
      continue;
    }

    const newObj: TranslatedInfo = {
      name: character.name?.trim() || undefined,
      ability: character.ability?.trim() || undefined,
      flavor: character.flavor?.trim() || undefined,
      first: character.firstNightReminder?.trim() || undefined,
      other: character.otherNightReminder?.trim() || undefined,
    };

    characterInfo[character.id] = newObj;
  }

  console.log(`Writing ${id}.json`);
  await writeFile(
    join(DESTINATION_DIR, `${id}.json`),
    JSON.stringify({ roles: characterInfo }, null, 2),
  );
}

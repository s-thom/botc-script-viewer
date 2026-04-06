import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";
import { ENABLED_LOCALES } from "../src/lib/i18n/config.ts";

const BASE_URL =
  "https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-translations/refs/heads/main";
const DESTINATION_DIR = "src/generated/i18n";

async function downloadAndSaveJson(langId: string, file: string) {
  console.log(`Downloading ${langId} ${file}...`);

  const res = await fetch(`${BASE_URL}/${file}/${langId}.json`);
  const destination = join(DESTINATION_DIR, langId, `${file}.json`);
  const fileStream = createWriteStream(destination, { flags: "w" });
  await finished(Readable.fromWeb(res.body as ReadableStream).pipe(fileStream));

  console.log(`Saved ${langId} ${file}`);
}

for (const locale of ENABLED_LOCALES) {
  await mkdir(join(DESTINATION_DIR, locale.botcId), { recursive: true });

  await downloadAndSaveJson(locale.botcId, "app");
  await downloadAndSaveJson(locale.botcId, "game");
  await downloadAndSaveJson(locale.botcId, "script");
}

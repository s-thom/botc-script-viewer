import { unzip } from "fflate";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ENABLED_LOCALES } from "../src/lib/i18n/config.ts";

const ZIP_URL =
  "https://github.com/ThePandemoniumInstitute/botc-translations/archive/refs/heads/main.zip";
const DESTINATION_DIR = "src/generated/i18n";
const FILES = ["app", "game", "script"] as const;
const ZIP_PREFIX = "botc-translations-main/";

const needed = new Set<string>();
for (const locale of ENABLED_LOCALES) {
  for (const file of FILES) {
    needed.add(`${ZIP_PREFIX}${file}/${locale.botcId}.json`);
  }
}

console.log("Downloading translations zip...");
const res = await fetch(ZIP_URL);
if (!res.ok) {
  throw new Error(`HTTP error! status: ${res.status}`);
}
const buffer = new Uint8Array(await res.arrayBuffer());
console.log("Downloaded translations zip, extracting...");

const extracted = await new Promise<Record<string, Uint8Array>>(
  (resolve, reject) => {
    unzip(buffer, { filter: (file) => needed.has(file.name) }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  },
);

for (const locale of ENABLED_LOCALES) {
  await mkdir(join(DESTINATION_DIR, locale.botcId), { recursive: true });

  for (const file of FILES) {
    const key = `${ZIP_PREFIX}${file}/${locale.botcId}.json`;
    const content = extracted[key];
    if (!content) {
      console.warn(`Missing ${locale.botcId}/${file} in zip`);
      continue;
    }
    await writeFile(
      join(DESTINATION_DIR, locale.botcId, `${file}.json`),
      content,
    );
    console.log(`Saved ${locale.botcId}/${file}`);
  }
}

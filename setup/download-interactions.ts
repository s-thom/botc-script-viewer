import { unzip } from "fflate";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FILES = ["matchups", "hermit", "extra", "groups", "categories"] as const;

const ZIP_URL =
  "https://github.com/LeCodex/botc-interactions/archive/refs/heads/main.zip";
const DESTINATION_DIR = "src/generated/interactions";
const ZIP_PREFIX = "botc-interactions-main/";

const needed = new Set(
  FILES.map((filename) => `${ZIP_PREFIX}${filename}.json`),
);

console.log("Downloading interactions zip...");
const res = await fetch(ZIP_URL);
if (!res.ok) {
  throw new Error(`HTTP error! status: ${res.status}`);
}
const buffer = new Uint8Array(await res.arrayBuffer());
console.log("Downloaded interactions zip, extracting...");

const extracted = await new Promise<Record<string, Uint8Array>>(
  (resolve, reject) => {
    unzip(buffer, { filter: (file) => needed.has(file.name) }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  },
);

await mkdir(DESTINATION_DIR, { recursive: true });

for (const file of FILES) {
  const key = `${ZIP_PREFIX}${file}.json`;
  const content = extracted[key];
  if (!content) {
    console.warn(`Missing ${file} in zip`);
    continue;
  }
  await writeFile(join(DESTINATION_DIR, `${file}.json`), content);
  console.log(`Saved ${file}`);
}

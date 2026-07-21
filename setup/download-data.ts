import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";

const DESTINATION_DIR = "src/generated/";

async function downloadAndSaveFile(url: string, filename: string) {
  console.log(`Downloading ${filename}...`);

  const res = await fetch(url);
  const destination = join(DESTINATION_DIR, filename);
  const fileStream = createWriteStream(destination, { flags: "w" });
  await finished(Readable.fromWeb(res.body as ReadableStream).pipe(fileStream));

  console.log(`Saved ${filename}`);
}

export default async function downloadData() {
  await Promise.all([
    downloadAndSaveFile(
      "https://release.botc.app/resources/data/roles.json",
      "roles.json",
    ),
    downloadAndSaveFile(
      "https://release.botc.app/resources/data/jinxes.json",
      "jinxes.json",
    ),
    downloadAndSaveFile(
      "https://release.botc.app/resources/data/nightsheet.json",
      "nightsheet.json",
    ),
  ]);
}

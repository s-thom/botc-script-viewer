import { createWriteStream } from "node:fs";
import { copyFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";
import PQueue from "p-queue";
import data from "../src/data/data.json" with { type: "json" };

const CACHE_DIR = "node_modules/.astro/sthom/character-icons";
const DESTINATION_DIR = "src/generated/character-icons";

console.log("Fetching page");
const pageRequest = await fetch("https://botc.app");
if (!pageRequest.ok) {
  throw new Error(`HTTP error! status: ${pageRequest.status}`);
}

const pageContent = await pageRequest.text();
const scriptMatch = pageContent.match(
  /src="(\/assets\/index-[A-Za-z0-9-]{8}.js)"/,
);
if (!scriptMatch) {
  throw new Error("Script tag not found in HTML");
}

console.log("Fetching script");
const scriptRequest = await fetch(`https://botc.app${scriptMatch[1]}`);
if (!scriptRequest.ok) {
  throw new Error(`HTTP error! status: ${pageRequest.status}`);
}

const scriptContent = await scriptRequest.text();

const iconMatches = Array.from(
  scriptContent.matchAll(
    /"(\/assets\/([^"]+(?:_[eg])?)-[A-Za-z0-9_-]{8}.webp)"/gm,
  ),
);

const originalFilenamesById: Record<string, string> = {};
for (const match of iconMatches) {
  originalFilenamesById[match[2]] = match[1];
}

const iconsToFetch: Record<string, string> = {};
for (const role of data.roles) {
  if (role.edition === "special") {
    continue;
  }

  switch (role.team) {
    case "traveller":
      iconsToFetch[role.id] = role.id;
      break;
    case "townsfolk":
    case "outsider":
      iconsToFetch[role.id] = `${role.id}_g`;
      break;
    case "minion":
    case "demon":
      iconsToFetch[role.id] = `${role.id}_e`;
      break;
    default:
  }
}
for (const role of data.fabled) {
  iconsToFetch[role.id] = role.id;
}

originalFilenamesById.minioninfo = originalFilenamesById["minion-info"];
originalFilenamesById.demoninfo = originalFilenamesById["demon-info"];
iconsToFetch.townsfolk = "townsfolk_g";
iconsToFetch.outsider = "outsider_g";
iconsToFetch.minion = "minion_e";
iconsToFetch.demon = "demon_e";
iconsToFetch.traveller = "traveller";
iconsToFetch.fabled = "fabled";
iconsToFetch.demoninfo = "demoninfo";
iconsToFetch.minioninfo = "minioninfo";

await mkdir(CACHE_DIR, { recursive: true });
await mkdir(DESTINATION_DIR, { recursive: true });

async function saveIconToCache(url: string, filename: string) {
  console.log(`Downloading ${filename}...`);

  const res = await fetch(url);
  const destination = join(CACHE_DIR, filename);
  const fileStream = createWriteStream(destination, { flags: "w" });
  await finished(Readable.fromWeb(res.body as ReadableStream).pipe(fileStream));

  console.log(`Saved ${filename}`);
}

const importLines: string[] = [];

const requestQueue = new PQueue({
  concurrency: 3,
  interval: 1000,
  intervalCap: 6,
});
async function processIcon(characterId: string, originalFileName: string) {
  const filename = `${characterId}.webp`;

  importLines.push(
    `export { default as ${characterId} } from "./${filename}";\n`,
  );

  const cacheFilePath = join(CACHE_DIR, filename);
  const destinationFilePath = join(DESTINATION_DIR, filename);

  try {
    await stat(destinationFilePath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // Not in destination dir, check cache dir
    try {
      await stat(cacheFilePath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err2) {
      // Not in destination dir, check cache dir

      const urlPath = originalFilenamesById[originalFileName];
      if (urlPath === undefined) {
        console.warn(`No icon known for ${originalFileName}`);
        return;
      }

      const url = `https://botc.app${urlPath}`;
      await requestQueue.add(() => saveIconToCache(url, filename));
    }

    // Should be saved now, copy to destination dir
    await copyFile(cacheFilePath, destinationFilePath);
  }
}

const queue = new PQueue({ concurrency: 5 });
Object.entries(iconsToFetch)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([id, originalFileName]) =>
    queue.add(() => processIcon(id, originalFileName)),
  );

await queue.onIdle();
await requestQueue.onIdle();
console.log("All icons downloaded successfully.");

const indexStream = createWriteStream(join(DESTINATION_DIR, "index.ts"));
const awaitDrain = () =>
  new Promise<void>((res) => indexStream.once("drain", res));
for await (const line of importLines) {
  const shouldContinue = indexStream.write(line);
  if (!shouldContinue) {
    await awaitDrain();
  }
}
indexStream.end();
await new Promise<void>((res) => indexStream.on("finish", res));

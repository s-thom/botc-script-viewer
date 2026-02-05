import { Buffer } from "node:buffer";
import { createWriteStream } from "node:fs";
import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
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

console.log("Fetching script", `https://botc.app${scriptMatch[1]}`);
const scriptRequest = await fetch(`https://botc.app${scriptMatch[1]}`);
if (!scriptRequest.ok) {
  throw new Error(`HTTP error! status: ${pageRequest.status}`);
}

const scriptContent = await scriptRequest.text();

const assetNamesToIds = new Map<string, string>();
for (const match of Array.from(
  scriptContent.matchAll(/"\/src\/assets\/icons\/([^"]+).webp":([\w$]+)\b/g),
)) {
  const [, assetName, id] = match;

  if (assetNamesToIds.has(assetName)) {
    if (assetNamesToIds.get(assetName) !== id) {
      console.warn(
        `Original ${assetName} exists multiple times with different identifiers`,
      );
    }

    continue;
  }

  assetNamesToIds.set(assetName, id);
}

const assetIdsToUrls = new Map<string, string>();
for (const match of Array.from(
  scriptContent.matchAll(
    /\b([\w$]+)\b="(\/assets\/[^"]+-[A-Za-z0-9_-]{8}\.webp|data:image\/webp;base64,[^"]+)"/g,
  ),
)) {
  const [, id, url] = match;

  if (assetIdsToUrls.has(id)) {
    if (assetIdsToUrls.get(id) !== url) {
      console.warn(
        `Actual ${id} exists multiple times with different identifiers`,
      );
    }

    continue;
  }

  assetIdsToUrls.set(id, url);
}

const toFetchMap = new Map<string, string>();
for (const role of data.roles) {
  if (role.edition === "special") {
    toFetchMap.set(role.id, role.id);
    continue;
  }

  switch (role.team) {
    case "traveller":
      toFetchMap.set(role.id, role.id);
      break;
    case "townsfolk":
    case "outsider":
      toFetchMap.set(role.id, `${role.id}_g`);
      break;
    case "minion":
    case "demon":
      toFetchMap.set(role.id, `${role.id}_e`);
      break;
    case "fabled":
    case "loric":
      toFetchMap.set(role.id, role.id);
      break;
    default:
  }
}

toFetchMap.set("townsfolk", "townsfolk_g");
toFetchMap.set("outsider", "outsider_g");
toFetchMap.set("minion", "minion_e");
toFetchMap.set("demon", "demon_e");
toFetchMap.set("traveller", "traveller");
toFetchMap.set("fabled", "fabled");
toFetchMap.set("loric", "loric");

toFetchMap.set("minioninfo", "minion-info");
toFetchMap.set("demoninfo", "demon-info");
toFetchMap.set("dusk", "dusk");
toFetchMap.set("dawn", "dawn");

await mkdir(CACHE_DIR, { recursive: true });
await mkdir(DESTINATION_DIR, { recursive: true });

async function downloadAndSaveIcon(url: string, filename: string) {
  console.log(`Downloading ${filename}...`);

  const res = await fetch(url);
  const destination = join(CACHE_DIR, filename);
  const fileStream = createWriteStream(destination, { flags: "w" });
  await finished(Readable.fromWeb(res.body as ReadableStream).pipe(fileStream));

  console.log(`Saved ${filename}`);
}

async function downloadAndSaveDataUrl(url: string, filename: string) {
  console.log(`Writing ${filename}...`);

  const match = url.match(/^data:image\/webp;base64,([^"]+)$/);
  if (!match) {
    throw new Error(`URL for ${filename} was not a data URL`);
  }
  const [, base64] = match;
  const buffer = Buffer.from(base64, "base64");

  const destination = join(CACHE_DIR, filename);
  await writeFile(destination, buffer);

  console.log(`Saved ${filename}`);
}

const importLines: string[] = [];

const requestQueue = new PQueue({
  concurrency: 3,
  interval: 1000,
  intervalCap: 6,
});
async function processIcon(characterId: string, assetName: string) {
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
      // Not in cache dir, create

      const assetId = assetNamesToIds.get(assetName);
      if (!assetId) {
        console.warn(`No asset ID known for ${assetName}`);
        return;
      }

      const urlPath = assetIdsToUrls.get(assetId);
      if (!urlPath) {
        console.warn(`No asset URL known for ${assetName} (${assetId})`);
        return;
      }

      if (urlPath.startsWith("data:")) {
        await downloadAndSaveDataUrl(urlPath, filename);
      } else {
        const url = `https://botc.app${urlPath}`;
        await requestQueue.add(() => downloadAndSaveIcon(url, filename));
      }
    }

    // Should be saved now, copy to destination dir
    await copyFile(cacheFilePath, destinationFilePath);
  }
}

const queue = new PQueue({ concurrency: 5 });
Array.from(toFetchMap.entries())
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

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
  /src="(\/assets\/index-[A-Za-z0-9_-]{8}.js)"/,
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

const assetNamesToVariableName = new Map<string, string>();
for (const match of Array.from(
  scriptContent.matchAll(
    /["'`]\/src\/assets\/((?:[^"'`/]+\/)*[^"'`/]+).webp["'`]:([\w$]+)\b/g,
  ),
)) {
  const [, assetName, variableName] = match;

  if (assetNamesToVariableName.has(assetName)) {
    if (assetNamesToVariableName.get(assetName) !== variableName) {
      console.warn(
        `Original ${assetName} exists multiple times with different identifiers`,
      );
    }

    continue;
  }

  assetNamesToVariableName.set(assetName, variableName);
}

// Uncomment if you need to know all of the asset names
// console.log(Array.from(assetNamesToVariableName.keys()).join(" "));

const variableNamesToUrls = new Map<string, string>();
for (const match of Array.from(
  scriptContent.matchAll(
    /((?:\b|\$)[\w]+)(?:\b|\$)=["'`](\/assets\/[^"'`]+-[A-Za-z0-9_-]{8}\.webp|data:image\/webp;base64,[^"'`]+)["'`]/g,
  ),
)) {
  const [, variableName, url] = match;

  if (variableNamesToUrls.has(variableName)) {
    if (variableNamesToUrls.get(variableName) !== url) {
      console.warn(
        `Actual ${variableName} exists multiple times with different identifiers`,
      );
    }

    continue;
  }

  variableNamesToUrls.set(variableName, url);
}

const toFetchMap = new Map<string, string>();
for (const role of data.roles) {
  if (role.edition === "special") {
    toFetchMap.set(`${role.id}`, `icons/${role.edition}/${role.id}`);
    continue;
  }

  switch (role.team) {
    case "traveller":
      toFetchMap.set(`${role.id}`, `icons/${role.edition}/${role.id}`);
      break;
    case "townsfolk":
    case "outsider":
      toFetchMap.set(`${role.id}`, `icons/${role.edition}/${role.id}_g`);
      break;
    case "minion":
    case "demon":
      toFetchMap.set(`${role.id}`, `icons/${role.edition}/${role.id}_e`);
      break;
    case "fabled":
    case "loric":
      toFetchMap.set(`${role.id}`, `icons/${role.edition}/${role.id}`);
      break;
    default:
  }
}

toFetchMap.set("townsfolk_g", "icons/generic/townsfolk_g");
toFetchMap.set("outsider_g", "icons/generic/outsider_g");
toFetchMap.set("minion_e", "icons/generic/minion_e");
toFetchMap.set("demon_e", "icons/generic/demon_e");
toFetchMap.set("traveller", "icons/generic/traveller");
toFetchMap.set("fabled", "icons/generic/fabled");
toFetchMap.set("loric", "icons/generic/loric");

toFetchMap.set("minioninfo", "icons/minion-info");
toFetchMap.set("demoninfo", "icons/demon-info");
toFetchMap.set("dusk", "icons/dusk");
toFetchMap.set("dawn", "icons/dawn");

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

  const match = url.match(/^data:image\/webp;base64,([^"'`]+)$/);
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
async function processIcon(exportName: string, assetName: string) {
  const filename = `${exportName}.webp`;

  importLines.push(
    `export { default as ${exportName} } from "./${filename}";\n`,
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

      const variableName = assetNamesToVariableName.get(assetName);
      if (!variableName) {
        console.warn(`No variable name known for ${assetName}`);
        return;
      }

      const urlPath = variableNamesToUrls.get(variableName);
      if (!urlPath) {
        console.warn(
          `No asset URL known for ${assetName} (variable ${variableName})`,
        );
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
  .forEach(([identifier, assetUrl]) =>
    queue.add(() => processIcon(identifier, assetUrl)),
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

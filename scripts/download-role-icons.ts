import { createWriteStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import PQueue from "p-queue";
import sharp from "sharp";
import data from "../src/data/data.json" with { type: "json" };

// The largest an icon is normally shown is 48px,
// and high-end devices have a pixel ratio of 3.
const RESIZE_WIDTH = 48 * 3;

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

await mkdir("src/generated/character-icons", { recursive: true });

async function saveIcon(url: string, filename: string) {
  console.log(`Downloading ${filename}...`);

  const res = await fetch(url);
  const destination = join("src/generated/character-icons", filename);

  const inputBuffer = await res.arrayBuffer();

  console.log(`Resizing ${filename}...`);
  const sharpInstance = sharp(inputBuffer);
  sharpInstance.resize(RESIZE_WIDTH);
  const output = await sharpInstance.webp().toBuffer();

  await writeFile(destination, output);

  console.log(`Saved ${filename}`);
}

const importLines: string[] = [];

const requestQueue = new PQueue({
  concurrency: 3,
  interval: 1000,
  intervalCap: 6,
});
async function processIcon(characterId: string, originalFileName: string) {
  const filename = `${characterId}-${RESIZE_WIDTH}.webp`;

  importLines.push(
    `export { default as ${characterId} } from './${filename}?no-inline';\n`,
  );

  try {
    await stat(join("src/generated/character-icons", filename));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    const urlPath = originalFilenamesById[originalFileName];
    if (urlPath === undefined) {
      console.warn(`No icon known for ${originalFileName}`);
      return;
    }

    const url = `https://botc.app${urlPath}`;
    requestQueue.add(() => saveIcon(url, filename));
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

const indexStream = createWriteStream(
  join("src/generated/character-icons", "index.ts"),
);
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

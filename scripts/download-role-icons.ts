import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";
import PQueue from "p-queue";
import data from "../src/generated/data.json" with { type: "json" };

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

const iconsToFetch: Record<string, string[]> = {};
for (const role of data.roles) {
  if (role.edition === "special") {
    continue;
  }

  switch (role.team) {
    case "traveller":
      iconsToFetch[role.id] = [role.id, `${role.id}_g`, `${role.id}_e`];
      break;
    case "townsfolk":
    case "outsider":
      iconsToFetch[role.id] = [`${role.id}_g`, `${role.id}_e`];
      break;
    case "minion":
    case "demon":
      iconsToFetch[role.id] = [`${role.id}_e`, `${role.id}_g`];
      break;
    default:
  }
}
for (const role of data.fabled) {
  iconsToFetch[role.id] = [role.id];
}

originalFilenamesById.minioninfo = originalFilenamesById["minion-info"];
originalFilenamesById.demoninfo = originalFilenamesById["demon-info"];
iconsToFetch.special = [
  "minioninfo",
  "demoninfo",
  "townsfolk_g",
  "townsfolk_e",
  "outsider_g",
  "outsider_e",
  "minion_g",
  "minion_e",
  "demon_g",
  "demon_e",
  "traveller",
  "traveller_g",
  "traveller_e",
  "fabled",
];

await mkdir("src/generated/character-icons", { recursive: true });

async function saveIcon(url: string, filename: string) {
  console.log(`Downloading ${filename}...`);

  const res = await fetch(url);
  const destination = join("src/generated/character-icons", filename);
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
async function processIcon(id: string) {
  const filename = `${id}.webp`;

  importLines.push(`export { default as ${id} } from './${filename}';\n`);

  try {
    await stat(join("src/generated/character-icons", filename));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    const urlPath = originalFilenamesById[id];
    if (urlPath === undefined) {
      console.warn(`No icon known for ${id}`);
      return;
    }

    const url = `https://botc.app${urlPath}`;
    requestQueue.add(() => saveIcon(url, filename));
  }
}

const queue = new PQueue({ concurrency: 5 });
Object.values(iconsToFetch)
  .flatMap((ids) => ids)
  .sort()
  .forEach((id) => queue.add(() => processIcon(id)));

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

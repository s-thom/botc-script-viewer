import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import vm from "node:vm";
import PQueue from "p-queue";

const DESTINATION_DIR = "src/scripts/monthly";

export async function downloadMonthlyScripts() {
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

  const requestQueue = new PQueue({
    concurrency: 3,
    interval: 1000,
    intervalCap: 6,
  });

  const monthsToFilenames = new Map<string, string>();
  for (const match of Array.from(
    scriptContent.matchAll(
      /["'`]\.\.\/\.\.\/data\/scripts\/([\d-]+)\.json["'`]:\(\)=>[\w$]+\(\(\)=>import\(`\.\/([^`]+\.js)`\),\[\]\)/g,
    ),
  )) {
    const [, month, filename] = match;
    monthsToFilenames.set(month, filename);
  }

  if (monthsToFilenames.size === 0) {
    throw new Error("No monthly script imports found in bundle");
  }

  function evaluateDefaultExport(code: string, filename: string): unknown {
    const transformed = code
      .replace(
        /export\s*\{\s*([\w$]+)\s+as\s+default\s*\}\s*;?/,
        "var __EXPORT__=$1;",
      )
      .replace(/export\s+default\s+/, "var __EXPORT__=");

    if (!transformed.includes("__EXPORT__")) {
      throw new Error(`Could not find default export in ${filename}`);
    }

    const sandbox = vm.createContext({});
    vm.runInContext(transformed, sandbox, { filename, timeout: 2000 });

    return (sandbox as { __EXPORT__?: unknown }).__EXPORT__;
  }

  async function processMonth(month: string, filename: string) {
    console.log(`Downloading ${filename}...`);

    const url = `https://botc.app/assets/${filename}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} for ${url}`);
    }

    const code = await res.text();
    const data = evaluateDefaultExport(code, filename);

    console.log(`Saved ${filename}`);

    return { month, data };
  }

  await mkdir(DESTINATION_DIR, { recursive: true });

  const results = await Promise.all(
    Array.from(monthsToFilenames.entries()).map(([month, filename]) =>
      requestQueue.add(() => processMonth(month, filename)),
    ),
  );

  for (const result of results) {
    if (!result) {
      continue;
    }

    const { month, data } = result;
    const destination = join(DESTINATION_DIR, `${month}.json`);
    await writeFile(destination, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`Wrote ${destination}`);
  }

  console.log("All monthly scripts downloaded successfully.");
}

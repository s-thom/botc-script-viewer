import type { JSONSchema4 } from "json-schema";
import { compile } from "json-schema-to-typescript";
import { mkdir, writeFile } from "node:fs/promises";

console.log("Fetching schema");
const request = await fetch(
  "https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/script-schema.json",
);
if (!request.ok) {
  throw new Error(`HTTP error! status: ${request.status}`);
}

const scriptSchema: JSONSchema4 = await request.json();

console.log("Compiling schema");
const ts = await compile(scriptSchema, "BotCScript", {
  ignoreMinAndMaxItems: true,
  additionalProperties: false,
});

console.log("Writing types");
await mkdir("src/generated", { recursive: true });
await writeFile("src/generated/script-schema.ts", ts);

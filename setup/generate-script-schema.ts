import type { JSONSchema4 } from "json-schema";
import { compile } from "json-schema-to-typescript";
import { mkdir, writeFile } from "node:fs/promises";
import schema from "./schema.json" with { type: "json" };

const scriptSchema = schema as JSONSchema4;

console.log("Compiling schema");
const ts = await compile(scriptSchema, "BotCScript", {
  ignoreMinAndMaxItems: true,
  additionalProperties: false,
});

console.log("Writing types");
await mkdir("src/generated", { recursive: true });
await writeFile("src/generated/script-schema.ts", ts);

import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";

const jsonContent = process.env.DATA_JSON;
if (jsonContent === undefined) {
  console.error("DATA_JSON environment variable not set.");
  throw new Error("DATA_JSON environment variable not set.");
}

try {
  JSON.parse(jsonContent);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (err) {
  console.log(jsonContent);
  throw new Error("DATA_JSON environment variable not valid JSON.");
}

await mkdir("src/generated", { recursive: true });

await writeFile("src/generated/data.json", jsonContent, "utf-8");

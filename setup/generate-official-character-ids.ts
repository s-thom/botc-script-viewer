import { mkdir, writeFile } from "node:fs/promises";
import data from "../src/data/data.json" with { type: "json" };

const set = new Set<string>();
const knownExceptions = new Set(["dusk", "dawn", "minioninfo", "demoninfo"]);

for (const character of [...data.roles, ...data.fabled]) {
  if (!knownExceptions.has(character.id)) {
    set.add(character.id);
  }
}

const allCharacters = Array.from(set).sort();

const lines = allCharacters.map((id) => `  | "${id}"`);

const fileContent = `export type OfficialCharacterId =\n${lines.join("\n")};\n`;

await mkdir("src/generated", { recursive: true });
await writeFile(`src/generated/types.ts`, fileContent);

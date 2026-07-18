import { mkdir, writeFile } from "node:fs/promises";
import { roles } from "../src/lib/data.ts";

export async function generateOfficialCharacterIds() {
  const set = new Set<string>();
  const knownExceptions = new Set(["dusk", "dawn", "minioninfo", "demoninfo"]);

  for (const character of roles) {
    if (!knownExceptions.has(character.id)) {
      set.add(character.id);
    }
  }

  const allCharacters = Array.from(set).sort();

  const lines = allCharacters.map((id) => `  | "${id}"`);

  const fileContent = `export type OfficialCharacterId =\n${lines.join("\n")};\n`;

  await mkdir("src/generated", { recursive: true });
  await writeFile(`src/generated/types.ts`, fileContent);
}

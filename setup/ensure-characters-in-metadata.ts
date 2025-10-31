import data from "../src/data/data.json" with { type: "json" };
import type { ScriptCharacter } from "../src/generated/script-schema.ts";
import { CHARACTER_METADATA } from "../src/lib/builder/metadata/characters.ts";

const nsCharacterSet = new Set(Object.keys(CHARACTER_METADATA));
const knownExceptions = new Set(["dusk", "dawn", "minioninfo", "demoninfo"]);

const missingSet = new Set<ScriptCharacter>();

for (const character of data.roles) {
  if (!nsCharacterSet.has(character.id) && !knownExceptions.has(character.id)) {
    missingSet.add(character as ScriptCharacter);
  }
}

if (missingSet.size > 0) {
  console.error("Some characters do not have metadata");
  console.error(
    Array.from(missingSet)
      .map((character) => `${character.name} (${character.id})`)
      .join(", "),
  );
  process.exit(1);
}

console.log("All characters have metadata.");

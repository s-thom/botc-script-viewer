import type { ScriptCharacter } from "../src/generated/script-schema";
import { roles } from "../src/lib/data.ts";
import { ORDERED_CHARACTER_LIST } from "../src/lib/number-store/characters.ts";

const nsCharacterSet = new Set(ORDERED_CHARACTER_LIST);
const knownExceptions = new Set([
  "dusk",
  "dawn",
  "minioninfo",
  "demoninfo",
  undefined,
]);

const missingSet = new Set<ScriptCharacter>();

for (const character of roles) {
  if (!nsCharacterSet.has(character.id) && !knownExceptions.has(character.id)) {
    missingSet.add(character as ScriptCharacter);
  }
}

if (missingSet.size > 0) {
  console.error("Some characters are not assigned positions in Number Store");
  console.error(
    Array.from(missingSet)
      .map((character) => `${character.name} (${character.id})`)
      .join(", "),
  );
  process.exit(1);
}

console.log("All characters have a number.");

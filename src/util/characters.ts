import data from "../data/data.json" with { type: "json" };
import type { ScriptCharacter } from "../generated/script-schema";

export const CHARACTERS_BY_ID = [...data.roles, ...data.fabled].reduce<
  Map<string, ScriptCharacter>
>((map, character) => {
  map.set(character.id, character as ScriptCharacter);
  return map;
}, new Map());

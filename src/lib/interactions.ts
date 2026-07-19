import rawExtra from "../generated/interactions/extra.json" with { type: "json" };
import rawHermit from "../generated/interactions/hermit.json" with { type: "json" };
import type { InteractionInfo } from "../types/botc";
import {
  isStatusBlock,
  type ExtraInteraction,
  type HermitInteractions,
} from "../types/interactions";

const extra = rawExtra as ExtraInteraction[];
const hermit = rawHermit as HermitInteractions;

export function getExtraInteractionsForCharacters(
  characters: Set<string>,
): InteractionInfo[] {
  const result = [] as InteractionInfo[];

  for (const entry of extra) {
    if (entry.characters.every((id) => characters.has(id))) {
      for (const [level, value] of Object.entries(entry.interaction)) {
        result.push({
          level: level as never,
          characters: entry.characters,
          value,
        });
      }
    }
  }

  return result;
}

function traverseHermit(
  node: HermitInteractions,
  parentList: string[],
  allCharacters: Set<string>,
): InteractionInfo[] {
  const result = [] as InteractionInfo[];

  if (isStatusBlock(node)) {
    for (const [level, value] of Object.entries(node)) {
      result.push({
        level: level as never,
        characters: parentList,
        value,
      });
    }
  } else {
    for (const [id, nextNode] of Object.entries(node)) {
      if (!allCharacters.has(id)) {
        continue;
      }

      const nextResult = traverseHermit(
        nextNode,
        [...parentList, id],
        allCharacters,
      );
      result.push(...nextResult);
    }
  }

  return result;
}

export function getHermitInteractionsForCharacters(
  characters: Set<string>,
): InteractionInfo[] {
  if (!characters.has("hermit")) {
    return [];
  }

  return traverseHermit(hermit, ["hermit"], characters);
}

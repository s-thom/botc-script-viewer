import rawExtra from "../generated/interactions/extra.json" with { type: "json" };
import rawHermit from "../generated/interactions/hermit.json" with { type: "json" };
import rawMatchups from "../generated/interactions/matchups.json" with { type: "json" };
import type { InteractionInfo, NormalisedScriptCharacter } from "../types/botc";
import {
  isStatusBlock,
  type ExtraInteraction,
  type HermitInteractions,
  type RoleMatchups,
} from "../types/interactions";

const matchups = rawMatchups as RoleMatchups;
const extra = rawExtra as ExtraInteraction[];
const hermit = rawHermit as HermitInteractions;

function getMatchupInteractionsForCharacters(
  characters: Set<string>,
): InteractionInfo[] {
  const result = [] as InteractionInfo[];

  for (const [role1Id, entry] of Object.entries(matchups)) {
    if (!characters.has(role1Id)) {
      continue;
    }

    for (const [role2Id, interaction] of Object.entries(entry)) {
      if (!characters.has(role2Id)) {
        continue;
      }

      for (const [level, value] of Object.entries(interaction)) {
        result.push({
          level: level as never,
          characters: [role1Id, role2Id],
          value,
        });
      }
    }
  }

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

function getExtraInteractionsForCharacters(
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

function getHermitInteractionsForCharacters(
  characters: Set<string>,
): InteractionInfo[] {
  if (!characters.has("hermit")) {
    return [];
  }

  return traverseHermit(hermit, ["hermit"], characters);
}

export function getInteractionsForCharacters(
  characters: NormalisedScriptCharacter[],
) {
  const idSet = new Set(characters.map((character) => character.normalisedId));
  const indexLookup = new Map(
    characters.map((character, i) => [character.normalisedId, i]),
  );

  const interactions = ([] as InteractionInfo[]).concat(
    getMatchupInteractionsForCharacters(idSet),
    getExtraInteractionsForCharacters(idSet),
    getHermitInteractionsForCharacters(idSet),
  );

  // Sort according to script order, since this is also the order that jinxes appear
  return interactions.sort((a, b) => {
    // Loop over characters until index is different
    const commonLength = Math.min(a.characters.length, b.characters.length);
    for (let i = 0; i < commonLength; i++) {
      const aIndex = indexLookup.get(a.characters[i])!;
      const bIndex = indexLookup.get(b.characters[i])!;

      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
    }

    // Entries are the same for the common length, if one has more characters, sort it later.
    const lengthDifference = b.characters.length - a.characters.length;
    if (lengthDifference !== 0) {
      return lengthDifference;
    }

    // Same characters and same length, so must be equivalent.
    return 0;
  });
}

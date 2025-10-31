import data from "../../data/data.json" with { type: "json" };
import type {
  CharacterTeam,
  OfficialCharacterDeprecated,
  OfficialCharacterID,
  ScriptCharacter,
  ScriptMetadata,
} from "../../generated/script-schema";
import type { GlobalState } from "./state/types";

export const CHARACTERS_BY_ID = data.roles.reduce<Map<string, ScriptCharacter>>(
  (map, character) => {
    map.set(character.id, character as ScriptCharacter);
    return map;
  },
  new Map(),
);

export const CHARACTERS_BY_TEAM = Array.from(CHARACTERS_BY_ID.values()).reduce<
  Record<CharacterTeam, ScriptCharacter[]>
>(
  (obj, character) => {
    if (character.team === undefined || character.edition === "special") {
      return obj;
    }
    obj[character.team].push(character);
    return obj;
  },
  {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
    loric: [],
  },
);
for (const characters of Object.values(CHARACTERS_BY_TEAM)) {
  characters.sort((a, b) => a.name.localeCompare(b.name));
}

export const TEAM_NAMES: Record<CharacterTeam, string> = {
  townsfolk: "Townsfolk",
  outsider: "Outsiders",
  minion: "Minions",
  demon: "Demons",
  traveller: "Travellers",
  fabled: "Fabled",
  loric: "Loric",
};

export function normaliseCharacterId(id: string): string {
  return id.toLowerCase().replace(/_/g, "");
}

export function getFullScriptCharacter(
  character:
    | ScriptCharacter
    | OfficialCharacterID
    | OfficialCharacterDeprecated,
): ScriptCharacter {
  if (typeof character === "object" && "team" in character) {
    return character;
  }

  const characterId = typeof character === "string" ? character : character.id;
  const officialCharacter = CHARACTERS_BY_ID.get(
    normaliseCharacterId(characterId),
  );

  if (officialCharacter) {
    return officialCharacter;
  }

  return {
    id: characterId,
    name: characterId,
    team: "<unknown>" as never,
    ability: `<unknown official character ${characterId}>`,
  };
}

export function getMinimalScriptCharacter(
  character: ScriptCharacter,
): ScriptCharacter | OfficialCharacterID {
  const officialCharacter = CHARACTERS_BY_ID.get(character.id);
  if (officialCharacter) {
    return officialCharacter.id;
  }

  return character;
}

export function isScriptMetadata(
  item:
    | ScriptCharacter
    | OfficialCharacterID
    | ScriptMetadata
    | OfficialCharacterDeprecated,
): item is ScriptMetadata {
  return typeof item === "object" && item.id === "_meta" && !("team" in item);
}

export function getEnforcedFabled(
  state: GlobalState,
): Map<string, Set<string>> {
  const enforcedFabled = new Map<string, Set<string>>();
  function addFabledReason(fabled: string, reason: string) {
    if (!enforcedFabled.has(fabled)) {
      enforcedFabled.set(fabled, new Set());
    }
    enforcedFabled.get(fabled)!.add(reason);
  }

  if (state.meta.bootlegger && state.meta.bootlegger.length > 0) {
    addFabledReason("bootlegger", "Script contains custom rules");
  }

  const allCharactersMap = new Map<string, ScriptCharacter>();
  for (const characters of Object.values(state.characters)) {
    for (const character of characters) {
      allCharactersMap.set(character.id, character);
    }
  }

  for (const character of allCharactersMap.values()) {
    if (!CHARACTERS_BY_ID.has(character.id)) {
      addFabledReason("bootlegger", "Script contains custom characters");
    }

    if (character.jinxes) {
      for (const jinx of character.jinxes) {
        if (allCharactersMap.has(normaliseCharacterId(jinx.id))) {
          addFabledReason("djinn", "Script contains jinxes");
        }
      }
    }
  }

  return enforcedFabled;
}

// Sort order rules: https://bloodontheclocktower.com/news/sort-order-sao-update
// Note: `!` indicates no asterisk (to ensure "night*" comes after "night")
const SORT_ORDER_PREFIXES = [
  "You start knowing that", // Custom rule. Sorts TB's top 4 better.
  "You start knowing",
  "At night",
  "Each dusk*",
  "Each night!",
  "Each night*",
  "Each day",
  "Once per game, at night!",
  "Once per game, at night*",
  "Once per game, during the day",
  "Once per game",
  "On your 1st night",
  "On your 1st day",
  "You think",
  "You are",
  "You have",
  "You do not know",
  "You might",
  "You",
  "When you die",
  "When you learn that you died",
  "When",
  "If you die",
  "If you died",
  "If you are “mad”",
  "If you",
  "If the Demon dies",
  "If the Demon kills",
  "If the Demon",
  "If both",
  "If there are 5 or more players alive",
  "If",
  "All players",
  "All",
  "The 1st time",
  "The",
  "Good",
  "Evil",
  "Players",
  "Minions",
];
const SORT_ORDER_REGEXES = SORT_ORDER_PREFIXES.map(
  (prefix) =>
    new RegExp(`^${prefix.replace(/\*/g, "\\*").replace(/!/g, "[^*]")}`),
);

type Comparator = (a: ScriptCharacter, b: ScriptCharacter) => number;

function reverse(comparator: Comparator): Comparator {
  return (a, b) => comparator(b, a);
}

function booleanComparator(
  test: (value: ScriptCharacter) => boolean,
): Comparator {
  return (a: ScriptCharacter, b: ScriptCharacter) => {
    const aTest = test(a);
    const bTest = test(b);
    if (aTest && !bTest) {
      return -1;
    }
    if (!aTest && bTest) {
      return 1;
    }
    return 0;
  };
}
function numberComparator(
  getter: (value: ScriptCharacter) => number,
): Comparator {
  return (a: ScriptCharacter, b: ScriptCharacter) => {
    const aValue = getter(a);
    const bValue = getter(b);
    return aValue - bValue;
  };
}
function stringComparator(
  getter: (value: ScriptCharacter) => string,
): Comparator {
  return (a: ScriptCharacter, b: ScriptCharacter) => {
    const aString = getter(a);
    const bString = getter(b);
    return aString.localeCompare(bString);
  };
}

function top3(): Comparator {
  // As these characters are always together and always at the top of the list, we don't need
  // to check whether we need to move them around, like with the Xaan face.

  // This list is backwards because we're using `.indexOf()` for sorting, and entries that
  // don't exist have a value of -1. By sorting backwards, this puts them at the end instead.
  const reverseRoles = ["investigator", "librarian", "washerwoman"];

  return reverse(
    numberComparator((character) => reverseRoles.indexOf(character.id)),
  );
}

function xaanFace(minions: ScriptCharacter[]): Comparator {
  const hats = ["baron", "witch"];
  const eyes = ["xaan"];
  const noses = ["boomdandy", "summoner", "boffin"];
  const mouths = ["goblin", "scarletwoman"];

  const hat = hats.find((id) => minions.find((minion) => minion.id === id));
  const eye = eyes.find((id) => minions.find((minion) => minion.id === id));
  const nose = noses.find((id) => minions.find((minion) => minion.id === id));
  const mouth = mouths.find((id) => minions.find((minion) => minion.id === id));

  // Only do sorting if it's possible to make a face at all.
  if (!(eye && mouth)) {
    return () => 0;
  }

  const orderedRoles = [hat, eye, nose, mouth].filter(
    (s) => typeof s === "string",
  );

  // No need to reverse here, since the Xaan face will always be at the end of the section.
  return numberComparator((character) => orderedRoles.indexOf(character.id));
}

function kazaliFace(demons: ScriptCharacter[]): Comparator {
  const hats = ["alhadikhia"];
  const eyes = ["kazali"];
  const mouths = ["yaggababble"];

  const hat = hats.find((id) => demons.find((demon) => demon.id === id));
  const eye = eyes.find((id) => demons.find((demon) => demon.id === id));
  const mouth = mouths.find((id) => demons.find((demon) => demon.id === id));

  // Only do sorting if it's possible to make a face at all.
  if (!(eye && mouth)) {
    return () => 0;
  }

  const orderedRoles = [hat, eye, mouth].filter((s) => typeof s === "string");

  // No need to reverse here, since the Kazali face will always be at the end of the section.
  return numberComparator((character) => orderedRoles.indexOf(character.id));
}

function combineComparators(...comparators: Comparator[]): Comparator {
  return (a: ScriptCharacter, b: ScriptCharacter) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
}

export function sortCharacters(
  teams: Record<CharacterTeam, ScriptCharacter[]>,
  isFun: boolean,
): Record<CharacterTeam, ScriptCharacter[]> {
  // TODO: ensure characters are in the correct teams.
  // This should be the case anyway.

  const comparator = combineComparators(
    // Special rules
    top3(),
    isFun ? xaanFace(teams.minion) : () => 0,
    isFun ? kazaliFace(teams.demon) : () => 0,
    // Normal script order
    ...SORT_ORDER_REGEXES.map((regex) =>
      booleanComparator((character) => regex.test(character.ability)),
    ),
    numberComparator((character) => character.ability.length),
    numberComparator((character) => character.name.length),
    stringComparator((character) => character.name),
  );

  return Object.fromEntries(
    Object.entries(teams).map(([team, characters]) => [
      team,
      [...characters].sort(comparator),
    ]),
  ) as Record<CharacterTeam, ScriptCharacter[]>;
}

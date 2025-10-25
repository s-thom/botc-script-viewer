import { CHARACTERS_BY_ID, CHARACTERS_BY_TEAM } from "./characters";
import { arrayRandom } from "./util/arrays";

const generators: (() => string)[] = [
  function singleTownsfolk(): string {
    const character = arrayRandom(CHARACTERS_BY_TEAM.townsfolk);
    return `A script that is built around the ${character.name}`;
  },
  function singleOutsider(): string {
    const character = arrayRandom(CHARACTERS_BY_TEAM.outsider);
    return `A script that is built around the ${character.name}`;
  },
  function singleMinion(): string {
    const character = arrayRandom(CHARACTERS_BY_TEAM.minion);
    return `A script that is built around the ${character.name}`;
  },
  function singleDemon(): string {
    const character = arrayRandom(CHARACTERS_BY_TEAM.demon);
    return `A script with a solo ${character.name}`;
  },
  function jinx(): string {
    const charactersWithJinxes = Array.from(CHARACTERS_BY_ID.values()).filter(
      (character) => character.jinxes,
    );
    const character = arrayRandom(charactersWithJinxes);
    const jinx = arrayRandom(character.jinxes!);
    const secondCharacter = CHARACTERS_BY_ID.get(jinx.id)!;
    return `A script about the ${character.name} and ${secondCharacter.name} jinx`;
  },
  function mechanic(): string {
    const mechanics = [
      "misregistration",
      "extra night deaths",
      "protection from death",
      "quiet minions",
      "loud minions ",
    ];

    const mechanic = arrayRandom(mechanics);
    return `A script that focuses on ${mechanic}`;
  },
];

export function generatePrompt(): string {
  let prompt = arrayRandom(generators)();
  if (Math.random() < 0.15) {
    prompt = prompt.replace(/^A script/, "A teensy script");
  }
  return prompt;
}

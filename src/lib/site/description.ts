import type { NormalisedScript } from "../../types/botc";
import { type Translator } from "../i18n";

export function getScriptPageDescription(
  t: Translator,
  script: NormalisedScript,
): string {
  const allCharacters = Object.entries(script.teams).flatMap(([, characters]) =>
    characters.map((character) => character.name),
  );

  const characterNameList = t.ListFormat().format(allCharacters);

  return t.string(
    script.author
      ? "viewer.head.descriptionWithAuthor"
      : "viewer.head.description",
    {
      title: script.name || t.string("viewer.script.untitledScript").value,
      author: script.author,
      characters: characterNameList,
    },
  ).value;
}

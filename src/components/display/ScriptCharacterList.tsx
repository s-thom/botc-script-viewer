import clsx from "clsx";
import styles from "../../css/display.module.css";
import type { ScriptCharacter } from "../../generated/script-schema";
import { CharacterListItem } from "./CharacterListItem";

export interface ScriptCharacterListProps {
  characters: ScriptCharacter[];
  className?: string;
}

export function ScriptCharacterList({
  characters,
  className,
}: ScriptCharacterListProps) {
  return (
    <ul className={clsx(styles.ScriptCharacterList, className)}>
      {characters.map((character) => (
        <li key={character.id} className={styles.ScriptCharacterListItem}>
          <CharacterListItem
            character={character}
            title={character.name}
            description={character.ability}
          />
        </li>
      ))}
    </ul>
  );
}

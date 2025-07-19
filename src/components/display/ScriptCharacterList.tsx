import styles from "../../css/display.module.css";
import type { ScriptCharacter } from "../../generated/script-schema";
import { CharacterListItem } from "./CharacterListItem";

export interface ScriptCharacterListProps {
  characters: ScriptCharacter[];
}

export function ScriptCharacterList({ characters }: ScriptCharacterListProps) {
  return (
    <ul className={styles.ScriptCharacterList}>
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

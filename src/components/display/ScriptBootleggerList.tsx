import styles from "../../css/display.module.css";
import { CHARACTERS_BY_ID } from "../../util/characters";
import { CharacterListItem } from "./CharacterListItem";

export interface ScriptBootleggerListProps {
  rules: string[];
}

export function ScriptBootleggerList({ rules }: ScriptBootleggerListProps) {
  return (
    <ul className={styles.ScriptCharacterList}>
      {rules.map((rule) => (
        <li key={rule} className={styles.ScriptCharacterListItem}>
          <CharacterListItem
            character={CHARACTERS_BY_ID.get("bootlegger")!}
            description={rule}
          />
        </li>
      ))}
    </ul>
  );
}

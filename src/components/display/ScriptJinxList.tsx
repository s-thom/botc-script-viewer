import styles from "../../css/display.module.css";
import type { JinxInfo } from "../../types/botc";
import { CharacterListItem } from "./CharacterListItem";

export interface ScriptJinxListProps {
  jinxes: JinxInfo[];
}

export function ScriptJinxList({ jinxes }: ScriptJinxListProps) {
  return (
    <ul className={styles.ScriptCharacterList}>
      {jinxes.map((jinx) => (
        <li
          key={`${jinx.character1.id}/${jinx.character2.id}`}
          className={styles.ScriptCharacterListItem}
        >
          <CharacterListItem
            character={jinx.character1}
            character2={jinx.character2}
            description={jinx.reason}
          />
        </li>
      ))}
    </ul>
  );
}

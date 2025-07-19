import styles from "../../css/display.module.css";
import type { NightInfo } from "../../types/botc";
import { CharacterListItem } from "./CharacterListItem";

export interface ScriptNightOrderListProps {
  info: NightInfo[];
}

export function ScriptNightOrderList({ info }: ScriptNightOrderListProps) {
  return (
    <ul className={styles.ScriptCharacterList}>
      {info.map((rule) => (
        <li
          key={rule.type === "character" ? rule.character.id : rule.id}
          className={styles.ScriptCharacterListItem}
        >
          {rule.type === "character" ? (
            <CharacterListItem
              character={rule.character}
              title={rule.character.name}
              description={rule.reminderText}
            />
          ) : (
            <CharacterListItem
              character={null}
              title={rule.name}
              description={rule.reminderText}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

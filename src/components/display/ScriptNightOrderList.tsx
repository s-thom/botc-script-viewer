import clsx from "clsx";
import styles from "../../css/display.module.css";
import type { NightInfo } from "../../types/botc";
import { CharacterListItem } from "./CharacterListItem";

export interface ScriptNightOrderListProps {
  info: NightInfo[];
  className?: string;
}

export function ScriptNightOrderList({
  info,
  className,
}: ScriptNightOrderListProps) {
  return (
    <ul className={clsx(styles.ScriptCharacterList, className)}>
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

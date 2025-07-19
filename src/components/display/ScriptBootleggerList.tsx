import clsx from "clsx";
import styles from "../../css/display.module.css";
import { CHARACTERS_BY_ID } from "../../util/characters";
import { CharacterListItem } from "./CharacterListItem";

export interface ScriptBootleggerListProps {
  rules: string[];
  className?: string;
}

export function ScriptBootleggerList({
  rules,
  className,
}: ScriptBootleggerListProps) {
  return (
    <ul className={clsx(styles.ScriptCharacterList, className)}>
      {rules &&
        rules.map((rule) => (
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

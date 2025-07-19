import styles from "../../css/display.module.css";
import type { ScriptCharacter } from "../../generated/script-schema";
import { CharacterIcon } from "./CharacterIcon";

export interface CharacterListItemProps {
  character: ScriptCharacter;
  character2?: ScriptCharacter;
  title?: string;
  description?: string;
}

export function CharacterListItem({
  character,
  character2,
  title,
  description,
}: CharacterListItemProps) {
  return (
    <div className={styles.ScriptCharacter}>
      <CharacterIcon
        character={character}
        className={styles.ScriptCharacterIcon}
      />
      {character2 && (
        <CharacterIcon
          character={character2}
          className={styles.ScriptCharacterIcon}
        />
      )}
      <div className={styles.ScriptCharacterInfo}>
        {title && <h4 className={styles.ScriptCharacterTitle}>{title}</h4>}
        {description && (
          <p className={styles.ScriptCharacterDescription}>{description}</p>
        )}
      </div>
    </div>
  );
}

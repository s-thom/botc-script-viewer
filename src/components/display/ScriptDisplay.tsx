import clsx from "clsx";
import styles from "../../css/display.module.css";
import type { NormalisedScript } from "../../types/botc";
import { HomeLink } from "../misc/HomeLink";
import { CharacterIcon } from "./CharacterIcon";
import { ScriptBootleggerList } from "./ScriptBootleggerList";
import { ScriptCharacterList } from "./ScriptCharacterList";
import { ScriptJinxList } from "./ScriptJinxList";
import { ScriptNightOrderList } from "./ScriptNightOrderList";

export interface ScriptDisplayProps {
  script: NormalisedScript;
}

export function ScriptDisplay({ script }: ScriptDisplayProps) {
  return (
    <div className={styles.ScriptDisplay}>
      <HomeLink />
      <div className={styles.Page}>
        <div className={styles.TitleArea}>
          <h1 className={styles.ScriptTitle}>
            <span>{script.name || "Custom Script"}</span>
            {script.author && (
              <>
                <span className={styles.ScriptTitleReduced}>&ensp;by </span>
                <span className={styles.ScriptTitleReduced}>
                  {script.author}
                </span>
              </>
            )}
          </h1>
          {script.teams.fabled.length > 0 && (
            <ul className={styles.ScriptFabledList}>
              {script.teams.fabled.map((character) => (
                <li key={character.id} className={styles.ScriptFabledListItem}>
                  <CharacterIcon
                    className={styles.FabledListIcon}
                    character={character}
                  />
                  <span className={styles.ScriptFabledTitle}>
                    {character.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {script.bootlegger && script.bootlegger.length > 0 && (
          <ScriptBootleggerList rules={script.bootlegger} />
        )}
        <h2 className={styles.CategoryTitle}>Characters</h2>
        <h3 className={styles.CategoryTitle}>Townsfolk</h3>
        <ScriptCharacterList characters={script.teams.townsfolk} />
        <h3 className={styles.CategoryTitle}>Outsiders</h3>
        <ScriptCharacterList characters={script.teams.outsider} />
        <h3 className={styles.CategoryTitle}>Minions</h3>
        <ScriptCharacterList characters={script.teams.minion} />
        <h3 className={styles.CategoryTitle}>Demons</h3>
        <ScriptCharacterList characters={script.teams.demon} />
      </div>

      {(script.jinxes.length > 0 ||
        script.teams.traveller.length > 0 ||
        script.teams.fabled.length > 0) && (
        <div className={styles.Page}>
          {script.teams.traveller.length > 0 && (
            <>
              <h3 className={styles.CategoryTitle}>Travellers</h3>
              <ScriptCharacterList characters={script.teams.traveller} />
            </>
          )}
          {script.teams.fabled.length > 0 && (
            <>
              <h3 className={styles.CategoryTitle}>Fabled</h3>
              <ScriptCharacterList characters={script.teams.fabled} />
            </>
          )}
          {script.jinxes.length > 0 && (
            <>
              <h3 className={styles.CategoryTitle}>Jinxes</h3>
              <ScriptJinxList jinxes={script.jinxes} />
            </>
          )}
        </div>
      )}

      <hr className="screen-only" />

      <div className={styles.Page}>
        <h2 className={styles.CategoryTitle}>Night Order</h2>
        <div className={styles.TwoColumn}>
          <div>
            <h3 className={styles.CategoryTitle}>First Night</h3>
            <ScriptNightOrderList info={script.firstNight} />
          </div>
          <div>
            <h3 className={styles.CategoryTitle}>Other Nights</h3>
            <ScriptNightOrderList info={script.otherNight} />
          </div>
        </div>
      </div>
      <footer className={clsx(styles.ScriptDisplayFooter, "screen-only")}>
        This website is not affiliated with The Pandemonium Institute. Character
        icons and descriptions are the property of Steven Medway and The
        Pandemonium Institute. Website made by{" "}
        <a href="https://sthom.kiwi">Stuart Thomson</a>.
      </footer>
    </div>
  );
}

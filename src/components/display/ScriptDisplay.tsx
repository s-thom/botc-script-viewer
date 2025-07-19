import styles from "../../css/display.module.css";
import type { NormalisedScript } from "../../types/botc";
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
      <div className={styles.Page}>
        <h1>
          <span>{script.name || "Custom Script"}</span>
          {script.author && (
            <>
              <span> by </span>
              <span>{script.author}</span>
            </>
          )}
        </h1>
        {script.bootlegger && (
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

      {(script.jinxes.length > 0 || script.teams.traveller.length > 0) && (
        <div className={styles.Page}>
          {script.teams.traveller.length > 0 && (
            <>
              <h3 className={styles.CategoryTitle}>Travellers</h3>
              <ScriptCharacterList characters={script.teams.traveller} />
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
    </div>
  );
}

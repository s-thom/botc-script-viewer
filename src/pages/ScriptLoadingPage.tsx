import { CharacterIcon } from "../components/display/CharacterIcon";
import styles from "../css/home.module.css";

export function ScriptLoadingPage() {
  return (
    <div className={styles.HomePage}>
      <h1 className={styles.HomeTitle}>Loading script...</h1>
      <div className={styles.BigPageContent}>
        <CharacterIcon
          character={{
            id: "gossip",
            ability: "",
            name: "",
            team: "townsfolk",
          }}
          className={styles.BigPageImage}
        />
      </div>
    </div>
  );
}

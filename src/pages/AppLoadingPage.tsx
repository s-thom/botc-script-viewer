import { CharacterIcon } from "../components/display/CharacterIcon";
import styles from "../css/home.module.css";

export function AppLoadingPage() {
  return (
    <div className={styles.HomePage}>
      <h1 className={styles.HomeTitle}>Loading app...</h1>
      <div className={styles.BigPageContent}>
        <CharacterIcon
          character={{
            id: "balloonist",
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

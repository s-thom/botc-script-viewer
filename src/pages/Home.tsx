import { CustomScriptForm } from "../components/home/CustomScriptForm";
import { HostedScriptsMenu } from "../components/home/HostedScriptsMenu";
import styles from "../css/home.module.css";
import { usePageView } from "../util/usePageView";

export default function HomePage() {
  usePageView("/");

  return (
    <div className={styles.HomePage}>
      <h1 className={styles.HomeTitle}>
        Blood on the Clocktower Script Viewer
      </h1>
      <div className={styles.HomeContent}>
        <HostedScriptsMenu />
        <CustomScriptForm />
        <footer className={styles.HomeFooter}>
          <p>
            This website is not affiliated with The Pandemonium Institute.
            Character icons and descriptions are the property of Steven Medway
            and The Pandemonium Institute.
          </p>
          <p>
            Website made by <a href="https://sthom.kiwi">Stuart Thomson</a>.
          </p>
        </footer>
      </div>
    </div>
  );
}

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
        <p className={styles.InfoText}>
          View scripts for{" "}
          <a
            href="https://bloodontheclocktower.com/"
            target="_blank"
            rel="external noreferrer"
          >
            Blood on the Clocktower
          </a>{" "}
          in your browser.
        </p>
        <HostedScriptsMenu />
        <CustomScriptForm />
        <footer className={styles.HomeFooter}>
          <p>
            This website is not affiliated with The Pandemonium Institute.
            Character icons and descriptions are the property of Steven Medway
            and The Pandemonium Institute.
          </p>
          <p>
            Website made by{" "}
            <a
              href="https://sthom.kiwi"
              target="_blank"
              rel="external noreferrer"
            >
              Stuart Thomson
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}

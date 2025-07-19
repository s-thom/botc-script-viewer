import { CustomScriptForm } from "../components/home/CustomScriptForm";
import { HostedScriptsMenu } from "../components/home/HostedScriptsMenu";
import styles from "../css/home.module.css";

export default function HomePage() {
  return (
    <div className={styles.HomePage}>
      <h1 className={styles.HomeTitle}>
        Blood on the Clocktower Script Viewer
      </h1>
      <div className={styles.HomeContent}>
        <p className="visually-hidden">Select an existing script</p>
        <HostedScriptsMenu />
        <p>or view a custom script</p>
        <CustomScriptForm />
        <footer className={styles.HomeFooter}>
          This website is not affiliated with The Pandemonium Institute.
          Character icons and descriptions are the property of Steven Medway and
          The Pandemonium Institute.
        </footer>
      </div>
    </div>
  );
}

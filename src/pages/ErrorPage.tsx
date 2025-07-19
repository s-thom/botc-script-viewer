import { NavLink } from "react-router";
import styles from "../css/home.module.css";

export function ErrorPage() {
  return (
    <div className={styles.HomePage}>
      <h1 className={styles.HomeTitle}>Error trying to display script</h1>
      <div className={styles.BigPageContent}>
        <p>That&apos;s all, sorry.</p>
        <NavLink to="/">Home</NavLink>
      </div>
    </div>
  );
}

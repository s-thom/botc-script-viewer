import clsx from "clsx";
import { NavLink } from "react-router";
import styles from "../../css/display.module.css";

export function HomeLink() {
  return (
    <NavLink className={clsx(styles.ReturnHomeLink, "screen-only")} to="/">
      Change script
    </NavLink>
  );
}

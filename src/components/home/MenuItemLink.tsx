import { Menu } from "@base-ui-components/react/menu";
import clsx from "clsx";
import type { ReactNode } from "react";
import { NavLink } from "react-router";
import styles from "../../css/menu.module.css";

export interface MenuItemNavLinkProps {
  to: string;
  children?: ReactNode;
  className?: string;
}

export function MenuItemNavLink({
  to,
  children,
  className,
}: MenuItemNavLinkProps) {
  return (
    <Menu.Item
      className={clsx(styles.MenuItem, styles.MenuNavLink, className)}
      render={<NavLink to={to} />}
    >
      {children}
    </Menu.Item>
  );
}

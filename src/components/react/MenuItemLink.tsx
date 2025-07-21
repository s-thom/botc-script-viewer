import { Menu } from "@base-ui-components/react/menu";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "../../css/home.module.css";

export interface MenuItemNavLinkProps {
  href: string;
  children?: ReactNode;
  className?: string;
}

export function MenuItemNavLink({
  href,
  children,
  className,
}: MenuItemNavLinkProps) {
  return (
    <Menu.Item
      className={clsx(styles.MenuItem, styles.MenuNavLink, className)}
      render={<a href={href} />}
    >
      {children}
    </Menu.Item>
  );
}

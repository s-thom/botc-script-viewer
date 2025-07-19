import { Menu } from "@base-ui-components/react/menu";
import styles from "../../css/menu.module.css";
import type { HostedScriptDefinition } from "../../types/botc";
import { CHARACTERS_BY_ID } from "../../util/characters";
import { CharacterIcon } from "../display/CharacterIcon";
import { MenuItemNavLink } from "./MenuItemLink";

export interface ScriptMenuProps {
  title: string;
  path: string;
  scripts: HostedScriptDefinition[];
}

export function ScriptMenu({ title, path, scripts }: ScriptMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger className={styles.MenuTrigger}>{title}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className={styles.MenuPositioner}
          sideOffset={6}
          alignOffset={-2}
          sticky
        >
          <Menu.Popup className={styles.MenuPopup}>
            {scripts.map((script) => (
              <MenuItemNavLink key={script.id} to={`${path}/${script.id}`}>
                <CharacterIcon
                  className={styles.MenuInlineIcon}
                  character={CHARACTERS_BY_ID.get(script.character)!}
                />
                <span>{script.title}</span>
              </MenuItemNavLink>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

import { Menubar } from "@base-ui-components/react/menubar";
import styles from "../../css/menu.module.css";
import { BASE_3 } from "../../scripts/base3";
import { CAROUSEL_COLLECTION } from "../../scripts/carousel-collection";
import { WORLD_CUP_25 } from "../../scripts/wc25";
import { ScriptMenu } from "./ScriptMenu";

export function HostedScriptsMenu() {
  return (
    <div>
      <Menubar className={styles.Menubar}>
        <ScriptMenu title="Base 3" path="b3" scripts={BASE_3} />
        <ScriptMenu
          title="Carousel Collection"
          path="cc"
          scripts={CAROUSEL_COLLECTION}
        />
        <ScriptMenu title="World Cup '25" path="wc25" scripts={WORLD_CUP_25} />
      </Menubar>
    </div>
  );
}

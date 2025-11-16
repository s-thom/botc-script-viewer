import { upgradeState } from "../../builder/state-helper";
import {
  CURRENT_STATE_VERSION,
  type AllPastStateTypes,
  type GlobalState,
} from "../../builder/state/types";

const LOCAL_STORAGE_KEY = "botc-script-builder-state";

/** @deprecated */
export function getBuilderState(): GlobalState | undefined {
  const str = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (str) {
    try {
      const state: AllPastStateTypes = JSON.parse(str);
      if (state.version === CURRENT_STATE_VERSION) {
        return state;
      } else {
        return upgradeState(state);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Ignore
    }
  }
}

/** @deprecated */
export function saveBuilderState(state: GlobalState) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  history.replaceState({ hasStoredScript: "true" }, "", "/builder");
}

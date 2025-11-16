import { nanoid } from "nanoid";
import {
  getBuilderState,
  saveBuilderState,
} from "../../client/storage/local-storage";
import { getScriptFromState } from "../state-helper";
import { saveScript } from "../switcher";
import { type GlobalState } from "./types";

const DEFAULT_INITIAL_STATE: GlobalState = {
  version: 4,
  scriptId: nanoid(),
  meta: { id: "_meta", name: "" },
  characters: {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
    loric: [],
  },
  unknownCharacters: [],
  options: {
    useSortOrder: true,
    useSortOrderFun: true,
  },
  ui: {
    useChecks: true,
    isChecksDrawerOpen: false,
    ignoredChecks: [],
    panelSizes: { script: 350, options: 350, checks: 300 },
    screen: "script",
  },
};

export function getInitialState(): GlobalState {
  if (typeof localStorage !== "undefined") {
    const state = getBuilderState();
    if (state) {
      return state;
    }
  }

  return DEFAULT_INITIAL_STATE;
}

export async function persistState(state: GlobalState) {
  saveBuilderState(state);

  const numCharacters = Object.values(state.characters).reduce(
    (sum, team) => sum + team.length,
    0,
  );
  const hasMeta = !!(state.meta.name || state.meta.author);

  // Only store script to IndexedDB if it's likely to actually be useful
  if (numCharacters > 0 || hasMeta) {
    const script = getScriptFromState(state);
    await saveScript(state.scriptId, script);
  }
}

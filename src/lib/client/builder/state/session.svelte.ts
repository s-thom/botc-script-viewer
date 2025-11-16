import type { CheckResult } from "../../../builder/checks/types";

export interface SessionState {
  checks: {
    loading: boolean;
    didError: boolean;
    errors: CheckResult[];
    warnings: CheckResult[];
    infos: CheckResult[];
  };
}

export const sessionState = $state<SessionState>({
  checks: {
    loading: false,
    didError: false,
    errors: [],
    warnings: [],
    infos: [],
  },
});

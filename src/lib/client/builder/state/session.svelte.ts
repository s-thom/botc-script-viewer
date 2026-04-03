export interface SessionState {
  checks: {
    loading: boolean;
    didError: boolean;
    errors: never[];
    warnings: never[];
    infos: never[];
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

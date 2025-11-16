<script lang="ts">
  import { getAbortSignal } from "svelte";
  import { runAllChecks } from "../../../../lib/builder/checks";
  import { groupBy } from "../../../../lib/builder/util/arrays";
  import { delay, scheduleTask } from "../../../../lib/builder/util/async";
  import {
    scriptState,
    appState,
    sessionState,
  } from "../../../../lib/client/builder/state";
  import {
    setAppSettings,
    setScriptSettings,
  } from "../../../../lib/client/storage/builder";

  // Run checks
  $effect(() => {
    const signal = getAbortSignal();
    const state = $state.snapshot(scriptState);

    if (!appState.checks.enabled) {
      return;
    }

    sessionState.checks.loading = true;
    sessionState.checks.didError = false;

    delay(300, signal)
      .then(() => runAllChecks(state, signal))
      .then((results) => {
        const grouped = groupBy(results, (result) => result.level);

        sessionState.checks.errors = grouped.error ?? [];
        sessionState.checks.warnings = grouped.warning ?? [];
        sessionState.checks.infos = grouped.info ?? [];
        sessionState.checks.loading = false;
        sessionState.checks.didError = false;
      })
      .catch((err: unknown) => {
        if (
          typeof err === "object" &&
          err != null &&
          "type" in err &&
          err.type === "abort"
        ) {
          return;
        }
        console.error("Error while running checks", err);

        sessionState.checks.loading = false;
        sessionState.checks.didError = true;
      });
  });

  // Persist state
  $effect(() => {
    const signal = getAbortSignal();
    const appSnapshot = $state.snapshot(appState);
    const scriptSnapshot = $state.snapshot(scriptState);

    delay(300, signal)
      .then(() =>
        scheduleTask(async () => {
          await setAppSettings(appSnapshot);

          // Only store script to IndexedDB if it's likely to actually be useful
          const numCharacters = Object.values(scriptSnapshot.characters).reduce(
            (sum, team) => sum + team.length,
            0,
          );
          const hasMeta = !!(
            scriptSnapshot.meta.name || scriptSnapshot.meta.author
          );
          if (numCharacters > 0 || hasMeta) {
            await setScriptSettings(
              appSnapshot.currentScriptId,
              scriptSnapshot,
            );
          }
        }, signal),
      )
      .catch((err: unknown) => {
        if (
          typeof err === "object" &&
          err != null &&
          "type" in err &&
          err.type === "abort"
        ) {
          return;
        }
        console.error("Error while persisting state", err);
      });
  });
</script>

<div class="visually-hidden-always"></div>

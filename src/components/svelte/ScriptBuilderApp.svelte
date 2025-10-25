<svelte:options runes />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import DesktopLayout from "./layouts/DesktopLayout.svelte";
  import MobileLayout from "./layouts/MobileLayout.svelte";
  import TabletLayout from "./layouts/TabletLayout.svelte";
  import { getAbortSignal } from "svelte";
  import { runAllChecks } from "../../lib/builder/checks";
  import { checksState, globalState } from "../../lib/builder/state.svelte";
  import { groupBy } from "../../lib/builder/util/arrays";
  import { delay, scheduleTask } from "../../lib/builder/util/async";
  import { persistState } from "../../lib/builder/state";

  const large = new MediaQuery("min-width: 960px");
  const medium = new MediaQuery("min-width: 600px");

  // Run checks
  $effect(() => {
    const signal = getAbortSignal();
    const state = $state.snapshot(globalState);

    if (!globalState.ui.useChecks) {
      return;
    }

    checksState.loading = true;
    checksState.didError = false;

    delay(300, signal)
      .then(() => runAllChecks(state, signal))
      .then((results) => {
        const grouped = groupBy(results, (result) => result.level);

        checksState.errors = grouped.error ?? [];
        checksState.warnings = grouped.warning ?? [];
        checksState.infos = grouped.info ?? [];
        checksState.loading = false;
        checksState.didError = false;
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

        checksState.loading = false;
        checksState.didError = true;
      });
  });

  // Persist state
  $effect(() => {
    const signal = getAbortSignal();
    const state = $state.snapshot(globalState);

    delay(300, signal)
      .then(() => scheduleTask(() => persistState(state), signal))
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

{#if large.current}
  <DesktopLayout />
{:else if medium.current}
  <TabletLayout />
{:else}
  <MobileLayout />
{/if}

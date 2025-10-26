<svelte:options runes />

<script lang="ts">
  import { getAbortSignal, onMount } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
  import { runAllChecks } from "../../lib/builder/checks";
  import { persistState } from "../../lib/builder/state";
  import {
    checksState,
    globalState,
    setScript,
  } from "../../lib/builder/state.svelte";
  import { groupBy } from "../../lib/builder/util/arrays";
  import { delay, scheduleTask } from "../../lib/builder/util/async";
  import { rawScriptValidator } from "../../lib/parse";
  import DesktopLayout from "./layouts/DesktopLayout.svelte";
  import MobileLayout from "./layouts/MobileLayout.svelte";
  import TabletLayout from "./layouts/TabletLayout.svelte";
  import { createPortal, portal } from "../../lib/builder/portal";
  import BuilderNavLinks from "./options/BuilderNavLinks.svelte";

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

  // Load script from HTML body if needed
  onMount(() => {
    if (typeof document !== "undefined") {
      const dataElement = document.querySelector("script#post-data");
      if (!dataElement) {
        return;
      }

      let script: BloodOnTheClocktowerCustomScript;
      try {
        const json = JSON.parse(dataElement.textContent);
        script = rawScriptValidator.parse(json);
      } catch (err) {
        console.error("Error while parsing script content", err);
        return;
      }

      // Whenever state is stored, we also mark it on the current entry of the history stack.
      // Without this or similar, then refreshing the page would cause the POSTed script to be loaded again.
      if (history.state?.hasStoredScript === "true") {
        return;
      }

      setScript(script);
    }
  });

  // Set up navigation bar
  onMount(() => {
    createPortal(
      document.querySelector("#top-nav-links-container")!,
      "top-nav-links-container",
    );
  });
</script>

{#if large.current}
  <DesktopLayout />
{:else if medium.current}
  <TabletLayout />
{:else}
  <MobileLayout />
{/if}

<div use:portal={"top-nav-links-container"}>
  <BuilderNavLinks />
</div>

<span class="marker"></span>

<style>
  :global(body):has(.marker) {
    max-height: 100vh;
    max-height: 100dvh;

    > :global(.container) {
      display: contents;
    }

    :global(main) {
      flex-grow: 1;
    }
  }

  .marker {
    display: none;
  }
</style>

<script lang="ts">
  import {
    CheckAll,
    Error,
    Info,
    Search,
    SearchFuzzy,
    SearchSparkle,
    Warning,
  } from "svelte-codicons";
  import { slide } from "svelte/transition";
  import { checksState, globalState } from "../../../lib/builder/state.svelte";
  import AboutChecks from "./AboutChecks.svelte";
  import ChecksList from "./ChecksList.svelte";

  const PANEL_MINIMUM_SIZE = 50;
  const PANEL_MINIMUM_SIZE_GRACE = 10;
  const PANEL_MAXIMUM_SIZE = 800;

  function onTabClick() {
    globalState.ui.isChecksDrawerOpen = !globalState.ui.isChecksDrawerOpen;
  }

  function keyPressHandler(event: KeyboardEvent) {
    const element = event.currentTarget as HTMLElement;

    let moveAmount = 10;
    if (event.metaKey) {
      moveAmount = 1;
    } else if (event.shiftKey) {
      moveAmount = 50;
    }

    switch (event.key) {
      case "ArrowDown":
        globalState.ui.panelSizes.checks = Math.max(
          Math.min(
            globalState.ui.panelSizes.checks - moveAmount,
            PANEL_MAXIMUM_SIZE,
          ),
          PANEL_MINIMUM_SIZE,
        );
        break;
      case "ArrowUp":
        globalState.ui.panelSizes.checks = Math.max(
          Math.min(
            globalState.ui.panelSizes.checks + moveAmount,
            PANEL_MAXIMUM_SIZE,
          ),
          PANEL_MINIMUM_SIZE,
        );
        break;
      case "Home":
        globalState.ui.panelSizes.checks = PANEL_MINIMUM_SIZE;
        break;
      case "End":
        globalState.ui.panelSizes.checks = PANEL_MAXIMUM_SIZE;
        break;
    }
  }

  function mouseDownHandler(event: PointerEvent) {
    const element = event.currentTarget as HTMLElement;

    const initialY = event.clientY;
    let initialHeight = globalState.ui.panelSizes.checks;
    if (!globalState.ui.isChecksDrawerOpen) {
      initialHeight -= PANEL_MINIMUM_SIZE;
    }

    const doc = document.documentElement;

    function moveHandler(event2: PointerEvent) {
      const newY = event2.clientY;

      const difference = (newY - initialY) * -1;

      const rawHeight = initialHeight + difference;

      // Open/close if too low
      globalState.ui.isChecksDrawerOpen =
        rawHeight > PANEL_MINIMUM_SIZE - PANEL_MINIMUM_SIZE_GRACE;

      const newHeight = Math.max(
        Math.min(rawHeight, PANEL_MAXIMUM_SIZE),
        PANEL_MINIMUM_SIZE,
      );

      globalState.ui.panelSizes.checks = newHeight;
    }
    doc.addEventListener("pointermove", moveHandler);

    function removeHandlers() {
      doc.removeEventListener("pointermove", moveHandler);
      doc.removeEventListener("pointerup", removeHandlers);
      doc.removeEventListener("pointerleave", removeHandlers);
    }
    doc.addEventListener("pointerup", removeHandlers, { once: true });
    doc.addEventListener("pointerleave", removeHandlers, { once: true });
  }

  const checksData = $derived.by(() => {
    const filteredErrors = checksState.errors.filter(
      (result) => !globalState.ui.ignoredChecks.includes(result.id),
    );
    const filteredWarnings = checksState.warnings.filter(
      (result) => !globalState.ui.ignoredChecks.includes(result.id),
    );
    const filteredInfos = checksState.infos.filter(
      (result) => !globalState.ui.ignoredChecks.includes(result.id),
    );

    const allResults = [
      ...filteredErrors,
      ...filteredWarnings,
      ...filteredInfos,
    ];
    const hasResults = allResults.length > 0;

    let hasFixes = false;
    for (const result of allResults) {
      if (result.actions && result.actions.length > 0) {
        hasFixes = true;
        break;
      }
    }

    return {
      hasResults,
      hasFixes,
      numErrors: filteredErrors.length,
      numWarnings: filteredWarnings.length,
      numInfo: filteredInfos.length,
      total:
        filteredErrors.length + filteredWarnings.length + filteredInfos.length,
    };
  });
</script>

<div
  class={[
    "resize-panel checks-panel-container",
    globalState.ui.isChecksDrawerOpen && "open",
  ]}
>
  <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
  <button
    class="panel-resize-handle"
    role="separator"
    aria-valuenow={globalState.ui.panelSizes.checks}
    aria-valuemin={PANEL_MINIMUM_SIZE}
    aria-valuemax={PANEL_MAXIMUM_SIZE}
    onkeydown={keyPressHandler}
    onpointerdown={mouseDownHandler}
    data-umami-event="checks-panel-resize"
    ><span class="visually-hidden">Change checks panel size</span></button
  >
  <button
    type="button"
    class="tab"
    onclick={onTabClick}
    data-umami-event="checks-tab-toggle"
    data-umami-event-open={!globalState.ui.isChecksDrawerOpen}
  >
    {#if checksData.hasFixes}
      <SearchSparkle class="inline-icon" />
    {:else if checksData.hasResults}
      <SearchFuzzy class="inline-icon" />
    {:else}
      <Search class="inline-icon" />
    {/if}&numsp;
    <span class="visually-hidden">Toggle checks drawer</span>
    {#if checksData.total > 0}
      <Error class="inline-icon" aria-label="Errors" />
      &nbsp;{checksData.numErrors}&nbsp;
      <Warning class="inline-icon" aria-label="Warnings" />
      &nbsp;{checksData.numWarnings}&nbsp;
      <Info class="inline-icon" aria-label="Info" />
      &nbsp;{checksData.numInfo}
    {:else}
      <CheckAll class="inline-icon" aria-label="Success" /><span> &nbsp;0</span>
    {/if}
  </button>
  {#if globalState.ui.isChecksDrawerOpen}
    <div
      class="resize-panel-content scroll-container"
      transition:slide={{ axis: "y", duration: 100 }}
    >
      {#if globalState.ui.screen === "checks:about"}
        <div class="about-container">
          <AboutChecks />
        </div>
      {:else}
        <ChecksList />
      {/if}
    </div>
  {/if}
</div>

<style>
  .scroll-container {
    overflow-y: auto;
  }

  .resize-panel {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    position: relative;

    .resize-panel-content {
      flex-grow: 1;
    }
  }

  .panel-resize-handle {
    width: 100%;
    height: var(--panel-resize-handle-size);
    background-color: var(--color-control-border-hover);
    border: none;
    top: 0;
    padding: 0;
    cursor: ns-resize;
    transition: transform 150ms ease-in-out;
    z-index: 1;

    inset-block-start: calc(-1 * var(--panel-resize-handle-size));

    &:hover {
      transform: scaleY(2);
      background-color: var(--color-control-border-active);
    }
  }

  .checks-panel-container {
    height: var(--panel-resize-handle-size);

    &.open {
      height: clamp(50px, var(--panel-checks-height), 800px);
    }
  }

  .tab {
    position: absolute;
    inset-inline-end: 0;
    inset-block-start: 0;
    transform: translateY(-100%);
    background-color: var(--color-control-background-active);
    border: none;
    border-block-start: var(--panel-resize-handle-size) solid
      var(--color-control-border-hover);
    border-inline-start: var(--panel-resize-handle-size) solid
      var(--color-control-border-hover);
    padding: 0.2rem;

    display: flex;
    align-items: center;

    &:hover:not(:active) {
      background-color: var(--color-control-background);
      border-color: var(--color-control-border-active);
    }

    :global(.tab-icon) {
      width: 0.8rem;
    }
  }

  .about-container {
    padding-inline: 0.5rem;
  }
</style>

<script lang="ts">
  import { globalState } from "../../../lib/builder/state.svelte";
  import type { GlobalState } from "../../../lib/builder/state/types";
  import CharacterSelectForm from "../character-selection/CharacterSelectForm.svelte";
  import ChecksDrawer from "../checks/ChecksDrawer.svelte";
  import AboutSection from "../common/AboutSection.svelte";
  import PromptDisplay from "../common/PromptDisplay.svelte";
  import TopSticky from "../common/TopSticky.svelte";
  import ImportExportForm from "../options/ImportExportForm.svelte";
  import ScriptOptions from "../options/ScriptOptions.svelte";
  import BasicMetadataForm from "../script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "../script/CurrentCharacterList.svelte";

  const PANEL_MINIMUM_SIZE = 250;
  const PANEL_MAXIMUM_SIZE = 650;

  // Svelte's <svelte:document> doesn't allow you to set custom properties.
  $effect(() => {
    document.documentElement.style.setProperty(
      "--panel-script-width",
      `${globalState.ui.panelSizes.script}px`,
    );
    document.documentElement.style.setProperty(
      "--panel-options-width",
      `${globalState.ui.panelSizes.options}px`,
    );
    document.documentElement.style.setProperty(
      "--panel-checks-height",
      `${globalState.ui.panelSizes.checks}px`,
    );
  });

  function getKeyPressHandler(panel: keyof GlobalState["ui"]["panelSizes"]) {
    return (event: KeyboardEvent) => {
      const element = event.currentTarget as HTMLElement;
      const direction = window
        .getComputedStyle(element)
        .getPropertyValue("direction");

      const isHandleOnEnd = panel === "script";
      const expandsToLeft =
        (isHandleOnEnd && direction === "ltr") ||
        (!isHandleOnEnd && direction === "rtl");

      let moveAmount = 10;
      if (event.metaKey) {
        moveAmount = 1;
      } else if (event.shiftKey) {
        moveAmount = 50;
      }
      if (!expandsToLeft) {
        moveAmount *= -1;
      }

      switch (event.key) {
        case "ArrowLeft":
          globalState.ui.panelSizes[panel] = Math.max(
            Math.min(
              globalState.ui.panelSizes[panel] - moveAmount,
              PANEL_MAXIMUM_SIZE,
            ),
            PANEL_MINIMUM_SIZE,
          );
          break;
        case "ArrowRight":
          globalState.ui.panelSizes[panel] = Math.max(
            Math.min(
              globalState.ui.panelSizes[panel] + moveAmount,
              PANEL_MAXIMUM_SIZE,
            ),
            PANEL_MINIMUM_SIZE,
          );
          break;
        case "Home":
          globalState.ui.panelSizes[panel] = PANEL_MINIMUM_SIZE;
          break;
        case "End":
          globalState.ui.panelSizes[panel] = PANEL_MAXIMUM_SIZE;
          break;
      }
    };
  }

  function getMouseDownHandler(panel: keyof GlobalState["ui"]["panelSizes"]) {
    return (event: PointerEvent) => {
      const element = event.currentTarget as HTMLElement;
      const direction = window
        .getComputedStyle(element)
        .getPropertyValue("direction");

      const isHandleOnEnd = panel === "script";
      const expandsToLeft =
        (isHandleOnEnd && direction === "ltr") ||
        (!isHandleOnEnd && direction === "rtl");

      const initialX = event.clientX;
      const initialWidth = globalState.ui.panelSizes[panel];

      const doc = document.documentElement;

      function moveHandler(event2: PointerEvent) {
        const newX = event2.clientX;

        let difference = newX - initialX;
        if (!expandsToLeft) {
          difference *= -1;
        }

        const rawWidth = initialWidth + difference;
        const newWidth = Math.max(
          Math.min(rawWidth, PANEL_MAXIMUM_SIZE),
          PANEL_MINIMUM_SIZE,
        );

        globalState.ui.panelSizes[panel] = newWidth;
      }
      doc.addEventListener("pointermove", moveHandler);

      function removeHandlers() {
        doc.removeEventListener("pointermove", moveHandler);
        doc.removeEventListener("pointerup", removeHandlers);
        doc.removeEventListener("pointerleave", removeHandlers);
      }
      doc.addEventListener("pointerup", removeHandlers, { once: true });
      doc.addEventListener("pointerleave", removeHandlers, { once: true });
    };
  }

  const scriptKeyHandler = getKeyPressHandler("script");
  const optionsKeyHandler = getKeyPressHandler("options");

  const scriptMouseHandler = getMouseDownHandler("script");
  const optionsMouseHandler = getMouseDownHandler("options");
</script>

<main class="container">
  <div class="resize-panel script-panel-container panel">
    <div class="resize-panel-content panel-padding scroll-container">
      <TopSticky>
        <BasicMetadataForm />
        <PromptDisplay />
      </TopSticky>
      <CurrentCharacterList />
    </div>
    <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
    <button
      class="panel-resize-handle handle-end"
      role="separator"
      aria-valuenow={globalState.ui.panelSizes.script}
      aria-valuemin={PANEL_MINIMUM_SIZE}
      aria-valuemax={PANEL_MAXIMUM_SIZE}
      onkeydown={scriptKeyHandler}
      onpointerdown={scriptMouseHandler}
      data-umami-event="script-panel-resize"
      ><span class="visually-hidden">Change script panel size</span></button
    >
  </div>

  <div class="panel main-panel">
    <div class="panel-padding main-panel-content scroll-container">
      <CharacterSelectForm />
    </div>
    {#if globalState.ui.useChecks}
      <ChecksDrawer />
    {/if}
  </div>

  <div class="resize-panel options-panel-container panel">
    <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
    <button
      class="panel-resize-handle handle-start"
      role="separator"
      aria-valuenow={globalState.ui.panelSizes.options}
      aria-valuemin={PANEL_MINIMUM_SIZE}
      aria-valuemax={PANEL_MAXIMUM_SIZE}
      onkeydown={optionsKeyHandler}
      onpointerdown={optionsMouseHandler}
      data-umami-event="options-panel-resize"
      ><span class="visually-hidden">Change options panel size</span></button
    >
    <div class="resize-panel-content panel-padding scroll-container">
      <ImportExportForm />
      <ScriptOptions />
      <AboutSection />
    </div>
  </div>
</main>

<style>
  .container {
    height: 100vh;
    height: 100svh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100svh;
    max-height: 100dvh;
    display: flex;
  }

  .panel {
    height: 100%;
    max-height: 100vh;
    max-height: 100svh;
    max-height: 100dvh;
  }

  .scroll-container {
    overflow-y: auto;
  }

  .panel-padding {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .resize-panel {
    flex-shrink: 0;
    display: flex;

    .resize-panel-content {
      flex-grow: 1;
    }
  }

  .script-panel-container {
    width: clamp(250px, var(--panel-script-width), 650px);
  }

  .options-panel-container {
    width: clamp(250px, var(--panel-options-width), 650px);
  }

  .main-panel {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .main-panel-content {
    flex-grow: 1;
  }

  .panel-resize-handle {
    height: 100vh;
    height: 100svh;
    height: 100dvh;
    width: var(--panel-resize-handle-size);
    background-color: var(--color-control-border-hover);
    border: none;
    top: 0;
    padding: 0;
    cursor: ew-resize;
    transition: transform 150ms ease-in-out;
    z-index: 1;

    &.handle-start {
      inset-inline-start: calc(-1 * var(--panel-resize-handle-size));
    }

    &.handle-end {
      inset-inline-end: calc(-1 * var(--panel-resize-handle-size));
    }

    &:hover {
      transform: scaleX(2);
      background-color: var(--color-control-border-active);
    }
  }
</style>

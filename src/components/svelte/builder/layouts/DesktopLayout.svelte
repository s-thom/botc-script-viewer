<script lang="ts">
  import {
    appState,
    getCurrentScreen,
  } from "../../../../lib/client/builder/state";
  import type { BuilderAppSettingsLatest } from "../../../../lib/client/builder/state/types";
  import CharacterSpotlight from "../character-edit/CharacterSpotlight.svelte";
  import CharacterSelectForm from "../character-selection/CharacterSelectForm.svelte";
  import ChecksDrawer from "../checks/ChecksDrawer.svelte";
  import AboutSection from "../common/AboutSection.svelte";
  import PromptDisplay from "../common/PromptDisplay.svelte";
  import TopSticky from "../common/TopSticky.svelte";
  import ScriptOptions from "../options/ScriptOptions.svelte";
  import BasicMetadataForm from "../script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "../script/CurrentCharacterList.svelte";
  import ImportForm from "../switcher/ImportForm.svelte";
  import ScriptSwitcher from "../switcher/ScriptSwitcher.svelte";

  const PANEL_MINIMUM_SIZE = 250;
  const PANEL_MAXIMUM_SIZE = 650;

  // Svelte's <svelte:document> doesn't allow you to set custom properties.
  $effect(() => {
    document.documentElement.style.setProperty(
      "--panel-script-width",
      `${appState.panelSizes.script}px`,
    );
    document.documentElement.style.setProperty(
      "--panel-options-width",
      `${appState.panelSizes.options}px`,
    );
    document.documentElement.style.setProperty(
      "--panel-checks-height",
      `${appState.panelSizes.checks}px`,
    );
  });

  function getKeyPressHandler(
    panel: keyof BuilderAppSettingsLatest["panelSizes"],
  ) {
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
          appState.panelSizes[panel] = Math.max(
            Math.min(
              appState.panelSizes[panel] - moveAmount,
              PANEL_MAXIMUM_SIZE,
            ),
            PANEL_MINIMUM_SIZE,
          );
          break;
        case "ArrowRight":
          appState.panelSizes[panel] = Math.max(
            Math.min(
              appState.panelSizes[panel] + moveAmount,
              PANEL_MAXIMUM_SIZE,
            ),
            PANEL_MINIMUM_SIZE,
          );
          break;
        case "Home":
          appState.panelSizes[panel] = PANEL_MINIMUM_SIZE;
          break;
        case "End":
          appState.panelSizes[panel] = PANEL_MAXIMUM_SIZE;
          break;
      }
    };
  }

  function getMouseDownHandler(
    panel: keyof BuilderAppSettingsLatest["panelSizes"],
  ) {
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
      const initialWidth = appState.panelSizes[panel];

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

        appState.panelSizes[panel] = newWidth;
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

  let currentScreen = $derived.by(() => getCurrentScreen());
</script>

<main class="container">
  <div class="resize-panel script-panel-container panel">
    <div class="resize-panel-content panel-padding scroll-container">
      {#if currentScreen.id === "switcher" || currentScreen.id === "switcher:import"}
        <ScriptSwitcher />
      {:else}
        <TopSticky>
          <BasicMetadataForm />
          <PromptDisplay />
        </TopSticky>
        <CurrentCharacterList />
      {/if}
    </div>
    <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
    <button
      class="panel-resize-handle handle-end"
      role="separator"
      aria-valuenow={appState.panelSizes.script}
      aria-valuemin={PANEL_MINIMUM_SIZE}
      aria-valuemax={PANEL_MAXIMUM_SIZE}
      onkeydown={scriptKeyHandler}
      onpointerdown={scriptMouseHandler}
      data-umami-event="script-panel-resize"
      ><span class="visually-hidden">Change script panel size</span></button
    >
  </div>

  <div class="panel main-panel">
    {#if currentScreen.id === "edit-character"}
      <div class="panel-padding main-panel-content scroll-container">
        <CharacterSpotlight />
      </div>
    {:else if currentScreen.id === "switcher" || currentScreen.id === "switcher:import"}
      <div class="panel-padding main-panel-content scroll-container">
        <ImportForm />
      </div>
    {:else}
      <div class="panel-padding main-panel-content scroll-container">
        <CharacterSelectForm />
      </div>
      {#if appState.checks.enabled}
        <ChecksDrawer />
      {/if}
    {/if}
  </div>

  <div class="resize-panel options-panel-container panel">
    <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
    <button
      class="panel-resize-handle handle-start"
      role="separator"
      aria-valuenow={appState.panelSizes.options}
      aria-valuemin={PANEL_MINIMUM_SIZE}
      aria-valuemax={PANEL_MAXIMUM_SIZE}
      onkeydown={optionsKeyHandler}
      onpointerdown={optionsMouseHandler}
      data-umami-event="options-panel-resize"
      ><span class="visually-hidden">Change options panel size</span></button
    >
    <div class="resize-panel-content panel-padding scroll-container">
      {#if currentScreen.id !== "switcher"}
        <ScriptOptions />
      {/if}
      <AboutSection />
    </div>
  </div>
</main>

<style>
  .container {
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    display: grid;
    grid-template-columns:
      clamp(250px, var(--panel-script-width), 650px) 1fr
      clamp(250px, var(--panel-options-width), 650px);
  }

  .panel {
    height: 100%;
    min-height: 100%;
    max-height: 100%;
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
    position: relative;

    .resize-panel-content {
      flex-grow: 1;
    }
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
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    width: var(--panel-resize-handle-size);
    background-color: var(--color-control-border-hover);
    border: none;
    top: 0;
    padding: 0;
    cursor: ew-resize;
    transition: transform 150ms ease-in-out;
    z-index: 1;
    position: absolute;

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

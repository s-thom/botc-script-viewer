<svelte:options runes />

<script lang="ts">
  import { getCurrentScreen } from "../../../../lib/client/builder/state";
  import CharacterSpotlight from "../character-edit/CharacterSpotlight.svelte";
  import CharacterSelectForm from "../character-selection/CharacterSelectForm.svelte";
  import AboutChecks from "../checks/AboutChecks.svelte";
  import ChecksList from "../checks/ChecksList.svelte";
  import AboutSection from "../common/AboutSection.svelte";
  import MobileNavigation from "../common/MobileNavigation.svelte";
  import PromptDisplay from "../common/PromptDisplay.svelte";
  import TopSticky from "../common/TopSticky.svelte";
  import ScriptOptions from "../options/ScriptOptions.svelte";
  import BasicMetadataForm from "../script/BasicMetadataForm.svelte";
  import CurrentCharacterList from "../script/CurrentCharacterList.svelte";
  import ImportForm from "../switcher/ImportForm.svelte";
  import ScriptSwitcher from "../switcher/ScriptSwitcher.svelte";

  let currentScreen = $derived.by(() => getCurrentScreen());
</script>

<main class="container">
  <div class="panel detail-panel">
    <div class="panel-padding scroll-container detail-panel-content">
      {#if currentScreen.id === "options"}
        <ScriptOptions />
        <AboutSection />
      {:else if currentScreen.id === "checks"}
        <div class="reverse-padding">
          <ChecksList />
        </div>
      {:else if currentScreen.id === "checks:about"}
        <AboutChecks />
      {:else if currentScreen.id === "switcher" || currentScreen.id === "switcher:import"}
        <ScriptSwitcher />
      {:else}
        <TopSticky>
          <BasicMetadataForm />
          <PromptDisplay />
        </TopSticky>
        <CurrentCharacterList />
      {/if}
    </div>
    <MobileNavigation pages={["script", "checks", "options"]} />
  </div>
  <div class="panel panel-padding scroll-container">
    {#if currentScreen.id === "edit-character"}
      <CharacterSpotlight />
    {:else if currentScreen.id === "switcher" || currentScreen.id === "switcher:import"}
      <ImportForm />
    {:else}
      <CharacterSelectForm />
    {/if}
  </div>
</main>

<style>
  .container {
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    display: flex;
  }

  .panel {
    flex-basis: 50%;

    &:not(:first-child) {
      border-inline-start: 1px solid var(--color-control-border-hover);
    }

    &:not(:last-child) {
      border-inline-end: 1px solid var(--color-control-border-hover);
    }
  }

  .scroll-container {
    overflow-y: auto;
  }

  .panel-padding {
    padding: 0.5rem;
  }

  .reverse-padding {
    margin: 0 -0.5rem;
  }

  .detail-panel {
    display: flex;
    flex-direction: column;

    .detail-panel-content {
      flex-grow: 1;
    }
  }
</style>

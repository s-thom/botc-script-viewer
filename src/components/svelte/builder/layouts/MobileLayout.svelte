<svelte:options runes />

<script lang="ts">
  import { appState } from "../../../../lib/client/builder/state";
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
</script>

<main class="container">
  <div class="scroll-container content">
    <div class="panel panel-padding">
      {#if appState.screen.current === "script"}
        <TopSticky>
          <BasicMetadataForm />
          <PromptDisplay />
        </TopSticky>
        <CurrentCharacterList />
      {:else if appState.screen.current === "select-characters"}
        <CharacterSelectForm />
      {:else if appState.screen.current === "options"}
        <ScriptOptions />
        <AboutSection />
      {:else if appState.screen.current === "checks"}
        <div class="reverse-padding">
          <ChecksList />
        </div>
      {:else if appState.screen.current === "checks:about"}
        <AboutChecks />
      {:else if appState.screen.current === "switcher"}
        <ScriptSwitcher />
      {:else if appState.screen.current === "switcher:import"}
        <ImportForm />
      {/if}
    </div>
  </div>

  <MobileNavigation
    pages={["script", "select-characters", "checks", "options"]}
  />
</main>

<style>
  .container {
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex-grow: 1;
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
</style>

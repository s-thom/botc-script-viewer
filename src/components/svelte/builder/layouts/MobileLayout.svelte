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
  <div class="scroll-container content">
    <div class="panel panel-padding">
      {#if currentScreen.id === "script"}
        <TopSticky>
          <BasicMetadataForm />
          <PromptDisplay />
        </TopSticky>
        <CurrentCharacterList />
      {:else if currentScreen.id === "select-characters"}
        <CharacterSelectForm />
      {:else if currentScreen.id === "options"}
        <ScriptOptions />
        <AboutSection />
      {:else if currentScreen.id === "checks"}
        <div class="reverse-padding">
          <ChecksList />
        </div>
      {:else if currentScreen.id === "checks:about"}
        <AboutChecks />
      {:else if currentScreen.id === "switcher"}
        <ScriptSwitcher />
      {:else if currentScreen.id === "switcher:import"}
        <ImportForm />
      {:else if currentScreen.id === "edit-character"}
        <CharacterSpotlight />
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

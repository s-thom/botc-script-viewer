<script lang="ts">
  import { CHARACTERS_BY_ID } from "../../../../lib/characters";
  import {
    getCurrentScreen,
    navigatePopScreen,
    scriptState,
  } from "../../../../lib/client/builder/state";
  import CentredInfoArea from "../common/CentredInfoArea.svelte";
  import ViewCharacter from "./ViewCharacter.svelte";

  let character = $derived.by(() => {
    const currentScreen = getCurrentScreen();
    const scriptCharacters = scriptState.characters;
    if (currentScreen.data && currentScreen.data.type === "edit-character") {
      const characterId = currentScreen.data.id;

      for (const team of Object.values(scriptCharacters)) {
        for (const character of team) {
          if (character.id === characterId) {
            return character;
          }
        }
      }

      if (CHARACTERS_BY_ID.has(characterId)) {
        return CHARACTERS_BY_ID.get(characterId) ?? null;
      }
    }

    return null;
  });
</script>

{#if character}
  <div class="top-links-list">
    <button
      type="button"
      class="back-link link-button"
      data-umami-event="checks-about-back"
      onclick={() => navigatePopScreen()}>Back</button
    >
  </div>
  {#key character}
    <ViewCharacter {character} />
  {/key}
{:else}
  <CentredInfoArea character="recluse">
    <p>Character not found.</p>
  </CentredInfoArea>
{/if}

<style>
  .top-links-list {
    display: flex;
    justify-content: space-between;
    margin-block-start: 0.5rem;
    margin-block-end: 1rem;
  }

  .back-link {
    font-size: 1rem;
  }
</style>

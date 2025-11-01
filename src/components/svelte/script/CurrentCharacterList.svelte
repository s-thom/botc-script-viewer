<script lang="ts">
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../../generated/script-schema";
  import {
    CHARACTERS_BY_ID,
    getEnforcedCharacters,
    TEAM_NAMES,
  } from "../../../lib/characters";
  import { generatePrompt } from "../../../lib/builder/prompts";
  import { globalState } from "../../../lib/builder/state.svelte";
  import CharacterIcon from "../common/CharacterIcon.svelte";
  import TeamCharacterList from "./TeamCharacterList.svelte";

  const forcedCharactersByTeam = $derived.by(() => {
    const map = getEnforcedCharacters(globalState);

    // Remove fabled that are already in the script
    for (const fabled of globalState.characters.fabled) {
      map.delete(fabled.id);
    }

    return Array.from(map.entries())
      .map(([id, reasons]) => ({
        character: CHARACTERS_BY_ID.get(id)!,
        reasons: Array.from(reasons).sort(),
      }))
      .reduce<
        Record<
          CharacterTeam,
          { character: ScriptCharacter; reasons: string[] }[]
        >
      >(
        (acc, curr) => {
          acc[curr.character.team].push(curr);
          return acc;
        },
        {
          townsfolk: [],
          outsider: [],
          minion: [],
          demon: [],
          traveller: [],
          fabled: [],
          loric: [],
        },
      );
  });

  const teams = $derived.by(() =>
    Object.entries(TEAM_NAMES)
      .map(([team, teamName]) => ({
        team: team as CharacterTeam,
        teamName,
        characters: globalState.characters[team as CharacterTeam],
        pinned: forcedCharactersByTeam[team as CharacterTeam],
      }))
      .filter(
        ({ characters, pinned }) =>
          characters.length + (pinned?.length ?? 0) > 0,
      ),
  );

  function setPrompt() {
    globalState.ui.prompt = generatePrompt();
  }
</script>

{#each teams as { team, teamName, characters, pinned } (team)}
  <div class="team-list">
    <h2>{teamName}</h2>
    <TeamCharacterList team={team as CharacterTeam} {characters} {pinned} />
  </div>
{:else}
  <div class="info-area">
    <CharacterIcon
      character={{
        id: "magician",
        name: "",
        team: "townsfolk",
        ability: "",
      }}
      class="info-area-icon slow-spin"
    />
    <p>Select some characters to get started.</p>
    <button
      type="button"
      class="button mobile-only"
      onclick={() => (globalState.ui.screen = "select-characters")}
      data-umami-event="script-empty-select-characters"
      >Select characters</button
    >
    <button
      type="button"
      class="button"
      onclick={setPrompt}
      data-umami-event="prompt-new">Prompt me</button
    >
  </div>
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }

  .info-area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    :global(.info-area-icon) {
      width: 128px;
    }
  }
</style>

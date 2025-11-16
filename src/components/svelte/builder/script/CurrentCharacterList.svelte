<script lang="ts">
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../../../generated/script-schema";
  import { globalState } from "../../../../lib/builder/state.svelte";
  import {
    CHARACTERS_BY_ID,
    getEnforcedCharacters,
    TEAM_NAMES,
  } from "../../../../lib/characters";
  import CentredInfoArea from "../common/CentredInfoArea.svelte";
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
</script>

{#each teams as { team, teamName, characters, pinned } (team)}
  <div class="team-list">
    <h2>{teamName}</h2>
    <TeamCharacterList team={team as CharacterTeam} {characters} {pinned} />
  </div>
{:else}
  <CentredInfoArea character="magician">
    <p>Select some characters to get started.</p>
    <button
      type="button"
      class="button mobile-only"
      onclick={() => (globalState.ui.screen = "select-characters")}
      data-umami-event="script-empty-select-characters"
      >Select characters</button
    >
  </CentredInfoArea>
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }
</style>

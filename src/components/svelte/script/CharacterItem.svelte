<script lang="ts">
  import { Gripper, Lock, Pinned, Trash } from "svelte-codicons";
  import type { ScriptCharacter } from "../../../generated/script-schema";
  import CharacterIcon from "../common/CharacterIcon.svelte";
  import { globalState } from "../../../lib/builder/state.svelte";
  import { normaliseCharacterId, TEAM_NAMES } from "../../../lib/characters";

  interface Props {
    character: ScriptCharacter;
    remarks?: string[];
    showGripper?: boolean;
    showPinned?: boolean;
    onDeleteClick?: () => void;
  }

  const { character, remarks, showGripper, showPinned, onDeleteClick }: Props =
    $props();

  const jinxedCharacters = $derived.by(() => {
    // State reads must occur before return. This does mean extra object allocation but oh well.
    // Eventually I'll take the time to learn how to write performant Svelte code.
    // The answer is probably "don't use global state, you dingus".
    const allCharacters = [
      ...globalState.characters.townsfolk,
      ...globalState.characters.outsider,
      ...globalState.characters.minion,
      ...globalState.characters.demon,
      ...globalState.characters.traveller,
      ...globalState.characters.fabled,
    ];

    if (!character.jinxes) {
      return [];
    }

    const jinxedCharacters: ScriptCharacter[] = [];
    for (const jinx of character.jinxes) {
      const found = allCharacters.find(
        (character) => normaliseCharacterId(jinx.id) === character.id,
      );

      if (found) {
        jinxedCharacters.push(found);
      }
    }

    const teamIds = Object.keys(TEAM_NAMES);
    jinxedCharacters.sort((a, b) => {
      const aTeam = teamIds.indexOf(a.team);
      const bTeam = teamIds.indexOf(b.team);
      const teamDiff = aTeam - bTeam;
      if (teamDiff !== 0) {
        return teamDiff;
      }

      return a.name.localeCompare(b.name);
    });

    return jinxedCharacters;
  });

  const hasDetail = $derived(
    (remarks && remarks.length > 0) || jinxedCharacters.length > 0,
  );
</script>

{#snippet name()}
  <h3 class="character-name">{character.name}</h3>
{/snippet}

<div class="character">
  {#if showGripper}
    <span class="action-button">
      {#if showPinned}
        <Pinned aria-label="Required" />
      {:else}
        <Gripper aria-label={`Drag ${character.name}`} />
      {/if}
    </span>
  {/if}
  <CharacterIcon class="list-icon" {character} />
  {#if hasDetail}
    <div class="detail-container">
      {@render name()}
      {#if jinxedCharacters.length > 0}
        <ul class="jinx-list">
          {#each jinxedCharacters as jinxCharacter (jinxCharacter.id)}
            <li class="jinx-item">
              <CharacterIcon class="jinx-icon" character={jinxCharacter} />
            </li>
          {/each}
        </ul>
      {/if}
      {#if remarks && remarks.length > 0}
        <ul class="remarks-list">
          {#each remarks as remark}
            <li class="remark">{remark}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {:else}
    {@render name()}
  {/if}
  {#if onDeleteClick}
    {#if showPinned}
      <span class="action-button icon-button"
        ><Lock aria-label="Required" /></span
      >
    {:else}
      <button
        type="button"
        class="action-button icon-button no-drag"
        onclick={onDeleteClick}
        data-umami-event="script-character-remove"
        ><Trash aria-label={`Remove ${character.name}`} /></button
      >
    {/if}
  {/if}
</div>

<style>
  .character-name {
    flex-grow: 1;
    font-size: 1.2rem;
    font-family: var(--font-title);

    &:is(.detail-container &) {
      padding-top: 6px;
    }

    &:not(.detail-container &) {
      align-self: center;
    }
  }

  .character {
    display: flex;
    align-items: start;
    gap: 0.5rem;
    padding: 0 0.5rem;
    --icon-size: 48px;

    :global(.list-icon) {
      width: var(--icon-size);
      height: var(--icon-size);
      flex-shrink: 0;
    }
  }

  .detail-container {
    flex-grow: 1;
  }

  .action-button {
    padding: 0;
    width: 24px;
    height: var(--icon-size);
    flex-shrink: 0;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .jinx-list {
    display: flex;
    gap: 0.2rem;
    flex-wrap: wrap;
    list-style: none;
    padding-inline-start: 0;

    :global(.jinx-icon) {
      width: 32px;
      height: 32px;
    }
  }

  .remarks-list {
    opacity: 0.7;
    padding-inline-start: 1rem;
  }
</style>

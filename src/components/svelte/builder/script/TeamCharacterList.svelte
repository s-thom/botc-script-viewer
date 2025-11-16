<script lang="ts">
  import { draggable, droppable, type DragDropState } from "@thisux/sveltednd";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../../../generated/script-schema";
  import { filterInPlace } from "../../../../lib/builder/util/arrays";
  import CharacterItem from "./CharacterItem.svelte";
  import { appState } from "../../../../lib/client/builder/state";

  interface Props {
    team: CharacterTeam;
    characters: ScriptCharacter[];
    pinned?: { character: ScriptCharacter; reasons: string[] }[];
  }

  const { team, characters, pinned }: Props = $props();

  let pinnedLookup = $derived(
    (pinned ?? []).reduce((map, item) => {
      map.set(item.character.id, item.reasons);
      return map;
    }, new Map<string, string[]>()),
  );
  let filteredPinned = $derived.by(() => {
    const characterIds = new Set(characters.map((character) => character.id));

    return (pinned ?? []).filter(
      (item) => !characterIds.has(item.character.id),
    );
  });

  let invalidDrop = $state(false);

  let isDragDropEnabled = $derived(!appState.sorting.enabled);

  // Validation function that sets invalidDrop state
  function onDragOver(state: DragDropState<ScriptCharacter>) {
    const character = state.draggedItem;
    if (!character) {
      return;
    }

    // Set invalidDrop based on the color condition
    invalidDrop = character.team !== team;
  }

  function onDrop(state: DragDropState<ScriptCharacter>) {
    if (invalidDrop || !state.draggedItem) {
      return;
    }

    const { draggedItem, targetContainer } = state;
    const dragIndex = characters.findIndex(
      (item) => item.id === draggedItem.id,
    );
    const dropIndex = parseInt(targetContainer ?? "0");

    if (dragIndex !== -1 && !isNaN(dropIndex)) {
      const [item] = characters.splice(dragIndex, 1);
      characters.splice(dropIndex, 0, item);
    }
  }

  function onDragEnd() {
    invalidDrop = false;
  }

  function handleDelete(deletedCharacter: ScriptCharacter) {
    filterInPlace(
      characters,
      (character) => character.id !== deletedCharacter.id,
    );
  }
</script>

<ul class="list">
  {#each characters as character, index (character.id)}
    <li
      class={[
        "list-item",
        isDragDropEnabled && "drag-enabled",
        invalidDrop && "drag-error",
      ]}
      use:draggable={{
        container: index.toString(),
        dragData: character,
        interactive: [".no-drag"],
        disabled: !isDragDropEnabled,
      }}
      use:droppable={{
        container: index.toString(),
        callbacks: { onDrop, onDragOver, onDragEnd },
        disabled: !isDragDropEnabled,
      }}
      animate:flip={{ duration: 200 }}
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 150 }}
    >
      <CharacterItem
        {character}
        showGripper={isDragDropEnabled}
        allowDrag={isDragDropEnabled}
        showPinned={!!pinnedLookup.has(character.id)}
        remarks={pinnedLookup.get(character.id)}
        onDeleteClick={() => handleDelete(character)}
      />
    </li>
  {/each}
  {#if filteredPinned !== undefined && filteredPinned.length > 0}
    {#each filteredPinned as { character, reasons } (character.id)}
      <li
        class="detail-item"
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 150 }}
      >
        <CharacterItem
          {character}
          showGripper={isDragDropEnabled}
          showPinned
          remarks={reasons}
          onDeleteClick={() => {}}
        />
      </li>
    {/each}
  {/if}
</ul>

<style>
  .list {
    list-style: none;
    padding-inline-start: 0;
  }

  .list-item {
    border-radius: var(--border-radius);
    transition:
      background-color 0.2s ease-in-out,
      outline 0.2s ease-in-out;
    background-color: transparent;
    outline: 2px solid transparent;

    &.drag-enabled {
      cursor: move;
    }

    &:global(.dragging) {
      opacity: 0.7;
    }

    &:global(.drag-over) {
      background-color: var(--color-control-background);
      outline: 2px solid var(--color-control-border-active);

      &.drag-error {
        background-color: var(--color-control-background-error);
        outline: 2px solid var(--color-control-border-error);
      }
    }
  }
</style>

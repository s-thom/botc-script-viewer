<script lang="ts">
  import type { ScriptCharacter } from "../../../../generated/script-schema";
  import CharacterIcon from "../../common/CharacterIcon.svelte";
  import { nanoid } from "nanoid";

  interface Props {
    characters: ScriptCharacter[];
    selectedSet: Set<string>;
    onCharacterSelect?: (character: ScriptCharacter) => void;
    class?: string;
    itemClass?: string;
  }

  const {
    characters,
    selectedSet,
    onCharacterSelect,
    class: className,
    itemClass,
  }: Props = $props();

  let listId = $state(nanoid());
</script>

<ul class={["character-list", className]}>
  {#each characters as character (character.id)}
    <li class="character-item">
      <label
        for={`${listId}_${character.id}`}
        class={[
          "icon-button character",
          `team-${character.team}`,
          selectedSet.has(character.id) && "selected",
          itemClass,
        ]}
        data-umami-event="select-character"
        data-umami-event-character={character.id}
        data-umami-event-selected={!selectedSet.has(character.id)}
      >
        <CharacterIcon {character} class="select-icon" />
        <p class="character-name">{character.name}</p>
      </label>
      <input
        type="checkbox"
        name={character.id}
        id={`${listId}_${character.id}`}
        class="visually-hidden-always"
        onchange={() => onCharacterSelect?.(character)}
      />
    </li>
  {/each}
</ul>

<style>
  .character-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding-inline-start: 0;
  }

  .character {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    border: 2px solid var(--color-control-border-active);
    border-radius: var(--border-radius);
    padding-inline-end: 8px;

    :global(.select-icon) {
      width: 32px;
    }

    &:hover,
    &:active {
      background-color: var(--color-control-background);
    }

    &:not(.selected) {
      &:hover {
        border-color: var(--color-control-border-hover);
      }
      &:active {
        border-color: var(--color-control-border-active);
      }
    }
    &.selected {
      border-color: var(--color-alignment);
      box-shadow: 0px 0px 5px var(--color-alignment);
    }
  }

  .character-name {
    font-family: var(--font-title);
  }
</style>

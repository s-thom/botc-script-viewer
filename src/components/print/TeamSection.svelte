<script lang="ts">
  import type { PrintCharacter, PrintTeamId } from "../../lib/print/data";
  import CharacterEntry from "./CharacterEntry.svelte";

  interface Props {
    team: PrintTeamId;
    heading: string;
    characters: PrintCharacter[];
  }

  let { team, heading, characters }: Props = $props();
</script>

{#if characters.length > 0}
  <section class={["team", team]}>
    <h2 class="heading">{heading}</h2>
    <div class="characters">
      {#each characters as character (character.id)}
        <CharacterEntry
          icon={character.icon}
          name={character.name}
          text={character.ability}
        />
      {/each}
    </div>
  </section>
{/if}

<style>
  .team {
    margin-block-end: 0.6em;
    --team-color: var(--color-alignment-good);
  }

  .minion,
  .demon {
    --team-color: var(--color-alignment-evil);
  }

  .traveller,
  .fabled,
  .loric {
    --team-color: var(--color-text);
  }

  .heading {
    font-family: var(--print-title-font);
    font-size: 1.5em;
    font-weight: 400;
    line-height: 1.1;
    margin: 0 0 0.5em;
    color: var(--team-color);
    border-block-end: 0.08em solid var(--team-color);
  }

  .characters {
    columns: 2;
    column-gap: 1.2em;
  }
</style>

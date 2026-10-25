<script lang="ts">
  import type { PrintCharacter, PrintTeamId } from "../../lib/print/data";
  import PrintCharacterListEntry from "./PrintCharacterListEntry.svelte";

  interface Props {
    team: PrintTeamId;
    heading: string;
    characters: PrintCharacter[];
    /** Also render the heading as a stacked label in the fancy side strip. */
    sideLabel?: boolean;
  }

  let { team, heading, characters, sideLabel = false }: Props = $props();
</script>

{#if characters.length > 0}
  <section class={["team", team, { "has-side-label": sideLabel }]}>
    {#if sideLabel}
      <div class="side-label" aria-hidden="true">
        <span class="side-label-text">{heading}</span>
      </div>
    {/if}
    <h2 class="heading">{heading}</h2>
    <div class="characters">
      {#each characters as character (character.id)}
        <PrintCharacterListEntry
          icon={character.icon}
          name={character.name}
          text={character.ability}
          jinxIcons={character.jinxIcons}
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

  .side-label {
    display: none;
  }

  :global(.sheet.fancy) .has-side-label {
    position: relative;
  }

  /* Fancy: the heading moves into the strip, and a rule separates sections. */
  :global(.sheet.fancy) .has-side-label .heading {
    /* Keep it for screen readers; the label is aria-hidden. */
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    margin: 0;
  }

  :global(.sheet.fancy) .has-side-label .side-label {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    inset-inline-start: calc(-1 * (var(--strip-width) + var(--strip-gap)));
    width: var(--strip-width);
    color: var(--color-header-text);
    font-family: var(--print-title-font);
    font-size: 1.5em;
    line-height: 1;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .side-label-text {
    writing-mode: vertical-rl;
    text-orientation: upright;
    white-space: nowrap;
    letter-spacing: -0.25em;
    text-transform: uppercase;
  }

  :global(.sheet.fancy) .has-side-label + :global(.has-side-label) {
    border-block-start: 0.08em solid var(--color-print-fancy-rule);
    padding-block-start: 0.6em;
  }

  .characters {
    columns: 2;
    column-gap: 1.2em;
  }
</style>

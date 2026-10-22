<script lang="ts">
  import type { PrintData, PrintNightEntry } from "../../lib/print/data";
  import CharacterEntry from "./CharacterEntry.svelte";
  import FitBox from "./FitBox.svelte";
  import SheetHeader from "./SheetHeader.svelte";

  interface Props {
    data: PrintData;
    /** `simple` puts both nights on one sheet, the other nights upside down. */
    mode: "first" | "other" | "simple";
    deps: unknown;
    overflowing: boolean;
  }

  let { data, mode, deps, overflowing = $bindable() }: Props = $props();

  const phaseTitle = $derived({
    first: data.strings["app.grimoire.phases.first_night"],
    other: data.strings["app.grimoire.phases.other_nights"],
  });
</script>

{#snippet list(entries: PrintNightEntry[], withText: boolean)}
  {#each entries as entry, i (i)}
    <CharacterEntry
      icon={entry.icon}
      name={entry.name}
      text={withText ? entry.text : undefined}
    />
  {/each}
{/snippet}

<FitBox {deps} bind:overflowing>
  {#if mode === "simple"}
    <div class="halves">
      <div class="half" data-fit>
        <h2 class="phase">{phaseTitle.first}</h2>
        {@render list(data.firstNight, false)}
      </div>
      <div class="half upside-down" data-fit>
        <h2 class="phase">{phaseTitle.other}</h2>
        {@render list(data.otherNight, false)}
      </div>
    </div>
  {:else}
    <SheetHeader
      title={mode === "first" ? phaseTitle.first : phaseTitle.other}
      subtitle={data.title}
    />
    <div class="detailed" data-fit>
      {@render list(mode === "first" ? data.firstNight : data.otherNight, true)}
    </div>
  {/if}
</FitBox>

<style>
  .halves {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm;
    flex: 1;
    min-height: 0;
  }

  .half {
    min-height: 0;
    overflow: hidden;
  }

  .upside-down {
    rotate: 180deg;
  }

  .phase {
    font-family: var(--print-title-font);
    font-size: 1.5em;
    font-weight: 400;
    margin: 0 0 0.4em;
    border-block-end: 0.08em solid currentColor;
  }

  .detailed {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    columns: 1;
  }
</style>

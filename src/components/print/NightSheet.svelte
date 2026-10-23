<script lang="ts">
  import type { PrintData, PrintNightEntry } from "../../lib/print/data";
  import CharacterEntry from "./CharacterEntry.svelte";
  import FitBox from "./FitBox.svelte";

  interface Props {
    data: PrintData;
    /** `simple` puts both nights on one sheet, the other nights upside down. */
    mode: "first" | "other" | "simple";
    hideTravellers?: boolean;
    deps: unknown;
    overflowing: boolean;
  }

  let {
    data,
    mode,
    hideTravellers = false,
    deps,
    overflowing = $bindable(),
  }: Props = $props();

  const phaseTitle = $derived({
    first: data.strings["app.grimoire.phases.first_night"],
    other: data.strings["app.grimoire.phases.other_nights"],
  });
</script>

{#snippet list(entries: PrintNightEntry[], withText: boolean)}
  {#each hideTravellers ? entries.filter((entry) => !entry.traveller) : entries as entry, i (i)}
    <CharacterEntry
      icon={entry.icon}
      special={entry.special}
      name={entry.name}
      text={withText ? entry.text : undefined}
    />
  {/each}
{/snippet}

{#if mode !== "simple"}
  <div class="strip" aria-hidden="true">
    <span class="strip-title">{phaseTitle[mode]}</span>
  </div>
{/if}
<FitBox
  {deps}
  bind:overflowing
  class={mode !== "simple" ? "detailed-fit" : undefined}
>
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
    <div class="detailed" data-fit>
      <h2 class="phase">{phaseTitle[mode]}</h2>
      {@render list(mode === "first" ? data.firstNight : data.otherNight, true)}
    </div>
  {/if}
</FitBox>

<style>
  .strip {
    display: none;
  }

  :global(.sheet.fancy) :is(.strip, :global(.detailed-fit)) {
    --strip-width: 14mm;
    --strip-gap: 5mm;
  }

  :global(.sheet.fancy) .strip {
    display: flex;
    justify-content: center;
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    width: var(--strip-width);
    box-sizing: border-box;
    /* Align the title with the top of the content, inside the sheet padding. */
    padding-block-start: 12mm;
    background: url("../../assets/header-ferns.webp")
      var(--color-header-background);
    background-blend-mode: multiply;
    color: var(--color-header-text);
    font-family: var(--print-title-font);
    font-size: 17pt;
    line-height: 1;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .strip-title {
    writing-mode: vertical-rl;
    text-orientation: upright;
    white-space: nowrap;
    letter-spacing: -5px;
    text-transform: uppercase;
  }

  /* The title moves into the strip; keep the heading for screen readers. */
  :global(.sheet.fancy) .detailed .phase {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    margin: 0;
  }

  /* Extend the box over the sheet's padding, then pad content clear of the strip. */
  :global(.sheet.fancy .detailed-fit) {
    box-sizing: border-box;
    margin-inline-end: -12mm;
    width: calc(100% + 12mm);
    padding-inline-end: calc(var(--strip-width) + var(--strip-gap));
  }

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
    padding-block: var(--icon-overhang);
    margin-block: calc(-1 * var(--icon-overhang));
  }

  .upside-down {
    rotate: 180deg;
  }

  .phase {
    font-family: var(--print-title-font);
    font-size: 1.5em;
    font-weight: 400;
    margin: 0 0 1em;
    border-block-end: 0.08em solid currentColor;
  }

  .detailed {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding-block: var(--icon-overhang);
    margin-block: calc(-1 * var(--icon-overhang));
    columns: 1;
  }
</style>

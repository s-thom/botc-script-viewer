<script lang="ts">
  import type {
    BackMode,
    NightMode,
    PaperSize,
    PrintOptions,
    PrintStyle,
  } from "../../lib/print/options";

  interface Props {
    options: PrintOptions;
    strings: Record<string, string>;
    /** Whether the script has anything to show on an info back. */
    hasBackInfo: boolean;
    onprint: () => void;
  }

  let { options = $bindable(), strings, hasBackInfo, onprint }: Props = $props();

  const STYLES: PrintStyle[] = ["plain", "fancy"];
  const PAPERS: PaperSize[] = ["a4", "letter"];
  const BACKS: BackMode[] = ["info", "fancy", "blank"];
  const NIGHTS: NightMode[] = ["simple", "detailed"];
</script>

<form class="controls" onsubmit={(event) => event.preventDefault()}>
  <h2 class="heading">{strings["viewer.print.optionsHeading"]}</h2>

  <fieldset>
    <legend>{strings["viewer.print.style.label"]}</legend>
    {#each STYLES as value (value)}
      <label>
        <input type="radio" name="style" {value} bind:group={options.style} />
        {strings[`viewer.print.style.${value}`]}
      </label>
    {/each}
  </fieldset>

  <fieldset>
    <legend>{strings["viewer.print.paper.label"]}</legend>
    {#each PAPERS as value (value)}
      <label>
        <input type="radio" name="paper" {value} bind:group={options.paper} />
        {strings[`viewer.print.paper.${value}`]}
      </label>
    {/each}
  </fieldset>

  <fieldset>
    <legend>{strings["viewer.print.back.label"]}</legend>
    {#each BACKS as value (value)}
      <label>
        <input type="radio" name="back" {value} bind:group={options.back} />
        {strings[`viewer.print.back.${value}`]}
      </label>
    {/each}
    {#if options.back === "info"}
      <label class="nested">
        <input type="checkbox" bind:checked={options.jinxes} />
        {strings["viewer.print.jinxes"]}
      </label>
    {/if}
  </fieldset>

  <fieldset>
    <legend>{strings["viewer.print.night.label"]}</legend>
    {#each NIGHTS as value (value)}
      <label>
        <input type="radio" name="night" {value} bind:group={options.night} />
        {strings[`viewer.print.night.${value}`]}
      </label>
    {/each}
  </fieldset>

  <label>
    <input type="checkbox" bind:checked={options.qrPage} />
    {strings["viewer.print.qrPage"]}
  </label>

  <label>
    <input type="checkbox" bind:checked={options.doubleSided} />
    {strings["viewer.print.doubleSided"]}
    <small class="hint">{strings["viewer.print.doubleSidedHint"]}</small>
  </label>

  <button type="button" class="print-button" onclick={onprint}>
    {strings["viewer.print.printButton"]}
  </button>
  <p class="hint">{strings["viewer.print.printHint"]}</p>
</form>

<style>
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
    background: var(--color-control-background);
    border: 1px solid var(--color-control-border);
    border-radius: var(--border-radius);
  }

  .heading {
    font-size: 1.4rem;
    margin: 0;
  }

  fieldset {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin: 0;
    padding: 0;
    border: 0;
  }

  legend {
    font-weight: 700;
    margin-block-end: 0.3rem;
    padding: 0;
  }

  label {
    display: block;
  }

  .nested {
    margin-inline-start: 1.5rem;
  }

  .hint {
    display: block;
    opacity: 0.75;
    font-size: 0.9rem;
    margin: 0;
  }

  .print-button {
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: inherit;
    background: var(--color-control-background-hover);
    border: 1px solid var(--color-control-border);
    border-radius: var(--border-radius);

    &:hover {
      background: var(--color-control-background-active);
    }
  }
</style>

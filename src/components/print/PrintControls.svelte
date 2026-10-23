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

  let {
    options = $bindable(),
    strings,
    hasBackInfo,
    onprint,
  }: Props = $props();

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
  </fieldset>

  <fieldset>
    <legend>{strings["viewer.print.night.label"]}</legend>
    {#each NIGHTS as value (value)}
      <label>
        <input type="radio" name="night" {value} bind:group={options.night} />
        {strings[`viewer.print.night.${value}`]}
      </label>
    {/each}

    <label>
      <input type="checkbox" bind:checked={options.hideTravellersInNight} />
      {strings["viewer.print.night.hideTravellers"]}
    </label>
  </fieldset>

  <fieldset>
    <legend>{strings["viewer.print.qrCode.label"]}</legend>

    <label>
      <input type="checkbox" bind:checked={options.qrPage} />
      {strings["viewer.print.qrCode.addPage"]}
    </label>
  </fieldset>

  <button type="button" class="button" onclick={onprint}>
    {strings["viewer.print.printButton"]}
  </button>
</form>

<style>
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
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
</style>

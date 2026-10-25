<script lang="ts">
  import ColorPicker from "svelte-awesome-color-picker";
  import { formatHex, parse } from "culori";
  import {
    DEFAULT_PRINT_OPTIONS,
    type BackMode,
    type NightMode,
    type PaperSize,
    type PrintOptions,
    type PrintStyle,
  } from "../../lib/print/options";
  import type { PageRange, SheetSequence } from "../../lib/print/sequence";

  interface Props {
    title: string;
    options: PrintOptions;
    strings: Record<string, string>;
    sequence: SheetSequence;
  }

  let { title, options = $bindable(), strings, sequence }: Props = $props();

  const STYLES: PrintStyle[] = ["plain", "fancy"];
  const PAPERS: PaperSize[] = ["a4", "letter"];
  const BACKS: BackMode[] = ["info", "fancy", "blank"];
  const NIGHTS: NightMode[] = ["simple", "detailed"];

  function formatRange(range: PageRange): string {
    return range.from === range.to
      ? strings["viewer.print.help.page"].replace("{page}", String(range.from))
      : strings["viewer.print.help.pages"]
          .replace("{from}", String(range.from))
          .replace("{to}", String(range.to));
  }

  /** The header colour as currently rendered, as a hex string for the picker. */
  function getDefaultColor(): string {
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-header-background")
      .trim();
    const parsed = parse(computed);
    return (parsed && formatHex(parsed)) ?? "#20562d";
  }

  // Deliberately not part of `options`, so it isn't persisted.
  let color = $state(getDefaultColor());

  function setScriptColor(hex: string | null) {
    if (hex !== null) {
      document.documentElement.style.setProperty("--color-script", hex);
    }
  }

  function print() {
    window.print();
  }
</script>

<aside class="sidebar screen-only">
  <div class="sidebar-content">
    <div>
      <h2>{title}</h2>
    </div>

    <form class="controls" onsubmit={(event) => event.preventDefault()}>
      <h2 class="heading">{strings["viewer.print.optionsHeading"]}</h2>

      <fieldset>
        <legend>{strings["viewer.print.style.label"]}</legend>
        {#each STYLES as value (value)}
          <label>
            <input
              type="radio"
              name="style"
              {value}
              bind:group={options.style}
            />
            {strings[`viewer.print.style.${value}`]}
          </label>
        {/each}
        {#if options.style === "fancy" || options.back === "fancy"}
          <ColorPicker
            bind:hex={color}
            label={strings["viewer.print.style.color"]}
            isAlpha={false}
            onInput={({ hex }) => setScriptColor(hex)}
          />
        {/if}
        {#if options.style === "fancy"}
          <label>
            <input type="checkbox" bind:checked={options.colorScriptHeader} />
            {strings["viewer.print.style.colorScriptHeader"]}
          </label>
        {/if}
      </fieldset>

      <fieldset>
        <legend>{strings["viewer.print.paper.label"]}</legend>
        {#each PAPERS as value (value)}
          <label>
            <input
              type="radio"
              name="paper"
              {value}
              bind:group={options.paper}
            />
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
            <input
              type="radio"
              name="night"
              {value}
              bind:group={options.night}
            />
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

      {#if options.style === "fancy" || options.back === "fancy"}
        <fieldset>
          <legend>{strings["viewer.print.fancyOptions.label"]}</legend>
        </fieldset>
      {/if}

      <button
        type="button"
        class="button"
        onclick={print}
        data-umami-event="print"
        data-umami-event-print-style={options.style}
        data-umami-event-print-paper-size={options.paper}
        data-umami-event-print-back-style={options.back}
        data-umami-event-print-night-info-style={options.night}
        data-umami-event-print-night-info-hide-travellers={String(
          options.hideTravellersInNight,
        )}
        data-umami-event-print-qr-page={String(options.qrPage)}
        data-umami-event-print-color-script-header={String(
          options.colorScriptHeader !== DEFAULT_PRINT_OPTIONS.colorScriptHeader,
        )}
      >
        {strings["viewer.print.printButton"]}
      </button>
    </form>

    <section class="help">
      <h2 class="help-heading">{strings["viewer.print.help.heading"]}</h2>
      <p class="help-hint">{strings["viewer.print.help.marginHint"]}</p>
      <ul>
        {#if sequence.playerPages}
          <li>
            {strings["viewer.print.help.players"].replace(
              "{range}",
              formatRange(sequence.playerPages),
            )}
          </li>
        {/if}
        {#if sequence.storytellerPages}
          <li>
            {strings["viewer.print.help.storyteller"].replace(
              "{range}",
              formatRange(sequence.storytellerPages),
            )}
          </li>
        {/if}
      </ul>
    </section>
  </div>
</aside>

<style>
  .sidebar {
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));

    @media (min-width: 1000px) {
      position: sticky;
      top: 1rem;
    }
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    padding-block-end: 1.5rem;
    color: var(--color-text);
    background-color: var(--color-control-background);

    clip-path: polygon(
      0 100%,
      10% calc(100% - 10px),
      20% calc(100% - 3px),
      30% calc(100% - 12px),
      40% calc(100% - 14px),
      50% calc(100% - 8px),
      60% calc(100% - 11px),
      70% calc(100% - 7px),
      80% calc(100% - 4px),
      90% calc(100% - 9px),
      100% calc(100% - 6px),
      100% calc(14px - 6px),
      90% calc(14px - 9px),
      80% calc(14px - 4px),
      70% calc(14px - 7px),
      60% calc(14px - 11px),
      50% calc(14px - 8px),
      40% calc(14px - 14px),
      30% calc(14px - 12px),
      20% calc(14px - 3px),
      10% calc(14px - 10px),
      0 calc(14px - 0px)
    );
  }

  .help-heading {
    font-size: 1.3rem;
    margin: 0 0 0.5rem;
  }

  .help ul {
    margin: 0;
    padding-inline-start: 1.2rem;
  }

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

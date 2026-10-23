<script lang="ts">
  import type { PrintData } from "../../lib/print/data";
  import {
    PAPER_DIMENSIONS_MM,
    parsePrintOptions,
    type PrintOptions,
  } from "../../lib/print/options";
  import {
    buildSheetSequence,
    type PrintScriptContent,
  } from "../../lib/print/sequence";
  import BackInfoSheet from "./ExtraInfoPage.svelte";
  import FancyBackSheet from "./ScriptBackPage.svelte";
  import NightSheet from "./NightOrderPage.svelte";
  import QrSheet from "./QrCodePage.svelte";
  import PlayerScriptPage from "./PlayerScriptPage.svelte";
  import SheetFrame from "./SheetFrame.svelte";
  import PrintSidebar from "./PrintSidebar.svelte";

  export interface Props {
    data: PrintData;
  }

  let { data }: Props = $props();

  const STORAGE_KEY = "botc-print-options";
  const MM_TO_PX = 96 / 25.4;
  /** Space around the sheets in the on-screen preview, in px. */
  const PREVIEW_GUTTER = 16;

  function loadOptions(): PrintOptions {
    try {
      return parsePrintOptions(
        JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"),
      );
    } catch {
      return parsePrintOptions(null);
    }
  }

  let options = $state(loadOptions());

  $effect(() => {
    const snapshot = $state.snapshot(options);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Storage unavailable (private mode, etc). Options just won't persist.
    }
  });

  const content: PrintScriptContent = $derived({
    hasTravellers: data.teams.traveller.length > 0,
    hasFabled: data.teams.fabled.length > 0,
    hasLoric: data.teams.loric.length > 0,
    hasJinxes: data.jinxes.length > 0,
    hasBootlegger: data.bootlegger.length > 0,
  });

  const sequence = $derived(buildSheetSequence(content, options));
  const paper = $derived(PAPER_DIMENSIONS_MM[options.paper]);
  const paperPx = $derived(paper.width * MM_TO_PX);

  let previewWidth = $state(0);
  const scale = $derived(
    previewWidth > 0
      ? Math.min(1, (previewWidth - PREVIEW_GUTTER) / paperPx)
      : 1,
  );

  // Anything that changes how much room content takes up.
  const layoutKey = $derived(
    `${options.style}|${options.paper}|${options.night}|${options.hideTravellersInNight}`,
  );

  // Whether each sheet's content overflows, by position. Only meaningful for sheets that fit their content.
  let overflow: boolean[] = $state([]);
  const FITTED_KINDS = new Set([
    "script",
    "back-info",
    "night-simple",
    "night-first",
    "night-other",
  ]);

  const strings = $derived(data.strings);
</script>

<svelte:head>
  {@html `<style>@page { size: ${options.paper === "a4" ? "A4" : "letter"}; margin: 0; }</style>`}
</svelte:head>

<div
  class="print-app"
  style:--paper-w="{paper.width}mm"
  style:--paper-h="{paper.height}mm"
  style:--scale={scale}
>
  <PrintSidebar title={data.title} bind:options {strings} {sequence} />

  <div class="preview" bind:clientWidth={previewWidth}>
    <h2 class="preview-heading visually-hidden">
      {strings["viewer.print.preview.heading"]}
    </h2>
    <div class="sheets">
      {#each sequence.sheets as sheet, i (`${i}-${sheet.kind}`)}
        <SheetFrame
          label={strings["viewer.print.preview.page"].replace(
            "{page}",
            String(i + 1),
          )}
          padding={sheet.padding}
          blankLabel={strings["viewer.print.preview.blankBack"]}
          fancy={options.style === "fancy"}
          overflowing={FITTED_KINDS.has(sheet.kind) && overflow[i]}
          overflowMessage={strings["viewer.print.preview.overflow"]}
        >
          {#if sheet.kind === "script"}
            <PlayerScriptPage
              {data}
              teams={["townsfolk", "outsider", "minion", "demon"]}
              deps={layoutKey}
              bind:overflowing={overflow[i]}
            />
          {:else if sheet.kind === "back-info"}
            <BackInfoSheet
              {data}
              deps={layoutKey}
              bind:overflowing={overflow[i]}
            />
          {:else if sheet.kind === "back-fancy"}
            <FancyBackSheet {data} />
          {:else if sheet.kind === "night-simple"}
            <NightSheet
              {data}
              hideTravellers={options.hideTravellersInNight}
              mode="simple"
              deps={layoutKey}
              bind:overflowing={overflow[i]}
            />
          {:else if sheet.kind === "night-first"}
            <NightSheet
              {data}
              hideTravellers={options.hideTravellersInNight}
              mode="first"
              deps={layoutKey}
              bind:overflowing={overflow[i]}
            />
          {:else if sheet.kind === "night-other"}
            <NightSheet
              {data}
              hideTravellers={options.hideTravellersInNight}
              mode="other"
              deps={layoutKey}
              bind:overflowing={overflow[i]}
            />
          {:else if sheet.kind === "qr"}
            <QrSheet {data} />
          {/if}
        </SheetFrame>
      {/each}
    </div>

    <slot name="footer" />
  </div>
</div>

<style>
  .print-app {
    display: grid;
    gap: 1.5rem;
    margin: 1rem;
    align-items: start;

    @media (min-width: 1000px) {
      grid-template-columns: 22rem 1fr;
    }
  }

  .preview-heading {
    font-size: 1.3rem;
    margin: 0 0 0.5rem;
  }

  .preview {
    min-width: 0;
  }

  .sheets {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  @media print {
    .print-app {
      display: block;
      margin: 0;
    }

    .sheets {
      display: block;
    }
  }
</style>

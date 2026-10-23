<script lang="ts">
  import type { PrintData } from "../../lib/print/data";
  import {
    PAPER_DIMENSIONS_MM,
    parsePrintOptions,
    type PrintOptions,
  } from "../../lib/print/options";
  import {
    buildSheetSequence,
    hasBackInfo,
    type PageRange,
    type PrintScriptContent,
  } from "../../lib/print/sequence";
  import BackInfoSheet from "./BackInfoSheet.svelte";
  import FancyBackSheet from "./FancyBackSheet.svelte";
  import NightSheet from "./NightSheet.svelte";
  import PrintControls from "./PrintControls.svelte";
  import QrSheet from "./QrSheet.svelte";
  import ScriptSheet from "./ScriptSheet.svelte";
  import SheetFrame from "./SheetFrame.svelte";

  interface Props {
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
    `${options.style}|${options.paper}|${options.night}`,
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

  function formatRange(range: PageRange): string {
    return range.from === range.to
      ? data.strings["viewer.print.copies.page"].replace(
          "{page}",
          String(range.from),
        )
      : data.strings["viewer.print.copies.pages"]
          .replace("{from}", String(range.from))
          .replace("{to}", String(range.to));
  }

  const strings = $derived(data.strings);

  function print() {
    window.print();
  }
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
  <aside class="sidebar screen-only">
    <div class="sidebar-content">
      <div>
        <h2>{data.title}</h2>
        <p>{strings["viewer.print.intro"]}</p>
      </div>

      <PrintControls
        bind:options
        {strings}
        hasBackInfo={hasBackInfo(content)}
        onprint={print}
      />

      <section class="copies">
        <h2 class="copies-heading">{strings["viewer.print.copies.heading"]}</h2>
        <ul>
          {#if sequence.playerPages}
            <li>
              {strings["viewer.print.copies.players"].replace(
                "{range}",
                formatRange(sequence.playerPages),
              )}
            </li>
          {/if}
          {#if sequence.storytellerPages}
            <li>
              {strings["viewer.print.copies.storyteller"].replace(
                "{range}",
                formatRange(sequence.storytellerPages),
              )}
            </li>
          {/if}
        </ul>
      </section>
    </div>
  </aside>

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
            <ScriptSheet
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
              mode="simple"
              deps={layoutKey}
              bind:overflowing={overflow[i]}
            />
          {:else if sheet.kind === "night-first"}
            <NightSheet
              {data}
              mode="first"
              deps={layoutKey}
              bind:overflowing={overflow[i]}
            />
          {:else if sheet.kind === "night-other"}
            <NightSheet
              {data}
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

  .copies-heading,
  .preview-heading {
    font-size: 1.3rem;
    margin: 0 0 0.5rem;
  }

  .copies ul {
    margin: 0;
    padding-inline-start: 1.2rem;
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

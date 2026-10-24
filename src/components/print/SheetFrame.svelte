<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Sheet } from "../../lib/print/sequence";

  interface Props {
    label: string;
    sheet: Sheet;
    fancy?: boolean;
    overflowing?: boolean;
    strings: Record<string, string>;
    children?: Snippet;
  }

  let {
    label,
    sheet,
    fancy = false,
    overflowing = false,
    strings,
    children,
  }: Props = $props();

  let fancyNotQr = $derived(fancy && sheet.kind !== "qr");
  let fancyStripSide = $derived(
    fancyNotQr
      ? sheet.kind === "script"
        ? "left"
        : sheet.kind === "night-first" || sheet.kind === "night-other"
          ? "right"
          : "none"
      : "none",
  );
  let hasFooter = $derived(
    sheet.kind !== "qr" &&
      sheet.kind !== "back-fancy" &&
      sheet.kind !== "blank",
  );
  let footerHasNotFirstNight = $derived(sheet.kind === "script");
</script>

<figure class="frame">
  <figcaption class="caption screen-only">
    {label}
    {#if sheet.padding && strings["viewer.print.preview.blankBack"]}
      <span class="faint">{strings["viewer.print.preview.blankBack"]}</span>
    {/if}
    {#if overflowing && strings["viewer.print.preview.overflow"]}
      <span class="warning" role="alert"
        >{strings["viewer.print.preview.overflow"]}</span
      >
    {/if}
  </figcaption>
  <div class="paper">
    <div class="sheet-scaler">
      <div
        class={[
          "sheet",
          fancyNotQr ? "fancy" : "plain",
          { blank: sheet.padding },
        ]}
      >
        {@render children?.()}
        {#if hasFooter}
          <div
            class={[
              "footer",
              fancyStripSide === "left" && "strip-left",
              fancyStripSide === "right" && "strip-right",
            ]}
          >
            <span>{strings["viewer.print.footer.copyright"]}</span>
            {#if footerHasNotFirstNight}
              <span>{strings["script.print.not-first-night"]}</span>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</figure>

<style>
  .frame {
    margin: 0;
    color-scheme: light;
  }

  .caption {
    margin-block-end: 0.3rem;
    font-size: 0.9rem;
  }

  .faint {
    opacity: 0.6;
  }

  .warning {
    display: block;
    color: var(--color-alignment-evil);
  }

  /* On screen the sheet is laid out at full physical size and scaled down to fit. */
  .paper {
    width: calc(var(--paper-w) * var(--scale));
    height: calc(var(--paper-h) * var(--scale));
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    background: #fff;
  }

  .sheet-scaler {
    width: var(--paper-w);
    height: var(--paper-h);
    transform: scale(var(--scale));
    transform-origin: top left;
  }

  .sheet {
    width: 100%;
    height: 100%;
    padding: 12mm;
    overflow: hidden;
    position: relative;
    color: #000;
    background: #fff;
    --color-text: #000;
    --print-title-font: var(--font-body);
    --color-alignment-good: #0144a7;
    --color-alignment-evil: #940014;
    font-family: var(--font-body);
    line-height: 1.2;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .sheet.fancy {
    --print-title-font: var(--font-title);
  }

  @media print {
    .paper {
      width: var(--paper-w);
      height: var(--paper-h);
      box-shadow: none;
      break-after: page;
      break-inside: avoid;
    }

    .frame:last-child .paper {
      break-after: auto;
    }

    .sheet-scaler {
      transform: none;
    }
  }

  .footer {
    position: absolute;
    bottom: 1em;
    width: 100%;
    display: flex;
    justify-content: space-between;

    &.strip-left {
      padding-left: 7mm;
      width: calc(100% - 24mm);
    }

    &.strip-right {
      padding-right: 7mm;
      width: calc(100% - 24mm);
    }
  }
</style>

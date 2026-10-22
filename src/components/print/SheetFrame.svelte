<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    label: string;
    padding?: boolean;
    fancy?: boolean;
    blankLabel?: string;
    overflowing?: boolean;
    overflowMessage?: string;
    children?: Snippet;
  }

  let {
    label,
    padding = false,
    fancy = false,
    blankLabel,
    overflowing = false,
    overflowMessage,
    children,
  }: Props = $props();
</script>

<figure class="frame">
  <figcaption class="caption screen-only">
    {label}
    {#if padding && blankLabel}
      <span class="faint">{blankLabel}</span>
    {/if}
    {#if overflowing && overflowMessage}
      <span class="warning" role="alert">{overflowMessage}</span>
    {/if}
  </figcaption>
  <div class="paper">
    <div class="sheet-scaler">
      <div class={["sheet", fancy ? "fancy" : "plain", { blank: padding }]}>
        {@render children?.()}
      </div>
    </div>
  </div>
</figure>

<style>
  .frame {
    margin: 0;
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
</style>

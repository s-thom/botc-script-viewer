<script lang="ts">
  import type { PrintIcon, PrintSegment } from "../../lib/print/data";
  import PrintSegments from "./PrintSegments.svelte";

  interface Props {
    icon: PrintIcon;
    name: string;
    text?: PrintSegment[];
    /** Icon is not an actual character (e.g. Minion Info), so it isn't scaled up. */
    special?: boolean;
    /** Additional icons for entries with more than one character, such as jinxes. */
    extraIcons?: PrintIcon[];
  }

  let { icon, name, text, special = false, extraIcons = [] }: Props = $props();

  function useFallback(event: Event, fallback: string) {
    const img = event.currentTarget as HTMLImageElement;
    if (img.src !== new URL(fallback, document.baseURI).href) {
      img.src = fallback;
    }
  }
</script>

<div class={["entry", { "no-text": !text?.length }]}>
  <div class="icons">
    {#each [icon, ...extraIcons] as { src, fallback }, i (i)}
      <img
        {src}
        alt=""
        class={["icon", { special }]}
        width="192"
        height="192"
        onerror={(event) => useFallback(event, fallback)}
      />
    {/each}
  </div>
  <div class="info">
    {#if name}
      <div class="name">{name}</div>
    {/if}
    {#if text?.length}
      <p class="text"><PrintSegments segments={text} /></p>
    {/if}
  </div>
</div>

<style>
  .entry {
    display: flex;
    align-items: flex-start;
    gap: 0.4em;
    break-inside: avoid;
    margin-block-end: 0.5em;

    &.no-text {
      align-items: center;
    }
  }

  .icons {
    display: flex;
    flex-shrink: 0;
  }

  .icon {
    width: 2.8em;
    height: 2.8em;
    transform-origin: center;
    scale: 1.5;
    /* Scaling doesn't affect layout; keep the enlarged icon's overhang clear of clipping edges. Applied to every icon so text stays aligned. */
    margin-inline-start: var(--icon-overhang);

    &.special {
      scale: 1;
    }
  }

  .info {
    min-width: 0;
  }

  .name {
    font-family: var(--print-title-font);
    font-size: 1.25em;
    line-height: 1.1;
  }

  .text {
    margin: 0.1em 0 0;
    line-height: 1.2;
  }
</style>

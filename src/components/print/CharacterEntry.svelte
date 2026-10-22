<script lang="ts">
  import type { PrintIcon } from "../../lib/print/data";

  interface Props {
    icon: PrintIcon;
    name: string;
    text?: string;
    /** Additional icons for entries with more than one character, such as jinxes. */
    extraIcons?: PrintIcon[];
  }

  let { icon, name, text, extraIcons = [] }: Props = $props();

  function useFallback(event: Event, fallback: string) {
    const img = event.currentTarget as HTMLImageElement;
    if (img.src !== new URL(fallback, document.baseURI).href) {
      img.src = fallback;
    }
  }
</script>

<div class="entry">
  <div class="icons">
    {#each [icon, ...extraIcons] as { src, fallback }, i (i)}
      <img
        {src}
        alt=""
        class="icon"
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
    {#if text}
      <p class="text">{text}</p>
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
  }

  .icons {
    display: flex;
    flex-shrink: 0;
  }

  .icon {
    width: 2.8em;
    height: 2.8em;
    margin: -0.2em;
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

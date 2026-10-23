<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    /** Change this when anything affecting the content's size changes, to re-measure. */
    deps: unknown;
    overflowing?: boolean;
    class?: string;
    children: Snippet;
  }

  const MIN_FIT = 0.8;
  const STEP = 0.02;

  let {
    deps,
    overflowing = $bindable(),
    class: className,
    children,
  }: Props = $props();

  let root: HTMLElement | undefined = $state();

  function isOverflowing(el: HTMLElement) {
    return (
      el.scrollHeight > el.clientHeight + 1 ||
      el.scrollWidth > el.clientWidth + 1
    );
  }

  function measure(el: HTMLElement) {
    const areas = [el, ...el.querySelectorAll<HTMLElement>("[data-fit]")];
    let fit = 1;
    el.style.setProperty("--fit", String(fit));
    while (fit > MIN_FIT && areas.some(isOverflowing)) {
      fit = Math.max(MIN_FIT, fit - STEP);
      el.style.setProperty("--fit", String(fit));
    }
    overflowing = areas.some(isOverflowing);
  }

  $effect(() => {
    void deps;
    if (!root) return;
    const el = root;
    measure(el);

    // Font metrics change the layout once they are loaded.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) measure(el);
    });
    return () => {
      cancelled = true;
    };
  });
</script>

<div bind:this={root} class={["fit-box", className]}>
  {@render children()}
</div>

<style>
  .fit-box {
    --fit: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-size: calc(10pt * var(--fit));
  }
</style>

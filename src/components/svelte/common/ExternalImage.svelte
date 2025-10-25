<script module>
  import { type ClassValue } from "svelte/elements";
  import { ALLOWED_EXTERNAL_HOSTNAMES } from "../../../lib/images";

  export interface ExternalImageProps {
    src: string;
    alt: string;
    class?: ClassValue;
  }

  function validateImageUrl(src: string): string | null {
    const url = new URL(src);
    if (!url) {
      return null;
    }

    if (!ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname)) {
      return null;
    }

    return src;
  }
</script>

<script lang="ts">
  const { src: srcProp, alt, class: className }: ExternalImageProps = $props();

  const src = validateImageUrl(srcProp);
</script>

<div class={["image-container", className]}>
  {#if src != null}
    <img class="image" {src} {alt} />
  {:else}
    <div class="image image-placeholder"></div>
  {/if}
</div>

<style>
  .image-container {
    aspect-ratio: 1/1;
  }

  .image {
    width: 100%;
    aspect-ratio: 1/1;
  }
</style>

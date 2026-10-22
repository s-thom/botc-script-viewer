<script lang="ts">
  import type { PrintData } from "../../lib/print/data";

  interface Props {
    data: PrintData;
  }

  let { data }: Props = $props();
</script>

<div class="fancy-back">
  <div class="panel">
    <h1 class="title">{data.title}</h1>
    {#if data.author}
      <p class="author">{data.author}</p>
    {/if}
  </div>
</div>

<style>
  .fancy-back {
    margin: -12mm;
    height: calc(100% + 24mm);
    display: grid;
    place-items: center;
    color: var(--color-header-text);
    background: url("../../assets/header-ferns.webp") var(--color-header-background);
    background-blend-mode: multiply;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .panel {
    text-align: center;
    padding: 0 18mm;
  }

  .title {
    font-family: var(--font-title);
    font-size: 40pt;
    font-weight: 400;
    line-height: 1.05;
    margin: 0;
    text-wrap: balance;
  }

  .author {
    font-size: 16pt;
    margin: 6mm 0 0;
  }
</style>

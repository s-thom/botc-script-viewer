<script lang="ts">
  import type { PrintData } from "../../lib/print/data";
  import SheetHeader from "./SheetHeader.svelte";

  interface Props {
    data: PrintData;
  }

  let { data }: Props = $props();
</script>

<div class="qr-sheet">
  <SheetHeader title={data.title} subtitle={data.author} large />
  <div class="body">
    <img class="qr" src={data.qr.src} alt={data.strings["viewer.navigation.qrCode"]} />
    <p class="url">{data.qr.url}</p>
  </div>
</div>

<style>
  .qr-sheet {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 10pt;
  }

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8mm;
  }

  .qr {
    width: 120mm;
    max-width: 100%;
    aspect-ratio: 1;
  }

  .url {
    word-break: break-all;
    text-align: center;
    margin: 0;
  }
</style>

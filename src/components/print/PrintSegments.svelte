<script lang="ts">
  import type { PrintSegment } from "../../lib/print/data";
  import Self from "./PrintSegments.svelte";
  import PrintReminderToken from "./PrintReminderToken.svelte";

  interface Props {
    segments: PrintSegment[];
  }

  let { segments }: Props = $props();
</script>

{#each segments as segment, i (i)}
  {#if segment.type === "text"}
    {segment.value}
  {:else if segment.type === "bold"}
    <strong><Self segments={segment.children} /></strong>
  {:else}
    <PrintReminderToken />
  {/if}
{/each}

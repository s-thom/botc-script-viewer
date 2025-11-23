<script lang="ts">
  import { parseRichDescription } from "../../../lib/characters";
  import ReminderToken from "./ReminderToken.svelte";

  interface Props {
    content: string;
  }

  const { content }: Props = $props();

  const parts = parseRichDescription(content);
</script>

<span>
  {#each parts as part}
    {#if part.type === "bold"}
      <strong>{part.content}</strong>
    {:else if part.type === "square"}
      <strong>[{part.content}]</strong>
    {:else if part.type === "colon"}
      <ReminderToken />
    {:else if part.type === "regular"}
      <span>{part.content}</span>
    {/if}
  {/each}
</span>

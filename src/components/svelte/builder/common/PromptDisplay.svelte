<script lang="ts">
  import { Close } from "svelte-codicons";
  import { scriptState } from "../../../../lib/client/builder/state";
</script>

{#if scriptState.prompt}
  <div class="prompt-display">
    <span class="prompt"
      ><span>Prompt: </span>
      <span class="prompt-prompt">{scriptState.prompt}</span></span
    >
    <button
      type="button"
      class="icon-button"
      aria-label="Dismiss prompt"
      onclick={() => (scriptState.prompt = undefined)}
      data-umami-event="prompt-dismiss"><Close /></button
    >
  </div>
{/if}

<style>
  .prompt-display {
    display: flex;
    gap: 0.2rem;
  }

  .prompt {
    flex-grow: 1;
  }

  .prompt-prompt {
    font-style: italic;
  }
</style>

<script lang="ts">
  import { Close } from "svelte-codicons";
  import { globalState } from "../../../lib/builder/state.svelte";
</script>

{#if globalState.ui.prompt}
  <div class="prompt-display">
    <span class="prompt"
      ><span>Prompt: </span>
      <span class="prompt-prompt">{globalState.ui.prompt}</span></span
    >
    <button
      type="button"
      class="icon-button"
      aria-label="Dismiss prompt"
      onclick={() => (globalState.ui.prompt = undefined)}
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

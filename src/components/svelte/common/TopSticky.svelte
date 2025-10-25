<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();
</script>

<div class="floating">
  {@render children?.()}
</div>

<style>
  .floating {
    position: sticky;
    background-color: var(--color-background);
    top: -0.5rem;
    padding: 0.5rem;
    margin: -0.5rem;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>

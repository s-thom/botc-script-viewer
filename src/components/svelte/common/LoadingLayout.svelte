<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import CharacterIcon from "./CharacterIcon.svelte";
  import type { OfficialCharacterId } from "../../../generated/types";

  interface Props {
    character: OfficialCharacterId;
    isLoaded?: boolean;
    children?: Snippet;
    preload?: Snippet;
  }

  let {
    children,
    character,
    isLoaded: isLoadedProp,
    preload,
  }: Props = $props();

  // It might seem strange to have a loading state that's immediately replaced with the content,
  // but since we pre-render with Astro, the loading state ends up baked into the HTML and gets
  // replaced only when the app itself loads.

  let isMounted = $state(false);
  let isLoaded = $derived(isLoadedProp ?? true);
  let shouldRender = $derived(isMounted && isLoaded);

  onMount(() => {
    isMounted = true;
  });
</script>

{#if shouldRender}
  {@render children?.()}
{:else}
  <div class="container">
    <CharacterIcon
      character={{ id: character, team: "outsider", name: "", ability: "" }}
      class="slow-spin loading-icon"
    />
    <p>Loading...</p>
    <noscript>
      <p>The script builder is interactive and requires Javascript to run.</p>
    </noscript>
  </div>
  <div class="preload">
    {@render children?.()}
    {@render preload?.()}
  </div>
{/if}

<style>
  .container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    :global(.loading-icon) {
      width: 144px;
      height: 144px;
    }
  }

  .preload {
    display: none;
  }
</style>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ScriptCharacter } from "../../../../generated/script-schema";
  import CharacterIcon from "../../common/CharacterIcon.svelte";
  import type { OfficialCharacterId } from "../../../../generated/types";
  import { CHARACTERS_BY_ID } from "../../../../lib/characters";

  interface Props {
    character?: ScriptCharacter | OfficialCharacterId;
    children?: Snippet;
  }

  const { character, children }: Props = $props();

  const actualCharacter: ScriptCharacter | undefined =
    character === undefined
      ? undefined
      : typeof character === "object"
        ? character
        : CHARACTERS_BY_ID.get(character);
</script>

<div class="info-area">
  {#if actualCharacter}
    <CharacterIcon
      character={actualCharacter}
      class="info-area-icon slow-spin"
    />
  {/if}
  {@render children?.()}
</div>

<style>
  .info-area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    :global(.info-area-icon) {
      width: 128px;
    }
  }
</style>

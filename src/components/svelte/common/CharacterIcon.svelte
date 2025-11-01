<script module>
  import { type ClassValue } from "svelte/elements";
  import * as CHARACTER_ICONS from "../../../generated/character-icons";
  import { type ScriptCharacter } from "../../../generated/script-schema";
  import { ALLOWED_EXTERNAL_HOSTNAMES } from "../../../lib/images";
  import { once } from "../../../lib/builder/util/functions";
  import type { ImageMetadata } from "astro";

  export interface CharacterIconProps {
    character: ScriptCharacter;
    class?: ClassValue;
  }

  function getTeamFallbackIcon(
    character: ScriptCharacter,
  ): ImageMetadata | null {
    return character.team in CHARACTER_ICONS
      ? CHARACTER_ICONS[character.team]
      : null;
  }

  function getCharacterIconUrl(character: ScriptCharacter): string | null {
    const teamFallbackIcon = getTeamFallbackIcon(character);

    let characterId = character.id;
    if (character.special) {
      for (const special of character.special) {
        if (
          // @ts-expect-error This is a special case override
          special.type === "botc-script-builder" &&
          // @ts-expect-error This is a special case override
          special.name === "replace-icon"
        ) {
          characterId = special.value as string;
        }
      }
    }

    if (character.image) {
      let imageUrl: string;
      if (typeof character.image === "string") {
        imageUrl = character.image;
      } else if (Array.isArray(character.image) && character.image.length > 0) {
        imageUrl = character.image[0];
      } else {
        return teamFallbackIcon?.src ?? null;
      }

      const url = new URL(imageUrl);
      if (!url) {
        return null;
      }

      if (!ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname)) {
        return teamFallbackIcon?.src ?? null;
      }

      return imageUrl;
    }

    if (characterId in CHARACTER_ICONS) {
      return (CHARACTER_ICONS as unknown as Record<string, ImageMetadata>)[
        characterId
      ].src;
    } else {
      return teamFallbackIcon?.src ?? null;
    }
  }
</script>

<script lang="ts">
  const { character, class: className }: CharacterIconProps = $props();

  const fallback = getTeamFallbackIcon(character);
  const src = getCharacterIconUrl(character);
</script>

<div class={["icon-container", className]}>
  {#if src != null}
    <img
      class="icon"
      {src}
      alt=""
      onerror={once(function (this: HTMLImageElement) {
        if (fallback) {
          this.src = fallback.src;
        }
      })}
    />
  {:else}
    <div class="icon icon-placeholder"></div>
  {/if}
</div>

<style>
  .icon {
    width: 100%;
  }
</style>

<script lang="ts">
  import { References } from "svelte-codicons";
  import type { ScriptCharacter } from "../../../../generated/script-schema";
  import { CHARACTERS_BY_ID, getAlmanacLink } from "../../../../lib/characters";
  import CharacterIcon from "../../common/CharacterIcon.svelte";
  import {
    getCharactersFromScriptSettings,
    scriptState,
  } from "../../../../lib/client/builder/state";
  import { CHARACTER_METADATA } from "../../../../lib/builder/metadata/characters";
  import { EDITIONS } from "../../../../lib/builder/metadata/editions";
  import { ACTION_TYPE_NAMES } from "../../../../lib/builder/metadata/types";

  interface Props {
    character: ScriptCharacter;
  }

  const { character }: Props = $props();

  const isCustom = !CHARACTERS_BY_ID.has(character.id);

  let allCharacters = $derived(getCharactersFromScriptSettings(scriptState));
  let allCharactersById = $derived(
    new Map(allCharacters.map((c) => [c.id, c])),
  );

  let jinxPairs = $derived.by(() => {
    return [
      ...(character.jinxes ?? [])
        .filter((jinx) => allCharactersById.has(jinx.id))
        .map((jinx) => ({
          character1: character,
          character2: allCharactersById.get(jinx.id)!,
          reason: jinx.reason,
        })),
      ...allCharacters.flatMap((scriptCharacter) =>
        (scriptCharacter.jinxes ?? [])
          .filter((jinx) => jinx.id === character.id)
          .map((jinx) => ({
            character1: scriptCharacter,
            character2: character,
            reason: jinx.reason,
          })),
      ),
    ];
  });

  let metadata = $derived.by(() => {
    if (character.id in CHARACTER_METADATA) {
      return CHARACTER_METADATA[
        character.id as keyof typeof CHARACTER_METADATA
      ];
    }
  });
</script>

<div class="header">
  <h2 class="character-name">
    {character.name}
  </h2>

  <CharacterIcon {character} class="main-icon" />
</div>

<p class="ability">{character.ability}</p>
<p class="flavor">{character.flavor}</p>

{#if !isCustom}
  <p>
    <a
      class="character-wiki-link"
      href={getAlmanacLink(character)}
      rel="external noreferrer"
      target="_blank"
    >
      <References class="inline-icon" />
      <span>Wiki link</span>
    </a>
  </p>
{/if}

{#if character.firstNightReminder || character.otherNightReminder}
  <h3>Night order descriptions</h3>
  {#if character.firstNightReminder}
    <h4>First night</h4>
    <p>{character.firstNightReminder}</p>
  {/if}
  {#if character.otherNightReminder}
    <h4>Other nights</h4>
    <p>{character.otherNightReminder}</p>
  {/if}
{/if}

{#if jinxPairs.length > 0}
  <h3>Jinxes</h3>
  <ul class="jinx-list">
    {#each jinxPairs as jinx (`${jinx.character1.id}+${jinx.character2.id}`)}
      <li>
        <h4 class="jinx-header">
          <CharacterIcon character={jinx.character1} class="jinx-icon" />
          <span class="character-name">{jinx.character1.name}</span> +
          <CharacterIcon character={jinx.character2} class="jinx-icon" />
          <span class="character-name">{jinx.character2.name}</span>
        </h4>
        <p>{jinx.reason}</p>
      </li>
    {/each}
  </ul>
{/if}

{#if character.id === "djinn"}
  {@const allJinxes = allCharacters.flatMap((c) =>
    (c.jinxes ?? [])
      .filter((jinx) => allCharactersById.has(jinx.id))
      .map((jinx) => ({
        character1: c,
        character2: allCharactersById.get(jinx.id)!,
        reason: jinx.reason,
      })),
  )}
  <h3>All Jinxes</h3>
  <ul class="jinx-list">
    {#each allJinxes as jinx (`${jinx.character1.id}+${jinx.character2.id}`)}
      <li>
        <h4 class="jinx-header">
          <CharacterIcon character={jinx.character1} class="jinx-icon" />
          <span class="character-name">{jinx.character1.name}</span> +
          <CharacterIcon character={jinx.character2} class="jinx-icon" />
          <span class="character-name">{jinx.character2.name}</span>
        </h4>
        <p>{jinx.reason}</p>
      </li>
    {/each}
  </ul>
{/if}

{#if metadata}
  {@const edition = EDITIONS[metadata.edition]}
  <h3>Metadata</h3>
  <p>Information to help power the checks in the script builder.</p>
  <ul class="metadata-list">
    <li>
      Edition: <CharacterIcon
        character={{
          id: metadata.edition,
          name: edition.name,
          team: metadata.edition as never,
          ability: "",
          special: [
            {
              type: "botc-script-builder",
              name: "replace-icon",
              value: edition.icon,
            } as never,
          ],
        }}
        class="edition-icon"
      />
      {EDITIONS[metadata.edition].name}
    </li>
    <li>Action type: {ACTION_TYPE_NAMES[metadata.actionType]}</li>
    {#if metadata.causesDroison}
      <li>Causes drunkenness/poisoning</li>
    {/if}
    {#if metadata.causesMadness}
      <li>Causes madness</li>
    {/if}
    {#if metadata.causesExtraEvil}
      <li>Causes extra evil players</li>
    {/if}
    {#if metadata.causesExtraNightDeaths}
      <li>Causes extra deaths at night</li>
    {/if}
    {#if metadata.causesResurrection}
      <li>Causes resurrection at night</li>
    {/if}
    {#if metadata.preventsExecution}
      <li>Prevents executions</li>
    {/if}
    {#if metadata.preventsNightDeath}
      <li>Prevents deaths at night</li>
    {/if}
    {#if metadata.needsExtraMinion}
      <li>Could do with an extra minion on the script</li>
    {/if}
    {#if metadata.addsExtraGoodWinCondition}
      <li>Adds a win condition for the good team</li>
    {/if}
    {#if metadata.addsExtraEvilWinCondition}
      <li>Adds a win condition for the evil team</li>
    {/if}
    {#if metadata.outsiderModification}
      <li>Modifies the number of outsiders</li>
    {/if}
    {#if metadata.canChangeRules}
      <li>Can modify the rules of the game</li>
    {/if}
    {#if metadata.requiresCharacters && metadata.requiresCharacters.length > 0}
      <li>
        Requires the following characters to be in play:
        <ul>
          {#each metadata.requiresCharacters as requiredId}
            {@const requiredCharacter =
              allCharactersById.get(requiredId) ??
              CHARACTERS_BY_ID.get(requiredId)}
            <li>
              {#if requiredCharacter}
                <CharacterIcon
                  character={requiredCharacter}
                  class="edition-icon"
                />
                <span class="character-name">{requiredCharacter.name}</span>
              {:else}
                <span class="character-name">{requiredId}</span>
              {/if}
            </li>
          {/each}
        </ul>
      </li>
    {/if}
  </ul>
{/if}

<style>
  .flavor {
    font-style: italic;
  }

  .character-name {
    font-family: var(--font-title);
  }

  .header :global(.main-icon) {
    --icon-size: 96px;
    width: var(--icon-size);
    height: var(--icon-size);
    flex-shrink: 0;
  }

  .jinx-header {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    :global(.jinx-icon) {
      --icon-size: 32px;
      width: var(--icon-size);
      height: var(--icon-size);
      flex-shrink: 0;
    }
  }

  .metadata-list {
    :global(.edition-icon) {
      --icon-size: 32px;
      width: var(--icon-size);
      height: var(--icon-size);
      flex-shrink: 0;
      display: inline-block;
      vertical-align: middle;
    }
  }
</style>

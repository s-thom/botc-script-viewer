<script lang="ts">
  import { References } from "svelte-codicons";
  import type { ScriptCharacter } from "../../../../generated/script-schema";
  import { CHARACTERS_BY_ID, getAlmanacLink } from "../../../../lib/characters";
  import CharacterIcon from "../../common/CharacterIcon.svelte";
  import {
    getCharactersFromScriptSettings,
    navigateSetScreen,
    scriptState,
    setScriptState,
  } from "../../../../lib/client/builder/state";
  import { CHARACTER_METADATA } from "../../../../lib/builder/metadata/characters";
  import { EDITIONS } from "../../../../lib/builder/metadata/editions";
  import { ACTION_TYPE_NAMES } from "../../../../lib/builder/metadata/types";
  import { listScripts } from "../../../../lib/client/storage/builder";
  import type { SavedScriptData } from "../../../../lib/client/builder/state/types";
  import FormattedDescription from "../../common/FormattedDescription.svelte";
  import ReminderDefinition from "../../common/ReminderDefinition.svelte";
  import ReminderToken from "../../common/ReminderToken.svelte";

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

  let inScriptsPromise = $derived.by(() => {
    const searchId = character.id;

    return listScripts().then((scripts) =>
      scripts.filter((script) => {
        for (const team of Object.values(script.script.characters)) {
          for (const scriptCharacter of team) {
            if (scriptCharacter.id === searchId) {
              return true;
            }
          }
        }

        return false;
      }),
    );
  });

  function switchScript(id: string, script: SavedScriptData) {
    setScriptState(id, script.script);
    navigateSetScreen("script");
  }
</script>

<ReminderDefinition />

<div class="character-info">
  <div class="header">
    <h2 class="character-name">
      {character.name}
    </h2>

    <CharacterIcon {character} class="main-icon" />

    {#if !isCustom}
      <p class="ability-area">
        <a
          class="character-wiki-link"
          href={getAlmanacLink(character)}
          rel="external noreferrer"
          target="_blank"
        >
          <References class="inline-icon" />
          <span>Open in official wiki</span>
        </a>
      </p>
    {/if}

    <div class="ability-area">
      <h3 class="ability-title">Ability</h3>
      <p class="ability">
        <FormattedDescription content={character.ability} />
      </p>
    </div>
    <div class="ability-area">
      <h3 class="ability-title">Flavor</h3>
      <p class="ability flavor">{character.flavor}</p>
    </div>
  </div>

  {#if (character.reminders && character.reminders.length > 0) || (character.remindersGlobal && character.remindersGlobal.length > 0)}
    <div class="section">
      <h3>Reminder tokens</h3>
      <div class="two-column">
        {#if character.reminders && character.reminders.length > 0}
          <div class="section">
            <h4>When in play</h4>
            <ul class="jinx-list">
              {#each character.reminders as reminder}
                <li>
                  <ReminderToken />
                  {reminder}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
        {#if character.remindersGlobal && character.remindersGlobal.length > 0}
          <div class="section">
            <h4>Always available</h4>
            <ul class="jinx-list">
              {#each character.remindersGlobal as reminder}
                <li>
                  <ReminderToken />
                  {reminder}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if character.firstNightReminder || character.otherNightReminder}
    <div class="section">
      <h3>Night order descriptions</h3>
      <div class="two-column">
        {#if character.firstNightReminder}
          <div class="section">
            <h4>First night</h4>
            <p>
              <FormattedDescription content={character.firstNightReminder} />
            </p>
          </div>
        {/if}
        {#if character.otherNightReminder}
          <div class="section">
            <h4>Other nights</h4>
            <p>
              <FormattedDescription content={character.otherNightReminder} />
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if jinxPairs.length > 0}
    <div class="section">
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
    </div>
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
    <div class="section">
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
    </div>
  {/if}

  {#if character.id === "bootlegger"}
    {@const customCharacters = allCharacters.filter(
      (c) => !CHARACTERS_BY_ID.has(c.id),
    )}
    {@const bootleggerRules = scriptState.meta.bootlegger ?? []}

    {#if customCharacters.length > 0 || bootleggerRules.length > 0}
      <div class="section">
        <h3>Bootlegger</h3>

        <div class="two-column">
          {#if customCharacters.length > 0}
            <div class="section">
              <p>The following custom characters are on the script:</p>
              <ul class="jinx-list">
                {#each customCharacters as customCharacter (character.id)}
                  <li>
                    <h4 class="jinx-header">
                      <CharacterIcon
                        character={customCharacter}
                        class="jinx-icon"
                      />
                      <span class="character-name">{customCharacter.name}</span>
                    </h4>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if bootleggerRules.length > 0}
            <div class="section">
              <p>The following bootlegger rules are on the script:</p>
              <ul class="jinx-list">
                {#each bootleggerRules as rule}
                  <li>
                    <p>{rule}</p>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/if}

  {#await inScriptsPromise then foundInScripts}
    {#if foundInScripts.length > 0}
      <div class="section">
        <h3>Used in scripts</h3>
        <ul class="jinx-list">
          {#each foundInScripts as script}
            <li>
              <button
                type="button"
                class="link-button"
                onclick={() => switchScript(script.id, script)}
                >{script.script.meta.name}</button
              >
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/await}

  {#if metadata}
    {@const edition = EDITIONS[metadata.edition]}

    <div class="section">
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
    </div>
  {/if}
</div>

<style>
  .character-info {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .character-name {
    font-family: var(--font-title);
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    :global(.main-icon) {
      --icon-size: 128px;
      width: var(--icon-size);
      height: var(--icon-size);
      flex-shrink: 0;

      &:hover {
        animation: Spin 40s linear infinite;
      }
    }
    .ability-area {
      text-align: center;

      .ability-title {
        font-size: 1.3rem;
      }

      .flavor {
        font-style: italic;
      }
    }
  }

  .section {
  }

  .two-column {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

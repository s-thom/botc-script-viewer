<script lang="ts">
  import type {
    CharacterTeam,
    ScriptCharacter,
  } from "../../../../generated/script-schema";
  import type { OfficialCharacterId } from "../../../../generated/types";
  import { CHARACTER_METADATA } from "../../../../lib/builder/metadata/characters";
  import { EDITIONS } from "../../../../lib/builder/metadata/editions";
  import { filterInPlace } from "../../../../lib/builder/util/arrays";
  import {
    CHARACTERS_BY_TEAM,
    getEnforcedCharacters,
    TEAM_NAMES,
  } from "../../../../lib/characters";
  import {
    doSortScript,
    scriptState,
  } from "../../../../lib/client/builder/state";
  import CharacterSelectList from "./CharacterSelectList.svelte";

  const TEAM_CHARACTERS: ScriptCharacter[] = Object.entries(TEAM_NAMES).map(
    ([team, name]) => ({
      id: team,
      name,
      team: team as never,
      ability: "",
    }),
  );

  const EDITION_CHARACTERS: ScriptCharacter[] = Object.entries(EDITIONS)
    .filter(([id]) => id !== "custom") // Hide custom selection for now, will be added when custom characters are better supported.
    .map(([id, data]) => ({
      id: id,
      name: data.name,
      team: id as never,
      ability: "",
      special: [
        {
          type: "botc-script-builder",
          name: "replace-icon",
          value: data.icon,
        } as never,
      ],
    }));

  let search = $state("");
  let teamFilter = $state(new Set<string>());
  let editionFilter = $state(new Set<string>());

  const selectedSet = $derived.by<Set<string>>(() => {
    const inScript = Object.values(scriptState.characters).flatMap(
      (characters) => characters.map((character) => character.id),
    );
    const forcedCharacters = getEnforcedCharacters(scriptState);

    const set = new Set(inScript);
    for (const [forcedId] of forcedCharacters) {
      set.add(forcedId);
    }

    return set;
  });

  function onCharacterSelect(character: ScriptCharacter) {
    if (selectedSet.has(character.id)) {
      for (const characters of Object.values(scriptState.characters)) {
        filterInPlace(characters, (c) => c.id !== character.id);
      }
    } else {
      scriptState.characters[character.team].push(character);
    }

    doSortScript();
  }

  function onTeamSelect(character: ScriptCharacter) {
    const newSet = new Set(teamFilter);
    if (newSet.has(character.id)) {
      newSet.delete(character.id);
    } else {
      newSet.add(character.id);
    }
    teamFilter = newSet;
  }

  function onEditionSelect(character: ScriptCharacter) {
    const newSet = new Set(editionFilter);
    if (newSet.has(character.id)) {
      newSet.delete(character.id);
    } else {
      newSet.add(character.id);
    }
    editionFilter = newSet;
  }

  const filteredCharactersByTeam = $derived.by<
    Record<CharacterTeam, ScriptCharacter[]>
  >(() => {
    return Object.fromEntries(
      Object.entries(CHARACTERS_BY_TEAM).map<
        [CharacterTeam, ScriptCharacter[]]
      >(([team, characters]) => [
        team as CharacterTeam,
        characters.filter((character) => {
          let result = true;

          if (teamFilter.size > 0) {
            result &&= teamFilter.has(team);
          }

          if (editionFilter.size > 0) {
            const edition =
              character.id in CHARACTER_METADATA
                ? CHARACTER_METADATA[character.id as OfficialCharacterId]
                    .edition
                : "custom";
            result &&= editionFilter.has(edition);
          }

          if (search.length > 0) {
            result &&= character.name
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase());
          }

          return result;
        }),
      ]),
    ) as Record<CharacterTeam, ScriptCharacter[]>;
  });
</script>

<h2>Select characters</h2>

<div class="search-form">
  <label class="search-option" for="name-search">
    <span class="search-label">Search by name: </span>
    <input
      class="text-input"
      id="name-search"
      name="name-search"
      type="text"
      autocomplete="off"
      bind:value={search}
    />
  </label>
  <div class="search-option search-tags">
    <span class="search-label">Teams:</span>
    <CharacterSelectList
      characters={TEAM_CHARACTERS}
      selectedSet={teamFilter}
      onCharacterSelect={onTeamSelect}
      itemClass="tag"
    />
  </div>
  <div class="search-option search-tags">
    <span class="search-label">Editions:</span>
    <CharacterSelectList
      characters={EDITION_CHARACTERS}
      selectedSet={editionFilter}
      onCharacterSelect={onEditionSelect}
      itemClass="tag"
    />
  </div>
</div>

{#each Object.entries(TEAM_NAMES) as [team, teamName] (team)}
  {#if filteredCharactersByTeam[team as CharacterTeam].length > 0}
    <div class="team-list">
      <h3>{teamName}</h3>
      <CharacterSelectList
        characters={filteredCharactersByTeam[team as CharacterTeam]}
        {selectedSet}
        {onCharacterSelect}
      />
    </div>
  {/if}
{/each}

<style>
  .team-list {
    margin-block: 1rem;
  }

  .search-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .search-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .search-label {
    flex-shrink: 0;
  }

  .search-tags {
    :global(.character-name) {
      font-family: var(--font-body);
    }

    :global(.tag) {
      gap: 0.1rem;

      :global(.icon-container) {
        width: 24px;
      }
    }
  }
</style>

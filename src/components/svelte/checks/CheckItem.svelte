<script lang="ts">
  import {
    Close,
    Error,
    Info,
    TriangleDown,
    TriangleRight,
    Wand,
    Warning,
    type SvgComponent,
  } from "svelte-codicons";
  import type { ScriptCharacter } from "../../../generated/script-schema";
  import { CHARACTERS_BY_ID } from "../../../lib/characters";
  import type { CheckResult } from "../../../lib/builder/checks/types";
  import { doSortScript, globalState } from "../../../lib/builder/state.svelte";
  import CharacterIcon from "../common/CharacterIcon.svelte";

  const LEVEL_ICONS: Record<CheckResult["level"], typeof SvgComponent> = {
    error: Error,
    warning: Warning,
    info: Info,
  };

  interface Props {
    result: CheckResult;
  }

  const { result }: Props = $props();

  const LevelIcon = LEVEL_ICONS[result.level];

  function addCharacter(character: ScriptCharacter) {
    globalState.characters[character.team].push(character);

    doSortScript();
  }

  function ignoreCheck() {
    globalState.ui.ignoredChecks.push(result.id);
  }
</script>

<div class={["check", `level-${result.level}`]}>
  <details>
    <summary class="summary-line">
      <span class="summary-description">
        {#if (result.remarks && result.remarks.length > 0) || (result.actions && result.actions.length > 0)}
          <TriangleRight
            class="inline-icon summary-icon marker marker-closed"
            aria-label="Expand detail"
          />
          <TriangleDown
            class="inline-icon summary-icon marker marker-open"
            aria-label="Collapse detail"
          />
        {/if}
        <LevelIcon class="inline-icon summary-icon" aria-label={result.level} />
        <span>{result.description}</span>
        {#if result.actions && result.actions.length > 0}
          <Wand class="inline-icon summary-icon" aria-label="Has actions" />
        {/if}
      </span>
      <button
        type="button"
        class="icon-button"
        onclick={ignoreCheck}
        data-umami-event="check-ignore"
        data-umami-event-check={result.id}
        ><Close class="inline-icon summary-icon" aria-label="Ignore" /></button
      >
    </summary>

    {#if result.remarks && result.remarks.length > 0}
      <ul class="remarks-list">
        {#each result.remarks as remark}
          <li>{remark}</li>
        {/each}
      </ul>
    {/if}

    {#if result.actions && result.actions.length > 0}
      <ul class="actions-list">
        {#each result.actions as action}
          <li class="action-item">
            {#if action.type === "add-character"}
              {@const character = CHARACTERS_BY_ID.get(action.id)}
              {#if character != null}
                <button
                  type="button"
                  class="icon-button action-button"
                  data-umami-event="check-action"
                  data-umami-event-type={action.type}
                  data-umami-event-character={action.id}
                  onclick={() => addCharacter(character)}
                >
                  <CharacterIcon {character} class="action-icon" />
                  <span>Add {character.name}</span>
                </button>
              {/if}
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </details>
</div>

<style>
  .check {
    background-color: var(--color-level-background);
    border-block-start: 1px solid var(--color-level-border);
    padding-inline-start: 0.5rem;

    &:is(:global(li:last-child) &) {
      border-block-end: 1px solid var(--color-level-border);
    }
  }

  .summary-line {
    display: flex;
    gap: 0.2rem;

    :global(.inline-icon summary-icon) {
      flex-shrink: 0;
    }
  }

  :global(.marker) {
    &:global(.marker-closed):is(details[open] &),
    &:global(.marker-open):is(details:not([open]) &) {
      display: none;
    }
  }

  .summary-description {
    flex-grow: 1;
  }

  .actions-list {
    display: flex;
    list-style: none;
    padding-inline-start: 0;
  }

  :is(.remarks-list, .actions-list):last-child {
    padding-block-end: 0.2rem;
  }

  .action-item {
    :global(.action-icon) {
      width: 24px;
    }
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    border: 2px solid var(--color-control-border-active);
    background-color: var(--color-control-background-active);
    border-radius: var(--border-radius);
    padding-inline-end: 8px;

    &:hover,
    &:active {
      background-color: var(--color-control-background);
    }
  }
</style>

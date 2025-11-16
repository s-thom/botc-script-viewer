<script lang="ts">
  import { nanoid } from "nanoid";
  import { Trash } from "svelte-codicons";
  import {
    appState,
    setScriptFromRaw,
    setScriptState,
  } from "../../../../lib/client/builder/state";
  import type { SavedScriptData } from "../../../../lib/client/builder/state/types";
  import {
    deleteScriptSettings,
    listScripts,
  } from "../../../../lib/client/storage/builder";
  import CentredInfoArea from "../common/CentredInfoArea.svelte";

  interface Props {}

  const {}: Props = $props();

  const dateFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  let listPromise = $state(listScripts());
  function refreshList() {
    listPromise = listScripts();
  }

  function onNewScriptClick() {
    const id = nanoid();
    setScriptFromRaw(id, []);
    appState.screen.current = "script";
  }

  async function onGoToImportClick() {
    appState.screen.current = "switcher:import";
    appState.screen.previous = "switcher";
  }

  async function onScriptClick(data: SavedScriptData) {
    setScriptState(data.id, data.script);
    appState.screen.current = "script";
  }

  async function onDeleteClick(id: string) {
    await deleteScriptSettings(id);
    refreshList();
  }
</script>

{#await listPromise}
  <CentredInfoArea character="librarian">
    <p>Loading...</p>
  </CentredInfoArea>
{:then scriptList}
  {#if scriptList.length > 0}
    <div class="action-list">
      <button
        type="button"
        class="button"
        onclick={onNewScriptClick}
        data-umami-event="switcher-new">Create new script</button
      >
      <button
        type="button"
        class="button mobile-only"
        data-umami-event="switcher-go-to-import"
        onclick={onGoToImportClick}>Import JSON</button
      >
    </div>
    <ul class="script-list">
      {#each scriptList as savedScript}
        {@const scriptTitle = savedScript.script.meta.name || "Untitled script"}
        <li class="script-list-item">
          <button
            type="button"
            class="icon-button script-button"
            onclick={() => onScriptClick(savedScript)}
            data-umami-event="switcher-script-go"
          >
            <p>
              <span
                class={["title", !savedScript.script.meta.name && "no-title"]}
                >{scriptTitle}</span
              >
            </p>
            {#if savedScript.script.meta.author}
              <p>by {savedScript.script.meta.author}</p>
            {/if}
            <p>
              <span class="date"
                >Last updated: {dateFormat.format(
                  savedScript.updatedTimestamp,
                )}</span
              >
            </p>
          </button>

          <button
            type="button"
            class="action-button icon-button delete-button"
            onclick={() => onDeleteClick(savedScript.id)}
            data-umami-event="script-script-remove"
            ><Trash aria-label={`Remove ${scriptTitle}`} /></button
          >
        </li>
      {/each}
    </ul>
  {:else}
    <CentredInfoArea character="librarian">
      <p>No scripts yet.</p>
      <button type="button" class="button" onclick={onNewScriptClick}
        >Create new script</button
      >
    </CentredInfoArea>
  {/if}
{:catch}
  <CentredInfoArea character="goblin">
    <p>Unable to get list of saved scripts.</p>
  </CentredInfoArea>
{/await}

<style>
  .action-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-block-end: 0.5rem;
  }

  .script-list {
    list-style-type: none;
    padding-inline-start: 0;
  }

  .script-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: var(--border-radius);
    transition:
      background-color 0.1s ease-in-out,
      border 0.1s ease-in-out;
    background-color: transparent;
    border: 2px solid transparent;

    &:hover {
      background-color: var(--color-control-background);
      border: 2px solid var(--color-control-border-active);
    }

    &:active {
      background-color: var(--color-control-background);
      border: 2px solid var(--color-control-border-active);
    }

    &:has(.delete-button:hover) {
      background-color: var(--color-control-background-error);
      border: 2px solid var(--color-control-border-error);
    }
  }

  .script-button {
    text-align: start;
    flex-grow: 1;
  }

  .title {
    font-size: 1.2rem;

    &:not(.no-title) {
      font-weight: 600;
    }

    &.no-title {
      font-style: italic;
    }
  }

  .date {
    font-style: italic;
  }

  .action-button {
    padding: 0;
    width: 24px;
    height: 24px;
    height: var(--icon-size);
    flex-shrink: 0;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

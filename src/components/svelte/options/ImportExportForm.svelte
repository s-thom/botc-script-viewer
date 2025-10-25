<script lang="ts">
  import { slide } from "svelte/transition";
  import {
    parseOrFetchScript,
    validateScriptJson,
  } from "../../../lib/builder/import";
  import {
    getScript,
    globalState,
    setScript,
  } from "../../../lib/builder/state.svelte";

  let isShowingImport = $state(false);
  let isImporting = $state(false);
  let scriptInputValue = $state("");
  let scriptInputError = $state<string | undefined>(undefined);
  let uploadInputError = $state<string | undefined>(undefined);

  function downloadJson() {
    const script = getScript();
    const scriptFilename = `${(globalState.meta.name || "script").replace(/[\\/:*?"<>|]+/g, "_")}.json`;

    const blob = new Blob([JSON.stringify(script)], {
      type: "application/json",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = scriptFilename;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async function onScriptInputSubmit(event: SubmitEvent) {
    event.preventDefault();

    isImporting = true;
    scriptInputError = undefined;

    try {
      const rawJson = await parseOrFetchScript(scriptInputValue);
      const newScript = validateScriptJson(rawJson);

      setScript(newScript);

      isShowingImport = false;
    } catch (err) {
      scriptInputError = "Error importing script";
    } finally {
      isImporting = false;
    }
  }

  async function onFileInputChange(event: Event) {
    try {
      isImporting = true;
      uploadInputError = undefined;

      const input = event.currentTarget as HTMLInputElement;
      const fileList = input.files;
      if (fileList == null || fileList.length !== 1) {
        throw new Error("Input file list does not have 1 file");
      }

      const file = fileList[0];
      if (file.type !== "application/json") {
        console.warn(
          `Uploaded file has type ${file.type}. Expected application/json`,
        );
      }

      const rawContent = await file.text();
      const rawJson = JSON.parse(rawContent);

      const newScript = validateScriptJson(rawJson);

      setScript(newScript);

      isShowingImport = false;
    } catch (err) {
      uploadInputError = "Error uploading script";
    } finally {
      isImporting = false;
    }
  }

  function onResetClick() {
    setScript([]);
  }

  const numCharacters = $derived.by(() =>
    Object.values(globalState.characters).reduce(
      (sum, team) => sum + team.length,
      0,
    ),
  );
</script>

<div class="action-list">
  <button
    type="button"
    class="button"
    onclick={() => (isShowingImport = !isShowingImport)}
    data-umami-event="script-import-open"
    data-umami-event-open={!isShowingImport}>Import script</button
  >
  <button
    type="button"
    class="button"
    onclick={downloadJson}
    data-umami-event="script-export-json">Export JSON</button
  >
  {#if numCharacters > 0}
    <button
      type="button"
      class="button"
      onclick={onResetClick}
      data-umami-event="script-reset">Reset</button
    >
  {/if}
</div>

{#if isShowingImport}
  <form
    class="import-form"
    onsubmit={onScriptInputSubmit}
    transition:slide={{ axis: "y", duration: 150 }}
  >
    <fieldset class="fieldset">
      <label
        for="file-upload"
        class="button file-upload-label"
        data-umami-event="script-import-file-upload">Upload .json file</label
      >
      <input
        type="file"
        name="file-upload"
        id="file-upload"
        class="visually-hidden-always"
        accept="application/json,.json,text/*"
        aria-describedby="upload-error"
        oninput={onFileInputChange}
      />
      {#if uploadInputError}
        <p id="upload-error" class="import-error">{uploadInputError}</p>
      {/if}
    </fieldset>
    <fieldset class="fieldset">
      <label for="script">Script JSON or URL</label>
      <textarea
        class="text-input"
        name="script"
        id="script"
        required
        bind:value={scriptInputValue}
        aria-describedby="script-error"
      ></textarea>
      <button
        type="submit"
        class="button"
        disabled={isImporting}
        data-umami-event="script-import-textarea-submit"
      >
        Import
      </button>
      {#if scriptInputError}
        <p id="script-error" class="import-error">{scriptInputError}</p>
      {/if}
    </fieldset>
  </form>
{/if}

<style>
  .action-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-block-end: 0.5rem;
  }

  .import-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .fieldset {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 0.2rem;
    padding: 0;
    margin: 0;
    border: none;
  }

  .file-upload-label {
    text-align: center;
  }

  .import-error {
    color: var(--color-alignment-evil);
  }
</style>

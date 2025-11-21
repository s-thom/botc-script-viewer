<script lang="ts">
  import { nanoid } from "nanoid";
  import type { BloodOnTheClocktowerCustomScript } from "../../../../generated/script-schema";
  import { setupUploadForm } from "../../../../lib/forms";
  import {
    appState,
    navigatePopScreen,
    navigateSetScreen,
    setScriptFromRaw,
  } from "../../../../lib/client/builder/state";
  import { scriptFromFormData } from "../../../../lib/import";

  function setNewScript(script: BloodOnTheClocktowerCustomScript) {
    const id = nanoid();
    setScriptFromRaw(id, script);
    navigateSetScreen("script");
  }

  async function onFormSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!event.submitter) {
      console.error("Submit event has no submitter");
      return;
    }

    const form = event.submitter.closest("form")!;
    const formData = new FormData(form);

    const localResult = await scriptFromFormData(
      formData,
      window.location.hostname,
      false,
    );
    if (localResult.ok) {
      setNewScript(localResult.script);
      return;
    }

    // From the `if (!allowRemote)` statement in src/lib/import.ts
    if (localResult.message === "Remote scripts not allowed") {
      const response = await fetch("/proxy", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        console.error("Script request did not return a script");
        return;
      }

      const script: BloodOnTheClocktowerCustomScript = await response.json();
      setNewScript(script);
      return;
    }
  }

  let form: HTMLFormElement;
  let fileInput: HTMLInputElement;
  let fileInputLabel: HTMLLabelElement;
  let statusRegion: HTMLDivElement;

  $effect(() => {
    setupUploadForm(form, fileInput, fileInputLabel, statusRegion);
  });
</script>

<div class="top-links-list mobile-only">
  <button
    type="button"
    class="back-link link-button"
    data-umami-event="switcher-import-back"
    onclick={() => navigatePopScreen()}>Back</button
  >
</div>
<h2>Import script</h2>

<div class="import-layout">
  <form
    id="script-form"
    method="POST"
    action="/go"
    enctype="multipart/form-data"
    class="form"
    onsubmit={onFormSubmit}
  >
    <p><label for="script">Paste script JSON or URL.</label></p>

    <textarea class="textarea" name="script" id="script"></textarea>

    <button type="submit" class="button" data-umami-event="script-submit">
      View script
    </button>
  </form>

  <form
    id="upload-form"
    method="POST"
    action="/go"
    enctype="multipart/form-data"
    class="form"
    onsubmit={onFormSubmit}
    bind:this={form}
  >
    <p>Upload file.</p>

    <label
      class="file-input-label"
      for="file"
      aria-describedby="upload-error"
      bind:this={fileInputLabel}
    >
      <span>Click to upload JSON file or drag file here.</span>
    </label>
    <input
      class="file-input visually-hidden-always"
      type="file"
      name="file"
      id="file"
      accept="application/json"
      autocomplete="off"
      required
      bind:this={fileInput}
    />

    <div
      id="upload-status"
      class="visually-hidden-always"
      aria-live="polite"
      bind:this={statusRegion}
    ></div>

    <button
      type="submit"
      class="button upload-submit"
      data-umami-event="upload-submit"
    >
      Upload script
    </button>
  </form>
</div>

<style>
  .import-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;

    @media (min-width: 960px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .textarea {
    background-color: var(--color-background);
    border: 2px solid var(--color-control-border-active);
    color: var(--color-text);
    padding: 0.5rem;
    border-radius: 15px;
    width: 100%;
    resize: vertical;

    &:disabled {
      filter: grayscale();
    }

    &:hover {
      border-color: var(--color-control-border-hover);
    }

    &:active {
      border-color: var(--color-control-border-active);
    }
  }

  .file-input-label {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 160px;
    border: 2px dashed var(--color-control-border-active);
    padding: 16px;
    border-radius: 15px;
    background-color: var(--color-control-background);

    &:disabled {
      filter: grayscale();
    }

    &:hover {
      border-color: var(--color-control-border-hover);
      background-color: var(--color-background);
    }

    &:active {
      border-color: var(--color-control-border-active);
      background-color: var(--color-background);
    }

    &:global(.dragover) {
      border-color: var(--color-level-border-info);
    }

    &:global(.dragerror) {
      border-color: var(--color-level-border-error);
    }
  }

  .form:not(:has(.file-input:valid)) .upload-submit {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
</style>

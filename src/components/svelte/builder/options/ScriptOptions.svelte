<script lang="ts">
  import { Trash } from "svelte-codicons";
  import {
    doSortScript,
    globalState,
  } from "../../../../lib/builder/state.svelte";
  import ExternalImage from "../../common/ExternalImage.svelte";

  function addBootleggerRule() {
    globalState.meta.bootlegger ??= [];
    globalState.meta.bootlegger.push("");
  }

  function deleteBootleggerRule(index: number) {
    globalState.meta.bootlegger ??= [];
    globalState.meta.bootlegger.splice(index, 1);
  }
</script>

<form class="script-options">
  <div class="section">
    <h3>Script options</h3>

    <div class="image-option-container">
      <label class="option" for="script-logo">
        <span>Logo</span>
        <input
          class="text-input"
          id="script-logo"
          name="script-logo"
          type="text"
          autocomplete="off"
          bind:value={globalState.meta.logo}
        />
      </label>
      {#if globalState.meta.logo !== undefined && globalState.meta.logo !== ""}
        <ExternalImage
          src={globalState.meta.logo}
          alt="Logo"
          class="image-option-image"
        />
      {/if}
    </div>

    <div class="image-option-container">
      <label class="option" for="script-background">
        <span>Background</span>
        <input
          class="text-input"
          id="script-background"
          name="script-background"
          type="text"
          autocomplete="off"
          bind:value={globalState.meta.background}
        />
      </label>
      {#if globalState.meta.background !== undefined && globalState.meta.background !== ""}
        <ExternalImage
          src={globalState.meta.background}
          alt="Background"
          class="image-option-image"
        />
      {/if}
    </div>

    <label class="option" for="script-almanac">
      <span>Almanac link</span>
      <input
        class="text-input"
        id="script-almanac"
        name="script-almanac"
        type="text"
        autocomplete="off"
        bind:value={globalState.meta.almanac}
      />
    </label>

    <label class="option" for="script-hideTitle">
      <span
        ><input
          id="script-hideTitle"
          name="script-hideTitle"
          type="checkbox"
          autocomplete="off"
          value="hideTitle"
          bind:checked={globalState.meta.hideTitle}
        /> Hide title?</span
      >
      <p class="hint">
        Hides the title of the script when imported into the official app.
      </p>
    </label>
  </div>

  <div class="section">
    <h3>Bootlegger rules</h3>

    <p class="hint">
      Adding bootlegger rules will automatically add the Bootlegger loric into
      the script.
    </p>

    {#if globalState.meta.bootlegger !== undefined && globalState.meta.bootlegger.length > 0}
      <ul class="bootlegger-list">
        {#each globalState.meta.bootlegger as rule, index}
          <li class="bootlegger-rule">
            <input
              class="text-input"
              type="text"
              aria-label="Rule"
              autocomplete="off"
              bind:value={globalState.meta.bootlegger[index]}
            />
            <button
              type="button"
              class="icon-button delete-button"
              onclick={() => deleteBootleggerRule(index)}
              data-umami-event="bootlegger-delete"
              ><Trash aria-label="Delete rule" /></button
            >
          </li>
        {/each}
      </ul>
    {/if}

    <button
      class="button"
      type="button"
      onclick={addBootleggerRule}
      data-umami-event="bootlegger-add">Add rule</button
    >
  </div>
  <div class="section">
    <h3>App options</h3>

    <label
      class="option"
      for="app-sortOrder"
      data-umami-event="option-sort-order-toggle"
      data-umami-event-enabled={!globalState.options.useSortOrder}
    >
      <span
        ><input
          id="app-sortOrder"
          name="app-sortOrder"
          type="checkbox"
          autocomplete="off"
          value="sortOrder"
          bind:checked={
            () => globalState.options.useSortOrder,
            (value) => {
              globalState.options.useSortOrder = value;
              doSortScript();
            }
          }
        /> Use sort order</span
      >
      <p class="hint">
        Automatically sort scripts using the standard <a
          href="https://bloodontheclocktower.com/news/sort-order-sao-update"
          rel="external noreferrer">sort order</a
        >.
      </p>
    </label>

    <label
      class="option indented"
      for="app-sortOrderFun"
      data-umami-event="option-sort-order-fun-toggle"
      data-umami-event-enabled={!globalState.options.useSortOrder}
    >
      <span
        ><input
          id="app-sortOrderFun"
          name="app-sortOrderFun"
          type="checkbox"
          autocomplete="off"
          value="sortOrderFun"
          bind:checked={
            () => globalState.options.useSortOrderFun,
            (value) => {
              globalState.options.useSortOrderFun = value;
              doSortScript();
            }
          }
          disabled={!globalState.options.useSortOrder}
        /> Extra sorting rules</span
      >
      <p class="hint">
        e.g. make a face using the Xaan and Goblin if both are on the script.
      </p>
    </label>

    <label
      class="option"
      for="app-checks"
      data-umami-event="option-checks-toggle"
      data-umami-event-enabled={!globalState.ui.useChecks}
    >
      <span
        ><input
          id="app-checks"
          name="app-checks"
          type="checkbox"
          autocomplete="off"
          value="hideTitle"
          bind:checked={globalState.ui.useChecks}
        /> Enable checks</span
      >
      <p class="hint">
        Check your script against common script building advice and scenarios.
      </p>
    </label>
  </div>
</form>

<style>
  .script-options {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-block: 0.5rem;
  }

  .image-option-container,
  .option:not(.image-option-container .option) {
    margin: 0.2rem;

    &.indented {
      margin-inline-start: 1rem;
    }
  }

  .image-option-container {
    display: flex;
    align-items: center;
    gap: 0.2rem;

    .option {
      flex-grow: 1;
    }

    :global(.image-option-image) {
      width: 64px;
      max-height: 64px;

      :global(.image) {
        object-fit: contain;
      }
    }
  }

  .hint {
    opacity: 0.7;
    margin-top: 0.2rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-block: 0.5rem;
  }

  .bootlegger-list {
    padding-inline-start: 0;
    list-style-type: none;
  }

  .bootlegger-rule {
    display: flex;
    gap: 0.2rem;
    margin-block: 0.2rem;

    .text-input {
      flex-grow: 1;
    }
  }
</style>

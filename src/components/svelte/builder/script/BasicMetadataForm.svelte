<script lang="ts">
  import { globalState, setScript } from "../../../../lib/builder/state.svelte";

  let onResetClick = $derived.by(() => {
    const id = globalState.scriptId;

    return () => {
      setScript(id, []);
    };
  });

  function onSwitchClick() {
    globalState.ui.screen = "switcher";
  }

  const numCharacters = $derived.by(() =>
    Object.values(globalState.characters).reduce(
      (sum, team) => sum + team.length,
      0,
    ),
  );
</script>

<form class="metadata-form">
  <h1 class="line">
    <label class="visually-hidden" for="script-title">Script title</label><input
      id="script-title"
      name="script-title"
      class="text-input title-input"
      type="text"
      aria-label="Title"
      placeholder="Script title"
      autocomplete="off"
      bind:value={globalState.meta.name}
    />
  </h1>
  <p class="line">
    <span>by </span><label class="visually-hidden" for="script-author"
      >Script author</label
    ><input
      id="script-author"
      name="script-author"
      class="text-input"
      type="text"
      aria-label="Author"
      placeholder="Script author"
      autocomplete="off"
      bind:value={globalState.meta.author}
    />
  </p>

  <p class="line">
    <button
      type="button"
      class="button"
      onclick={onSwitchClick}
      data-umami-event="script-change">Switch script</button
    >
    {#if numCharacters > 0}
      <button
        type="button"
        class="button"
        onclick={onResetClick}
        data-umami-event="script-reset">Reset</button
      >
    {/if}
  </p>
</form>

<style>
  .line {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:not(:first-child) {
      margin-block-start: 0.5rem;
    }
    &:not(:last-child) {
      margin-block-end: 0.5rem;
    }
  }

  .title-input {
    font-size: 1.5rem;
  }
</style>

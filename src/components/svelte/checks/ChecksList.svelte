<script lang="ts">
  import { checksState, globalState } from "../../../lib/builder/state.svelte";
  import CharacterIcon from "../common/CharacterIcon.svelte";
  import CheckItem from "./CheckItem.svelte";

  const { errors, warnings, infos } = $derived.by(() => ({
    errors: checksState.errors.filter(
      (result) => !globalState.ui.ignoredChecks.includes(result.id),
    ),
    warnings: checksState.warnings.filter(
      (result) => !globalState.ui.ignoredChecks.includes(result.id),
    ),
    infos: checksState.infos.filter(
      (result) => !globalState.ui.ignoredChecks.includes(result.id),
    ),
  }));

  const total = $derived(errors.length + warnings.length + infos.length);
</script>

<div>
  <p class="checks-about-list">
    <button
      type="button"
      class="link-button"
      onclick={() => {
        globalState.ui.screen = "checks:about";
        globalState.ui.prevScreen = "checks";
      }}
      data-umami-event="checks-about">About checks</button
    >
    {#if globalState.ui.ignoredChecks.length > 0}
      <button
        type="button"
        class="link-button"
        onclick={() => (globalState.ui.ignoredChecks = [])}
        data-umami-event="checks-reenable">Re-enable all checks</button
      >
    {/if}
  </p>

  {#if checksState.didError}
    <div class="checks-list info-area">
      <CharacterIcon
        character={{ id: "goblin", name: "", team: "minion", ability: "" }}
        class="info-area-icon slow-spin"
      />
      <p>Something went wrong while running checks for this script.</p>
    </div>
  {:else if total === 0}
    {#if checksState.loading}
      <div class="checks-list info-area">
        <CharacterIcon
          character={{
            id: "nightwatchman",
            name: "",
            team: "townsfolk",
            ability: "",
          }}
          class="info-area-icon slow-spin"
        />
        <p>Running checks...</p>
      </div>
    {:else}
      <div class="checks-list info-area">
        <CharacterIcon
          character={{
            id: "professor",
            name: "",
            team: "townsfolk",
            ability: "",
          }}
          class="info-area-icon slow-spin"
        />
        <p>All checks passed!</p>
        <p>
          This does not necessarily mean your script is ready to play. There may
          still be interactions that have undesirable consequences.
        </p>
      </div>
    {/if}
  {:else}
    <ul class="checks-list">
      {#each errors as result}
        <li class="check-item"><CheckItem {result} /></li>
      {/each}
      {#each warnings as result}
        <li class="check-item"><CheckItem {result} /></li>
      {/each}
      {#each infos as result}
        <li class="check-item"><CheckItem {result} /></li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .checks-about-list {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem;
  }

  .checks-list {
    overflow-y: auto;
    list-style: none;
    padding-inline-start: 0;
  }

  .info-area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    margin: 0.5rem;

    :global(.info-area-icon) {
      width: 128px;
    }
  }
</style>

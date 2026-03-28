<script lang="ts">
  import { getScriptFromScriptSettings } from "../../../lib/client/builder/state";
  import { listScripts } from "../../../lib/client/storage/builder";
  import { compressToBase64, stringToBytes } from "../../../lib/compression";

  interface Props {}

  const {}: Props = $props();

  const dateFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  let listPromise = $state(
    listScripts().then((scripts) =>
      Promise.all(
        scripts.map(async (script) => {
          const scriptValue = getScriptFromScriptSettings(script.script);
          const json = JSON.stringify(scriptValue);
          const rawScriptBytes = stringToBytes(json);
          const rawScriptB64 = await compressToBase64(
            rawScriptBytes,
            "gzip",
            false,
          );
          const scriptBuilderUrl = `https://script.bloodontheclocktower.com/?script=${encodeURIComponent(rawScriptB64)}`;

          return {
            id: script.id,
            name: script.script.meta.name,
            url: scriptBuilderUrl,
            author: script.script.meta.author,
            lastUpdated: script.updatedTimestamp,
          };
        }),
      ),
    ),
  );
</script>

{#await listPromise}
  <p>Loading...</p>
{:then scriptList}
  {#if scriptList.length > 0}
    <ul class="script-list">
      {#each scriptList as savedScript}
        {@const scriptTitle = savedScript.name || "Untitled script"}
        <li class="script-list-item">
          <a
            href={savedScript.url}
            class="icon-button script-button"
            data-umami-event="script-builder-migrate"
          >
            <strong class={["title", !savedScript.name && "no-title"]}
              >{scriptTitle}</strong
            >
            {#if savedScript.author}
              <span>by {savedScript.author}</span>
            {/if}
            <p>
              <span class="date"
                >Last updated: {dateFormat.format(
                  savedScript.lastUpdated,
                )}</span
              >
            </p>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No saved scripts.</p>
  {/if}
{:catch}
  <p>Unable to get list of saved scripts.</p>
{/await}

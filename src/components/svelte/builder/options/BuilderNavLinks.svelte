<script lang="ts">
  import { getAbortSignal } from "svelte";
  import type { BloodOnTheClocktowerCustomScript } from "../../../../generated/script-schema";
  import { delay } from "../../../../lib/builder/util/async";
  import {
    getScriptFromScriptSettings,
    scriptState,
  } from "../../../../lib/client/builder/state";
  import { compressToBase64, stringToBytes } from "../../../../lib/compression";
  import { LinkExternal } from "svelte-codicons";

  let rawScript = $state<BloodOnTheClocktowerCustomScript>([]);

  $effect(() => {
    const signal = getAbortSignal();
    const scriptSnapshot = $state.snapshot(scriptState);

    delay(100, signal).then(() => {
      rawScript = getScriptFromScriptSettings(scriptSnapshot);
    });
  });

  function downloadScript() {
    const script = getScriptFromScriptSettings(scriptState);
    const scriptFilename = `${(scriptState.meta.name || "script").replace(/[\\/:*?"<>|]+/g, "_")}.json`;

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

  async function openInOfficialScriptEditor() {
    const script = getScriptFromScriptSettings(scriptState);
    const jsonString = JSON.stringify(script);
    const bytes = stringToBytes(jsonString);
    const b64 = await compressToBase64(bytes, "gzip", false);

    const url = `https://script.bloodontheclocktower.com/?script=${encodeURIComponent(b64)}`;
    window.open(url, "_blank");
  }
</script>

<ul class="nav-links">
  <li>
    <button
      type="button"
      class="link-button"
      onclick={downloadScript}
      data-umami-event="script-export-json">Download JSON</button
    >
  </li>
  <li>
    <form action="/go" method="post" enctype="multipart/form-data">
      <input type="hidden" name="script" value={JSON.stringify(rawScript)} />
      <button type="submit" class="link-button">Preview & Print</button>
    </form>
  </li>
  <li>
    <button
      type="button"
      class="link-button"
      onclick={openInOfficialScriptEditor}
      data-umami-event="script-open-official-builder"
      >Open in official script tool <LinkExternal class="inline-icon" /></button
    >
  </li>
</ul>

<style>
  .nav-links {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-inline-start: 0;
    gap: 0.5rem;
    list-style: none;
  }
</style>

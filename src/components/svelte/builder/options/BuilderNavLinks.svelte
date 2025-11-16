<script lang="ts">
  import { getAbortSignal } from "svelte";
  import type { BloodOnTheClocktowerCustomScript } from "../../../../generated/script-schema";
  import { getScriptFromState } from "../../../../lib/builder/state-helper";
  import { globalState } from "../../../../lib/builder/state.svelte";
  import { delay } from "../../../../lib/builder/util/async";

  let rawScript = $state<BloodOnTheClocktowerCustomScript>([]);

  $effect(() => {
    const signal = getAbortSignal();

    // Reference globalState eagerly so compiler knows to make it a dependency of this effect.
    $state.snapshot(globalState);

    delay(100, signal).then(() => {
      rawScript = getScriptFromState(globalState);
    });
  });

  function downloadScript() {
    const script = getScriptFromState(globalState);
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
</ul>

<style>
  .nav-links {
    display: flex;
    flex-direction: row;
    padding-inline-start: 0;
    gap: 0.5rem;
    list-style: none;
  }
</style>

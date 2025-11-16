<svelte:options runes />

<script lang="ts">
  import { onMount } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { createPortal, portal } from "../../../lib/builder/portal";
  import { initialiseScriptBuilderState } from "../../../lib/client/builder/state/init";
  import LoadingLayout from "../common/LoadingLayout.svelte";
  import StateListeners from "./common/StateListeners.svelte";
  import DesktopLayout from "./layouts/DesktopLayout.svelte";
  import MobileLayout from "./layouts/MobileLayout.svelte";
  import TabletLayout from "./layouts/TabletLayout.svelte";
  import BuilderNavLinks from "./options/BuilderNavLinks.svelte";
  import AboutChecks from "./checks/AboutChecks.svelte";
  import ChecksDrawer from "./checks/ChecksDrawer.svelte";
  import ImportForm from "./switcher/ImportForm.svelte";
  import ScriptSwitcher from "./switcher/ScriptSwitcher.svelte";
  import CheckItem from "./checks/CheckItem.svelte";
  import ChecksList from "./checks/ChecksList.svelte";

  const large = new MediaQuery("min-width: 960px");
  const medium = new MediaQuery("min-width: 600px");

  let isLoaded = $state(false);

  // Load script from HTML body if needed
  onMount(() => {
    initialiseScriptBuilderState().then(() => {
      isLoaded = true;
    });
  });

  // Set up navigation bar
  onMount(() => {
    createPortal(
      document.querySelector("#top-nav-links-container")!,
      "top-nav-links-container",
    );
  });
</script>

{#snippet preload()}
  <AboutChecks />
  <ChecksDrawer />
  <ChecksList />
  <CheckItem
    result={{
      id: "test",
      description: "ok",
      level: "info",
      actions: [{ type: "add-character", id: "lunatic" }],
      remarks: [""],
    }}
  />
  <ImportForm />
  <ScriptSwitcher />
{/snippet}

<LoadingLayout character="lunatic" {isLoaded} {preload}>
  {#if large.current}
    <DesktopLayout />
  {:else if medium.current}
    <TabletLayout />
  {:else}
    <MobileLayout />
  {/if}
</LoadingLayout>

<div use:portal={"top-nav-links-container"}>
  <BuilderNavLinks />
</div>

{#if isLoaded}
  <StateListeners />
{/if}

<span class="marker"></span>

<style>
  :global(body):has(.marker) {
    max-height: 100vh;
    max-height: 100dvh;

    > :global(.container) {
      display: contents;
    }

    :global(main) {
      flex-grow: 1;
    }
  }

  .marker {
    display: none;
  }
</style>

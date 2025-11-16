<script lang="ts">
  import {
    ArrowSwap,
    LightbulbEmpty,
    MapVertical,
    PersonAdd,
    Search,
    SearchFuzzy,
    SearchSparkle,
    Settings,
    type SvgComponent,
  } from "svelte-codicons";
  import {
    appState,
    scriptState,
    sessionState,
  } from "../../../../lib/client/builder/state";
  import type {
    AppScreen,
    BuilderAppSettingsLatest,
  } from "../../../../lib/client/builder/state/types";

  interface PageInfo {
    title: string;
    icon: typeof SvgComponent;
  }

  interface Props {
    pages: AppScreen[];
  }

  const PAGE_DATA: Record<AppScreen, PageInfo> = {
    script: { title: "Script", icon: MapVertical },
    options: { title: "Options", icon: Settings },
    checks: { title: "Checks", icon: Search },
    "checks:about": { title: "About checks", icon: LightbulbEmpty },
    "select-characters": { title: "Roles", icon: PersonAdd },
    switcher: { title: "Switch", icon: ArrowSwap },
    "switcher:import": { title: "Switch", icon: ArrowSwap },
  };

  function setScreenHandler(screen: AppScreen) {
    return () => {
      appState.screen.current = screen;
      appState.screen.previous = undefined;
    };
  }

  const { pages }: Props = $props();

  const checksData = $derived.by(() => {
    const allResults = [
      ...sessionState.checks.errors,
      ...sessionState.checks.warnings,
      ...sessionState.checks.infos,
    ].filter((result) => !scriptState.ignoredChecks.includes(result.id));
    const hasResults = allResults.length > 0;

    for (const result of allResults) {
      if (result.actions && result.actions.length > 0) {
        return { hasResults, hasFixes: true };
      }
    }

    return { hasResults, hasFixes: false };
  });
</script>

<nav>
  <ul class="nav-list">
    {#each pages as page}
      {#if page !== "checks" || appState.checks.enabled}
        {@const IconComponent = PAGE_DATA[page].icon}
        <li class="nav-item">
          <button
            type="button"
            class={[
              "nav-button",
              appState.screen.current.startsWith(page) && "current",
            ]}
            onclick={setScreenHandler(page)}
            data-umami-event="nav-button"
            data-umami-event-screen={page}
          >
            <span
              >{#if page === "checks"}
                {#if checksData.hasFixes}
                  <SearchSparkle width={24} height={24} />
                {:else if checksData.hasResults}
                  <SearchFuzzy width={24} height={24} />
                {:else}
                  <IconComponent width={24} height={24} />
                {/if}
              {:else}
                <IconComponent width={24} height={24} />
              {/if}</span
            >
            <span>{PAGE_DATA[page].title}</span>
          </button>
        </li>
      {/if}
    {/each}
  </ul>
</nav>

<style>
  .nav-list {
    display: flex;
    list-style: none;
    padding: 0.2rem;

    justify-content: space-around;
    justify-content: space-evenly;
    gap: 0.2em;

    border-block-start: 2px solid var(--color-control-border-hover);
  }

  .nav-item {
    flex-grow: 1;
    display: block;
  }

  .nav-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0.2rem;

    border-radius: var(--border-radius);
    border: 2px solid var(--color-control-border-active);
    background-color: var(--color-control-background-active);

    &.current {
      background-color: var(--color-control-background);
      border: 2px solid var(--color-control-border-active);
    }
  }
</style>

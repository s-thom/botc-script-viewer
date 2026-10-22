<script lang="ts">
  import type { PrintData } from "../../lib/print/data";
  import CharacterEntry from "./CharacterEntry.svelte";
  import FitBox from "./FitBox.svelte";
  import TeamSection from "./TeamSection.svelte";
  import { PRINT_TEAM_STRING_KEYS } from "../../lib/print/data";

  interface Props {
    data: PrintData;
    showJinxes: boolean;
    deps: unknown;
    overflowing: boolean;
  }

  let { data, showJinxes, deps, overflowing = $bindable() }: Props = $props();
</script>

<FitBox {deps} bind:overflowing>
  {#each ["traveller", "fabled", "loric"] as const as team (team)}
    <TeamSection
      {team}
      heading={data.strings[PRINT_TEAM_STRING_KEYS[team]]}
      characters={data.teams[team]}
    />
  {/each}

  {#if data.bootlegger.length > 0}
    <section class="section">
      <div class="columns">
        {#each data.bootlegger as rule, i (i)}
          <CharacterEntry icon={rule.icon} name="" text={rule.text} />
        {/each}
      </div>
    </section>
  {/if}

  {#if showJinxes && data.jinxes.length > 0}
    <section class="section">
      <h2 class="heading">{data.strings["app.tabs.character.jinxes"]}</h2>
      <div class="columns">
        {#each data.jinxes as jinx, i (i)}
          <CharacterEntry
            icon={jinx.icons[0]}
            extraIcons={jinx.icons.slice(1)}
            name={jinx.names}
            text={jinx.reason}
          />
        {/each}
      </div>
    </section>
  {/if}
</FitBox>

<style>
  .section {
    margin-block-end: 0.6em;
  }

  .heading {
    font-family: var(--print-title-font);
    font-size: 1.5em;
    font-weight: 400;
    line-height: 1.1;
    margin: 0 0 0.3em;
    border-block-end: 0.08em solid currentColor;
  }

  .columns {
    columns: 2;
    column-gap: 1.2em;
  }
</style>

<script lang="ts">
  import type { PrintData, PrintTeamId } from "../../lib/print/data";
  import { PRINT_TEAM_STRING_KEYS } from "../../lib/print/data";
  import FitBox from "./FitBox.svelte";
  import SheetHeader from "./SheetHeader.svelte";
  import TeamSection from "./TeamSection.svelte";

  interface Props {
    data: PrintData;
    teams: PrintTeamId[];
    deps: unknown;
    overflowing: boolean;
  }

  let { data, teams, deps, overflowing = $bindable() }: Props = $props();
</script>

<FitBox {deps} bind:overflowing>
  <SheetHeader title={data.title} subtitle={data.author} />
  {#each teams as team (team)}
    <TeamSection
      {team}
      heading={data.strings[PRINT_TEAM_STRING_KEYS[team]]}
      characters={data.teams[team]}
    />
  {/each}
</FitBox>

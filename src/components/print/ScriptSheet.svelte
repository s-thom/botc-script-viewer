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

<div class="strip"></div>
<FitBox {deps} bind:overflowing class="script-fit">
  <SheetHeader title={data.title} subtitle={data.author} />
  {#each teams as team (team)}
    <TeamSection
      {team}
      heading={data.strings[PRINT_TEAM_STRING_KEYS[team]]}
      characters={data.teams[team]}
      sideLabel
    />
  {/each}
</FitBox>

<style>
  .strip {
    display: none;
  }

  :global(.sheet.fancy) :is(.strip, :global(.script-fit)) {
    --strip-width: 14mm;
    --strip-gap: 5mm;
  }

  :global(.sheet.fancy) .strip {
    display: block;
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: var(--strip-width);
    background: url("../../assets/header-ferns.webp")
      var(--color-header-background);
    background-blend-mode: multiply;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /*
   * The sheet pads by 12mm, and the fit box clips its overflow. Extend the box
   * over that padding so the side labels fall inside it, then pad the content
   * clear of the strip.
   */
  :global(.sheet.fancy .script-fit) {
    box-sizing: border-box;
    margin-inline-start: -12mm;
    width: calc(100% + 12mm);
    padding-inline-start: calc(var(--strip-width) + var(--strip-gap));
  }
</style>

<script lang="ts">
  import type { PrintData, PrintTeamId } from "../../lib/print/data";
  import { PRINT_TEAM_STRING_KEYS } from "../../lib/print/data";
  import FitBox from "./FitBox.svelte";
  import PrintCharacterList from "./PrintCharacterList.svelte";

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
  <header class={["header"]}>
    {#if data.iconUrl}
      <img class="logo" src={data.iconUrl} alt={data.title} />
    {/if}
    <div class="header-content">
      <h1 class="title">{data.title}</h1>
      {#if data.author}
        <p class="subtitle">{data.author}</p>
      {/if}
    </div>
  </header>

  {#each teams as team (team)}
    <PrintCharacterList
      {team}
      heading={data.strings[PRINT_TEAM_STRING_KEYS[team]]}
      characters={data.teams[team]}
      sideLabel
    />
  {/each}

  <div class="footer">
    <span>{data.strings["viewer.print.footer.copyright"]}</span>
    <span>{data.strings["script.print.not-first-night"]}</span>
  </div>
</FitBox>

<style>
  .strip {
    display: none;
  }

  :global(.sheet.fancy) :is(.strip, :global(.script-fit)) {
    --strip-width: 14mm;
    --strip-edge-width: 1.5mm;
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
    box-shadow: 0 0 5mm rgba(0, 0, 0, 0.8);
    background-size: var(--print-background-size);

    &::before {
      content: " ";
      display: block;
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: calc(var(--strip-width) + var(--strip-edge-width));
      background: url("../../assets/header-ferns.webp")
        var(--color-header-background-edge);
      background-blend-mode: multiply;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      clip-path: rect(0 100% 100% var(--strip-width));
      background-size: var(--print-background-size);
    }
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

  .header {
    flex-shrink: 0;
    margin-block-end: 0.8em;

    :global(.sheet.fancy) & {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }

  .logo {
    display: none;
    max-width: 5em;
    max-height: 5em;

    :global(.sheet.fancy) & {
      display: block;
    }
  }

  .header-content {
    flex-shrink: 0;
  }

  .title {
    font-family: var(--print-title-font);
    font-size: 2.2em;
    font-weight: 400;
    line-height: 1;
    margin: 0;
  }

  .subtitle {
    margin: 0.2em 0 0;
    font-size: 1.2em;
  }

  :global(.sheet.plain) .header {
    border-block-end: 0.15em solid currentColor;
    padding-block-end: 0.3em;
  }

  :global(.sheet.fancy) .header {
    text-align: center;
    color: var(--color-script, #000);
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  :global(.sheet.fancy) .header .title {
    font-size: 3em;
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    :global(.sheet.fancy) & {
      width: calc(100% - 20mm);
    }
  }
</style>

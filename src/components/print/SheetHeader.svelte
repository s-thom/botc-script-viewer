<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    /** Larger title with the decorative banner. Only has an effect in the fancy style. */
    large?: boolean;
  }

  let { title, subtitle, large = false }: Props = $props();
</script>

<header class={["header", { large }]}>
  <h1 class="title">{title}</h1>
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
</header>

<style>
  .header {
    flex-shrink: 0;
    margin-block-end: 0.8em;
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

  /* Plain: a simple title with a rule underneath. */
  :global(.sheet.plain) .header {
    border-block-end: 0.15em solid currentColor;
    padding-block-end: 0.3em;
  }

  /* Fancy: the banner from the site header, with a ragged lower edge. */
  :global(.sheet.fancy) .header {
    margin: -12mm -12mm 0.8em;
    padding: 9mm 12mm 11mm;
    text-align: center;
    color: var(--color-header-text);
    background: url("../../assets/header-ferns.webp")
      var(--color-header-background);
    background-blend-mode: multiply;
    clip-path: polygon(
      0 0,
      0 100%,
      17% calc(100% - 3mm),
      38% calc(100% - 1mm),
      50% calc(100% - 3.5mm),
      71% calc(100% - 1.5mm),
      87% calc(100% - 2.5mm),
      100% calc(100% - 1mm),
      100% 0
    );
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  :global(.sheet.fancy) .header.large .title {
    font-size: 3em;
  }
</style>

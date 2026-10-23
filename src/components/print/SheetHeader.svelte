<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
  }

  let { title, subtitle }: Props = $props();
</script>

<header class={["header"]}>
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
</style>

<script lang="ts">
  import { GithubAlt } from "svelte-codicons";
</script>

<div class="footer-space"></div>
<footer class="footer">
  <p>
    This website is not affiliated with The Pandemonium Institute. Characters
    are the property of Steven Medway and The Pandemonium Institute.
  </p>
  <p>
    Website made by{" "}
    <a
      href="https://sthom.kiwi"
      target="_blank"
      rel="external noreferrer"
      data-umami-event="sthom-link"
      ><span class="lizard">𓆈</span> Stuart Thomson</a
    >.
    <a
      href="https://github.com/s-thom/botc-script-builder"
      target="_blank"
      rel="external noreferrer"
      data-umami-event="github-link"
      ><GithubAlt class="inline-icon" /> Source code</a
    >.
  </p>
</footer>

<style>
  .footer-space {
    flex-grow: 1;
  }

  .footer {
    opacity: 0.7;
    font-size: 0.9rem;
    margin-block-start: 2rem;
  }

  .lizard {
    vertical-align: sub;
  }
</style>

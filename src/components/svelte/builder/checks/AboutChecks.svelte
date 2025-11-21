<script lang="ts">
  import {
    Error,
    Info,
    Search,
    SearchFuzzy,
    SearchSparkle,
    Wand,
    Warning,
  } from "svelte-codicons";
  import { navigatePopScreen } from "../../../../lib/client/builder/state";
</script>

<div class="top-links-list">
  <button
    type="button"
    class="back-link link-button"
    data-umami-event="checks-about-back"
    onclick={() => navigatePopScreen()}>Back</button
  >
</div>
<div class="flow">
  <h2>About checks</h2>
  <p>
    This script builder runs a series of small checks on your script as you are
    building it. They're meant to help build a solid foundation for the script.
  </p>
  <p>
    These checks are based on common storytelling advice, such as including
    drunkenness/poisoning and modifications to the outsider count. There are
    other more specific ones too, such as making sure the Damsel is on the
    script if the Huntsman is added.
  </p>
  <p>
    Some of the checks will have actions that can be taken. These usually come
    in the form of adding another character to the script. These are indicated
    by a magic wand icon at the end of the description.
  </p>
  <p>
    If you find any of these checks getting in your way, you can ignore each of
    them by selecting the ignore button at the end of each line. If you need to
    restore any of them, you can select the "Re-enable all checks" option. If
    you instead want to prevent all checks from running, you can uncheck the
    "Enable checks" option in the app options.
  </p>

  <h3>What do the different levels mean?</h3>
  <p>Checks can either be errors, warnings, or informational.</p>
  <ul>
    <li>
      The <span class="level-example level-error"
        ><Error class="inline-icon"><title>Error</title></Error> error</span
      > level is used for issues that are likely to prevent the script from being
      playable.
    </li>
    <li>
      The <span class="level-example level-warning"
        ><Warning class="inline-icon"><title>Warning</title></Warning> warning</span
      > level is used for issues that won't stop the game from being played, but
      might need some consideration.
    </li>
    <li>
      The <span class="level-example level-info"
        ><Info class="inline-icon"><title>Info</title></Info> info</span
      > level is used for any information that isn't critical or shouldn't have much
      impact on the script.
    </li>
  </ul>

  <h3>Why is the magnifying glass icon different?</h3>
  <p>The magnifying glass icon changes based on the results of the checks.</p>
  <ul>
    <li>
      If all checks pass, then a plain <Search class="inline-icon"
        ><title>No issues</title></Search
      > magnifying glass will be used.
    </li>
    <li>
      If an issue was found, then there will be a <SearchFuzzy
        class="inline-icon"><title>Issues</title></SearchFuzzy
      > squiggly line under the magnifying glass.
    </li>
    <li>
      If any of the issues found have an action that can be taken (e.g. adding a
      character to the script), then there will be <SearchSparkle
        class="inline-icon"><title>Issues with actions</title></SearchSparkle
      > sparkles on the magnifying glass. These issues will have a <Wand
        class="inline-icon"><title>Has actions</title></Wand
      > magic wand at the end of their description.
    </li>
  </ul>

  <h3>Does having errors or warnings mean that the script is bad?</h3>
  <p>Absolutely not.</p>
  <p>
    While making the checks, I tested against well-known and popular scripts.
    Some of the scripts would have warnings from these checks. These checks
    don't take any external context into account. The only thing capable of
    truly judging a script are the players and storytellers.
  </p>

  <h3>Does having all of the checks pass mean the script is good?</h3>
  <p>
    Again, the only judges of a good script are players and storytellers. You
    can build scripts that pass every check on this site, but are not fun to
    actually play. Your judgement as a script builder is still necessary.
  </p>
</div>

<style>
  .top-links-list {
    display: flex;
    justify-content: space-between;
    margin-block-start: 0.5rem;
    margin-block-end: 1rem;
  }

  .back-link {
    font-size: 1rem;
  }

  .level-example {
    display: inline-block;
    padding-inline: 0.2rem;
    border: 1px solid var(--color-level-border);
    background-color: var(--color-level-background);
  }
</style>

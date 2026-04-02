# i18n

Custom translation library for vue-i18n/intlify locale files.

## Basic usage

```astro
---
import { createTranslator } from "../lib/i18n";
const t = createTranslator({ locale: Astro.currentLocale ?? "en" });
---
<h1>{t("script.keyword.player", { count: 1 })}</h1>
```

`t(key, params?)` always returns `MessageSegment[]`. Use `<FormattedMessage>` to render it.

## Plurals

Pipe-delimited: `"Player|Players"`. Pass `count` and it selects the right form.

```ts
t("script.keyword.player", { count: 5 }) // → "Players"
```

Two forms use `count === 1` for singular. Three or more use `Intl.PluralRules`.

## Variables

`{name}` and `{0}` are substituted from params. Missing variables are preserved as-is (`{name}`) for debugging.

```ts
t("script.analysis.maximum-character-recommendation", { number: 25 })
// → "The recommended maximum number of characters is 25."
```

`{n}` and `{count}` are automatically populated from the `count` param.

## Rendering

Always use `<FormattedMessage>` to render. Unknown tags fall back to rendering their inner content.

```astro
---
import FormattedMessage from "../components/misc/FormattedMessage.astro";
const segments = t("script.tour.welcome-01");
---
<FormattedMessage {segments} params={{}} />
```

`FormattedMessage` accepts an optional `character` prop forwarded to `FormattedDescription` for each text node.

## Missing keys

Returns the key string as-is. Logs a `console.warn` in dev.

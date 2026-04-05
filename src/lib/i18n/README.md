# i18n

Custom translation library for vue-i18n/intlify locale files.

## Basic Astro usage

```astro
---
import LocalisedMessage from "../components/i18n/LocalisedMessage.astro";
---

<LocalisedMessage t={t} key="script.keyword.player" params={{ count: 1 }} />
```

## Basic script usage

```astro
---
import { createTranslator } from "../lib/i18n";
const t = createTranslator({ locale: Astro.currentLocale ?? "en" });
---

<h1>{t("script.keyword.player", { count: 1 }).value}</h1>
```

`t(key, params?)` returns `TranslateResult<MessageSegment[]>` — a `{ value, fallbackLocale? }` wrapper. Use `<MessageSegments>` to render the segments.

## Translator methods

| Method | Returns | Notes |
|---|---|---|
| `t(key, params?)` | `TranslateResult<MessageSegment[]>` | Main entry point |
| `t.string(key, params?)` | `TranslateResult<string>` | Plain text, tags stripped |
| `t.resolve(key, ignoreMissing?)` | `TranslateResult<string \| undefined>` | Raw string lookup, no processing |
| `t.raw(raw, params?)` | `MessageSegment[]` | Parse an arbitrary string directly |
| `t.rawString(raw, params?)` | `string` | Parse and flatten to plain text |
| `t.locale` | `string` | The locale this translator was created for |

`fallbackLocale` is set when the key was found in a fallback locale rather than the primary one.

## Plurals

Pipe-delimited: `"Player|Players"`. Pass `count` and it selects the right form.

```ts
t("script.keyword.player", { count: 5 }).value // → [{ type: "text", value: "Players" }]
```

Two forms use `count === 1` for singular. Three or more use `Intl.PluralRules`.

## Variables

`{name}` and `{0}` are substituted from params. Missing variables are preserved as-is (`{name}`) for debugging.

`{n}` and `{count}` are automatically populated from the `count` param.

## Rendering from segments

Use `<MessageSegments>` to render segments. Unknown tags fall back to their inner content.

```astro
---
import MessageSegments from "../components/i18n/MessageSegments.astro";
const { value: segments } = t("script.tour.welcome-01");
---

<MessageSegments {segments} params={{}} />
```

## Missing keys

Returns the key as a single text segment. Logs a `console.warn` in dev.

## `TranslateParams` options

| Param | Type | Notes |
|---|---|---|
| `count` | `number` | Selects plural form; also populates `{n}` and `{count}` |
| `fallback` | `string` | Raw string to use if key is missing |
| `formatReplacements` | `boolean` | Converts `:reminder:`, `[Setup text]`, and `*emphasis*` to tag segments |
| `...rest` | `unknown` | Variable substitutions |

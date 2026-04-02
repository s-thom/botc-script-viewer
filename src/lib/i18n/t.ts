import { LOCALE_MAP } from "./config.ts";
import { formatToPlainText, resolveVariables } from "./format.ts";
import { parseMessage } from "./parse.ts";
import { isPluralMessage, selectPluralForm } from "./plural.ts";
import { resolveKey } from "./resolve.ts";
import type { MessageSegment, TranslateParams, Translator } from "./types.ts";

export function createTranslator({ locale }: { locale: string }): Translator {
  if (!(locale in LOCALE_MAP)) {
    throw new Error(`Unknown locale ${locale}`);
  }

  const knownLocale = locale as keyof typeof LOCALE_MAP;

  const resolver = function t(
    key: string,
    params: TranslateParams = {},
  ): MessageSegment[] {
    const raw = resolveKey(knownLocale, key);

    if (raw === undefined) {
      if (import.meta.env?.DEV) {
        console.warn(
          `[i18n] Missing translation key: "${key}" for locale "${locale}"`,
        );
      }
      return [{ type: "text", value: key }];
    }

    const { count } = params;

    let selected = raw;
    if (count !== undefined && isPluralMessage(raw)) {
      selected = selectPluralForm(raw, count, locale);
    }

    const fullParams: TranslateParams = {
      n: count,
      count,
      ...params,
    };

    return resolveVariables(parseMessage(selected), fullParams);
  };

  const t = Object.assign(resolver, {
    string: (key: string, params: TranslateParams = {}) =>
      formatToPlainText(resolver(key, params)),
  });

  return t;
}

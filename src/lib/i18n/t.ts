import type { LocaleIds } from "./config.ts";
import { resolveVariables } from "./format.ts";
import { parseMessage } from "./parse.ts";
import { isPluralMessage, selectPluralForm } from "./plural.ts";
import { resolveKey } from "./resolve.ts";
import type { MessageSegment, TranslateParams, Translator } from "./types.ts";

export function createTranslator({
  locale,
}: {
  locale: LocaleIds;
}): Translator {
  return function t(
    key: string,
    params: TranslateParams = {},
  ): MessageSegment[] {
    const raw = resolveKey(locale, key);

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
}

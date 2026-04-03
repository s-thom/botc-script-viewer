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

  const segmenter = (raw: string, params: TranslateParams = {}) => {
    const { count, formatReplacements } = params;

    let selected = raw;
    if (count !== undefined && isPluralMessage(raw)) {
      selected = selectPluralForm(raw, count, locale);
    }

    if (formatReplacements) {
      selected = selected
        .replace(/:reminder:/g, "{reminder}:reminder:{/reminder}")
        .replace(/(\[.*\])/g, "{bold}$1{/bold}")
        .replace(/(\s)\*(.*?)\*/g, "$1{bold}$2{/bold}");
    }

    const unresolvedSegments = parseMessage(selected);
    return resolveVariables(unresolvedSegments, params);
  };

  const resolver = (
    key: string,
    ignoreMissing?: boolean,
  ): string | undefined => {
    const value = resolveKey(knownLocale, key);

    if (value === undefined) {
      if (ignoreMissing) {
        return undefined;
      }

      if (import.meta.env?.DEV) {
        console.warn(
          `[i18n] Missing translation key: "${key}" for locale "${locale}"`,
        );
      }

      return undefined;
    }

    return value;
  };

  const full = function t(
    key: string,
    params: TranslateParams = {},
  ): MessageSegment[] {
    let value = resolver(key);

    if (value === undefined) {
      if (params.fallback) {
        value = params.fallback;
      } else {
        return [{ type: "text", value: key }];
      }
    }

    const { count } = params;

    const fullParams: TranslateParams = {
      n: count,
      count,
      ...params,
    };
    return segmenter(value, fullParams);
  };

  const t = Object.assign(full, {
    locale,
    resolve: resolver,
    string: (key: string, params: TranslateParams = {}) =>
      formatToPlainText(full(key, params)),
    raw: segmenter,
    rawString: (raw: string, params: TranslateParams = {}) =>
      formatToPlainText(segmenter(raw, params)),
  });

  return t;
}

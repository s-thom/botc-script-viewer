import { AppError } from "../../types/site.ts";
import { LOCALE_MAP, type LocaleIds } from "./config.ts";
import { formatToPlainText, resolveVariables } from "./format.ts";
import { LANGUAGE_DATA } from "./languages.ts";
import { parseMessage } from "./parse.ts";
import { isPluralMessage, selectPluralForm } from "./plural.ts";
import { resolveKey } from "./resolve.ts";
import type {
  LocaleData,
  MessageSegment,
  TranslateParams,
  TranslateResult,
  Translator,
} from "./types.ts";

export async function createTranslator({
  locale,
}: {
  locale: string;
}): Promise<Translator> {
  if (!(locale in LOCALE_MAP)) {
    throw new AppError(`Unknown locale ${locale}`, {
      status: 400,
      titleKey: "viewer.errors.unknownLocale",
      descriptionKey: "viewer.errors.unknownLocaleDescription",
      descriptionParams: { locale },
    });
  }

  const knownLocale = locale as keyof typeof LOCALE_MAP;
  const localeInfo = LOCALE_MAP[knownLocale];
  const standardLocale = localeInfo.standardId ?? knownLocale;

  const locales: Partial<Record<LocaleIds, LocaleData>> = {};
  locales[knownLocale] = await LANGUAGE_DATA[knownLocale]();
  for (const fallback of localeInfo.fallbacks) {
    locales[fallback] = await LANGUAGE_DATA[fallback]();
  }

  const segmenter = (raw: string, params: TranslateParams = {}) => {
    const { count, formatReplacements } = params;

    let selected = raw;
    if (count !== undefined && isPluralMessage(raw)) {
      selected = selectPluralForm(raw, count, standardLocale);
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
  ): TranslateResult<string | undefined> => {
    const result = resolveKey(knownLocale, key, locales);

    if (result.value === undefined) {
      if (!ignoreMissing && import.meta.env?.DEV) {
        console.warn(
          `[i18n] Missing translation key: "${key}" for locale "${locale}"`,
        );
      }
    }

    return result;
  };

  const combined = function t(
    key: string,
    params: TranslateParams = {},
  ): TranslateResult<MessageSegment[]> {
    const result = resolver(key);
    let value = result.value;
    const fallbackLocale = result.fallbackLocale;

    if (value === undefined) {
      if (params.fallback) {
        value = params.fallback;
      } else {
        return { value: [{ type: "text", value: key }], fallbackLocale };
      }
    }

    const fullParams: TranslateParams = {
      n: params.count,
      ...params,
    };
    const segments = segmenter(value, fullParams);
    return { value: segments, fallbackLocale };
  };

  const t = Object.assign(combined, {
    locale,
    resolve: resolver,
    string: (
      key: string,
      params: TranslateParams = {},
    ): TranslateResult<string> => {
      const result = combined(key, params);
      const str = formatToPlainText(result.value);

      return { value: str, fallbackLocale: result.fallbackLocale };
    },
    raw: segmenter,
    rawString: (raw: string, params: TranslateParams = {}): string => {
      const segments = segmenter(raw, params);
      const str = formatToPlainText(segments);

      return str;
    },
  });

  return t;
}

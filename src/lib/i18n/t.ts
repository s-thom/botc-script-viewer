import type { LocaleIds } from "./config.ts";
import { formatMessage, resolveVariables } from "./format.ts";
import { parseMessage } from "./parse.ts";
import { isPluralMessage, selectPluralForm } from "./plural.ts";
import { resolveKey } from "./resolve.ts";
import type { MessageSegment, TranslateParams } from "./types.ts";

function hasTagSegments(segments: MessageSegment[]): boolean {
  return segments.some((seg) => seg.type === "tag");
}

export function createTranslator({ locale }: { locale: LocaleIds }) {
  return function t(
    key: string,
    params: TranslateParams = {},
  ): string | MessageSegment[] {
    const raw = resolveKey(locale, key);

    if (raw === undefined) {
      if (import.meta.env?.DEV) {
        console.warn(
          `[i18n] Missing translation key: "${key}" for locale "${locale}"`,
        );
      }
      return key;
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

    const segments = parseMessage(selected);

    if (hasTagSegments(segments)) {
      return resolveVariables(segments, fullParams);
    }

    return formatMessage(segments, fullParams);
  };
}

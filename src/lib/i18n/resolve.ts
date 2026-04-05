import { LOCALE_MAP, type LocaleIds } from "./config.ts";
import { LANGUAGE_DATA } from "./languages.ts";
import type { TranslateResult } from "./types.ts";

function walkPath(
  obj: Record<string, unknown>,
  path: string[],
): string | undefined {
  let current: unknown = obj;
  for (const segment of path) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === "string" ? current : undefined;
}

export function resolveKey(
  locale: LocaleIds,
  key: string,
): TranslateResult<string | undefined> {
  const [ns, ...path] = key.split(".");

  const tryLocale = (loc: LocaleIds): string | undefined => {
    const data = LANGUAGE_DATA[loc];
    if (!data) {
      return undefined;
    }
    if (!(ns in data)) {
      return undefined;
    }

    return walkPath(data[ns as keyof typeof data], path);
  };

  const direct = tryLocale(locale);
  if (direct !== undefined) {
    return { value: direct };
  }

  for (const fallback of LOCALE_MAP[locale].fallbacks) {
    const result = tryLocale(fallback);
    if (result !== undefined) {
      return { value: result, fallbackLocale: fallback };
    }
  }

  return { value: undefined };
}

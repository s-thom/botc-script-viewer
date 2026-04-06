import { LOCALE_MAP, type LocaleIds } from "./config.ts";
import type { LocaleData, TranslateResult } from "./types.ts";

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
  locales: Partial<Record<LocaleIds, LocaleData>>,
): TranslateResult<string | undefined> {
  const [ns, ...path] = key.split(".");

  const tryLocale = (loc: LocaleIds): string | undefined => {
    const data = locales[loc];
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
      // Quick check for community translations, which should count towards the main language.
      const fallbackInfo = LOCALE_MAP[fallback];
      const fallbackLocale =
        locale === fallbackInfo.astroId ? undefined : fallbackInfo.astroId;

      return { value: result, fallbackLocale };
    }
  }

  return { value: undefined };
}

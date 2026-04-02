import { LOCALE_MAP, type LocaleIds } from "./config.ts";
import { LANGUAGE_DATA } from "./languages.ts";
import type { Namespace } from "./types.ts";

const NAMESPACES = new Set<Namespace>(["app", "game", "script"]);

function walkPath(
  obj: Record<string, unknown>,
  path: string[],
): string | undefined {
  let current: unknown = obj;
  for (const segment of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === "string" ? current : undefined;
}

export function resolveKey(locale: LocaleIds, key: string): string | undefined {
  const [ns, ...path] = key.split(".");
  if (!NAMESPACES.has(ns as Namespace)) return undefined;

  const tryLocale = (loc: LocaleIds): string | undefined => {
    const data = LANGUAGE_DATA[loc];
    if (!data) return undefined;
    return walkPath(data[ns as Namespace], path);
  };

  const direct = tryLocale(locale);
  if (direct !== undefined) return direct;

  for (const fallback of LOCALE_MAP[locale].fallbacks) {
    const result = tryLocale(fallback);
    if (result !== undefined) return result;
  }

  return undefined;
}

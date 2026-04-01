export interface LocaleInfo {
  name: string;
  botcId: string;
  slug: string;
  fallbacks: string[];
  isDefault?: boolean;
}

export type LocaleIds = "en";

export const LOCALE_MAP: Record<LocaleIds, LocaleInfo> = {
  en: {
    name: "English",
    slug: "en",
    botcId: "en",
    fallbacks: [],
    isDefault: true,
  },
};

export const ENABLED_LOCALES = Object.values(LOCALE_MAP);

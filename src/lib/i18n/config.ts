export type LocaleIds = "en";

export interface LocaleInfo {
  name: string;
  slug: LocaleIds;
  botcId: string;
  fallbacks: LocaleIds[];
  isDefault?: boolean;
}

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

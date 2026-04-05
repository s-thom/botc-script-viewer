export type LocaleIds = "en" | "fr";

export interface LocaleInfo {
  name: string;
  slug: LocaleIds;
  botcId: string;
  fallbacks: LocaleIds[];
  translators: string[];
  hasMachineTranslations: boolean;
  isDefault?: boolean;
}

export const LOCALE_MAP: Record<LocaleIds, LocaleInfo> = {
  en: {
    name: "English",
    slug: "en",
    botcId: "en",
    fallbacks: [],
    translators: [],
    hasMachineTranslations: false,
    isDefault: true,
  },
  fr: {
    name: "French",
    slug: "fr",
    botcId: "fr",
    fallbacks: ["en"],
    translators: [],
    hasMachineTranslations: false,
  },
};

export const ENABLED_LOCALES = Object.values(LOCALE_MAP);

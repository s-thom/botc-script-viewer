export type LocaleIds = "en" | "fr" | "fr_community" | "de" | "de-ch";

export interface LocaleInfo {
  name: string;
  isEnabled: boolean;
  isDefault?: boolean;
  astroId: LocaleIds;
  botcId: string;
  communitySheetId?: string;
  fallbacks: LocaleIds[];
  translators: string[];
  hasMachineTranslations?: boolean;
  hasCommunityTranslations?: boolean;
}

export const LOCALE_MAP: Record<LocaleIds, LocaleInfo> = {
  en: {
    name: "English",
    isEnabled: true,
    isDefault: true,
    astroId: "en",
    botcId: "en",
    fallbacks: [],
    translators: [],
  },
  fr: {
    name: "Français",
    isEnabled: true,
    astroId: "fr",
    botcId: "fr",
    fallbacks: ["fr_community", "en"],
    translators: [],
    hasCommunityTranslations: true,
  },
  fr_community: {
    name: "Français",
    isEnabled: false,
    astroId: "fr",
    botcId: "fr",
    communitySheetId: "410848247",
    fallbacks: [],
    translators: [],
  },
  de: {
    name: "Deutsch",
    isEnabled: true,
    astroId: "de",
    botcId: "de",
    fallbacks: ["en"],
    translators: [],
  },
  "de-ch": {
    name: "Deutsch (CH)",
    isEnabled: true,
    astroId: "de-ch",
    botcId: "de_CH",
    fallbacks: ["de", "en"],
    translators: [],
  },
};

export const ENABLED_LOCALES = Object.values(LOCALE_MAP).filter(
  (locale) => locale.isEnabled,
);

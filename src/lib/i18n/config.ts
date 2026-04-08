export type LocaleIds =
  | "en"
  | "en-7c"
  | "fr"
  | "fr_community"
  | "de"
  | "de-ch"
  | "es"
  | "es_community"
  | "es-mx"
  | "es-419"
  | "pt"
  | "pt_community"
  | "pt-br"
  | "pt-br_community";

export interface LocaleInfo {
  name: string;
  isEnabled: boolean;
  isDefault?: boolean;
  astroId: LocaleIds;
  /** Joke languages (like pirate) don't work with the Intl methods */
  standardId?: string;
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
  "en-7c": {
    name: "English (Pirate)",
    isEnabled: true,
    astroId: "en-7c",
    standardId: "en",
    botcId: "en@pirate",
    fallbacks: ["en"],
    translators: [],
  },
  fr: {
    name: "Français",
    isEnabled: true,
    astroId: "fr",
    botcId: "fr",
    fallbacks: ["fr_community", "en"],
    translators: [],
    hasMachineTranslations: true,
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
    hasMachineTranslations: true,
  },
  "de-ch": {
    name: "Deutsch (CH)",
    isEnabled: true,
    astroId: "de-ch",
    botcId: "de_CH",
    fallbacks: ["de", "en"],
    translators: [],
    hasMachineTranslations: true,
  },
  es: {
    name: "Español",
    isEnabled: true,
    astroId: "es",
    botcId: "es",
    fallbacks: ["es_community", "en"],
    translators: [],
    hasCommunityTranslations: true,
    hasMachineTranslations: true,
  },
  es_community: {
    name: "Español",
    isEnabled: false,
    astroId: "es",
    botcId: "es",
    communitySheetId: "36117822",
    fallbacks: [],
    translators: [],
  },
  "es-mx": {
    name: "Español (México)",
    isEnabled: true,
    astroId: "es-mx",
    botcId: "es_MX",
    fallbacks: ["es", "es_community", "en"],
    translators: [],
    hasCommunityTranslations: true,
    hasMachineTranslations: true,
  },
  "es-419": {
    name: "Español (Latinoamérica)",
    isEnabled: true,
    astroId: "es-419",
    botcId: "es_419",
    fallbacks: ["es", "es_community", "en"],
    translators: [],
    hasCommunityTranslations: true,
    hasMachineTranslations: true,
  },
  pt: {
    name: "Português",
    isEnabled: true,
    astroId: "pt",
    botcId: "pt_PT",
    fallbacks: ["pt_community", "en"],
    translators: [],
    hasCommunityTranslations: true,
    hasMachineTranslations: true,
  },
  pt_community: {
    name: "Português",
    isEnabled: false,
    astroId: "pt",
    botcId: "pt_PT",
    communitySheetId: "1213506294",
    fallbacks: [],
    translators: [],
  },
  "pt-br": {
    name: "Português (Brasil)",
    isEnabled: true,
    astroId: "pt-br",
    botcId: "pt_BR",
    fallbacks: ["pt-br_community", "pt", "pt_community", "en"],
    translators: [],
    hasCommunityTranslations: true,
    hasMachineTranslations: true,
  },
  "pt-br_community": {
    name: "Português (Brasil)",
    isEnabled: false,
    astroId: "pt-br",
    botcId: "pt_BR",
    communitySheetId: "1209768722",
    fallbacks: [],
    translators: [],
  },
};

export const ENABLED_LOCALES = Object.values(LOCALE_MAP).filter(
  (locale) => locale.isEnabled,
);

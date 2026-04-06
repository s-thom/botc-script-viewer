import type { SvgComponent } from "astro/types";
import enIcon from "language-icons/icons/en.svg";
import frIcon from "language-icons/icons/fr.svg";

export type LocaleIds = "en" | "fr";

export interface LocaleInfo {
  name: string;
  slug: LocaleIds;
  botcId: string;
  iconComponent: SvgComponent;
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
    iconComponent: enIcon,
    fallbacks: [],
    translators: [],
    hasMachineTranslations: false,
    isDefault: true,
  },
  fr: {
    name: "French",
    slug: "fr",
    botcId: "fr",
    iconComponent: frIcon,
    fallbacks: ["en"],
    translators: [],
    hasMachineTranslations: false,
  },
};

export const ENABLED_LOCALES = Object.values(LOCALE_MAP);

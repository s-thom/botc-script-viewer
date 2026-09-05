import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";
import type { LocaleIds, TranslateParams } from "../lib/i18n";

export interface PageTranslateData {
  basePath: string;
  locales: LocaleIds[] | "all";
}

export interface PageMeta {
  title: string;
  lang: LocaleIds;
  translate?: PageTranslateData;
  description?: string;
  color?: string;
  noIndex?: boolean;
  canonicalRef?: LocalScriptReference;
  noCanonical?: boolean;
}

interface AppErrorOptions {
  cause?: unknown;
  status: number;
  titleKey: string;
  descriptionKey: string;
  descriptionParams?: TranslateParams;
}

export interface LocalScriptReference {
  collectionId: string;
  scriptId: string;
}

export interface LocalScriptCollection {
  scripts: LocalScriptDefinition[];
  isOfficial?: boolean;
  showOnHome?: boolean;
}

export interface LocalScriptDefinition {
  id: string;
  title: string;
  character: string;
  color?: string;
  canonicalRef?: LocalScriptReference;
  botcScriptsPk?: number;
  getScript: () => Promise<BloodOnTheClocktowerCustomScript>;
  localeOverrides?: Partial<
    Record<LocaleIds, () => Promise<BloodOnTheClocktowerCustomScript>>
  >;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly titleKey: string;
  public readonly descriptionKey: string;
  public readonly descriptionParams?: TranslateParams;

  constructor(message: string, options: AppErrorOptions) {
    super(message, { cause: options.cause });

    this.status = options.status;
    this.titleKey = options.titleKey;
    this.descriptionKey = options.descriptionKey;
    this.descriptionParams = options.descriptionParams;
  }
}

import type { TranslateParams } from "../lib/i18n";

export interface PageMeta {
  title: string;
  basePath: string;
  description?: string;
  noIndex?: boolean;
  hasLocaleAlternates?: boolean;
}

interface AppErrorOptions {
  cause?: unknown;
  status: number;
  titleKey: string;
  descriptionKey: string;
  descriptionParams?: TranslateParams;
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

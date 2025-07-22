export interface PageMeta {
  title?: string;
  description?: string;
}

export interface AppErrorOptions {
  title?: string;
  description?: string;
}

export class AppError extends Error {
  private readonly options: AppErrorOptions;

  constructor(message: string, options: AppErrorOptions) {
    super(message);

    this.options = options;
  }

  get title() {
    return this.options.title;
  }

  get description() {
    return this.options.description;
  }
}

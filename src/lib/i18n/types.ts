import type { LocaleIds } from "./config";

export type TranslateResult<T> = { value: T; fallbackLocale?: LocaleIds };

export type Translator = ((
  key: string,
  params?: TranslateParams,
) => TranslateResult<MessageSegment[]>) & {
  locale: string;
  resolve: (
    key: string,
    ignoreMissing?: boolean,
  ) => TranslateResult<string | undefined>;
  string: (key: string, params?: TranslateParams) => TranslateResult<string>;
  raw: (raw: string, params?: TranslateParams) => MessageSegment[];
  rawString: (raw: string, params?: TranslateParams) => string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface StringDict extends Record<string, string | StringDict> {}

export interface LocaleData {
  app: StringDict;
  game: StringDict;
  script: StringDict;
  viewer: StringDict;
}

export interface TranslateParams {
  count?: number;
  /** Whether *CARD TEXT*, [Setup ability], or :reminder: should be replaced in messages */
  formatReplacements?: boolean;
  fallback?: string;
  [key: string]: unknown;
}

export interface TextMessageSegment {
  type: "text";
  value: string;
}

export interface VariableMessageSegment {
  type: "variable";
  name: string;
}

export interface TagMessageSegment {
  type: "tag";
  name: string;
  children: MessageSegment[];
  params: TranslateParams;
}

export interface UnresolvedTagMessageSegment {
  type: "tag";
  name: string;
  children: UnresolvedMessageSegment[];
}

export type UnresolvedMessageSegment =
  | TextMessageSegment
  | VariableMessageSegment
  | UnresolvedTagMessageSegment;

export type MessageSegment = TextMessageSegment | TagMessageSegment;

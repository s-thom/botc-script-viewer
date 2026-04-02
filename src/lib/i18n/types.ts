export type Translator = ((
  key: string,
  params?: TranslateParams,
) => MessageSegment[]) & {
  string: (key: string, params?: TranslateParams) => string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface StringDict extends Record<string, string | StringDict> {}

export interface LocaleData {
  app: StringDict;
  game: StringDict;
  script: StringDict;
  viewer: StringDict;
}

export type Namespace = "app" | "game" | "script" | "viewer";

export interface TranslateParams {
  count?: number;
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

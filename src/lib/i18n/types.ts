export type Translator = (
  key: string,
  params?: TranslateParams,
) => MessageSegment[];

export interface LocaleData {
  app: Record<string, unknown>;
  game: Record<string, unknown>;
  script: Record<string, unknown>;
}

export type Namespace = "app" | "game" | "script";

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

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

export type MessageSegment =
  | { type: "text"; value: string }
  | { type: "variable"; name: string }
  | { type: "tag"; name: string; children: MessageSegment[] };

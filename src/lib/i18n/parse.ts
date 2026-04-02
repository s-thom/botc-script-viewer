import type { UnresolvedMessageSegment } from "./types";

const TOKEN_RE = /\{(\/?)([\w]+)\}/g;

export function parseMessage(msg: string): UnresolvedMessageSegment[] {
  // Pre-scan to find which names have a closing tag — those are tag-opens
  const hasClose = new Set<string>();
  for (const match of msg.matchAll(TOKEN_RE)) {
    if (match[1] === "/") hasClose.add(match[2]);
  }

  const tokens: Array<
    | { isClose: boolean; name: string; index: number; length: number }
    | { text: string; index: number; length: number }
  > = [];

  let lastIndex = 0;
  TOKEN_RE.lastIndex = 0;
  for (const match of msg.matchAll(TOKEN_RE)) {
    if (match.index! > lastIndex) {
      tokens.push({
        text: msg.slice(lastIndex, match.index),
        index: lastIndex,
        length: match.index! - lastIndex,
      });
    }
    tokens.push({
      isClose: match[1] === "/",
      name: match[2],
      index: match.index!,
      length: match[0].length,
    });
    lastIndex = match.index! + match[0].length;
  }
  if (lastIndex < msg.length) {
    tokens.push({
      text: msg.slice(lastIndex),
      index: lastIndex,
      length: msg.length - lastIndex,
    });
  }

  let pos = 0;

  function parseUntilClose(closeName?: string): UnresolvedMessageSegment[] {
    const segments: UnresolvedMessageSegment[] = [];

    while (pos < tokens.length) {
      const token = tokens[pos];

      if ("text" in token) {
        segments.push({ type: "text", value: token.text });
        pos++;
        continue;
      }

      if (token.isClose) {
        if (token.name === closeName) {
          pos++; // consume closing tag
        }
        // mismatched close tag — stop, treat as end of current context
        return segments;
      }

      // Opening token
      if (hasClose.has(token.name)) {
        // tag-open
        pos++;
        const children = parseUntilClose(token.name);
        segments.push({ type: "tag", name: token.name, children });
      } else {
        // variable
        segments.push({ type: "variable", name: token.name });
        pos++;
      }
    }

    return segments;
  }

  return parseUntilClose();
}

import type { MessageSegment, TranslateParams } from "./types.ts";

export function formatMessage(
  segments: MessageSegment[],
  params: TranslateParams,
): string {
  return segments.map((seg) => formatSegment(seg, params)).join("");
}

function formatSegment(seg: MessageSegment, params: TranslateParams): string {
  if (seg.type === "text") {
    return seg.value;
  }

  if (seg.type === "variable") {
    const value = params[seg.name];
    return value !== undefined ? String(value) : `{${seg.name}}`;
  }

  // tag — degrade to inner text (only reached on the string path, which has no tags)
  return seg.children.map((child) => formatSegment(child, params)).join("");
}

// Resolves variables to text segments but preserves tag structure for component rendering.
export function resolveVariables(
  segments: MessageSegment[],
  params: TranslateParams,
): MessageSegment[] {
  return segments.map((seg): MessageSegment => {
    if (seg.type === "variable") {
      const value = params[seg.name];
      return {
        type: "text",
        value: value !== undefined ? String(value) : `{${seg.name}}`,
      };
    }
    if (seg.type === "tag") {
      return {
        type: "tag",
        name: seg.name,
        children: resolveVariables(seg.children, params),
      };
    }
    return seg;
  });
}

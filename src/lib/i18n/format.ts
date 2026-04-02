import type {
  MessageSegment,
  TranslateParams,
  UnresolvedMessageSegment,
} from "./types.ts";

// Resolves variables to text segments but preserves tag structure for component rendering.
export function resolveVariables(
  segments: UnresolvedMessageSegment[],
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

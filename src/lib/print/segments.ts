import type { MessageSegment } from "../i18n/types";
import type { PrintSegment } from "./data";

/**
 * Reduce translated message segments to the formatting print supports.
 * Bold and reminder tokens are kept; any other tag is flattened to its text.
 */
export function toPrintSegments(segments: MessageSegment[]): PrintSegment[] {
  return segments.flatMap((segment): PrintSegment[] => {
    if (segment.type === "text") {
      return [segment];
    }
    switch (segment.name) {
      case "bold":
        return [{ type: "bold", children: toPrintSegments(segment.children) }];
      case "reminder":
        return [{ type: "reminder" }];
      default:
        return toPrintSegments(segment.children);
    }
  });
}

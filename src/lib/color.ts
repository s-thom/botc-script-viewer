import { clampChroma, converter, formatRgb, parse } from "culori";

/**
 * Make a script's colour dark enough for light header text to be readable on it.
 * Returns undefined if the colour can't be parsed.
 */
export function getHeaderColor(color: string | undefined): string | undefined {
  if (color === undefined) {
    return undefined;
  }
  const parsed = parse(color);
  if (parsed === undefined) {
    return undefined;
  }

  const toOklch = converter("oklch");

  const asOklch = toOklch(parsed);
  // Reduce lightness so the title text is still readable.
  // This might put the colour outside of the visible space, so clamp it back in bounds.
  asOklch.l = Math.min(asOklch.l, 0.4);
  const clamped = clampChroma(asOklch);

  return formatRgb(clamped);
}

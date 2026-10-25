export type PrintStyle = "plain" | "fancy";
export type PaperSize = "a4" | "letter";
export type BackMode = "info" | "fancy" | "blank";
export type NightMode = "simple" | "detailed";

export interface PrintOptions {
  style: PrintStyle;
  paper: PaperSize;
  back: BackMode;
  night: NightMode;
  qrPage: boolean;
  hideTravellersInNight: boolean;
  colorScriptHeader: boolean;
}

export const DEFAULT_PRINT_OPTIONS: PrintOptions = {
  style: "plain",
  paper: "a4",
  back: "info",
  night: "detailed",
  qrPage: true,
  hideTravellersInNight: false,
  colorScriptHeader: true,
};

export const PAPER_DIMENSIONS_MM: Record<
  PaperSize,
  { width: number; height: number }
> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
};

const ENUM_VALUES: {
  [
    K in keyof PrintOptions as PrintOptions[K] extends string ? K : never
  ]: readonly PrintOptions[K][];
} = {
  style: ["plain", "fancy"],
  paper: ["a4", "letter"],
  back: ["info", "fancy", "blank"],
  night: ["simple", "detailed"],
};

const BOOLEAN_KEYS = [
  "qrPage",
  "hideTravellersInNight",
  "colorScriptHeader",
] as const;

/** Merge untrusted data (e.g. from localStorage) over the defaults, dropping anything invalid. */
export function parsePrintOptions(data: unknown): PrintOptions {
  const options: PrintOptions = { ...DEFAULT_PRINT_OPTIONS };

  if (typeof data !== "object" || data === null) {
    return options;
  }
  const record = data as Record<string, unknown>;

  for (const [key, values] of Object.entries(ENUM_VALUES)) {
    const value = record[key];
    if ((values as readonly unknown[]).includes(value)) {
      (options as unknown as Record<string, unknown>)[key] = value;
    }
  }
  for (const key of BOOLEAN_KEYS) {
    if (typeof record[key] === "boolean") {
      options[key] = record[key];
    }
  }

  return options;
}

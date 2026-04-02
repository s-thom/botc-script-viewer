const CLDR_CATEGORY_INDEX: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5,
};

export function isPluralMessage(msg: string): boolean {
  return msg.includes("|");
}

export function selectPluralForm(
  msg: string,
  count: number,
  locale: string,
): string {
  const forms = msg.split("|");

  if (forms.length === 2) {
    return count === 1 ? forms[0] : forms[1];
  }

  const category = new Intl.PluralRules(locale).select(count);
  const index = Math.min(CLDR_CATEGORY_INDEX[category] ?? 5, forms.length - 1);
  return forms[index];
}

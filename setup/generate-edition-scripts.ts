import { mkdir, writeFile } from "node:fs/promises";
import data from "../src/data/data.json" with { type: "json" };
import type { BloodOnTheClocktowerCustomScript } from "../src/generated/script-schema";
import { ENABLED_LOCALES } from "../src/lib/i18n/index.ts";
import { LANGUAGE_DATA } from "../src/lib/i18n/languages.ts";

for (const locale of ENABLED_LOCALES) {
  await mkdir(`src/generated/edition-scripts/${locale.slug}`, {
    recursive: true,
  });

  const localeData = LANGUAGE_DATA[locale.slug];

  for (const edition of data.editions) {
    if (edition.id === "custom") {
      continue;
    }

    const script: BloodOnTheClocktowerCustomScript = [
      {
        id: "_meta",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name:
          (localeData as any)?.game?.editions?.[edition.id]?.name ??
          (LANGUAGE_DATA["en"] as any).game.editions[edition.id].name,
        author: "The Pandemonium Institute",
        firstNight: edition.firstNight,
        otherNight: edition.otherNight,
      },
    ];

    for (const role of data.roles) {
      if (role.edition === edition.id) {
        script.push(role.id);
      }
    }

    await writeFile(
      `src/generated/edition-scripts/${locale.slug}/${edition.id}.json`,
      JSON.stringify(script, null, 2),
    );
  }
}

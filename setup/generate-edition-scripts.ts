import { mkdir, writeFile } from "node:fs/promises";
import type { BloodOnTheClocktowerCustomScript } from "../src/generated/script-schema";
import { editions, roles } from "../src/lib/data.ts";
import { createTranslator, ENABLED_LOCALES } from "../src/lib/i18n/index.ts";

export async function generateEditionScripts() {
  for (const locale of ENABLED_LOCALES) {
    await mkdir(`src/generated/edition-scripts/${locale.astroId}`, {
      recursive: true,
    });

    const t = await createTranslator({ locale: locale.astroId });

    for (const edition of editions) {
      if (edition.id === "custom") {
        continue;
      }

      const script: BloodOnTheClocktowerCustomScript = [
        {
          id: "_meta",
          name: t.string(`game.editions.${edition.id}.name`).value,
          author: "The Pandemonium Institute",
          firstNight: edition.firstNight,
          otherNight: edition.otherNight,
        },
      ];

      for (const role of roles) {
        if (role.edition === edition.id) {
          script.push(role.id);
        }
      }

      await writeFile(
        `src/generated/edition-scripts/${locale.astroId}/${edition.id}.json`,
        JSON.stringify(script, null, 2),
      );
    }
  }
}

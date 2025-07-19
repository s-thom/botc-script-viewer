import { mkdir, writeFile } from "node:fs/promises";
import data from "../src/data/data.json" with { type: "json" };
import type { BloodOnTheClocktowerCustomScript } from "../src/generated/script-schema";

for (const edition of data.editions) {
  if (edition.id === "custom") {
    continue;
  }

  const script: BloodOnTheClocktowerCustomScript = [
    {
      id: "_meta",
      name: edition.name,
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

  await mkdir("src/generated/edition-scripts", { recursive: true });
  await writeFile(
    `src/generated/edition-scripts/${edition.id}.json`,
    JSON.stringify(script, null, 2),
  );
}

async function run() {
  console.log("[Setup] Generating Typescript schema for scripts");
  await import("./generate-script-schema.ts").then((m) => m.default());

  console.log("[Setup] Downloading data");
  await import("./download-data.ts").then((m) => m.default());

  console.log("[Setup] Downloading official translations");
  await import("./download-translations.ts").then((m) => m.default());

  console.log("[Setup] Downloading community translations");
  await import("./generate-community-translations.ts").then((m) => m.default());

  console.log("[Setup] Downloading interactions data");
  await import("./download-interactions.ts").then((m) => m.default());

  console.log("[Setup] Generating official scripts JSON");
  await import("./generate-edition-scripts.ts").then((m) => m.default());

  console.log("[Setup] Generating official character IDs type");
  await import("./generate-official-character-ids.ts").then((m) => m.default());
}

await run();

export {};

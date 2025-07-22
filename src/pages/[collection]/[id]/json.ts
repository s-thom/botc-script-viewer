import type { APIRoute } from "astro";
import { HOSTED_SCRIPTS } from "../../../scripts";

export function getStaticPaths() {
  return Object.entries(HOSTED_SCRIPTS).flatMap(([collection, scripts]) =>
    scripts.map((script) => ({
      params: {
        collection: collection as keyof typeof HOSTED_SCRIPTS,
        id: script.id,
      },
    })),
  );
}

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { collection, id } = params;

  if (!collection || !(collection in HOSTED_SCRIPTS)) {
    return rewrite("/404");
  }

  const definition = HOSTED_SCRIPTS[
    collection as keyof typeof HOSTED_SCRIPTS
  ].find((script) => id === script.id);
  if (!definition) {
    return rewrite("/404");
  }

  const rawScript = await definition.getScript();

  return new Response(JSON.stringify(rawScript));
};

import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import PQueue from "p-queue";
import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";
import {
  fetchScriptInstance,
  fetchTopScriptsByScore,
} from "../lib/import/botcscripts";

export const topScriptSchema = z.object({
  pk: z.number(),
  script_id: z.number(),
  version: z.string(),
  name: z.string(),
  author: z.string(),
  score: z.number(),
  versions: z.record(z.string(), z.string()),
  latest_version: z.string(),
  content: z.custom<BloodOnTheClocktowerCustomScript>(),
});

/** Loads the top scripts from BotC Scripts. */
export function topScriptsLoader() {
  return {
    name: "botc-top-scripts",
    schema: topScriptSchema,
    load: async ({ store, parseData, logger }) => {
      const topScripts = await fetchTopScriptsByScore();
      const currentIds = new Set(topScripts.map((s) => String(s.pk)));

      for (const id of store.keys()) {
        if (!currentIds.has(id)) {
          store.delete(id);
        }
      }

      const queue = new PQueue({ interval: 1000, intervalCap: 4 });
      let fetched = 0;
      await Promise.all(
        topScripts.map(async (script) => {
          const id = String(script.pk);
          if (store.has(id)) {
            return;
          }

          const instance = await queue.add(() =>
            fetchScriptInstance(script.script_id.toString()),
          );
          fetched++;

          const data = await parseData({
            id,
            data: {
              pk: script.pk,
              script_id: script.script_id,
              version: script.version,
              name: script.name,
              author: script.author,
              score: script.score,
              versions: instance.versions,
              latest_version: instance.latest_version,
              content: script.content,
            },
          });
          store.set({ id, data });
        }),
      );

      logger.info(
        `Loaded ${topScripts.length} top scripts (${fetched} fetched, ${topScripts.length - fetched} cached)`,
      );
    },
  } satisfies Loader;
}

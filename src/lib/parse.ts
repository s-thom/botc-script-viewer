import { z } from "astro/zod";
import type {
  BloodOnTheClocktowerCustomScript,
  ScriptMetadata,
} from "../generated/script-schema";

const metaSchema = z.object({
  id: z.enum(["_meta"]),
  name: z.string(),
  author: z.string().optional(),
  logo: z.string().optional(),
  hideTitle: z.boolean().optional(),
  background: z.string().optional(),
  almanac: z.string().optional(),
  bootlegger: z.array(z.string()).optional(),
  firstNight: z.array(z.string()).optional(),
  otherNight: z.array(z.string()).optional(),
}) satisfies z.ZodType<ScriptMetadata>;

const fullCharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.union([z.string(), z.array(z.string()).max(3)]).optional(),
  team: z.enum([
    "townsfolk",
    "outsider",
    "minion",
    "demon",
    "traveller",
    "fabled",
    "loric",
  ]),
  edition: z.string().optional().nullable(),
  ability: z.string(),
  flavor: z.string().optional().nullable(),
  firstNight: z.number().optional().nullable(),
  firstNightReminder: z.string().optional().nullable(),
  otherNight: z.number().optional().nullable(),
  otherNightReminder: z.string().optional().nullable(),
  reminders: z.array(z.string()).optional().nullable(),
  remindersGlobal: z.array(z.string()).optional().nullable(),
  setup: z.boolean().optional().nullable(),
  jinxes: z
    .array(z.object({ id: z.string(), reason: z.string() }))
    .optional()
    .nullable(),
  special: z
    .array(
      z.object({
        type: z.enum([
          "selection",
          "ability",
          "signal",
          "vote",
          "reveal",
          "player",
        ]),
        name: z.enum([
          "grimoire",
          "pointing",
          "ghost-votes",
          "distribute-roles",
          "bag-disabled",
          "bag-duplicate",
          "multiplier",
          "hidden",
          "replace-character",
          "player",
          "card",
          "open-eyes",
        ]),
        value: z.union([z.string(), z.number()]).optional(),
        time: z
          .enum([
            "pregame",
            "day",
            "night",
            "firstNight",
            "firstDay",
            "otherNight",
            "otherDay",
          ])
          .optional(),
        global: z
          .enum([
            "townsfolk",
            "outsider",
            "minion",
            "demon",
            "traveller",
            "dead",
          ])
          .optional(),
      }),
    )
    .optional(),
});

const characterSchema = z.string();

const deprecatedCharacterSchema = z.object({ id: z.string() });

export const rawScriptValidator = z.array(
  z.union([
    metaSchema,
    fullCharacterSchema,
    characterSchema,
    deprecatedCharacterSchema,
  ]),
) satisfies z.ZodType<BloodOnTheClocktowerCustomScript>;

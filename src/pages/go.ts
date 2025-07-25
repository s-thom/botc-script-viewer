import type { APIRoute } from "astro";
import { z } from "astro:schema";
import type { BloodOnTheClocktowerCustomScript } from "../generated/script-schema";
import { compressToBase64 } from "../lib/compression";
import { rawScriptValidator } from "../lib/parse";

export const prerender = false;

const formSchema = z.object({ script: z.string() });

export const POST: APIRoute = async ({ request, rewrite, redirect }) => {
  try {
    const rawFormData = await request.formData();
    const formData = formSchema.parse(
      Object.fromEntries(rawFormData.entries()),
    );

    const rawScriptJson = JSON.parse(formData.script);
    let rawScript: BloodOnTheClocktowerCustomScript;
    try {
      rawScript = rawScriptValidator.parse(rawScriptJson);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Error parsing script", JSON.stringify(err.format()));
      } else {
        console.error("Error parsing script (unknown)");
      }

      // The script failed validation, but maybe it's OK. Send forth and see if the renderer will handle it.
      const minifiedScript = JSON.stringify(rawScriptJson);
      const gz = await compressToBase64(minifiedScript);

      return redirect(`/gz/${gz}`);
    }

    // Only gz is implemented right now.
    const minifiedScript = JSON.stringify(rawScript);
    const gz = await compressToBase64(minifiedScript);

    return redirect(`/gz/${gz}`);
  } catch (err) {
    console.error({ err });
    return rewrite("/500");
  }
};

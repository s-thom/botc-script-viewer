import type { APIRoute } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";
import { compressToBase64, stringToBytes } from "../lib/compression";
import { ENABLED_LOCALES, type LocaleIds } from "../lib/i18n";
import { scriptFromFormData } from "../lib/import";
import { encodeScript } from "../lib/number-store";
import { AppError } from "../types/site";

export const prerender = false;

export const POST: APIRoute = async ({
  request,
  redirect,
  url: requestUrl,
  currentLocale,
}) => {
  const rawFormData = await request.formData();

  const locale = rawFormData.get("locale");
  if (
    typeof locale != "string" ||
    !ENABLED_LOCALES.some((l) => l.astroId === locale)
  ) {
    throw new AppError("Invalid locale", {
      status: 400,
      titleKey: "viewer.errors.genericError",
      descriptionKey: "viewer.errors.genericErrorDescription",
    });
  }

  const rawScript = await scriptFromFormData(
    rawFormData,
    (currentLocale as LocaleIds | undefined) ?? "en",
    requestUrl.hostname,
    true,
  );

  const minifiedScript = JSON.stringify(rawScript);

  try {
    const bytes = encodeScript(rawScript);
    const base64 = await compressToBase64(bytes, "deflate-raw", true);
    const basePath = `/ns/${base64}`;
    return redirect(getRelativeLocaleUrl(locale, basePath));
  } catch (err) {
    console.warn(
      "Error trying to encode script in NS, falling back to JSON",
      err,
    );
  }

  // Fall back to just encoding the JSON
  const bytes = stringToBytes(minifiedScript);
  const base64 = await compressToBase64(bytes, "deflate-raw", true);
  const basePath = `/json/${base64}`;
  return redirect(getRelativeLocaleUrl(locale, basePath));
};

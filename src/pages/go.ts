import type { APIRoute } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";
import { compressToBase64, stringToBytes } from "../lib/compression";
import { ENABLED_LOCALES } from "../lib/i18n";
import { scriptFromFormData } from "../lib/import";
import { encodeScript } from "../lib/number-store";
import { LOCAL_SCRIPT_COLLECTIONS } from "../scripts";
import { AppError } from "../types/site";

export const prerender = false;

export const POST: APIRoute = async ({
  request,
  redirect,
  url: requestUrl,
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

  const rawInput = rawFormData.get("script");
  if (typeof rawInput === "string") {
    const parsedInput = URL.parse(rawInput.trim());
    if (parsedInput != null) {
      // External: https://www.botcscripts.com/script/<id>/<version> → /sw/<id>/<version>/
      if (parsedInput.hostname === "www.botcscripts.com") {
        const swMatch = parsedInput.pathname.match(
          /^\/script\/([^/]+)\/([^/]+)\/?$/,
        );
        if (swMatch) {
          const [, scriptId, versionId] = swMatch;
          return redirect(
            getRelativeLocaleUrl(locale, `/sw/${scriptId}/${versionId}/`),
          );
        }
      }

      // Same-hostname: redirect using the locale from the submitted URL
      if (parsedInput.hostname === requestUrl.hostname) {
        const pathSegments = parsedInput.pathname.split("/").filter(Boolean);
        const localeFromUrl = ENABLED_LOCALES.find(
          (l) => l.astroId === pathSegments[0],
        );
        const urlLocale = localeFromUrl?.astroId ?? "en";
        const contentSegments = localeFromUrl
          ? pathSegments.slice(1)
          : pathSegments;
        const [scheme, ...rest] = contentSegments;

        // Detect optional trailing /json endpoint segment on ns/json/sw routes
        const hasJsonEndpoint =
          rest[rest.length - 1] === "json" &&
          (scheme === "ns" || scheme === "json" || scheme === "sw");
        const baseRest = hasJsonEndpoint ? rest.slice(0, -1) : rest;

        if (
          (scheme === "sw" && baseRest.length === 2) ||
          (scheme === "ns" && baseRest.length === 1) ||
          (scheme === "json" && baseRest.length === 1) ||
          (scheme in LOCAL_SCRIPT_COLLECTIONS && baseRest.length === 1)
        ) {
          const contentPath = `/${[scheme, ...baseRest].join("/")}/`;
          return redirect(getRelativeLocaleUrl(urlLocale, contentPath));
        }
      }
    }
  }

  const rawScript = await scriptFromFormData(rawFormData);

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

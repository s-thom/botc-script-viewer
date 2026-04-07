import type { APIRoute } from "astro";
import QRCode from "qrcode-svg";
import { MAX_AGE_SECONDS } from "../../lib/constants";
import { AppError } from "../../types/site";

export const prerender = false;

/** Maximum length of binary data in a QR code */
const MAX_LENGTH = 2953;

const QUALITY_Q_LENGTH = 535;
const QUALITY_M_LENGTH = 908;
const QUALITY_L_LENGTH = 1452;

export const GET: APIRoute = async ({ rewrite, url: requestUrl }) => {
  const match = requestUrl.pathname.match(/(.*)\/qr\.svg$/);
  if (!match) {
    console.error("QR endpoint called unexpectedly");
    return rewrite("/500");
  }

  const url = new URL(match[1], requestUrl).toString();
  if (url.length > MAX_LENGTH) {
    throw new AppError(
      `URL length ${url.length} greater than QR code maximum ${MAX_LENGTH}`,
      {
        status: 500,
        titleKey: "viewer.errors.urlSize",
        descriptionKey: "viewer.errors.urlSizeQRDescription",
      },
    );
  }

  let correctionLevel: "L" | "M" | "Q" | "H" = "H";
  switch (true) {
    case url.length >= QUALITY_L_LENGTH:
      correctionLevel = "L";
      break;
    case url.length >= QUALITY_M_LENGTH:
      correctionLevel = "M";
      break;
    case url.length >= QUALITY_Q_LENGTH:
      correctionLevel = "Q";
      break;
  }

  let qrCode: QRCode = new QRCode({
    content: url,
    padding: 4,
    width: 512,
    height: 512,
    color: "#000000",
    background: "#ffffff",
    ecl: correctionLevel,
    join: true,
    container: "svg-viewbox",
  });
  try {
    qrCode = new QRCode({
      content: url,
      padding: 4,
      width: 512,
      height: 512,
      color: "#000000",
      background: "#ffffff",
      ecl: correctionLevel,
      join: true,
      container: "svg-viewbox",
    });
  } catch (err) {
    throw new AppError("Error generating QR code", {
      status: 500,
      cause: err,
      titleKey: "viewer.errors.genericError",
      descriptionKey: "viewer.errors.genericErrorDescription",
    });
  }

  const headers = new Headers();
  headers.set("Content-Type", "image/svg+xml");
  headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
  return new Response(qrCode.svg(), { headers });
};

import type { APIRoute } from "astro";
import QRCode from "qrcode-svg";
import { MAX_AGE_SECONDS } from "../../lib/constants";

export const prerender = false;

/** Maximum length of binary data in a QR code */
const MAX_LENGTH = 2953;

const QUALITY_Q_LENGTH = 535;
const QUALITY_M_LENGTH = 908;
const QUALITY_L_LENGTH = 1452;

export const GET: APIRoute = async ({ rewrite, url: requestUrl }) => {
  try {
    const match = requestUrl.pathname.match(/(.*)\/qr\.svg$/);
    if (!match) {
      console.error("QR endpoint called unexpectedly");
      return rewrite("/500");
    }

    const url = new URL(match[1], requestUrl).toString();
    if (url.length > MAX_LENGTH) {
      console.error("URL too long for QR endpoint");
      return rewrite("/500");
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

    const qrCode = new QRCode({
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

    const headers = new Headers();
    headers.set("Content-Type", "image/svg+xml");
    headers.set("Cache-Control", `public, max-age=${MAX_AGE_SECONDS}`);
    return new Response(qrCode.svg(), { headers });
  } catch (err) {
    console.error({ err });
    return rewrite("/500");
  }
};

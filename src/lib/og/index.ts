import { Resvg } from "@cf-wasm/resvg/workerd";
import { fontData } from "astro:assets";

async function getFont(
  key: keyof typeof fontData,
  currentUrl: URL,
): Promise<Uint8Array> {
  const fontSrc = fontData[key]
    .find((data) => data.style === "normal")
    ?.src.at(0)?.url;
  if (!fontSrc) {
    throw new Error(`Unable to load font (${key})`);
  }
  const fontBuffer = await fetch(new URL(fontSrc, currentUrl.origin)).then(
    (res) => res.arrayBuffer(),
  );

  return new Uint8Array(fontBuffer);
}

export async function renderSvg(
  svg: string,
  currentUrl: URL,
): Promise<Buffer<ArrayBuffer>> {
  const fontBuffers = await Promise.all([
    getFont("--font-sorts-mill-goudy", currentUrl),
    getFont("--font-source-han-serif-sc", currentUrl),
  ]);

  const resvg = await Resvg.async(svg, {
    font: {
      fontBuffers,
      loadSystemFonts: false,
    },
  });

  const image = resvg.render();

  return Buffer.from(image.asPng());
}

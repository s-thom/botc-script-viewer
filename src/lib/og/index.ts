import { Resvg } from "@cf-wasm/resvg/workerd";
import { fontData } from "astro:assets";

export async function renderSvg(
  svg: string,
  currentUrl: URL,
): Promise<Buffer<ArrayBuffer>> {
  const fontSrc = fontData["--font-sorts-mill-goudy"]
    .find((data) => data.style === "normal")
    ?.src.at(0)?.url;
  if (!fontSrc) {
    throw new Error("Unable to load font");
  }
  const fontBuffer = await fetch(new URL(fontSrc, currentUrl.origin)).then(
    (res) => res.arrayBuffer(),
  );

  const resvg = await Resvg.async(svg, {
    font: {
      fontBuffers: [new Uint8Array(fontBuffer)],
      loadSystemFonts: false,
    },
  });

  const image = resvg.render();

  return Buffer.from(image.asPng());
}

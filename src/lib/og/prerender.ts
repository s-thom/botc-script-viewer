import { createRemoteIconLoader, fetchBytes } from "./icons";
import { renderOgImage, type OgImageInput } from "./render";

const iconCache = new Map<string, Promise<Uint8Array>>();

function fetchCachedBytes(url: string): Promise<Uint8Array> {
  let bytes = iconCache.get(url);
  if (!bytes) {
    bytes = fetchBytes(url).catch((err: unknown) => {
      iconCache.delete(url);
      throw err;
    });
    iconCache.set(url, bytes);
  }
  return bytes;
}

const loadIcon = createRemoteIconLoader(fetchCachedBytes);

export async function getPrerenderedOgImageResponse(
  input: OgImageInput,
): Promise<Response> {
  const png = await renderOgImage(input, loadIcon);
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}

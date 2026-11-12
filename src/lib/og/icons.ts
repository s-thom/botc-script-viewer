import { getCharacterIcon, getFallbackIcon } from "../character-icon";
import type { IconLoader } from "./render";

export const OG_ICON_MANIFEST_PATH = "/og-icons.json";

export type OgIconManifest = Record<string, string>;

export type BytesFetcher = (url: string) => Promise<Uint8Array>;

export async function fetchBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

export function createRemoteIconLoader(
  fetcher: BytesFetcher = fetchBytes,
): IconLoader {
  return async (character) => {
    const icon = getCharacterIcon(character);
    const fallback = getFallbackIcon(character.team);
    if (typeof icon !== "string") {
      return fetcher(fallback);
    }

    try {
      return await fetcher(icon);
    } catch (err) {
      console.warn(`Using fallback OpenGraph icon for ${character.id}`, err);
      return fetcher(fallback);
    }
  };
}

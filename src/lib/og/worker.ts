import { env, waitUntil } from "cloudflare:workers";
import {
  createRemoteIconLoader,
  OG_ICON_MANIFEST_PATH,
  type OgIconManifest,
} from "./icons";
import { renderOgImage, type IconLoader, type OgImageInput } from "./render";

const OG_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;
const FALLBACK_MAX_AGE_SECONDS = 60 * 10;

// ASSETS is added by the Astro adapter, so it's missing from the generated Env type.
const assets = () => (env as unknown as { ASSETS: Fetcher }).ASSETS;

let manifestPromise: Promise<OgIconManifest> | undefined;

async function fetchAsset(
  path: string,
  origin: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const response = await assets().fetch(new URL(path, origin));
  if (!response.ok) {
    throw new Error(`Failed to fetch asset ${path}: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

function getManifest(origin: string): Promise<OgIconManifest> {
  manifestPromise ??= assets()
    .fetch(new URL(OG_ICON_MANIFEST_PATH, origin))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch icon manifest: ${response.status}`);
      }
      return response.json<OgIconManifest>();
    })
    .catch((err: unknown) => {
      manifestPromise = undefined;
      throw err;
    });
  return manifestPromise;
}

function createAssetIconLoader(origin: string): IconLoader {
  const loadRemoteIcon = createRemoteIconLoader();
  // The dev ASSETS binding only serves public/, not prerendered routes like the manifest.
  if (import.meta.env.DEV) {
    return loadRemoteIcon;
  }
  return async (character) => {
    const manifest = await getManifest(origin);
    const path =
      character.image === undefined ? manifest[character.id] : undefined;
    return path ? fetchAsset(path, origin) : loadRemoteIcon(character);
  };
}

function pngResponse(body: Uint8Array<ArrayBuffer>, maxAge: number): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": `public, max-age=${maxAge}`,
    },
  });
}

export async function getOgImageResponse(
  url: URL,
  getInput: () => Promise<OgImageInput>,
): Promise<Response> {
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(url.toString());
  const cached = await cache.match(cacheKey);
  if (cached) {
    return cached;
  }

  let response: Response;
  try {
    const png = await renderOgImage(
      await getInput(),
      createAssetIconLoader(url.origin),
    );
    response = pngResponse(png, OG_MAX_AGE_SECONDS);
  } catch (err) {
    console.error("Failed to render OpenGraph image", err);
    response = pngResponse(
      await fetchAsset("/banner.png", url.origin),
      FALLBACK_MAX_AGE_SECONDS,
    );
  }

  waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

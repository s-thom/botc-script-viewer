import { ALLOWED_EXTERNAL_HOSTNAMES } from "./constants.ts";

export function getAllowedImageUrl(
  imageUrl: string | undefined,
): string | undefined {
  if (!imageUrl) {
    return undefined;
  }

  try {
    const url = new URL(imageUrl);
    return ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname)
      ? imageUrl
      : undefined;
  } catch {
    return undefined;
  }
}

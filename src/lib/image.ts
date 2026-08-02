import { inferRemoteSize } from "astro:assets";

export interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
}

export async function getRemoteImageResize(
  src: string,
  options: ResizeOptions,
): Promise<{
  src: string;
  width: number;
  height: number;
}> {
  const { width: intrinsicWidth, height: intrinsicHeight } =
    await inferRemoteSize(src);

  const scale = Math.min(
    options.maxWidth / intrinsicWidth,
    options.maxHeight / intrinsicHeight,
    1,
  );

  return {
    src,
    width: Math.round(intrinsicWidth * scale),
    height: Math.round(intrinsicHeight * scale),
  };
}

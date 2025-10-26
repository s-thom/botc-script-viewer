/**
 * Replace instances of multiple slashes in a URL with just one.
 */
export function fixDoubleSlashPaths(url: URL): URL {
  const fixedPath = url.pathname.replace(/\/{2,}/g, "/");
  return new URL(fixedPath, url);
}

# External Requests

This website makes external requests on users' behalves.

1. When submitting a URL on the home page, the site will request the script JSON.
2. When viewing a script with custom role icons that match the [allowed domains list](../src/lib/images.ts), the site will request those images.

## Request behaviours

In order to not inundate external servers with requests, the following measures are put in place for each type of external request.

### Scripts

- Scripts are only requested when submitting the form on the homepage. This redirects to a URL containing all of the script data, so if this second URL is saved there is no need to request the script again.
- There is a rate limit of 5 requests per second per hostname.
- Script requests are sent with a `User-Agent` header set to `Mozilla/5.0 (compatible; Script Viewer/1.0; +https://github.com/s-thom/botc-script-viewer)`.

### Images

- Images are only downloaded from domains matching the allow list.
  - If a custom script has image URLs that do not match the allowed domains list, no request is made and a default icon is shown instead.
- This site will forward the `Cache-Control` header on image requests, keeping the same browser caching rules as the original site.

## Caveats

- This website does not respect `robots.txt` directives.
  - Script JSON files are only requested when submitting the form on the home page. This site does not automatically scrape other websites.
  - Requesting images is done only when initiated by request.
- Images may be cached by this website's CDN, but only if the original origin sets the `Cache-Control` header.

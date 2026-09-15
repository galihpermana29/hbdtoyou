/**
 * Template card art.
 *
 * Card art normally arrives from the backend as `thumbnail_uri` on each template row.
 * Several of those rows point at Cloudinary accounts that now answer 401 - as of
 * 2026-09-13 that is `dxuumohme`, `dqipjpy1w` and `braiwjaya-university` - so the
 * templates and create pages rendered empty cards.
 *
 * Rather than wait on the backend rows being rewritten, any template listed in
 * LOCAL_THUMBNAILS is served from `public/thumbnails/` instead. Those files are
 * screenshots of each template's own preview route, checked into the repo so no
 * image host can break the card art again.
 *
 * To add one: follow `scripts/thumbnails/catalog-thumbnails.json` and
 * `scripts/thumbnails/mat-thumbnail.mjs`, save the 1600x900 result as
 * `public/thumbnails/<route>.jpg`, and add the route below.
 *
 * Once the backend rows are updated to point at
 * `https://memoify.live/thumbnails/<route>.jpg`, a route can be dropped from this list
 * and the backend value will be used again.
 *
 * Every local thumbnail uses the matted product-shot treatment described under
 * MATTED_THUMBNAILS below.
 */

/** Routes with card art checked in at `public/thumbnails/<route>.jpg`. */
const LOCAL_THUMBNAILS = new Set([
  'netflixv1',
  'spotifyv1',
  'disneyplusv1',
  'magazinev1',
  'graduationv1',
  'graduationv2',
  'newspaperv1',
  'newspaperv3',
  'arcadeclawv1',
  // scrapbook5's backend thumbnail still resolves, so it is deliberately not listed
  'scrapbook1',
  'scrapbook2',
  'scrapbook3',
  'scrapbook4',
  'scrapbook6',
  'scrapbook7',
  'scrapbook8',
]);

/**
 * Routes whose card art is a matted product shot rather than a raw screenshot: the
 * template's own preview, framed in a browser window and floated on a flat mat with its
 * own padding and shadow already baked in, at 16:9.
 *
 * Cards must render these with `object-contain` against MATTED_THUMBNAIL_MAT instead of
 * `object-cover`. The `/templates` bento sizes its tiles anywhere from roughly 1.15:1 to
 * 2.3:1, and cropping a matted shot to fit eats the padding it was composed with - which
 * is the whole point of the treatment. Letterboxing against the same flat colour keeps
 * the composition intact at every tile size with no visible seam.
 *
 * Cards with a fixed 16:9 art box (`/create`, `/dashboard`) need no special handling.
 */
const MATTED_THUMBNAILS = LOCAL_THUMBNAILS;

/** The mat colour baked into every matted thumbnail. */
export const MATTED_THUMBNAIL_MAT = '#f2f0ed';

/**
 * The template's route, parsed out of its backend `name`.
 *
 * Names are shaped `"<Display name> - <route>"` (e.g. `"Netflix v1 - netflixv1"`), and
 * the route is what the viewer pages are mounted at. The card components already link
 * to previews this way; this keeps that parsing in one place.
 */
export function templateRoute(name?: string): string | undefined {
  return name?.split('-')[1]?.split(' ')[1];
}

/**
 * The image to render for a template card: the checked-in file when there is one,
 * otherwise whatever the backend supplied.
 */
export function templateThumbnail(data: {
  name?: string;
  thumbnail_uri?: string;
}): string | undefined {
  const route = templateRoute(data.name);
  return route && LOCAL_THUMBNAILS.has(route)
    ? `/thumbnails/${route}.jpg`
    : data.thumbnail_uri;
}

/**
 * Whether this template's card art is a matted product shot. See MATTED_THUMBNAILS.
 *
 * Only true for checked-in art: a backend `thumbnail_uri` is an unknown crop.
 */
export function isMattedThumbnail(data: { name?: string }): boolean {
  const route = templateRoute(data.name);
  return Boolean(
    route && MATTED_THUMBNAILS.has(route) && LOCAL_THUMBNAILS.has(route)
  );
}

/**
 * Three scrapbooks preview a different design than their route name suggests.
 *
 * The `scrapbookPreview` map in `scrapbook/create/page.tsx` wires route `scrapbook1` to
 * the scrapbook3 design, `scrapbook2` to scrapbook1 and `scrapbook3` to scrapbook2. That
 * wiring is load-bearing - it decides what an existing scrapbook renders as - so it is
 * left alone and the card art is pointed at the design the viewer will actually get.
 *
 * This applies ONLY inside the scrapbook create flow. Elsewhere (`/templates`,
 * `/create`) a scrapbook card links to `/<route>`, which does render the design its
 * route names, so those keep the straight mapping from `templateThumbnail`.
 */
const SCRAPBOOK_CREATE_PREVIEW_ALIAS: Record<string, string> = {
  scrapbook1: 'scrapbook3',
  scrapbook2: 'scrapbook1',
  scrapbook3: 'scrapbook2',
};

/** Card art for the scrapbook create flow's picker. See the alias note above. */
export function scrapbookCreateThumbnail(data: {
  name?: string;
  thumbnail_uri?: string;
}): string | undefined {
  const route = templateRoute(data.name);
  const shown = route ? SCRAPBOOK_CREATE_PREVIEW_ALIAS[route] : undefined;
  return shown && LOCAL_THUMBNAILS.has(shown)
    ? `/thumbnails/${shown}.jpg`
    : templateThumbnail(data);
}

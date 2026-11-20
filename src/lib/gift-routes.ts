/**
 * Which routes draw somebody's gift, as opposed to the product's own UI.
 *
 * The route group a page lives in is what settles it, rather than a list of
 * routes. See `docs/adr/0003-the-route-group-says-whether-a-page-is-a-gift.md`.
 */

/** Route groups whose every route draws a gift, sample pages included. */
const GIFT_ROUTE_GROUPS = ['(gifts)', '(scrapbooks)'];

/**
 * Product routes that keep one gift viewer directly beneath them. `/journal`
 * lists journals and `/journal/create` writes one; only `/journal/<id>`, the
 * route naming one piece of content, is somebody's journal.
 */
const ROUTES_WITH_A_GIFT_VIEWER = ['journal', 'photobox-newspaper'];

/**
 * Pass `useSelectedLayoutSegments()` read from the root layout, which includes
 * the route groups a page is nested in, and the `id` route parameter from
 * `useParams()`, which only a route naming one piece of content has.
 */
export function drawsAGift(
  segments: readonly string[],
  contentId: string | string[] | undefined
): boolean {
  if (segments.some((segment) => GIFT_ROUTE_GROUPS.includes(segment))) {
    return true;
  }

  const product = segments.findIndex((segment) =>
    ROUTES_WITH_A_GIFT_VIEWER.includes(segment)
  );
  if (product === -1) return false;

  const isDirectlyBeneathIt = product === segments.length - 2;
  return isDirectlyBeneathIt && Boolean(contentId);
}

/**
 * The template route of the page when it is a recipient's view of one
 * created gift or scrapbook (`/netflixv1/<id>`, `/scrapbook7/<id>`,
 * `/journal/<id>`), or null on every other page.
 *
 * Narrower than `drawsAGift`: the sample pages (`/netflixv1`, and the
 * `preview` pages under some templates) draw a gift but name no content, so
 * they have no `id` or `slug` parameter and are not counted. Wedding
 * invitations live under `(wedding)` and carry their own Memoify mark in
 * their own design, so they are not counted either.
 *
 * Pass the same `useSelectedLayoutSegments()` as `drawsAGift`, the route
 * parameters from `useParams()`, and `usePathname()`.
 */
export function recipientViewerRoute(
  segments: readonly string[],
  params: Record<string, string | string[]> | null | undefined,
  pathname: string | null | undefined
): string | null {
  const contentId = params?.id ?? params?.slug;
  if (!contentId) return null;
  if (segments.includes('(wedding)')) return null;
  if (!drawsAGift(segments, contentId)) return null;
  const route = (pathname ?? '').split('/')[1];
  return route || null;
}

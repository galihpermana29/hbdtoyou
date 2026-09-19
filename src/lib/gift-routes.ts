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

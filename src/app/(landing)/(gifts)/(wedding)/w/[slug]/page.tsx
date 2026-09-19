import WeddingTemplate1InvitationPage from '../../wedding-1/[slug]/page';

// The viewer's own fixed title, for the viewer's own reason: a fetched title
// would count a view for an open that never happened.
export { metadata } from '../../wedding-1/[slug]/page';

/**
 * The resolver behind a wedding's own subdomain.
 *
 * `{slug}.memoify.live` is rewritten here by the middleware, so the address a
 * guest reads never names a template - the subdomain is the couple's, and
 * which template draws their wedding is the record's business, per
 * `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`. This route is
 * the switch between that address and a template's own viewer.
 *
 * The switch has one answer today because one wedding template exists, and it
 * is taken without reading the record first: the public read counts a view, so
 * a resolver that fetched the invitation to learn its template would count
 * every guest twice - the same reason the viewer's title is fixed rather than
 * fetched. When a second template lands, the public read must answer which
 * template the record carries (it does not yet), and this becomes fetch, read
 * the template, dispatch - with the viewers taking the fetched record instead
 * of fetching their own.
 *
 * It delegates to the same page the old path address serves, so the two
 * addresses cannot drift while both exist. It lives under `(gifts)`, which is
 * what keeps the site footer off it, per
 * `docs/adr/0003-the-route-group-says-whether-a-page-is-a-gift.md` - the
 * rewrite means a guest's request renders this route, whatever their bar says.
 */
export default WeddingTemplate1InvitationPage;

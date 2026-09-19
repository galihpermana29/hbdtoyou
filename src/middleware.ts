import { NextResponse, type NextRequest } from 'next/server';

import {
  couldBeInvitationSlug,
  invitationHostFor,
  invitationSlugFromHost,
  isApexHost,
} from '@/lib/invitation-host';

/**
 * The one place a Host header means anything: a wedding answers at its own
 * subdomain - see `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`.
 *
 * `{slug}.memoify.live` is rewritten internally to `/w/{slug}`, so the address
 * in the bar stays the couple's while the resolver route decides what their
 * invitation is. Only the root path is rewritten: everything else a page on
 * that host asks for - assets, API routes, server action posts to themselves -
 * must keep meaning what it says.
 *
 * The old path address, `memoify.live/wedding-1/{slug}`, answers 301 to the
 * subdomain, but only when the request reached the apex itself. Dev and
 * staging serve these routes on hosts that are not the apex and have no
 * wildcard, so there the paths keep working exactly as before - which is also
 * what keeps this whole file inert until the wildcard DNS lands: no request
 * carries a `*.memoify.live` Host until then, and no host that is not the
 * apex is ever redirected.
 *
 * Only a path spelling a possible slug redirects. Slugs are minted from
 * letters, digits and hyphens, so a path spelling anything else names an
 * address no subdomain could serve, and it is left to the route to refuse in
 * its own words.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const { pathname } = request.nextUrl;

  const slug = invitationSlugFromHost(host);
  if (slug && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/w/${slug}`;
    return NextResponse.rewrite(url);
  }

  if (isApexHost(host)) {
    // With or without a trailing slash, because `skipTrailingSlashRedirect`
    // means Next serves both forms and a pasted link can carry one.
    const oldAddress = pathname.match(/^\/wedding-1\/([^/]+)\/?$/);
    if (oldAddress && couldBeInvitationSlug(oldAddress[1])) {
      const url = request.nextUrl.clone();
      url.protocol = 'https';
      url.host = invitationHostFor(oldAddress[1].toLowerCase());
      url.port = '';
      url.pathname = '/';
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  // The two paths a Host can change the meaning of, and no others: the root,
  // which a subdomain serves an invitation at, and the old path addresses,
  // which the apex redirects. Every other request never enters this file.
  // `:path*` rather than a single `:slug` segment, which this Next version's
  // matcher does not honour; the redirect itself still takes exactly one
  // label-shaped segment.
  matcher: ['/', '/wedding-1/:path*'],
};

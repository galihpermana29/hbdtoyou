import { NextResponse, type NextRequest } from 'next/server';

import {
  SITE_ORIGIN,
  couldBeInvitationSlug,
  hostRole,
  invitationHostFor,
  invitationSlugFromHost,
  isApexHost,
} from '@/lib/invitation-host';
import { PAGE_LANGUAGE_HEADER, isIndonesianPath } from '@/lib/page-language';

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
 *
 * Since the wildcard landed, every `*.memoify.live` host reaches this
 * deployment, so a host that is nobody's must not answer with the whole site
 * (`hostRole` says which is which):
 *
 * - A stray host (`api.`, `a.b.`, ...) answers 301 to the same address on
 *   `www`.
 * - A couple's subdomain keeps its root, which is the invitation, and sends
 *   every other page address to `www`. Assets, API routes, PostHog, client
 *   navigations and server action posts are left alone, so nothing the
 *   invitation asks of its own origin changes. Its root also says
 *   `X-Robots-Tag: noindex`, as every other gift viewer does: the header in
 *   next.config.mjs matches `/w/:slug`, which a guest's request never spells.
 *   An unknown label still draws the invitation's own "this link does not
 *   work" screen rather than redirecting, because telling an unknown slug
 *   from a real one takes a read that counts a view.
 * - Staging and Vercel or Netlify deployment hosts answer as before, with
 *   `X-Robots-Tag: noindex`.
 * - Every other host (localhost, an IP) is untouched.
 *
 * It also tells the root layout which language the page is in, so `/id` and
 * every page under it, the Indonesian pages, say `<html lang="id">`
 * (lib/page-language.ts).
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const { pathname } = request.nextUrl;
  const role = hostRole(host);

  if (role === 'stray') return toSite(request);

  const slug = invitationSlugFromHost(host);
  if (slug && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/w/${slug}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('X-Robots-Tag', 'noindex');
    return response;
  }
  if (role === 'invitation' && isPageNavigation(request)) {
    return toSite(request);
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

  // Set for the Indonesian page and taken off everything else this file
  // sees, so a header sent by the browser cannot claim a language.
  const forward = new Headers(request.headers);
  if (isIndonesianPath(pathname)) forward.set(PAGE_LANGUAGE_HEADER, 'id');
  else forward.delete(PAGE_LANGUAGE_HEADER);
  const response = NextResponse.next({ request: { headers: forward } });
  if (role === 'staging' || role === 'preview') {
    response.headers.set('X-Robots-Tag', 'noindex');
  }
  return response;
}

/** 301 to the same path and query on the site's own host. */
function toSite(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(`${SITE_ORIGIN}${pathname}${search}`, 301);
}

/**
 * A browser asking for a page by its address: a GET or HEAD for a path that
 * is not an API route, not PostHog's proxy, not a Next internal and not a
 * file, and not one of Next's own client navigations or server actions
 * (which carry `RSC` or `Next-Action`).
 */
function isPageNavigation(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  if (request.headers.has('rsc') || request.headers.has('next-action'))
    return false;
  const { pathname } = request.nextUrl;
  if (/^\/(api|ingest|_next)(\/|$)/.test(pathname)) return false;
  // A file: the last segment has an extension (`/templates/x/hero.png`).
  if (/\.[A-Za-z0-9]+$/.test(pathname)) return false;
  return true;
}

export const config = {
  // Every request but Next's static files and PostHog's proxy: a Host can
  // now change what any path means (a stray host redirects all of them, and
  // a preview host marks all of them noindex), so the middleware has to see
  // them. What each path does is decided above.
  matcher: ['/((?!_next/static|_next/image|ingest/).*)'],
};

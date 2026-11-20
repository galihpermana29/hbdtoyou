/**
 * Where a published invitation answers: `{slug}.memoify.live`.
 *
 * The one place the apex host is written down. The middleware that turns a
 * Host header back into an Invitation Slug and the flow that prints the
 * address a couple sends both read it here, so the two can never disagree
 * about where an invitation lives - see
 * `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`.
 *
 * Nothing here reaches a network, reads an env, or knows what a slug means.
 * That keeps it importable from the middleware, which runs on every request,
 * and from client components alike.
 */

/** The domain invitations hang off, without any subdomain. */
export const INVITATION_APEX_HOST = 'memoify.live';

/**
 * Subdomains that are the product's rather than any couple's.
 *
 * A Host carrying one of these is the site itself - or infrastructure - and
 * never resolves to an invitation, whatever the backend may have minted. The
 * backend's slug generator spells couples' nicknames, so a collision is
 * remote, but remote is not never and a couple must not be able to shadow
 * `www`.
 */
const RESERVED_SUBDOMAINS = new Set([
  'www',
  'api',
  'app',
  'staging',
  'dashboard',
  'mail',
]);

/** The host one invitation answers at. */
export function invitationHostFor(slug: string): string {
  return `${slug}.${INVITATION_APEX_HOST}`;
}

/** A Host header reduced to what it names: no port, and case put aside. */
function hostnameOf(hostHeader: string): string {
  return hostHeader.split(':')[0].toLowerCase();
}

/**
 * Whether a value could be an Invitation Slug at all: one DNS label's worth of
 * letters, digits and hyphens.
 *
 * Slugs are minted lowercase from exactly these characters, so anything else
 * names an address no subdomain could serve. Asked by the middleware before it
 * redirects an old path address, so nobody is sent to a host that cannot
 * exist.
 */
export function couldBeInvitationSlug(value: string): boolean {
  return /^[A-Za-z0-9-]+$/.test(value);
}

/**
 * The Invitation Slug a Host header names, or null when it names none.
 *
 * Null for the apex itself, for every reserved subdomain, for a label with a
 * dot still in it (`a.b.memoify.live` is nobody's invitation), and for any
 * host that is not this product's at all - localhost, a preview deployment, a
 * stranger's domain pointed here. Null means the request passes exactly as it
 * would have before subdomains existed, which is what keeps every other host
 * untouched.
 *
 * The header arrives however the client spelled it; DNS is case-insensitive
 * and slugs are minted lowercase, so the label is read lowercased.
 */
export function invitationSlugFromHost(hostHeader: string): string | null {
  const host = hostnameOf(hostHeader);
  const suffix = `.${INVITATION_APEX_HOST}`;
  if (!host.endsWith(suffix)) return null;
  const label = host.slice(0, -suffix.length);
  if (label === '' || label.includes('.')) return null;
  if (RESERVED_SUBDOMAINS.has(label)) return null;
  return label;
}

/** Where the site itself answers, and where every stray host is sent. */
export const SITE_ORIGIN = `https://www.${INVITATION_APEX_HOST}`;

/**
 * What a Host header is to this site, read once so the middleware can act on
 * it in one place.
 *
 * - `site`: the apex or `www`, the production site.
 * - `staging`: `staging.memoify.live`, a real deployment that must answer as
 *   it is but never be indexed.
 * - `invitation`: a single label that could be a couple's subdomain. Every
 *   such label is one, because a slug is minted by the backend and this file
 *   cannot know which exist without a read that counts a view.
 * - `stray`: under the apex but nobody's: a reserved label other than `www`
 *   and `staging` (`api`, `app`, `dashboard`, `mail`, which nothing serves
 *   today), or more than one label (`a.b.memoify.live`). The wildcard sends
 *   these to this deployment, where they answered with the whole site.
 * - `preview`: a Vercel or Netlify deployment host.
 * - `other`: everything else - localhost, an IP, a stranger's domain. Left
 *   exactly as it was.
 */
export type HostRole =
  'site' | 'staging' | 'invitation' | 'stray' | 'preview' | 'other';

export function hostRole(hostHeader: string): HostRole {
  const host = hostnameOf(hostHeader);
  if (host === INVITATION_APEX_HOST || host === `www.${INVITATION_APEX_HOST}`)
    return 'site';
  if (host === `staging.${INVITATION_APEX_HOST}`) return 'staging';
  if (host.endsWith(`.${INVITATION_APEX_HOST}`)) {
    return invitationSlugFromHost(host) ? 'invitation' : 'stray';
  }
  if (host.endsWith('.vercel.app') || host.endsWith('.netlify.app'))
    return 'preview';
  return 'other';
}

/**
 * Whether a Host header is the apex - the site itself, with or without `www`.
 *
 * Only these hosts redirect the old path addresses to subdomains. Staging and
 * dev serve the same routes on hosts that are not the apex, and a redirect
 * from there would send somebody testing a path URL to production.
 */
export function isApexHost(hostHeader: string): boolean {
  const host = hostnameOf(hostHeader);
  return (
    host === INVITATION_APEX_HOST || host === `www.${INVITATION_APEX_HOST}`
  );
}

# An invitation answers at its own subdomain

Supersedes `0001-path-urls-not-subdomains.md`.

A published wedding invitation's address is `{slug}.memoify.live`, which is what the design always drew.
ADR 0001 held the address to a path, `memoify.live/wedding-1/{slug}`, because a subdomain needed wildcard DNS, a wildcard TLS certificate and host-to-content middleware that nobody owned.
On 2026-08-09 the owner took that infrastructure on: the wildcard `*.memoify.live` is added to Vercel, and the nameserver move that makes it resolve is the owner's runbook on `hbd-ca5`.
What ADR 0001 predicted - "moving to subdomains later is a middleware change plus a redirect from the old paths" - is this change.

## The address names nobody's template

The old path carried the template so the route could tell which template it was asked for without looking the invitation up.
A subdomain carries only the slug, so that question moves off the URL and into a resolver.

`src/middleware.ts` reads the Host header.
A single non-reserved label ahead of the apex - `www`, `api`, `app`, `staging`, `dashboard` and `mail` are reserved - is an Invitation Slug, and the root path is rewritten internally to `/w/{slug}`, so the bar keeps the couple's address while the app serves the resolver route.
Every other host passes untouched, which keeps the middleware inert until the wildcard resolves: no request carries a `*.memoify.live` Host before then.
Only the root path is rewritten, so everything else a page on that host asks for - assets, API routes, the server action posts the RSVP makes to its own origin - keeps meaning what it says.

`/w/[slug]` is the switch between an address and a template's viewer.
It has one answer today because one wedding template exists, and it is taken without reading the record first: the public read counts a view, so a resolver that fetched the invitation to learn its template would count every guest twice.
When a second template lands, the public read must answer which template a record carries - it does not yet - and the resolver becomes fetch, read the template, dispatch.
It lives under `(gifts)`, so `drawsAGift` keeps the site footer off it per ADR 0003, and the rewrite means it is this route that renders whatever the guest's bar says.

## The old address keeps its promise

A shared link must never die, so `memoify.live/wedding-1/{slug}` answers 301 to `https://{slug}.memoify.live`, query string and guest token intact.
Only the apex redirects - `memoify.live` itself, with or without `www`.
Dev and staging serve the same routes on hosts that are not the apex and have no wildcard of their own, so there the path routes keep working exactly as before, and nothing a path URL is tested on ever lands on production.

## What the couple is shown

The addresses the flow prints all come off `invitationLinkFor` and `guestLinkFor`, which now build the subdomain form, so the published screen, the dashboard listing and the sample guest message all read `https://{slug}.memoify.live` the moment `learnTheAddress` knows the slug.
The field a couple reads their slug in shows `.memoify.live` after the box, as the design draws it; the deviation ADR 0001 recorded there - the path printed ahead of the box, `hbd-byb.18` - is withdrawn.
The apex host is written down once, in `src/lib/invitation-host.ts`, and the middleware and the link builders both read it there, so the address shown and the address served cannot drift (`hbd-6r1` is the standing warning about hardcoded hosts).

## What this waits on

The code is inert until two things outside this repo land, both tracked on `hbd-ca5`.
The nameserver switch to Vercel makes `*.memoify.live` resolve and auto-issues the wildcard certificate; until then the subdomain address the flow prints does not resolve, and the 301 sends followers of old links to an address that does not answer.
The deploy of this change should therefore follow the DNS cutover, not precede it.
The backend's CORS allowance for `https://*.memoify.live` is the second: no guest-side call needs it today, because the RSVP and the guest resolution are server actions posted to the invitation's own origin, but the MemoRoll guest photo upload will hit the uploads endpoint from the browser when it lands, and any future client-side call from the new origin needs the allowance in place.

## Consequences

Slugs were already fit for this: minted lowercase from letters, digits and hyphens, globally unique, and frozen from publish.
A path spelling anything a DNS label cannot carry is not redirected, and the route refuses it in its own words, because a redirect to an address no subdomain could serve would trade one dead link for another.
`{slug}.memoify.live/anything-else` serves the site's own routes rather than the invitation, which is harmless and unlinked-to; tightening it is not worth a rule until something links there.
The check's published screen and slug field expectations assert the subdomain form now, so `npm run visual` holds the new address exactly as it held the old one.

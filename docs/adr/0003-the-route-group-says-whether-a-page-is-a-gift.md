# The route group says whether a page is a gift

The site footer stays off any page that draws somebody's gift, and what settles whether a page does is the route group it lives in.
A page under `(gifts)` or `(scrapbooks)` is a gift, whether it is the sample the product links to from `/templates` or the `[id]` viewer a recipient was sent.
Everything else is the product's own UI and keeps its footer.

This is decided in one place, `drawsAGift` in `src/lib/gift-routes.ts`.
Everything the product would otherwise put on a gift asks it, rather than keeping a list of its own: `src/app/session-provider.tsx` asks it once and both the site footer and the promotional ads modal read that one answer.

## Why not a list of routes

There was a list, and it was wrong in three of its four entries.

It compared four literal paths against `usePathname()` with exact equality: `/spotify`, `/magazinev1`, `journal` and `/wedding-template-1`.
`journal` has no leading slash and so could never equal a pathname.
`/spotify` is not a route; the template is served at `/spotifyv1`.
And exact equality only ever matched a template's bare sample page, never the `/<template>/<id>` viewer, which is the page a recipient is actually sent.
So the one page the rule existed to protect was the one page it never covered, on every template.

A list also has to be edited for every gift template ever added, and is wrong from the day the template lands until somebody remembers.
A new template already goes in `(gifts)`, so reading the group instead means there is nothing to remember.
`useSelectedLayoutSegments()`, read from the root layout, includes the route groups a page is nested in, which is what makes the group readable at runtime at all.

## Journal keeps its gallery and loses its entries

`journal` was the entry that raised this, and adding the missing slash would have been the wrong fix.

`/journal` is not somebody's gift.
It is the product's public gallery of journals, with its own marketing copy and its own Open Graph card, and `/journal/create` writes one.
Only `/journal/<id>` is a journal somebody was given, which is also the link `src/lib/utils.ts` builds when it shares one.
`/photobox-newspaper` is the same shape with a different product on top: the route itself is the photobooth a person takes their picture in, and `/photobox-newspaper/<id>` is the front page they were given.

Both live in `(core)` rather than in a gift route group, so they are named in `gift-routes.ts`, and only the route directly beneath them, the one naming a piece of content, counts.

## Consequences

Journal entries, and every `[id]` viewer of every template under `(gifts)` and `(scrapbooks)`, no longer carry the site footer.
That is a visible change to pages that have been carrying it since the list was written.

Four gift routes were not covered, because they sat in `src/app/(landing)/` itself rather than in either group: `albumgraduation1`, `graduationv1`, `graduationv2` and `netlfix-wedding`.
They have been moved into `(gifts)`, which changed no URL, and the rule now covers them.
`src/app/(landing)/wedding-invitation` stays where it is: it is the product's marketing page for the wedding invitation, with its own Open Graph card, not somebody's invitation.

The promotional ads modal asks `drawsAGift` too, so no advertisement opens over a gift.
It keeps a short list beside that answer, but only of the product's own routes - `/create` and `/payment` - where an ad would interrupt somebody building a gift or paying for one.
That list matches a route and everything beneath it rather than by equality, so it does not repeat the hole described above: `/create/wedding-invitation` and `/payment/paypal-success` need no entry of their own.
It does not reach the two build pages that hang off another product's route, `/scrapbook/create` and `/journal/create`, which is `hbd-00d`.
No gift route appears in it, so a template added tomorrow is covered by the rule alone.
The modal also closes itself on arriving at a gift, because this provider outlives a navigation and an ad opened on a page that allows one would otherwise still be standing on the page that does not.

The check cannot see any of this from the other side.
`visual/expectations/page-chrome.mjs` asserts the site footer is present on the Create Flow's screens, which guards the rule against hiding the footer where the product wants it.
It cannot assert the absence of an element, so a rule that stopped hiding the footer on a gift would pass.

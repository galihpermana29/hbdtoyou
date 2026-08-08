# Path URLs, not per-invitation subdomains

The wedding invitation design shows a couple choosing a custom domain and the published invitation living at `FreeAtLastWithElias.memoify.live`.
We hold the invitation's Invitation Slug and serve the invitation from a path, `memoify.live/wedding-1/<slug>`, rather than a subdomain.

A real subdomain per invitation needs wildcard DNS, a wildcard TLS certificate, and host-to-content mapping in middleware.
None of that is frontend work and nobody owns it yet, whereas the entire user-facing flow works identically on a path.

## The path carries the template

`wedding-1` is Wedding Template 1, which is the one wedding template that exists.
More are expected, and they are separate templates rather than skins of one, so an address that named only the slug would leave a route with no way to tell which template it was asked for.
Naming it in the path answers that where the address is read, rather than by looking the invitation up first to find out how to draw it.

## What the couple is shown

The field a couple reads their slug in shows `memoify.live/wedding-1/` ahead of the box, rather than the `.memoify.live` the design draws after it.

Following the design there would promise an address the product does not serve.
A couple would read "your invitation is at FreeAtLastWithElias.memoify.live" on one step and be handed a different address on the next, which is what `hbd-byb.18` was raised for.
The fixed part of the address is therefore read first, left to right, exactly as the finished link reads.

The slug itself is no longer the couple's to choose.
There is no endpoint that can say whether a name is free, so a couple picking one could only be told it was taken after failing.
The backend generates a slug when an invitation is created without one, and the field is read-only.

## Consequences

The slug is unique and visible in the shared link, so the address the couple sends behaves as the design's does.
The URL's shape differs, and so does who names it.
Moving to subdomains later is a middleware change plus a redirect from the old paths, because the slug is already the identifier.

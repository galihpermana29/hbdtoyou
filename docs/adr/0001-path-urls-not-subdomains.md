# Path URLs, not per-invitation subdomains

The wedding invitation design shows a couple choosing a custom domain and the published invitation living at `FreeAtLastWithElias.memoify.live`.
We store the couple's choice as an Invitation Slug and serve the invitation from a path, `memoify.live/wedding/<slug>`, rather than a subdomain.

A real subdomain per invitation needs wildcard DNS, a wildcard TLS certificate, and host-to-content mapping in middleware.
None of that is frontend work and nobody owns it yet, whereas the entire user-facing flow works identically on a path.

## What the couple is shown

The field a couple types their slug into shows `memoify.live/wedding/` ahead of the box, rather than the `.memoify.live` the design draws after it.

Following the design there would promise an address the product does not serve.
A couple would read "your invitation is at FreeAtLastWithElias.memoify.live" on one step and be handed a different address on the next, which is what `hbd-byb.18` was raised for.
The fixed part of the address is therefore read first, left to right, exactly as the finished link reads.

## Consequences

The slug is still user-chosen, unique, and visible in the shared link, so the couple's experience matches the design.
Only the URL's shape differs.
Moving to subdomains later is a middleware change plus a redirect from the old paths, because the slug is already the identifier.

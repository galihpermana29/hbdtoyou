# A Shot develops at capture

> **Amended 2026-08-24: this decision keeps its substance and loses its word.**
> "Develop" now means the guest-facing ceremony the design draws - an undeveloped Roll, the Dark Room, the photos seen for the first time.
> What this ADR describes is now called **baking**. See "The rename" at the end.

A MemoRoll Shot is finished the moment it is taken: the camera bakes the guest's chosen Film, the Date Stamp the Film burns in, and the memoify.live Watermark into the JPEG itself.
The stored photo is the developed photo, and the negative never exists - there is no original to re-develop, no filter to peel off later.

## The alternative was metadata

The other shape was to keep the pixels clean and carry the Film as a field on the Shot, applied as CSS wherever it renders.
That keeps the original and makes the look reversible - which is exactly what MemoRoll refuses.
The product's whole premise is a disposable camera: no retakes, no edits, a shot that costs something.
Reversible film would also spread the look's enforcement across every renderer - the gallery grid, the dark-room viewer, the camera thumbnail, the creator's moderation view, and whatever serves downloads later - each of which could forget it.
Baked pixels keep every downstream surface dumb.

## Consequences

- When the upload service lands, what goes to storage is already the finished artifact: filtered, stamped, watermarked. There is no server-side develop pipeline to build and nothing to migrate.
- The choice of Film is unrecoverable by construction. A guest who shoots ten frames of HP5 has a black-and-white roll forever, the same as they would on film.
- The Date Stamp belongs to the Film (None carries no stamp); the Watermark belongs to the product and rides on every Shot. Renderers must not print either a second time over a guest's own Shot.
- This is also why the creator's film toggle went away without a replacement: a look decided per Shot at capture leaves nothing for the couple to configure.

## The rename

The 2026-08-24 design gives a guest a button that says **Develop My Roll**, a Dark Room that says "Developing…", and a My Roll that is **undeveloped** until they press it.
That is a different act from the one this ADR named, and it is the one a guest actually reads.
Two meanings cannot share a word, and between a term on a button and a term in a codebase, the button wins.

So the pixel pipeline this ADR decided is now called **baking**: the Film, the Date Stamp and the Watermark are baked into the JPEG at capture, irreversibly, with no negative kept.
**Developing** is what turns a Roll a guest cannot see into one they can.

Nothing about the implementation changes, and the argument above stands unaltered - a baked Shot is exactly as unrecoverable as a developed one was.
It is also closer to the metaphor the product is built on: on real film nothing is visible at capture either, and the roll is developed later.

What follows from it:

- `developMemoRollFilm` in `src/lib/memoroll-film.ts` becomes `bakeMemoRollFilm`. Its five call sites in `docs/research/memoroll-film-look.proof.mjs` move with it, and that proof must still run.
- `camera-capabilities.ts` moves to `src/lib/memoroll-camera.ts`, which the same proof script compiles by path.
- A guest can develop their own Roll the moment their shots are spent, mid-event, without waiting for the reveal. The reveal gates everyone else's Shots, not their own.


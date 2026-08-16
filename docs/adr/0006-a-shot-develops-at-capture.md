# A Shot develops at capture

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

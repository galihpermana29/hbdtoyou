# MemoRoll is a standalone product, and the demo renders the same components

MemoRoll owns its own event - a vibe, a name, a cover, a time window, a venue, shots per guest, a reveal time - and anyone can create one without a wedding invitation existing.
The wedding invitation may link to a MemoRoll later, prefilling its venue and address, but nothing in the product depends on that today.
The clickable demo and the real product are not two implementations of one design: they are two thin surfaces over one component layer, and the demo passes mock data where the product will pass real data.

## Why standalone

The design argues both ways and we picked the reading that satisfies all of it.

Step 1 of the creator flow offers *Romantic & timeless (Wedding)*, *Fun & spontaneous (Birthday)* and *For all the little moments (Trips, Parties, Gatherings)*, which only makes sense if a MemoRoll can exist for an event that has no invitation.
Against that, the Venue and Address fields carry the hint "We get this from your digital invitation", which only makes sense if one does.

Standalone-with-an-optional-link satisfies both: the fields are editable, they are prefilled when there is something to prefill from, and the hint describes a connection rather than a requirement.
The alternative - MemoRoll exists only inside a wedding invitation - would have meant deleting Birthday and Trips from a designed screen, which is a design change and not ours to make.

This is also what finally gives hbd-o3f an answer.
The Create Flow's MemoRoll switch currently turns on a feature with nowhere to point; a standalone MemoRoll is somewhere for it to point.

## Why one component layer

"The demo and the product must look the same" is a promise that decays if it depends on anyone remembering it.
Two copies of nineteen screens drift by the second week, and the demo is the thing shown to people deciding whether to use the product, so the copy that drifts is the one being judged.

So the screens live in `src/components/memoroll/{guest,creator,ui}/`, take a plain view model as props, and fetch nothing.
`src/app/memoroll/demo/` holds mocks and the demo dock; the product surface will hold the real reads.
A screen that reaches for `useShots`, `localStorage` or an API is in the wrong layer.

## Consequences

- The camera's technical stack is unaffected and stays where it is: `src/lib/memoroll-film.ts` for the develop pipeline, `src/lib/memoroll-camera.ts` for Flash and Torch capability detection, `use-shots.ts` for IndexedDB storage. The new design re-skins the camera; it does not re-engineer it.
- The demo keeps its own route and its own dock, and stays deliberately outside the `(gifts)` route group, for the reason ADR 0003 gives.
- Nothing outside `src/components/memoroll/`, `src/app/memoroll/` and `src/lib/memoroll-*` is touched by this work. The single shared edit is `visual/screens.mjs`, whose `FIGMA_FILE_NAME` becomes per-screen so the harness can check screens from a second Figma file.
- The wedding link is not built, not stubbed and not designed around. When it arrives it prefills two fields.

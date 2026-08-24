# The MemoRoll design, frozen

This directory is the design MemoRoll is built from.
It was captured on 2026-08-24 from the Figma file "Randos", through the plugin bridge, from the two sections the designer had selected: `Guest` and `Creator`.

It exists because the bridge is not a source anyone can build against.
It answers only while somebody has the plugin open, the beads are worked unattended overnight, and the file renumbers itself between sessions - the previous capture's ids (`79:194`, `80:590`, `103:260`) name nothing in the file today.
A live read can therefore disagree with the design a bead was written against, silently.

So: **build against this capture, not against the bridge.**
If the design genuinely moved, that is a design change.
Re-capture on purpose, say so, and re-cut whatever it invalidates.

## What is here

| | |
|---|---|
| `design-nodes.json` | the raw capture: both sections, every node, every style. The truth. |
| `inspect.mjs` | how to read it without loading 2.5MB into a context window |
| `frames/*.jpg` | every screen exported at 2x. Evidence, not truth - see below |
| `frames/flow-*.jpg` | the two whole sections, for orientation |

Screenshots decide nothing.
They are lossy, and the colours in them are JPEG approximations.
Every value you build from comes out of `design-nodes.json`; the frames are for seeing what a screen is meant to feel like, and for catching a layout you have read wrongly.

## Reading it

```
node docs/design/memoroll/inspect.mjs                          every screen, with its node id
node docs/design/memoroll/inspect.mjs guest-09-camera-a        one screen, full tree
node docs/design/memoroll/inspect.mjs guest-09-camera-a --depth 3
node docs/design/memoroll/inspect.mjs guest-11-popup-how-a --copy    verbatim copy, in order
node docs/design/memoroll/inspect.mjs --node 434:7827          any node by id
node docs/design/memoroll/inspect.mjs --fonts                  type census
node docs/design/memoroll/inspect.mjs --colors                 colour census
```

Each node prints its box, its fills, strokes, radius, effects and auto-layout, and each text node prints its family, style, size, line height, tracking, weight, alignment and its exact characters.

## Four traps in this file

**Off-canvas leftovers.**
Earlier versions of these screens were parked far off the artboard rather than deleted.
The Camera frame is 375 wide, clips its content, and has three children sitting at x ≈ -16830.
They are fully styled, they are in the tree, and they are invisible.
`inspect.mjs` hides any child whose box does not intersect a clipping parent and says how many it hid; `--all` shows them.
This is not cosmetic: the leftovers are the *previous* design's camera, in Homemade Apple, and an agent reading the raw tree would faithfully rebuild the thing this work is replacing.

**iOS chrome is mocked, not designed.**
Every frame carries an iOS status bar at the top and a Safari tab bar at the bottom, in SF Pro and SF Compact, with `memoroll.com` in the address bar.
None of it is ours to render.
If a face in the type census is SF anything, it belongs to the mock.

**Placeholder copy that looks like content.**
The camera's film pills read `RAW`, then `Portra 400` three times.
Three identical labels is a placeholder, not a roster - and Portra 400 is Kodak's trademark. See the deviations below.

**Mixed runs.**
Six text nodes report their family and size as `mixed`, because they carry more than one style in one string.
For those, read the frame image.

## The guest flow

```
QR or link
  └─ event started? ──no──▶ guest-04-countdown   "Come back when the function begins."
        │yes
  ▼
guest-01/02/03-landing        the cover, one of six templates, CTA "Let's Shoot!"
  ▼
SSO
  ▼
guest-05-username             "This you?" over an editable handle
  ▼
guest-07-location-allow ──outside 500m──▶ guest-08-location-blocked  "Check Again"
  │inside
  ▼
guest-09-camera               + guest-11-popup-how, shown once on first entry
  ▼
guest-13-gallery-all-during   ALL: everyone's, blurred, "Ends in"
  ├─ My Roll, shots left      guest-15-myroll-undeveloped   blurred, no CTA
  ├─ My Roll, zero shots      guest-16-myroll-develop-cta   "Develop My Roll"
  │     ▼
  │  guest-17-darkroom        "Developing…"
  │     ▼
  │  guest-18-myroll-developed  sharp, stamped, signed - mid-event, no reveal needed
  ▼
reveal time
  ▼
guest-14-gallery-all-after    ALL: sharp, "Ended on May 4th 2026, 12:00PM"
  ▼
guest-19/20-preview           one photo, swipeable, "Who took this?"
```

Two gates, and they are independent.
**Your own Roll** develops when *your* shots hit zero, and is sharp to you immediately, event still running.
**ALL** stays blurred for everyone until the creator's reveal time, whatever you did with your own roll.

## The creator flow

The steppers say the order, and they disagree with the order the frames are laid out in.
White is done-or-current, grey `#808080` is not yet, so the highest white number is the step you are on.

| # | Screen | Asks |
|---|---|---|
| 1 | `creator-02-vibe` | Wedding / Birthday / Trips, Parties, Gatherings |
| 2 | `creator-06-name-your-roll` | the event name |
| 3 | `creator-03/04/05-make-it-yours` | cover style - Collage, Taped wall, Simple - and photos |
| 4 | `creator-07-time` | when the roll opens |
| 5 | `creator-08-venue` | venue, address, and the 500m "Only at the venue" switch |
| 6 | `creator-09-shots-per-guest` | how many shots each guest gets |
| 7 | `creator-10-reveal-timing` | when the roll develops. CTA is "Create Now" |
| 8 | `creator-11-ready-to-publish` | Edit / Preview / Publish, then the QR bottomsheet |

Step 5's venue and address both carry the hint "We get this from your digital invitation".
MemoRoll is being built standalone and the wedding link is deliberately later, so that hint describes a connection that does not exist yet.
It ships as written - it is the designer's copy, and the fields are editable either way.

## Tokens

**Type.** Four families, and every one of them earns its place:

| Family | Job |
|---|---|
| Plus Jakarta Sans | everything structural. Regular, Medium, SemiBold, Bold, ExtraBold, ExtraBold Italic |
| Passion One Bold | the `MEMO R⬭LL` wordmark, where the O is an orange lozenge. Nothing else |
| Oooh Baby | the event name in script, 32 on the covers |
| Sometype Mono | "Created by Memoify.live" at 10, in the footer. Nothing else |

Homemade Apple and Poppins are **not** in this design.
Homemade Apple appears in the capture only inside the off-canvas leftovers.

Sizes actually in use: 44, 32, 25, 23, 20, 18, 17, 16, 14, 12, 10, 8.
Line height is almost always 150%, tracking almost always -1.1%.

**Colour.**

| | |
|---|---|
| `#f7f5f3` | the paper ground - landing, gallery, creator |
| `#232323` `#212121` `#1b1b1b` | the camera's dark ground |
| `#ff3e09` | the one accent. Shutter, back button, wordmark lozenge, stepper marks |
| `#e0dabf` | cream. **Selected** film pill, selected tab, counter text |
| `#dadada` `#808080` `#999999` | greys, in that order of frequency |
| `#fdd8b8` `#e7caab` | warm tints on the covers |
| `#ae9ea6` | the mauve of the shutter dock and the counter's outer pill |

Selection is expressed the same way in two places: the chosen thing is cream on dark, the unchosen are dark with cream text.

**Shape.** Radius 16 on the viewfinder, 10 on cards, full-round on pills and the shutter. Prints in the gallery are white-bordered, individually rotated a degree or two, with a soft drop shadow.

**Blur.** `LAYER_BLUR 4` for a photo that is hidden, 6 and 10 mid-develop in the Dark room. Not a colour overlay - a real blur.

## Deviations from the design, agreed

The rule in this repo is that the design is literal truth, including its errors (ADR 0002).
Three departures are deliberate and recorded.

1. **The film pills are not "Portra 400".**
   Six pills ship: `RAW` and the five original recipes already in `src/lib/memoroll-film.ts`.
   Portra 400 is Kodak's trademark, and three identical pills is a placeholder rather than a roster.
   `RAW` is adopted as the label for the no-film option, replacing "None".

2. **No iOS status bar and no Safari tab bar.** They are mockery of the browser, not the product.

3. **Two animations are approximated.**
   The designer attached reference videos to the Landing and to the Dark room as Gumlet links, which cannot be read from here.
   Both are built from the animation guidance in this setup and marked as approximations pending her references.

## What the capture does not contain

The two interaction reference videos, and anything she draws after 2026-08-24.
Her own notes, in Indonesian, are in the file and worth reading - `--all` will show them:
"Muncul sekali aja pas awal masuk" (the How popup shows once, on first entry),
"CTA muncul pas udah 0 shots nya" (the Develop CTA appears at zero shots),
"Cue hand swipe pas awal awal aja" (the swipe hint shows only the first time).

## Re-capturing

Needs the bridge live, which needs the Figma plugin open.
Export frames with `save_screenshots`, save the selection JSON over `design-nodes.json`, then update `SCREENS` in `inspect.mjs` if ids moved.
Convert PNG exports to JPEG before committing (`sips -s format jpeg -s formatOptions 85`); the raw PNGs are 22MB.

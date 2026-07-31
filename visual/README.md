# Visual comparison harness

Renders a Create Flow screen in a real browser at 1440px wide, captures the full page, and compares it against an image exported from the Figma design.

It exists so that "pixel-perfect" is a result rather than an opinion.
The design is the source of truth at 1440px, taken literally, including its copy errors.
See `docs/adr/0002-figma-is-literal-truth.md`.

## Setup, once

```sh
npm install
npx playwright install chromium
```

The second line downloads the browser, roughly 95MB.
It is not a `postinstall` hook, because everyone who never runs this harness would pay for it on every install.

## Running it

```sh
npm run visual
```

That is the whole command.
It starts the app on port 3210 if nothing is already serving there, drives a headless Chromium to each screen, captures, compares, and stops the server again.
An app already serving that port is reused, so iterating on one screen does not pay the dev server's start-up every time.

```sh
npm run visual -- --screen=details-and-story-expanded   # one screen
npm run visual -- --threshold=0.01                      # a looser gate for one run
npm run visual -- --base-url=http://127.0.0.1:3000      # an app you started yourself
```

Exit codes carry the verdict:

| Code | Meaning |
| ---- | ------- |
| 0 | every comparable screen is within its threshold |
| 1 | at least one screen differs from the design by more than its threshold |
| 2 | the harness could not run: no server, a capture that never settled, a missing baseline |

Every run writes to `visual/output/`, which is not committed:

- `<screen>.actual.png` - what the browser rendered
- `<screen>.diff.png` - the same page with every counted difference marked red, and antialiasing marked yellow
- `report.json` - the numbers, for anything that wants to read them

## Reading a result

```
DIFFERS details-and-story-expanded: 11.803% of pixels (985,974), threshold 0.200%
        size: design 1440x5801, page 1440x1197
        differs across: 1440x5781 at (0, 20)
```

`size` comes first for a reason.
When the two heights disagree the page is a different length from the design, and every difference below the first divergence is a consequence of that rather than a separate problem.
Fix the height, then read the percentage again.

`differs across` is the rectangle enclosing every counted difference.
Antialiasing marks are excluded from it, so a screen that passes does not report a full-page rectangle just for having text on it.
A small rectangle points straight at the problem.
A rectangle the size of the page means something near the top has shifted everything below it.

## Screens

`visual/screens.mjs` is the list, and it is the only place a screen is defined.
Seven screens are covered: the details-and-story step in each of its four designed states, the guest invites step empty and populated, and the published screen.

A screen is `SKIPPED` when the thing it would compare does not exist yet, either because the route has not been built or because no frame has been exported for that state.
Skipping is not failing.
It keeps a red run meaning "this screen does not match the design" rather than "this screen has not been built".

Only four of the seven states have an exported frame today.
The three remaining details-and-story states need exporting from the design before they can ever be compared; that is design-side work, and until it happens those screens stay skipped.

## The threshold

The default is **0.2% of pixels**, set in `visual/screens.mjs` next to the reasoning.
Equality is not an option: Figma's rasteriser and Chromium never agree on glyph edges, so a screen that is genuinely correct still differs.
Pixelmatch's antialiasing detection absorbs most of that, and 0.2% covers the residue while still failing on anything the size of a single form field.

The threshold starts strict and may only be relaxed with a recorded reason.
`--threshold` exists for exploring a screen you are working on, not for landing one: it leaves no record.
A value a screen actually needs belongs on that screen in `screens.mjs`, as `maxDiffRatio`, with a comment saying why, where a reviewer will see it.

What the comparison cannot catch is worth knowing.
A field stored under the wrong name, a slug validated by the wrong rule, or two parents joined in the wrong order all look correct.
Human sign-off is still the final gate.

## Determinism

The Site Preview renders the live invitation, so it animates and it loads remote imagery.
Three things hold it still, and the panel is frozen rather than masked so the comparison still sees it:

- the browser runs with reduced motion, and captures with animations disabled
- a stylesheet pauses every animation and collapses every transition
- the page is screenshotted repeatedly until two consecutive captures are byte-identical

The third is the one that matters, because it covers animation driven from JavaScript and images that arrive late.
If the page never stops changing the capture fails loudly rather than comparing an arbitrary frame.

## Regenerating the baselines

```sh
FIGMA_FILE_KEY=<key> npm run visual:baselines
```

The file key is not stored anywhere in this repository, and the script refuses to run without one.
The design is read through the Figma plugin bridge rather than the REST API, because the account's plan rate-limits the API partway through a session, and the key the bridge reports **changes between sessions**.
A key committed today is a silently wrong export tomorrow, so it is read at the start of every run.

To find the current key: open the bridge plugin in the Figma desktop application, then ask it to list its files.

The command prints which Figma node becomes which baseline file, and which states have no frame to export yet.
Both come from `visual/screens.mjs`, the same manifest the comparison reads, so the export list and the screen list cannot drift apart.

## Checking the harness itself

```sh
npm run visual:self-check
```

Every screen reports red until this epic is finished, and a permanently red command is one nobody trusts.
This compares each baseline against itself, expecting no difference; then against a copy with a patch inverted, expecting a difference in exactly that place; then a pair that differs only in antialiasing, expecting no difference and no region.
It needs no browser and no server.
When it passes, a red screen means the screen.

# Visual check harness

Renders a designed screen in a real browser, drives it into its designed state, and asks it what it is: the copy each element renders, where it sits in the document, and how it is styled.
That is compared against values taken from the Figma design.

It exists so that "matches the design" is a result rather than an opinion.
The design is the source of truth, taken literally, including its copy errors.
See `docs/adr/0002-figma-is-literal-truth.md`.

Two things are checked.
The Create Flow, which is the seven screens a couple fills their invitation in, drawn at 1440px.
And Wedding Template 1, which is the invitation itself, drawn as a phone: it renders as a fixed column at any window width, so it is driven at the same 1440px and its own frames are 375px wide.

## What is asserted, and what is never asserted

For each element the design describes, the check asserts typeface, size, weight, line height, letter spacing, colour, background, border colour, width and style, corner radius, shadow, padding, margin and gap, together with the exact copy the element renders and where it sits in the document relative to every other element.

Two properties carry a behaviour rather than an appearance: `overflow` and `contain`.
They are asserted in five places, each of them something defined by the behaviour rather than by how it looks.
On everything below the envelope, which a sealed invitation contains out of the page and an opened one lets go - the difference between an envelope a guest has to open and one they can scroll past.
On `body` while the invitation is sealed, which says the page is still the guest's own to scroll: an envelope taller than the window has to be scrolled down before its one control can be pressed.
On `body` again while the RSVP is open, because the invitation does not scroll under a guest who is replying to it.
And on the Messages section's list of Guest Messages, which the design draws as a box shorter than the list inside it, so a list a guest cannot scroll is not that section.
And on the Guest List's columns in the Create Flow, which carry more about a guest than the card the design draws is wide, so they scroll on one axis and not the other - a table that also scrolled downwards would hide guests as well as columns.
It is the only part of any of them that a computed style can hold.

It never asserts a width or a height.
That is the whole point.
A field that stretches to its container is correct at any size, so measuring one would fail correct work and train everyone to ignore the check.
The property list is an allow-list, and a dimension is refused by name with an explanation, so one cannot arrive by accident.

Screenshots are still captured on every run and written beside the report.
They exist so a person can see what the check saw.
They decide nothing.

Comparing rendered screenshots pixel by pixel was tried first and removed.
It failed a correct screen whose input happened to be a few pixels wider than the design's, and on a mostly white page it barely noticed a genuine fault: a capture missing four fifths of the page scored as only twelve percent different, which reads as almost right.
A missing element now fails outright, named.

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
It starts the app on port 3210 if nothing is already serving there, drives a headless Chromium to each screen, checks it, and stops the server again.
An app already serving that port is reused, so iterating on one screen does not pay the dev server's start-up every time.

```sh
npm run visual -- --screen=details-and-story-expanded   # one screen
npm run visual -- --base-url=http://127.0.0.1:3000      # an app you started yourself
```

Exit codes carry the verdict:

| Code | Meaning |
| ---- | ------- |
| 0 | every checkable screen matches the design |
| 1 | at least one screen differs from the design |
| 2 | the harness could not run: no server, a capture that never settled, a broken manifest |

Every run writes to `visual/output/`, which is not committed:

- `<screen>.actual.png` - what the browser rendered, as evidence
- `report.json` - every failure, for anything that wants to read them

## Reading a result

```
DIFFERS details-and-story-expanded: 3 failure(s) across 59 checked elements
        Page title - copy
          expected: Create Wedding Invitation
          actual:   Create your wedding invitation
        Page title - fontSize
          expected: 18px
          actual:   30px
        Cover Header Section card - presence
          expected: one element matching "form section:nth-of-type(1)"
          actual:   nothing matched
```

Every line names one element and one property, with what the design says and what the page did.
There is no percentage, because a percentage cannot be acted on.

`presence` means the element is not there at all.
When the element was looked for by its copy, the failure also names the nearest copy the page does render - the one sharing the most words with it, ignoring case - which turns a typo into two spellings side by side rather than a hunt.
When a position was asked for, the failure says how many were found instead, which separates "the element is missing" from "there are fewer of them than the design has".

`position` means the element exists but the design puts it somewhere else in the document relative to the others.

## Screens

`visual/screens.mjs` is the list, and it is the only place a screen is defined.
Twelve screens are covered.
Seven are the Create Flow: the details-and-story step in each of its four designed states, the guest invites step empty and populated, and the published screen.
One is Wedding Template 1 sealed, which is the invitation as a guest is sent it.
Three are its Showcase opened, which is one screen rendered with each of the three sets of Example Content - flattering, realistic and hostile.
One is the RSVP a guest replies on, opened over the invitation.

The three opened screens share one manifest, because the design owns the type, the order and the words around a couple's answers rather than the answers themselves.
Checking that one manifest at three lengths of answer is how a section that cannot hold a real couple's content is caught by a command rather than by somebody looking.
Each of them opens the envelope first, the way a guest does, so the seal is exercised on every run: if it stops releasing, all three fail at once.

The sealed screen is the only one driven nowhere first, because sealed is how an invitation arrives.
It claims the Hero and nothing below it, and it is where the three things only a sealed invitation has are asserted: the envelope is closed over its cards, everything below the envelope is out of the invitation, and the page is still the guest's own to scroll.
The first of those is a claim about counting rather than about a style - the design draws a closed envelope with the cards not drawn at all, so the first line of words on the page is the one asking a guest to open it, and a build that still drew them would report the wrong copy three lines running.
The second is one region and two marks, because "not yet" has two halves.
`inert` takes a subtree out of the focus order and out of the accessibility tree at once, so without it a build a guest could Tab down to the RSVP on would pass every screen here.
`contain: size` takes it out of the page's layout, so the page ends where the envelope does and there is nothing past it to wheel to.
The three opened screens claim the same region with both gone, which is how a run says the invitation let go again.
The third claim is what makes the second the right way round: holding the page still would keep a guest to the envelope too, and did until `hbd-du8`, but it also stranded anybody whose window was shorter than the envelope, with the one control 527px down an 812px Hero and no way to scroll to it.

The RSVP screen opens the envelope and then presses RSVP Now, which is how a guest reaches the card: the design draws it as a frame of its own and it has no URL.
It claims the card and not the invitation behind it, since three screens already assert that, and it claims the page as well - the invitation does not scroll while a guest is replying.

### Where it stands

All twelve screens match the design, so `npm run visual` exits 0.
It last went red on the two differences every template screen shared - every line set 1.5 loose where the design lets the typeface decide (`hbd-a09.13`), and the five bordered controls omitting the 10px the design puts inside them (`hbd-a09.14`) - and both have landed.
A red run now means a screen has moved away from the design.

A screen is `SKIPPED` when the thing it would check does not exist yet, and the reason says which.
`route not built yet` is code-side work.
`nothing recorded from the design yet` is the expectations file, which is the work of the bead that builds that screen.

Skipping is not failing.
It keeps a red run meaning "this screen does not match the design" rather than "this screen has not been built".

## Expectations

`visual/expectations/<screen>.mjs` holds what the design says one screen is, in the order the design arranges it.
Every value there was read from the Figma frame named at the top of the file.

Where several screens are the same screen in different states, that file names the state and the values live in one file beside it.
The details-and-story step is drawn as four frames differing only in which Sections are open, so `details-and-story.mjs` says what the step is and each of the four names the Sections its frame draws open.
`guest-invites.mjs` does the same for the two states of the guest invites step, and `page-chrome.mjs` for what every step shares above its own content.

An expectation is written in ordinary CSS syntax and compared against whatever spelling the browser reports, so `#e34013` matches `rgb(227, 64, 19)`, `24` matches `24px`, and `bold` matches `700`.
Failures show the normal form, where a see-through colour reads as `#101828@0.05`.
Only the first family of a font stack is compared, because the fallbacks are the implementation's business and not a design decision.
A colour written by name is refused: a browser never reports one that way, so `white` could only ever fail against the `#ffffff` the page reports.

Elements are found two ways, and the choice decides what a failure reads like.

A structural selector says where an element sits and lets its copy be checked as a claim, so a typo reports as a `copy` failure with both spellings.
Those selectors use nothing but ordinary HTML and the standard ARIA patterns - `header`, `nav[aria-label="Breadcrumb"]`, `h1`, `form section`, `label` with its control, `[role="group"]` for a field the design builds from more than one element, `button`, `button[aria-expanded]` for the one that opens a Section, `inert` for a region nobody may reach yet, `footer` - and that list is the whole contract a screen has to satisfy.
The invitation adds one plain `main > div`, for the region below the envelope once it has been opened: `inert` is what marks it out of reach and is exactly what an opened one no longer has, so there is nothing left to find it by but its place in the markup.
It is the only `div` `main` owns, and a second one would fail the run as an ambiguous selector rather than quietly claim the wrong element.

The Guest List card adds the other, `form [role="group"] > div`, for its header and for the region its columns scroll in.
Neither has anything of its own to be found by - a header is a row of three things the design already claims separately, and the scrolling region is a plain box - so both are asked for by position within the card, `nth: 0` and `nth: 1`.
That is weaker than the `main > div` case and worth knowing: a third `div` added directly inside the card would not fail as ambiguous, it would silently move whichever claim sat after it.
The card holds exactly those two `div`s, and adding a third means renumbering both claims in `visual/expectations/guest-invites-populated.mjs`.
It holds one other element, the line saying the columns scroll, and that is a `p` for this reason rather than by accident.

The chrome above a screen's own content is the same on all four steps, so it lives in `visual/expectations/page-chrome.mjs` and each screen spreads it in.

`withText` is the other way, for elements whose only distinguishing feature is what they say.
Copy is the locator there, so wrong copy reports as a missing element rather than as a copy failure.

An expectation that cannot be checked - no name, no way to find its element, a repeated name, a property this harness does not compare - stops the run before a browser starts, with exit code 2.
That is the harness being broken rather than a screen differing from the design, and it is never silently skipped: a rule nobody notices was dropped is worse than one that fails loudly.

What the check cannot catch is worth knowing.
A field stored under the wrong name, a slug validated by the wrong rule, or two parents joined in the wrong order all look correct.
Human sign-off is still the final gate.

## Determinism

The invitation animates, counts down to the wedding a second at a time, and loads remote imagery, and the Site Preview renders it live inside the Create Flow.
Four things hold it still, and it is frozen rather than masked so the check still sees it:

- the browser runs with reduced motion, and captures with animations disabled
- a stylesheet pauses every animation and collapses every transition
- the clock is fixed, so the countdown is a still image rather than a page that changes every second
- the page is screenshotted repeatedly until two consecutive captures are byte-identical, and only then is it inspected

The last is the one that matters most, because it covers animation driven from JavaScript and images that arrive late.
If the page never stops changing the run fails loudly rather than inspecting an arbitrary frame.

The fixed clock keeps timers running and only holds what they read, so nothing that waits for a tick waits for ever.
The instant is before all three Example Content weddings, so the countdown counts down rather than clamping at zero - though what it counts is the couple's and nothing asserts it.

## Regenerating the design images

```sh
FIGMA_FILE_KEY=<key> npm run visual:baselines
```

`visual/baseline/` holds the frames exported from Figma.
Nothing reads them automatically: they are what a person reads design values from when writing or revising an expectations file, and what a run's screenshot is held up against by eye.

The file key is not stored anywhere in this repository, and the script refuses to run without one.
The design is read through the Figma plugin bridge rather than the REST API, because the account's plan rate-limits the API partway through a session, and the key the bridge reports **changes between sessions**.
A key committed today is a silently wrong export tomorrow, so it is read at the start of every run.

To find the current key: open the bridge plugin in the Figma desktop application, then ask it to list its files.

The command prints which Figma node becomes which image, at what width, which states share another state's frame, and which have no frame to export yet.
All of it comes from `visual/screens.mjs`, the same manifest the check reads, so the export list and the screen list cannot drift apart.

The realistic and hostile sets of Example Content share the flattering set's frame, and always will: the design draws the invitation once, with its own example wedding, and the whole point of the other two is that they are content the design was never drawn against.

## Checking the harness itself

```sh
npm run visual:self-check
```

A screen reports red until the work it describes is finished, and a permanently red command is one nobody trusts.
This checks that a value is read the way a browser spells it, that a matching screen passes, and that each kind of fault - a missing element, an ambiguous one, wrong copy, a wrong property, an element in the wrong place - fails with the element and the property named.
It also refuses an expectation that measures something, and validates every expectations file this repository has recorded.

It needs no browser and no server.
When it passes, a red screen means the screen.

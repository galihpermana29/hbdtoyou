# The Figma design is literal truth, including its errors

The wedding invitation Create Flow is built to match the Figma design's style and arrangement, and copy is taken exactly as written.
Where the design contains a mistake in its copy, we ship the mistake rather than silently improving it.

This exists because "match the design, except where it looks wrong to me" is not a criterion anyone can sign off, which is why an earlier attempt at this work kept feeling unfinished.
Fixing the wording in the design rather than in the code keeps one source of truth.

## What matching means

Matching is a claim about style and arrangement, not about measurements.
Colour, size, weight, line height, border, radius, shadow, spacing and copy must match exactly.

Two things are deliberately not matched.

Widths and heights may be dynamic, because a form field that stretches to its container is correct at any size.

The typeface family stays whatever the application already sets globally, rather than the family the design was drawn in.
Everything else about type is still matched, including size, weight, line height and letter spacing.
Loading a second family for one flow would leave the product in two typefaces for the sake of a difference the couple filling in the form will never notice.

This distinction matters because it decides how the work is verified.
Comparing rendered screenshots pixel by pixel would fail a correct screen whose input happens to be a different width, which is noise rather than signal.
Verification therefore asserts computed style, structure and copy, and never asserts a dimension.

## Consequences

Step 3's stepper description reads "Config guest details on your the invites", and that is intentional.
Do not correct it here.
Corrections belong in Figma, and flow back to us as a design change.

One deviation is agreed and recorded: step 4 is titled "Share with guests", not "Share with communities".
The design uses both across different frames, so it cannot be followed literally, and the wedding-specific wording won.

The details-and-story step is drawn as four frames - every Section closed, the Cover Header open, the Love Story open, and every Section open - and they disagree with each other in two places.
The three that draw the step mostly closed stack Venue Details above Love Story and name the seventh Section "Photo Collection".
"Expanded All", node 332-14392, stacks Love Story above Venue Details and names that Section "Photo Showcase".
A screen cannot restack itself when a Section opens, so this too cannot be followed literally.

The closed envelope is addressed to the guest it was sent to, which the design both asks for and hides.

The design writes a guest's name across the front of it - "Galih & Keluarga", node 332:30838 inside the sealed Hero 332-30920 - and then draws the envelope's own photograph over the top, where the name cannot be read.
So the frame cannot be followed literally: it states a line of copy and hides it in the same breath.
It could not be followed anyway, because there is nowhere for the name to come from.
A guest's name belongs to the Guest List the Create Flow collects, and the template is handed one wedding rather than one guest, so an invitation would first have to know which guest opened it.
Both questions are answered now, one each way.

The line is kept and the hiding is not.
The addressee is drawn in the design's own place, node 332:30838, 152x19 at 115,374 in 16px Sometype Mono, which sits on the face of the envelope clear of the seal above it.
It is drawn over the photograph rather than under it, because a line of copy the design states and then covers is the frame contradicting itself rather than an instruction.

Where the name comes from is still not answered.
A guest's name belongs to the Guest List, and reaching it needs a link per guest, which is `hbd-a09.21` and waits on the Create Flow being wired to a backend at all.
Until then a query parameter supplies one, the same scaffolding shape the Showcase already uses to choose its Example Content, and it comes out when that lands.

An invitation with no addressee draws none.
A placeholder would be worse than nothing, because the one surface of the invitation that is supposed to be a guest's own would carry somebody else's name.

The Love Story asks for three chapters and offers no way to add a fourth or remove one.

The form it replaced let a couple add and remove milestones freely, and this ticket was written expecting that to continue.
The design says otherwise: it draws three chapters, each with its own words - how they met, how they grew closer, and the proposal - and each has its own place on the finished invitation.
There is nothing a fourth could be called and nowhere for it to go, so the absence is the design rather than an omission in it.

Two fields are drawn that the design does not draw at all, because the invitation prints things the form had no way to ask for.

"Wedding Address" in Venue Details, above the location link.
The invitation prints a written street address, and the design asks only for a Google Maps link.
A link gives directions; a guest still needs somewhere written down, and without the field every invitation printed the sample's address.

"Gift Headline" in Gift Registry, above the account.
The invitation prints a line of the couple's own words there, and without the field every invitation printed the sample's.

"Bride Photo" and "Groom Photo" in the Bride & Groom's Introduction, one above each partner's name.
The invitation prints a portrait of each beside their names and the design asks for neither, so every couple who published carried the designer's two models in their own frames.

All four are recorded in the expectations beside the fields the design does draw, so the check covers them rather than ignoring them.
Three other values the invitation printed were resolved without new fields: the map keepsake is the first of the photos Venue Details already collects, the photo sharing block's card is product art the block draws itself, and the Guest Messages block is always shown because guests write those on the invitation rather than the couple enabling them.

The designer settled it, one answer each way, rather than making either frame win outright.
The Sections stack Love Story above Venue Details, following "Expanded All".
The seventh Section is named "Photo Collection", following the other three.

So there is no frame of record for that step.
Each disagreement was decided on its own, and neither frame can be trusted wholesale where they differ again.

The web domain field is read-only and prints nothing under it, where the design draws it as the couple's to type.

An addition was agreed here once and has been withdrawn.
The step used to print a line stating the rules a slug is held to - "Letters, numbers and hyphens only, 3 to 63 characters, starting and ending with a letter or a number" - because a couple who cannot see the rules can only find them by being refused, which is what user story 34 on `hbd-byb` exists to prevent.
That reasoning ended when the typing did.
There is no endpoint that can say whether a slug is free, so a couple choosing one could only be told it was taken after failing; the backend generates the slug instead and the field shows it.
Rules for typing something nobody types, and a message naming a fault nobody can have caused, are both words a couple cannot act on, so neither is drawn.

The field is still a field rather than a line of text: it is the address they are about to send, so it stays reachable, selectable and copyable.
`visual/expectations/guest-invites.mjs` claims the box and its value and no longer claims a hint, so the line cannot come back unnoticed either.

Two additions are agreed and recorded: the Gift Registry Section and the Background Track field each carry a switch the design does not draw.

The invitation is created with four feature flags and the design draws a control for exactly one of them, MemoRoll.
The other three are `rsvp_enabled`, `digital_gift_enabled` and `song_request_enabled`, and two of those are plainly a couple's decision rather than the product's: whether the block asking for a gift appears at all, and whether the invitation offers a track.
Following the frame literally would ship two answers the couple can never give, each defaulted on their behalf, one of which asks their guests for money.

`rsvp_enabled` gets no switch and is always on.
Replying is the only way a guest can leave a message, so turning it off would silently empty the Guest Messages a couple can watch being written - which is a different thing from the couple choosing to stop taking replies, and there is no design for either.

Both switches are the shape the design does state, `src/components/forms/wedding/flow-switch.tsx`, which is MemoRoll's own switch written once and worn by all three rather than drawn again slightly differently twice.
Each sits at the end of the line naming what it turns off: the Gift Registry's at the right edge of the Section header, past the control that opens it, so a couple who has decided against a gift block does not have to open five questions to say so, and the Background Track's on that field's label line.
Both start on, because the invitation the design draws has both and a couple who never touches them should get the invitation they were shown.
All three are claimed in `visual/expectations/details-and-story.mjs`.

The fade over the foot of the Guest Messages is drawn as the design draws it, and lets go as a guest scrolls to the end of the list.

The design draws that band, node 312:1785, as one still: 105px of gradient reaching rgba(0,0,0,0.8) at the bottom of a 509px list.
A still cannot say what it does once the list is scrolled, and the list scrolls now, so the frame has to be read as one state of something rather than as all of it.
A fade at the foot of a list says there is more below it.
At the end of the list that is no longer true, and the band is then dimming the last wish a guest came to read in order to say something untrue, so it lets go over the last 105px of the scroll.

Every frame the design does draw is untouched by that.
A list nobody has scrolled is always at the band's full strength, including one with nothing to scroll at all - which the design's own five messages come within 2px of being, since they were drawn to fill the box exactly.
Reading the rule as "no messages below, no band" instead would take the band out of the very frame the design draws, and `hbd-a09.8` settled that the design's fade stays.

No run verifies this.
`visual/style-vocabulary.mjs` carries no `backgroundImage`, so a gradient can be neither asserted nor found by the check, and the band has neither copy nor border to be found by instead.
What settles it is a browser driven to the end of the list, asserting that the bottom of it renders identically with the band taken away, and at rest that it does not.

One addition is agreed and recorded: the Guest List carries six columns where the design's table draws one, and the uploader offers the file to fill them in.

The design draws a Guest column and an Action column, and the backend accepts six things about a guest - name, group label, phone, email, maximum plus ones and notes.
Maximum plus ones is the one that earns its place beyond tidiness: it is what caps how many people a guest may bring, and without it every guest gets whatever the backend defaults to.
So the frame cannot be followed literally without shipping a form that collects a fifth of what the product can store.
Whatever the table does not show a couple can neither check nor correct, and their only other recourse is to fix the spreadsheet and upload the whole list again, which replaces every guest.

Six columns and a couple's own notes do not fit the width the design draws the card at, so the columns scroll sideways inside the card rather than widening it.
A table that pushed the page sideways would move everything else on the screen to make room for a phone number.
It is a tab stop, because a region only a pointer can scroll is a region somebody navigating by keyboard cannot read the far side of.

The dashed area the design draws says only "Upload in format .CSV", which leaves a couple guessing which six columns and in what order.
A control reading "Download CSV template" is therefore printed on the end of the size limit's line, in the accent every action in the flow is drawn in, and it downloads a file carrying the six headings and no example row - a row that file carried would be read as a guest by the couple who forgot to delete it.
It stays on the screen once a list is uploaded, on a line of its own under the card, because uploading again is the only way to change a column the first file never had, and the couple who has just seen five empty columns is the couple who most needs the file to fill them in.
Under the card rather than inside it: the design's card header holds a title, a date and Upload File at a stated spacing, and putting a fourth thing among them crushes all three onto two lines each.
Nothing in the check would have caught that, because every one of those is a dimension and dimensions are never asserted - it was found by looking at the capture, which is the job screenshots are kept for.
The control's colour, size and weight are claimed by the check; its underline is not, because the harness has no vocabulary for a text decoration.

`GUEST_COLUMNS` in `src/components/forms/wedding/guest-list.ts` is the single list behind all three: what the template writes, what a heading row in a couple's own file is recognised as, and what the table draws.
Splitting them apart is how a template comes to name a column the parsing does not read, which would be invisible until a couple had filled that column in for nothing.
The headings are claimed in `visual/expectations/guest-invites-populated.mjs` and the control in `visual/expectations/guest-invites-empty.mjs`, so neither can quietly become something else; the file itself reaches the browser as a link's `download` and the check reads copy and computed style rather than attributes, so nothing opens it.

The RSVP prints one line the design does not draw, above the Submit control: "Nothing is saved yet. Your reply stays on this page and goes when you reload it."

An RSVP is held in the page and lost on reload, because persisting one is integration work and is not built.
The design was drawn for the finished thing and so says nothing about that.
A card that took a guest's reply and quietly dropped it would be worse than one that says so, so the card says so, in the small grey setting the design already uses for the Optional beside a question.
It is claimed in `visual/expectations/wedding-template-1-rsvp.mjs` so that it cannot quietly become something vaguer, and it goes when the reply is actually saved.

One addition is agreed and recorded: the guest invites step carries a "Save as draft" control beside Confirm Create, which the design does not draw.

The design was drawn for a flow that saved nothing, so it has no way to say "keep this, I will come back".
Every other save in the flow happens on the way past - pressing Next from the details-and-story step writes what a couple has entered - and the guest invites step's own forward action is Confirm Create, which publishes.
Following the frame literally would leave a couple who wants to stop for the evening with two choices, publishing a wedding they have not finished or closing the tab on it.

It sits between Previous step and Confirm Create rather than at the start of the row, because it is the other thing a couple can do with what they have written rather than the other way out of the step.
It wears the shape the design does state for the action beside the filled one, `flowActionAside` in `src/components/forms/wedding/create-flow-treatment.ts`, which is the outlined action written under its own name rather than Previous step's treatment worn by a control that does not go back.
`visual/expectations/guest-invites.mjs` claims it with the same style block as Previous step, so it can neither disappear nor drift away from the action it was drawn beside.

A save that fails prints one line under that row, in the red the flow already gives a field that will not take what it was given.
The line names what the backend said and tells the couple nothing has been lost, and a step whose save failed does not advance.
It is not asserted, because it is drawn only when there is something to say and every screen the design draws has nothing.

This rule holds at desktop width, where the design exists.
Below that there is no design, so usability governs and the rule does not apply.

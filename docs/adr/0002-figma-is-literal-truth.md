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

The closed envelope is not addressed to anybody.

The design writes a guest's name across the front of it - "Galih & Keluarga", node 332:30838 inside the sealed Hero 332-30920 - and then draws the envelope's own photograph over the top, where the name cannot be read.
So the frame cannot be followed literally: it states a line of copy and hides it in the same breath.
It could not be followed anyway, because there is nowhere for the name to come from.
A guest's name belongs to the Guest List the Create Flow collects, and the template is handed one wedding rather than one guest, so an invitation would first have to know which guest opened it.
Both questions are `hbd-a09.17`; until they are answered the envelope arrives unaddressed, and the sealed screen's expectations claim no such line.

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

Both are recorded in the expectations beside the fields the design does draw, so the check covers them rather than ignoring them.
Three other values the invitation printed were resolved without new fields: the map keepsake is the first of the photos Venue Details already collects, the photo sharing block's card is product art the block draws itself, and the Guest Messages block is always shown because guests write those on the invitation rather than the couple enabling them.

The designer settled it, one answer each way, rather than making either frame win outright.
The Sections stack Love Story above Venue Details, following "Expanded All".
The seventh Section is named "Photo Collection", following the other three.

So there is no frame of record for that step.
Each disagreement was decided on its own, and neither frame can be trusted wholesale where they differ again.

This rule holds at desktop width, where the design exists.
Below that there is no design, so usability governs and the rule does not apply.

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

"Expanded All" is the frame of record for that step, and where the other three differ from it, they lose.
It is the frame this work was commissioned against, it is the only one that draws every Section's contents, and it is the most recently added of the four.
So the Sections stack Love Story above Venue Details, and the seventh is named "Photo Showcase".

That one was chosen by whoever built the states rather than agreed with the designer, unlike step 4's title.
It is out for confirmation as `hbd-7p5`, and a design change that settles it the other way is welcome and flows back to us as any other change does.

This rule holds at desktop width, where the design exists.
Below that there is no design, so usability governs and the rule does not apply.

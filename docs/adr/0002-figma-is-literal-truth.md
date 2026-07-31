# The Figma design is literal truth, including its errors

The wedding invitation Create Flow is built to match the Figma design's style and arrangement, and copy is taken exactly as written.
Where the design contains a mistake in its copy, we ship the mistake rather than silently improving it.

This exists because "match the design, except where it looks wrong to me" is not a criterion anyone can sign off, which is why an earlier attempt at this work kept feeling unfinished.
Fixing the wording in the design rather than in the code keeps one source of truth.

## What matching means

Matching is a claim about style and arrangement, not about measurements.
Colour, typeface, size, weight, border, radius, shadow, spacing and copy must match exactly.
Widths and heights may be dynamic, because a form field that stretches to its container is correct at any size.

This distinction matters because it decides how the work is verified.
Comparing rendered screenshots pixel by pixel would fail a correct screen whose input happens to be a different width, which is noise rather than signal.
Verification therefore asserts computed style, structure and copy, and never asserts a dimension.

## Consequences

Step 3's stepper description reads "Config guest details on your the invites", and that is intentional.
Do not correct it here.
Corrections belong in Figma, and flow back to us as a design change.

One deviation is agreed and recorded: step 4 is titled "Share with guests", not "Share with communities".
The design uses both across different frames, so it cannot be followed literally, and the wedding-specific wording won.

This rule holds at desktop width, where the design exists.
Below that there is no design, so usability governs and the rule does not apply.

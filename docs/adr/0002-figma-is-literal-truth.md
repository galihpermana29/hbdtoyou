# The Figma design is literal truth, including its errors

Pixel-perfection for the wedding invitation create flow is defined against the Figma design at 1440px wide, and that includes copy exactly as written.
Where the design contains a mistake, we ship the mistake rather than silently improving it.

This exists because "match the design, except where it looks wrong to me" is not a criterion anyone can sign off, which is why an earlier attempt at this work kept feeling unfinished.
Taking the design literally makes the check mechanical: a screenshot diff either passes or it does not.

## Consequences

Step 3's stepper description reads "Config guest details on your the invites", and that is intentional.
Do not correct it here.
Corrections belong in Figma, and flow back to us as a design change.

One deviation is agreed and recorded: step 4 is titled "Share with guests", not "Share with communities".
The design uses both across different frames, so it cannot be followed literally, and the wedding-specific wording won.

This rule holds only at 1440px.
Below that there is no design, so usability governs and pixel-perfection is undefined.

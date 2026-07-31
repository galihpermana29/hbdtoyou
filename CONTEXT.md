# Wedding Invitation

The vocabulary of Memoify's wedding invitation product: the flow a couple uses to build an invitation, the content it holds, and the people who receive it.

## Language

### The create flow

**Create Flow**:
The four-step wizard a couple moves through to produce a finished invitation.
Its steps are named below and are the only names used for them.

**Choose your template**:
Step 1.
Picking which invitation design the couple wants.

**Fill in the details & story**:
Step 2.
Entering the invitation's content, section by section.
_Avoid_: Fill details

**Guest invites details**:
Step 3.
Naming the invitation and deciding who receives it.
_Avoid_: Publish

**Share with guests**:
Step 4.
The published invitation and its shareable link.
_Avoid_: Share with communities, Share

### Invitation content

**Section**:
One collapsible group of related fields in step 2, and the unit the invitation viewer renders.

**Cover Header**:
The section holding the couple's photos, nicknames, venue, date and background track.
It is what a guest sees first on opening the invitation.
_Avoid_: Hero

**Bride & Groom's Introduction**:
The section introducing each partner and their family.
_Avoid_: Bride & Groom

**Bride Nickname**, **Groom Nickname**:
The short informal name each partner is known by, distinct from their full name.
_Avoid_: short name, display name

**Bride's Father**, **Bride's Mother**:
One named parent each.
Two separate people, never a single combined string.
_Avoid_: parents

**Background Track**:
The song playing behind the invitation.
_Avoid_: music, backtrack

### Preview

**Site Preview**:
The phone mockup on the create page showing the invitation as the couple edits it.
_Avoid_: Live Preview

**Play Preview**:
The control that opens the full invitation viewer from the create page.
_Avoid_: Full Preview

**Invitation Viewer**:
The recipient-facing page a guest actually opens.
Distinct from Site Preview, which only ever shows it to the couple.

### Guests

The word "guest" covers two unrelated concepts.
They are never interchangeable.

**Guest List**:
The roster of people the couple intends to invite, uploaded as a CSV in step 3.

**Guest Message**:
A wish written by a visitor and displayed on the invitation.
Belongs to the invitation's content, not to the Guest List.
_Avoid_: wishes

**Invitation Slug**:
The couple-chosen identifier that makes their invitation's link unique.
_Avoid_: domain, subdomain

### Quality

**Pixel-perfect**:
Matching the Figma design's style and arrangement, not its measurements.
Colour, size, weight, line height, border, radius, shadow, spacing and copy must match exactly.
Two things are deliberately free: widths and heights, so an element is correct at any size, and the typeface family, which stays whatever the application already sets.
_Avoid_: pixel-exact, identical

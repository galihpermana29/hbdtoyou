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

**Prefill**:
An answer already in a field when the couple first opens it, put there because most couples want it.
Theirs from that moment: editable, clearable, and saved exactly like anything they typed.
The scripture the Holy Verse section opens with is one.
_Avoid_: default, which is also used for the other thing below

**Fallback**:
A value invented at render time to stand in for one the couple never gave.
There are none, deliberately: nothing invented reaches the backend or a guest.
An optional answer left blank is absent, and the invitation omits what it would have said rather than
printing somebody else's.
_Avoid_: default

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

**Gift Registry**:
The section collecting where a gift can be sent: the account, its number, and the bank or e-wallet holding it.
_Avoid_: Token of Love, which is what the invitation titles the block this section fills in

**Bank/e-Wallet Provider**:
Where the account is held, asked for on its own rather than written into the holder's name.
Two answers, joined for display, the same way a father and a mother are.
_Avoid_: bank

**Photo Collection**:
The section collecting the pre-wedding photos the invitation ends on.
_Avoid_: Gallery, which is what the invitation calls the block this section fills in

**MemoRoll**:
The collective photo experience: guests photograph the day and send it back afterwards.
One switch in step 2 turns it on, and it is what the invitation's photo sharing block offers.
_Avoid_: Photo Share, disposable camera

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

**Showcase**:
The template rendered with example content, so a couple can see what it looks like before choosing it.
Nobody's invitation, and the one place example photographs are the right answer.
_Avoid_: sample, demo

**Example Content**:
A named set of content the Showcase and the check render the template with.
Three exist: one flattering, one realistic and awkward, one deliberately hostile.
They are how the template's handling of unpredictable input is judged.

### Guests

The word "guest" covers two unrelated concepts.
They are never interchangeable.

**Guest List**:
The roster of people the couple intends to invite, uploaded as a CSV in step 3.

**RSVP**:
A guest's reply to the invitation: their name, whether they are coming, whether they bring someone, and an optional Guest Message.
Collected in a modal on the invitation itself, never in the Create Flow.

**Guest Message**:
A wish a guest writes in their RSVP and the invitation displays.
Belongs to the invitation's content, not to the Guest List.
_Avoid_: wishes

**Invitation Slug**:
The couple-chosen identifier that makes their invitation's link unique.
_Avoid_: domain, subdomain

### The template's parts

**Sealed**:
The invitation before a guest opens it: the envelope closed, the page locked, nothing below reachable.
Opening it is a guest's deliberate act rather than something that happens on load.

**Frame**:
Artwork the template draws whatever the couple supplies: an envelope, a polaroid border, a torn edge, a wax seal.
A Frame is never content, and is the same on every invitation.
Distinct from the photograph inside it, which is always the couple's.

### Quality

**Pixel-perfect**:
Matching the Figma design's style and arrangement, not its measurements.
Colour, size, weight, line height, border, radius, shadow, spacing and copy must match exactly.
Two things are deliberately free: widths and heights, so an element is correct at any size, and the typeface family, which stays whatever the application already sets.
_Avoid_: pixel-exact, identical

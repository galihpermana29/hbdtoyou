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
There are none.
There was exactly one, and it retired on 2026-08-18: the camera in the Love Story played one shared
teaser film on every invitation, because the uploads endpoint refused video/mp4 and no couple could
hand over a Wedding Teaser Video.
The endpoint takes video now and a couple who wants one uploads their own, so the camera plays
theirs or shows the artwork's own screen.
An answer left blank is absent, and the invitation omits what it would have said rather than
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
The identifier that makes an invitation's link unique.
Minted by the backend as `{title-slug}-{8-random-hex}`, so two couples whose titles match still get addresses that do not, and offered a name-derived replacement at most once while unpublished.
Never the couple's to type: the backend will accept a chosen one, and nothing in the flow asks for it.
Since ADR 0005 it is also where a published invitation answers: the subdomain label of `{slug}.memoify.live`, and the v2 backend itself prints that address as the invitation's `full_url`.
_Avoid_: domain. Subdomain names where the slug is served, never the slug itself.

**Guest Token**:
The name-derived identifier in a guest's personal link (`galih-dhila`), minted by the backend from the guest's name and deduplicated with numeric suffixes when names repeat.
Opening a link with it counts the visit; submitting an RSVP requires it; revoking it kills the link while the guest row survives.
_Avoid_: guest id, which names the row rather than the link.

### MemoRoll

**Roll**:
A guest's whole allotment of Shots for the day.
When it is spent it is spent: no retakes, no camera-roll uploads.

**Shot**:
One photo a guest takes on their Roll.
A Shot is developed at capture: the finished photo is the only artifact, and the negative never exists.
What a Shot looks like is settled the moment it is taken and never edited afterwards.

**Film**:
The analog look a Shot develops through, chosen by the guest on the camera, per Shot, before it is taken.
Six exist: Wedding Natural (the approved consumer-negative look), Soft Pastel, Clean Cool, Bold Color, Black & White, and None, which is plain digital.
No Film carries synthetic grain; a look is tone and color only, and the low-light Party look stays unofferable until a representative input approves it.
The camera opens on Wedding Natural and stays on whatever the guest last chose.
The couple has no say: the choice moved from creator to guest and did not leave a switch behind.
Shots developed under retired rosters remain what they are: the pixels were baked when they were taken.
_Avoid_: filter, effect, film filter

**Flash**, **Torch**:
Two hardware lights on the camera, offered only when the phone truly has them and hidden otherwise.
Flash is the synchronized burst fired with the shutter; Torch is the continuous lamp a guest switches on in the dark.
Neither is the shutter's white-screen animation, which is feedback and lights nothing.

**Date Stamp**:
The date every Film burns into a Shot's corner, the way a point-and-shoot exposes it onto the negative.
Part of the Film, so a Shot taken on None carries no Date Stamp.
_Avoid_: timestamp

**Watermark**:
The small memoify.live mark on every Shot, Film or None alike.
It belongs to the product, not to the Film.

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

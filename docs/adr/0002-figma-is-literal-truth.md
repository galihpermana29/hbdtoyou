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

Where the name comes from is the guest's own link, and the query parameter that stood in for one during development has gone.
The link carries the token the backend mints for that guest, `?guest=<token>`, and the Invitation Viewer resolves it into the name the Guest List holds.
The design writes that link as `?name=guest`, which is the third thing about it that cannot be followed: a name on the address is a name anybody can type, and the invitation would be taking a stranger's word for who they were.
The tokens themselves arrive when the Guest List is saved with the invitation, which `hbd-ox7.7` landed: uploading a list inserts every guest in one batch and the backend answers with the token it minted for each of them.
The greeting message's preview still carries a token belonging to nobody, because it is a picture of a message to a guest called Johnny who does not exist.

The Showcase keeps an addressee because the design's sealed frame has one, and its name is Example Content like the couple and the chapters around it - the frame's own "Galih & Keluarga", `EXAMPLE_ADDRESSEE`.
Nobody's invitation, so nobody's name.

An invitation with no addressee draws none.
A placeholder would be worse than nothing, because the one surface of the invitation that is supposed to be a guest's own would carry somebody else's name.
So a real invitation opened without a token draws none, and one opened with a token the backend refuses is told so rather than shown a blank envelope: that half of the link is also what a reply is signed with.

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
Two other values the invitation printed were resolved without new fields: the photo sharing block's card is product art the block draws itself, and the Guest Messages block is always shown because guests write those on the invitation rather than the couple enabling them.
A third, the map keepsake, was resolved the same way - the first of the photos Venue Details already collects - and has since given up its screen to the Wedding Teaser Video, recorded below.

The designer settled it, one answer each way, rather than making either frame win outright.
The Sections stack Love Story above Venue Details, following "Expanded All".
The seventh Section is named "Photo Collection", following the other three.

So there is no frame of record for that step.
Each disagreement was decided on its own, and neither frame can be trusted wholesale where they differ again.

The web domain field was read-only, where the design draws it as the couple's to type. That deviation is withdrawn.

It was never a disagreement with the design, only with what the backend could answer.
The design draws the address as theirs to choose and shows a chosen name being confirmed as available; there was no endpoint that could say whether a name was free, so a couple choosing one could only have been told it was taken after failing.
The rules line went with it - "Letters, numbers and hyphens only, 3 to 63 characters, starting and ending with a letter or a number" - because rules for typing something nobody types are words a couple cannot act on.

The v2 backend answers it: `GET /v1/wedding/slug-availability` says whether a name is free, and `PUT /v1/wedding/{id}` takes a chosen one.
So the field takes what it shows again, the rules line is back where user story 34 on `hbd-byb` wanted it, and the confirmation the design draws is a control the couple presses.
What the backend answers is a courtesy rather than a promise - somebody else's save can take a name between the answer and the attempt - so the refusal on save is what finally decides, and it is printed in its own words rather than as a general failure.
Verified on 2026-08-17: the endpoint is owner-authenticated, which the backend's guide does not say.

One thing the design draws is still not read from the frame: how the check control and its two answers are treated.
They are drawn in the step's own type and colours until somebody reads the frame - `hbd-bmi` carries that, and this is the deviation to withdraw next.

A published invitation's field stops taking anything, which the design does not draw either.
From publish the address is in the hands of everybody who was sent it, and a shared link must never die - see `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`.

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

The Action column does not scroll with them.
At the design's width the card is about 586px and the six columns about 736, so Delete and Edit - the only two controls the design's own Action column carries - sat past the visible edge until somebody thought to scroll, and nothing on the screen said there was anything to the right of Notes.
The two actions the design puts on every row were therefore, in practice, on none of them.

So the column is pinned to the right-hand edge of the scrolling region, keeping its row's own background so the other columns pass behind it rather than through it, with a seam down its left.
The seam is a shadow rather than a border because the design gives these cells one hairline and it runs underneath them; a rule down the side would be one the design does not draw.
Nothing about this moves a cell or changes the design's arrangement: Action is still the last column, still after Notes, and still the far edge of the row.

The check does not catch this and could not have.
Reaching the far side of a scrolling region is a question about where an element is, and every property that could answer it is a dimension - which is exactly the class of claim the harness refuses.
What found it was reading the capture, which is the job screenshots are kept for, and what the check does still guarantee is that pinning the column changed none of the twenty-one values already asserted about those cells.

That cell carries four actions where the design draws two, and it carries them as one control rather than as four.

The design's Action cell holds Edit and Delete side by side.
A guest now also has a personal invitation message to be sent to them and a personal link to open, and both are per-guest rather than per-invitation: the message names them and the link carries their own token.
Neither has anywhere else to live.
A couple who cannot reach them from the guest's own row has to assemble both by hand, which is the same fault the six columns were added to answer.

Four controls do not fit a cell drawn for two, and a fifth column for each new action walks straight back into the width problem the pinning was needed for.
So the cell becomes one antd button carrying an ellipsis, and everything a couple can do to that guest is in the menu it opens.
Copy invitation message, Open invitation, Edit and Remove are in that list, Remove last and marked as the destructive one.
An action with nothing behind it is left out rather than offered dead, so a guest with no personal link yet has no Open invitation to press.

A named button beside the ellipsis was tried first and taken out again.
It read Actions, which says nothing about which of the four it does, and the one it did - Edit - was in the menu underneath it as well.
Two routes to the same action, one of them unlabelled, is a worse cell than one route that names what it reaches.

The button is antd's and wears antd's own metrics, so the check asserts that each row has exactly one and where it sits, and says nothing about its type.
That is the deviation itself rather than drift, and asserting the design's type on a control the design does not draw would be inventing a claim.
Its accessible name carries the guest's own - a column of identical icons is otherwise a column of identically named controls - and the check cannot read it, because it reaches a label only through a `label` element.
The cell's own hairline, padding and pinning are unmoved, and the row still ends where the design ends it.

Two more states of that card are drawn that the design has no frame for, because the Guest List now reaches a backend.

Every action on it waits for the backend before the list changes, so while one is in flight Upload File, Delete, Edit and Save are dimmed and cannot be pressed, at the `opacity-40` the card already used for a Save with nothing to save.
The design was drawn for a table nothing was sent from, so it has no mid-flight state; a control that cannot be pressed and looks exactly as it did reads as a press that did nothing, and a couple's answer to that is to press it again - which for Delete is one guest removed and one refusal about a guest who is already gone.
Cancel is never dimmed, because it abandons a draft that was never sent and a couple whose save is being refused should always be able to close the row.
The empty state's drop area is held the same way and for a sharper reason: there is no card on the screen yet to say a file is already being sent, so a second one dropped into that gap would be inserted as well as the first, leaving the invitation carrying both lists and the screen showing one.

A refusal prints one line under the Guest List, where a file that cannot be read already printed one.
It names what did not happen, what the backend said, and what is still true - which differs every time, and is the part a couple cannot work out for themselves: a correction that was refused leaves the guest as they were, a deletion that was refused leaves them on the invitation, and an upload that replaced a list but could not remove the old one leaves named people holding a working personal link to an invitation whose list no longer shows them.

Neither is asserted, for the reason the failed save is not: both are drawn only when there is something to say, and every screen the design draws has nothing.

The dashed area the design draws says only "Upload in format .CSV", which leaves a couple guessing which six columns and in what order.
A control reading "Download CSV template" is therefore printed on the end of the size limit's line, in the accent every action in the flow is drawn in, and it downloads a file carrying the six headings and no example row - a row that file carried would be read as a guest by the couple who forgot to delete it.
It stays on the screen once a list is uploaded, on a line of its own under the card, because uploading again is the only way to change a column the first file never had, and the couple who has just seen five empty columns is the couple who most needs the file to fill them in.
Under the card rather than inside it: the design's card header holds a title, a date and Upload File at a stated spacing, and putting a fourth thing among them crushes all three onto two lines each.
Nothing in the check would have caught that, because every one of those is a dimension and dimensions are never asserted - it was found by looking at the capture, which is the job screenshots are kept for.
The control's colour, size and weight are claimed by the check; its underline is not, because the harness has no vocabulary for a text decoration.

`GUEST_COLUMNS` in `src/components/forms/wedding/guest-list.ts` is the single list behind all three: what the template writes, what a heading row in a couple's own file is recognised as, and what the table draws.
Splitting them apart is how a template comes to name a column the parsing does not read, which would be invisible until a couple had filled that column in for nothing.
The headings are claimed in `visual/expectations/guest-invites-populated.mjs` and the control in `visual/expectations/guest-invites-empty.mjs`, so neither can quietly become something else; the file itself reaches the browser as a link's `download` and the check reads copy and computed style rather than attributes, so nothing opens it.

The RSVP prints one line the design does not draw, above the Submit control, saying whatever is true of the reply being written.

The design was drawn for the finished thing, so it draws the card once and says nothing about what becomes of a reply.
A card that took a guest's reply and quietly dropped it, or quietly failed to send it, would be worse than one that says so, so the card says so, in the small grey setting the design already uses for the Optional beside a question.

Where a reply has nowhere to go the line is "Nothing is saved yet. Your reply stays on this page and goes when you reload it."
That is every invitation nobody was sent: the Showcase, the Create Flow's two panels and Play Preview, and a published invitation opened at its bare address rather than by a guest's own link.
It is claimed in `visual/expectations/wedding-template-1-rsvp.mjs`, whose screen is the Showcase's card, so that it cannot quietly become something vaguer.

Where a guest came by their own link the reply reaches the couple, and the same line says which of four things happened: "Thank you. Your reply is with the couple.", "You have already replied to this invitation. The couple has that first answer, and it is the one that counts.", a rate-limited reply's "Your reply has not gone through just yet: too many replies arrived at once. Nothing you have written has been lost - wait a moment, then press Submit again.", or one naming what the backend said and that nothing they wrote has been lost.
Only the failures the backend has named get words of their own; the last stays generic on purpose, because inventing a friendlier reason for an unnamed failure would be guessing.
None of those is asserted, for the same reason a failed save's line is not: each is drawn only when there is something to say, and every screen the design draws has nothing.

The Name field on that card is read-only and holds the name the Guest List carries, unless the list carries none for that guest, in which case it is theirs to type as anybody else's is.
The backend says who is replying from the token on the link, so a typed name would be discarded, and a field that took one would be asking a guest for something nobody reads.
The design draws the field, so it stays drawn: a guest confirming who they are is truer than a box that quietly does nothing.

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

Confirm Create prints in that same place, and in the same red, when the invitation is not ready to go out.

The design draws Confirm Create as a step, so its frame goes straight from the guest invites screen to the published one.
Publishing is a request, and one the backend can refuse: it runs no check of its own on publish, so the flow asks first and a couple whose invitation is missing something is told rather than carried on to a screen announcing an invitation that never went.
What is drawn is one line saying the invitation is still a draft and that nothing has reached their guests, and under it a list of what the backend named, in the backend's own words.

Its words rather than ours.
The only issue the contract documents is an empty title, which this flow hardcodes and a couple cannot cause, so every other string is one nobody here has read.
Translating an unknown into reassuring product copy would mean inventing a description of a fault we cannot see, and the couple would then be told something nobody has checked is true.
The one line written here is for the case where the check refuses and names nothing at all, which is the contract being broken rather than a state the product has.

Nothing about this is asserted, for the reason the failed save is not: it is drawn only when there is something to say, and every screen the design draws has nothing.

One addition is agreed and recorded: the Invitation Viewer draws a screen for a link that does not open an invitation, which the design does not draw.

The design draws the invitation, and an invitation that will not open is not one of its states.
It cannot be followed literally here because a link is not a screen: it travels through a message, a screenshot and somebody reading it out over a phone, and it will arrive early, mistyped and after the wedding has been taken down.
A guest handed the server's error page cannot tell "not yet" from "wrong address", and those ask opposite things of them - one is to keep the link, the other is to go back to the couple and ask for it again.

So the two are told apart, and only those two.
An invitation the backend answers for and says is still a draft reads "This invitation is not ready yet", and under it "The couple are still putting it together. The link is the right one and it will open as soon as they publish, so keep it and come back."
Everything else - no such slug, a refused read, a stored record that will not parse - reads "This invitation could not be opened", and under it "The address may have been mistyped, or the invitation may have been taken down. Ask the couple for the link again."
Which of the several faults behind the second one it was is ours to look into and nothing a guest could act on, so it is not printed.

It is drawn in the invitation's own black and the invitation's own typefaces, in `src/app/(landing)/(gifts)/(wedding)/wedding-1/[slug]/invitation-unavailable.tsx`, because it is the invitation's address that was opened.
A guest who followed a wedding link should land somewhere that looks like the wedding rather than somewhere that looks like a fault in a different product.

Nothing about it is asserted.
The check has no invitation to read - it drives a signed-out browser against no backend - so it cannot reach either state, and there is no frame to hold them against in any case.

The Create Flow carries a language control the design does not draw, and opens in Indonesian.

The design exists in English because it was drawn in English, not because a decision was taken that couples read English.
Most of them do not: the product marries Indonesian couples, and every field on this form was asking them about their own wedding in a second language.

So the flow opens in Indonesian and a control above the Sections switches it to English.
It sits above them because it governs all of them, and outside the form because it is a preference about reading the flow rather than an answer about a wedding.
That second part is load-bearing rather than tidy: the check addresses each step's fields by their position within its form, and a setting parked among them renumbered every one of them the first time it was tried.
The same control sits on Guest invites details, above that step's fields and outside its form for the same reasons, so the choice is offered on both of the steps a couple works in rather than only the first.

This is the one place where the design cannot be the reference for what a couple sees, because the design has nothing to say about a language it was not drawn in.
The check therefore selects English before every capture, and holds the English against the frames exactly as before.
Nothing verifies the Indonesian.
There is no Indonesian frame to hold it against, and inventing one would be the check marking its own homework, so the translations are reviewed by a person who reads both.

The invitation is not translated, in either direction.
What a guest reads is what the couple wrote, and a control that rewrote it would be editing their words.

The Venue Details Section draws a map the design does not draw, and View Location no longer points where the design implies.

The design draws a View Location control and no map, so a guest had to leave the invitation to find out where the wedding was.
The Section now renders the couple's own map beneath the address, from the embed Google Maps hands over under Share, Embed a map, Copy HTML.

What the couple pastes is never rendered.
The address inside the paste is taken out and a fresh iframe is built from it, because a couple's invitation is opened by strangers and putting their markup into that page would run a pasted script in every guest's browser.
An `onload` smuggled in beside a valid `src` is therefore harmless: only the address survives the extraction.

View Location is built from the written Wedding Address rather than from the pasted value, because an embed address opens a stripped map with no way to start directions.
So the couple pastes once and both jobs are served: the map shows the pin they chose, the control opens the venue in whatever maps application the guest already uses.

The field's guidance changed with it, and its Indonesian names Google Maps' own menu items - worth checking against the real application, because wrong menu names in an instruction are worse than English ones.

The Love Story's camera plays a film the design does not draw, where the design draws the venue's map.

The Create Flow asks for a Wedding Teaser Video and the design draws nowhere that could play one: nine sections, and none of them is a video.
A couple was therefore waiting out an upload no guest would ever see, which is the exact waste `hbd-5dd` was filed about.
The designer settled where it lives rather than adding a tenth section: the camera keepsake at the foot of the Love Story, whose screen the design draws showing the venue's map under a pin.
The film takes the screen, and the map and its pin retire with the `mapPhoto` the saved record carried for them - that value was a copy of the first Venue Details photograph rather than anything a couple answered, so nothing of theirs is lost, and old records still carrying one are read and ignored.

That deviation is withdrawn on 2026-08-18.
The uploads endpoint takes video/mp4 - confirmed by the owner by hand, and documented at 50MB a file - so the Create Flow asks every couple for their own teaser and the camera plays what they gave.
The screen is empty on a draft that has not been given one yet, which is what a camera with no film in it looks like.
Which film is `hbd-1qh`'s question: the one the owner chose, `DQgtgRZqhws`, has embedding disabled on YouTube and renders "Video tidak tersedia" inside the camera, so until embedding is enabled or another video is named the screen plays a plainly marked placeholder, `FALLBACK_TEASER_VIDEO` in `LoveStory.tsx`.
That makes it the product's one Fallback, and CONTEXT.md's Fallback entry names it as the exception: invented at render time, standing in for a value no couple can yet give, and never reaching the backend.
It is temporary by construction - the invitation already prefers `loveStoryVideo` whenever a record holds one, so the moment the backend takes mp4 a couple's own film takes the screen and the shared one is never drawn for them again.

The check does not assert the film and cannot: it has no copy, and the harness has no vocabulary for an iframe or a video, so it is media the way the photographs are.
What settles it is a browser opened at the invitation with the camera's screen playing, which is the job screenshots are kept for.

Required fields carry a red mark the design does not draw, and every uploader's guidance is generated rather than written.

The design was drawn for a form where nothing was required, so it marks nothing.
Now that a step can refuse, a couple who cannot tell which fields are obliged only finds out by being refused, so each required field's label carries the mark.
It is drawn with `::after` rather than written into the label, which keeps it out of `textContent` and leaves the twenty label assertions saying exactly what the design says.
The control itself is what assistive technology hears, through `aria-required`; the mark is for eyes.

The guidance under an uploader is built from the numbers that field enforces, and the prop that let a Section write its own is gone.
The design's guidance said "We recommend to add more than 2 images" over a field that takes one, and once the counts moved four of the six were telling couples the opposite of what the field would accept.
A number a person writes beside another number drifts from it; removing the prop turned every stale hint into a compile error rather than something to notice by eye.

Three photograph fields take a different number than the design's frames say.

The Couples Photo takes one where the frame says five, because the invitation prints one and always did.
The Polaroid Photos take three where the frame says twelve, because the film strip has three slots.
The Gift Section Photo takes three where the frame says one, and that frame was already disagreeing with itself: it printed the guidance for three underneath a prompt that said one.

In every case the frame's number described a field the invitation could not honour, and a couple was being invited to add photographs that would never be seen.
The prompts follow the real numbers, which means the words inside those areas changed too.

The Venue Details Section asks for "Venue Photos" where the design writes "More Photos".

The design's label says how many rather than what of, on the one field in that Section that takes a photograph at all.
A couple reading it has just answered the address and the reception time and is being asked for "More" of something the label does not name.
It is renamed rather than kept, because this is the Section where a guest works out where to go, and the photographs in it are of the venue.

The Gallery is laid out as masonry rather than as the collage the design draws.

Node 312-1807 places five photographs by hand, each its own size, overlapping the section's edges inside a fixed 570px band.
It is a composition rather than a rule, and it does not generalise: a couple is now asked for between five and fifteen photographs, and there is no honest way to read a sixth slot out of an arrangement that has five.
The alternatives were to cap the couple at five, which throws away the ask, or to draw the collage once per group of five, which forces the count to land on a multiple of five.

So the section becomes two columns of varying heights that grow with the count.
It keeps what the collage was actually doing - photographs of different sizes, read down the page - without pretending to know where a fifteenth one goes.

This costs the check nothing, which is part of why it is affordable.
Gallery is the one section with no words at all, so the only thing asserted about it is its ground, `#fafafa`, and that is as true of masonry as of the collage.

Nothing here licenses redrawing a section that does generalise.
The collage was replaced because the design states five and the product now asks for fifteen, not because masonry is nicer.

This rule holds at desktop width, where the design exists.
Below that there is no design, so usability governs and the rule does not apply.

Every frame in this file is drawn at 1440, so 1440 is what "desktop width" means here, and it is the width `npm run visual` drives.
That is deliberately a width rather than a device: a laptop at 1200 is as undesigned as a phone at 390, and a clause that only reached phones would leave the widths in between with neither a design to follow nor permission to depart from one.

What the clause has been used for so far, so that a reader can find it rather than infer it.
The Create Flow's two columns stack into one below `lg`, on the guest invites step and on the published step, because the Site Preview is a phone 405px wide and a phone has no 405px to spare beside the form.
The stepper drops its four descriptions below `md`, because four of them in four 70px columns is fifteen lines of one word each.
The Guest List card says that its columns scroll sideways, below 1440 only, because a phone has no scrollbar to say it instead.

None of these is a deviation to be argued with the designer.
They are the product at widths the design does not describe, and the moment a frame is drawn at one of them the frame wins.

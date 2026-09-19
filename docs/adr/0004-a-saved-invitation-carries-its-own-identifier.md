# A saved invitation carries its own identifier

The record a wedding invitation stores its content in also stores the identifier of the invitation holding it, under `weddingId`.
Nothing renders it.
It exists so that a couple's own invitations can be listed, and so that a row in that list can be opened.

## Why there is nothing else to go on

There is no endpoint that lists the invitations one person owns.
The wedding domain offers `GET /v1/wedding/{ref}`, which needs the identifier a listing exists to find, and `GET /v1/wedding` answers `METHOD_NOT_ALLOWED`.
That was checked against the staging backend rather than inferred, and the internal notes in `integrations/wedding-internal-notes.md` document no collection endpoint either.

What can be listed is the generic content table.
Creating an invitation creates a row in it, so `GET /contents` filtered to the wedding template is a complete list of a person's invitations: one row each, no more and no fewer.
It is also already how the dashboard finds everything else somebody has made, and it is already scoped by user, with the empty user meaning everybody.

What a content row cannot say is which invitation it belongs to.
Its own `id` is the content's, not the invitation's - `wedding_invitations.content_id` is a foreign key to it, so the two are different values - and nothing on the row carries the invitation's identifier, its Invitation Slug, or whether it has been published.

So the listing can enumerate and cannot open.
The identifier is the one fact that closes that gap, and the record is the only place this product controls that a listing already reads.

## Where it is written and what it costs

`formValuesToInvitationPayload` writes it, so every save carries it.
A create cannot: the identifier is what the create answers with. The first save is therefore two writes - the create, then an update carrying the identifier - and the second is silent when it fails, exactly as the read that learns the Invitation Slug is, and for the same reason: the invitation is saved either way, every later save carries the identifier too, and every way out of the Create Flow saves.

The costs are real and are stated on the screen rather than hidden.

An invitation saved before this existed carries no identifier.
It appears in the listing and says, in a sentence, that the record does not name it and that nothing on the screen can reach it.
Hiding those rows would tell a couple their invitation is gone when it is not.

The address and the status are not stored, and are read off each invitation instead, one call per row in parallel.
Storing them would be a second and a third denormalised fact, each able to go stale in a way a couple would see: an address that no longer resolves, or a draft that says it is published.
The identifier is the only one that cannot go stale, because an invitation's identity does not change.

## Precedent

The greeting message is already stored this way.
Nothing in the invitation renders it either; it is in the record because that is where the couple's own words belong and there is nowhere else for them.
This is the same shape and the same reason, and it is deliberately a separate type - `SavedWeddingRecord` rather than `WeddingTemplate1Content` - so that nothing which draws an invitation for a guest can read it.

## This is meant to be removed

`hbd-007` asks the backend for an owner-scoped `GET /v1/wedding` answering `id`, `invitation_slug`, `status`, `title` and `create_time`.
That endpoint removes the identifier from the record, removes one write from the first save, removes one read per listed row, and makes every invitation ever created reachable again, including the ones saved before this.
Until it exists, this is what a couple has instead of losing their invitation the moment they close the tab.

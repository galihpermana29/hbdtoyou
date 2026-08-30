/**
 * The wedding invitations one person owns, assembled from the two things the
 * backend can actually answer.
 *
 * ## Why this is assembled rather than fetched
 *
 * There is no endpoint that lists a couple's invitations. The wedding domain
 * offers `GET /wedding/{ref}`, which needs the identifier a listing exists to
 * find, and `GET /wedding` answers `METHOD_NOT_ALLOWED`. Asking the backend for
 * one is `hbd-007`.
 *
 * What can be listed is the generic content table. Creating an invitation
 * creates a row in it, so `GET /contents` filtered to the wedding template is a
 * complete list of a person's invitations - one row each, no more and no fewer.
 * What that row cannot say is which invitation it belongs to: its own id is the
 * content's, and nothing on it carries the invitation's identifier, its address
 * or whether it has been published.
 *
 * So the identifier is read out of the record's own content, where the Create
 * Flow writes it - see `WEDDING_ID_KEY`.
 *
 * ## One call, not one per invitation
 *
 * The address and the publish state used to be read off each invitation in
 * turn - a `GET /wedding/{id}` per row, fired together, because a person with a
 * dozen invitations should not wait a dozen round trips. Both now come off the
 * listing row itself: `status`, which the row has always carried, and
 * `invitation_slug`, which the backend was asked for on 2026-08-18 so that this
 * screen could stop asking twice for what one call could answer.
 *
 * Two things follow from trusting the row, and both are the backend's to keep
 * true. `status` on a content row did not follow the wedding's own status when
 * this was written - a published invitation's row still read `draft`, verified
 * on staging - so a listing that shows every invitation as a draft is that
 * desync rather than this screen. And a row that carries no `invitation_slug`
 * yet shows a card with no address, which is what the field arriving fixes.
 *
 * ## What it does when it cannot
 *
 * A row whose record carries no identifier still appears, and says why it
 * cannot be opened. Every invitation saved before the identifier was written
 * carries none, and hiding them would tell a couple their invitation is gone
 * when it is not.
 */

import type { IContent } from '@/action/interfaces';
import { getAllTemplates, getContentByUserId } from '@/action/user-api';
import { invitationLinkFor } from '@/components/forms/wedding/guest-invites-types';
import {
  coupleNamedIn,
  WEDDING_TEMPLATE_SLUG,
  weddingContentFrom,
  weddingIdFrom,
} from '@/components/forms/wedding/wedding-invitation-types';

/**
 * How many invitations one page of this listing covers.
 *
 * One per invitation ever created, and each one costs a call, so this is the
 * point at which a listing stops being free. Nobody has approached it: it is a
 * ceiling rather than a page size, and there is no second page, so a listing
 * that reached it would silently be missing invitations. That is why
 * `moreThanShown` exists and why the screen says so.
 */
const INVITATIONS_PER_PAGE = 100;

/** What the couple's own status word is, as the backend spells it. */
const PUBLISHED = 'published';

export interface OwnedInvitation {
  /** The content row it was found on, which is unique and always present. */
  contentId: string;
  /**
   * The invitation itself, or null when the saved record does not name it.
   *
   * Null is what makes a row one that can be shown and not opened: every screen
   * that acts on an invitation is addressed by this, so there is nowhere for a
   * row without one to go.
   */
  weddingId: string | null;
  /** The couple, as far as the record names them. */
  couple: string;
  /** When the invitation was made, in the backend's own words. */
  createdOn: string;
  /**
   * Where guests read it, or null when there is no address to show.
   *
   * A draft has one - the backend generates the slug when the invitation is
   * created - and it does not resolve until the invitation is published, which
   * is what `isPublished` is for.
   */
  address: string | null;
  /**
   * The bare slug the address is composed from, for the one caller that needs
   * the path rather than the URL: the card's live preview iframes the
   * same-origin viewer at `/w/{slug}` (2026-08-30), which is the route the
   * subdomain middleware itself resolves to.
   */
  slug: string | null;
  /**
   * The couple's own cover photograph, for the card face when the live
   * preview cannot render - a draft, whose record the public viewer refuses.
   * Null when the record holds none, and the card falls back to a monogram
   * rather than anything invented.
   */
  heroPhoto: string | null;
  isPublished: boolean;
  /**
   * Why this invitation cannot be opened, in a sentence, or null when it can.
   *
   * Two things put a sentence here: a record that does not say which invitation
   * it is, and an invitation the backend would not answer for. Both are shown
   * rather than hidden, because a couple whose invitation has quietly vanished
   * from their own list has been told something untrue.
   */
  unreachable: string | null;
}

export interface OwnedInvitations {
  invitations: OwnedInvitation[];
  /** What stopped the list being read at all, or null when it was. */
  problem: string | null;
  /**
   * Whether the person owns more invitations than this list carries.
   *
   * Said on the screen rather than swallowed: a truncated list that looks
   * complete is how somebody concludes their invitation was deleted.
   */
  moreThanShown: boolean;
}

/**
 * What a row is called when the couple have not said who they are.
 *
 * Not a Fallback in the sense CONTEXT.md forbids: nothing invented here is
 * stored, sent to the backend, or shown to a guest. This is the product
 * labelling a row on the couple's own screen, and a row with no label at all is
 * one they cannot tell from the row beneath it. What the invitation itself does
 * with unanswered names is unchanged - it prints nothing.
 */
const NOT_NAMED_YET = 'Not named yet';

/** The couple, as the record names them, or something to call the row. */
function coupleOn(content: IContent): string {
  const named = coupleNamedIn(
    weddingContentFrom(content.detail_content_json_text)
  );
  return named || NOT_NAMED_YET;
}

const UNNAMED_RECORD =
  'This invitation was saved before invitations could be opened again, so ' +
  'the record does not say which one it is. Everything on it is safe; there ' +
  'is nothing here that can reach it yet.';

/**
 * Every wedding invitation the given person owns, or every one there is.
 *
 * `userId` null is the admin case, which is how the dashboard's other listing
 * spells "everybody" too.
 */
/**
 * Where a listed invitation answers, or null while the row does not say.
 *
 * A couple's own domain wins over the subdomain when they have one, because it
 * is the address they would give somebody. Neither is composed here - see
 * `invitationLinkFor`, which is the one place an address is spelled.
 */
function addressOn(row: IContent): string | null {
  if (row.custom_domain) return `https://${row.custom_domain}`;
  const slug = row.slug || row.invitation_slug;
  return slug ? invitationLinkFor(slug) : null;
}

export async function ownedWeddingInvitations(
  userId: string | null
): Promise<OwnedInvitations> {
  const templates = await getAllTemplates();
  if (!templates.success) {
    return {
      invitations: [],
      problem: `The wedding template could not be read: ${templates.message}.`,
      moreThanShown: false,
    };
  }

  const template = templates.data?.find(
    (candidate) => candidate.slug === WEDDING_TEMPLATE_SLUG
  );
  if (!template) {
    return {
      invitations: [],
      problem: 'The wedding template is not available right now.',
      moreThanShown: false,
    };
  }

  const contents = await getContentByUserId(
    userId,
    String(INVITATIONS_PER_PAGE),
    '1',
    template.id
  );
  if (!contents.success) {
    return {
      invitations: [],
      problem: `Your invitations could not be read: ${contents.message}.`,
      moreThanShown: false,
    };
  }

  const rows = contents.data ?? [];

  const invitations = rows.map((row): OwnedInvitation => {
    const weddingId = weddingIdFrom(row.detail_content_json_text);
    const record = weddingContentFrom(row.detail_content_json_text);
    const listed = {
      contentId: row.id,
      couple: coupleOn(row),
      createdOn: row.create_date ?? '',
      slug: row.slug || row.invitation_slug || null,
      heroPhoto: record?.heroPhotos?.[0]?.trim() || null,
      // The listing row's own word for it. Trusted here rather than read off
      // the invitation, which is what this screen used to spend a call per row
      // doing - see the note at the top of this file.
      isPublished: row.status === PUBLISHED,
      // Composed rather than taken whole, so `invitation-host.ts` stays the one
      // place an address is spelled (ADR 0005). Null until the row carries a
      // slug, which is what a card with no address to print is.
      //
      // Either spelling: the content table calls it `slug` and the wedding
      // domain calls it `invitation_slug`, and which one a row carries is the
      // backend's business rather than this screen's.
      address: addressOn(row),
    };

    return weddingId
      ? { ...listed, weddingId, unreachable: null }
      : { ...listed, weddingId: null, unreachable: UNNAMED_RECORD };
  });

  return {
    invitations,
    problem: null,
    moreThanShown: rows.length >= INVITATIONS_PER_PAGE,
  };
}

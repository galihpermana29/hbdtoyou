import { INVITATION_NOT_PUBLISHED } from '@/action/interfaces';
import {
  getPublicWeddingInvitation,
  resolveWeddingGuest,
} from '@/action/wedding-api';
import {
  GUEST_TOKEN_PARAM,
  guestTokenFrom,
} from '@/components/forms/wedding/guest-invites-types';
import {
  weddingContentFrom,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';
import WeddingTemplate1 from '@/components/wedding/wedding-template-1/WeddingTemplate1';
import { weddingTemplate1Fonts } from '@/components/wedding/wedding-template-1/fonts';

import InvitationUnavailable, {
  type Unavailable,
} from './invitation-unavailable';

export const metadata = {
  title: 'Wedding Invitation',
};

/**
 * The Invitation Viewer for Wedding Template 1: somebody's own wedding, at the
 * address they send their guests.
 *
 * The path carries the template as well as the slug, per
 * `docs/adr/0001-path-urls-not-subdomains.md`, because more wedding templates
 * are expected and an address naming only the slug could not tell them apart.
 *
 * It does what every other gift viewer does. It reads the invitation by its
 * identifier on the server, parses the content the couple built, and hands it to
 * the template unchanged. The template is not touched: the Showcase renders it
 * with Example Content, the Create Flow renders it with what a couple has typed,
 * and this renders it with what they published, and what separates the three is
 * only what is passed in.
 *
 * Sealed, and the page is what it scrolls, exactly as the Showcase is: this
 * route is the invitation and has the window to itself, so nothing below the
 * envelope is part of the page before a guest opens it.
 *
 * The title is fixed rather than the couple's. Reading the invitation counts a
 * view, so a `generateMetadata` that fetched it would count every open twice and
 * the couple would be told their wedding had been read by people who do not
 * exist.
 *
 * Whose envelope this is - the guest's name across the front of it - comes from
 * the token their own link carries. The address alone is the wedding and is the
 * same for everybody; the token is the half of the link that is one guest's, and
 * the backend is what turns it into a name. A link without one is the invitation
 * with no guest on the end of it, which draws no addressee at all: a placeholder
 * would put somebody else's name on the one surface of the invitation meant to
 * be that guest's own.
 *
 * The same token is what a reply is signed with, so a guest who arrived by their
 * own link can answer the invitation and one who arrived at its bare address
 * cannot: the backend says who is replying from the token rather than from
 * anything typed, and there is nobody for an unsigned reply to be from.
 *
 * It lives under `(gifts)`, which is what keeps the site footer off it, per
 * `docs/adr/0003-the-route-group-says-whether-a-page-is-a-gift.md`.
 */
export default async function WeddingInvitationViewerPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = guestTokenFrom(searchParams[GUEST_TOKEN_PARAM]);
  const invitation = await getPublicWeddingInvitation(params.slug);
  const content = weddingContentFrom(invitation.data?.detail_content_json_text);
  const personalLink = token !== '';

  // Two things a guest can be told apart when the address itself did not
  // answer, and only two. An invitation that exists but is still a draft is a
  // link that is early, and the guest keeps it; everything else - no such slug,
  // a refused read, a record that will not parse - is a link that does not
  // work, and the guest goes back to the couple. The difference between the
  // reasons behind "does not work" is ours to look into and nothing a guest
  // could act on.
  //
  // Asked before the guest is, and separately rather than both at once: the
  // backend records the open and bumps the guest's count on every resolve, so
  // resolving somebody whose invitation then turned out to be a draft would tell
  // the couple a wedding nobody has been shown had been read. That is the same
  // reason this route's title is fixed rather than fetched.
  const guest =
    content && personalLink
      ? await resolveWeddingGuest(params.slug, token)
      : null;

  // A link carrying no token asked about no guest, and that is not a failure:
  // it is the invitation itself, which anybody the couple hands the address to
  // can read, and which draws no name across the envelope.
  const guestIsKnown = !personalLink || Boolean(guest?.data);

  // The one guest this invitation is for, where a personal link brought
  // somebody the Guest List knows: the row answers both what to write across
  // the envelope and who a reply is from, so it is read once and asked twice.
  //
  // Read here rather than anywhere nearer the template, because the shape it
  // arrives in is the backend's: the guest endpoints answer in PascalCase where
  // the invitation answers in snake_case, and that is a fact about the wire
  // rather than about an invitation. Nothing is written across the envelope for
  // a row carrying no name, for the same reason nothing is without a token.
  //
  // Replying is gated on the row rather than on the name it carries. The token
  // is what identifies a guest to the backend, so a row with no name is still
  // somebody who can answer - they are only asked for their name, the way
  // anybody without a personal link is.
  const guestRow = guest?.data ?? null;
  const addressee = guestRow?.Name?.trim() || undefined;

  // Everything below is drawn inside the invitation's own fonts, because all of
  // it is what the invitation's own address answered with.
  return (
    <div className={`${weddingTemplate1Fonts} bg-black`}>
      {content && guestIsKnown ? (
        <WeddingTemplate1
          content={content}
          addressee={addressee}
          guest={
            guestRow
              ? { slug: params.slug, token, name: addressee ?? '' }
              : undefined
          }
          sealed
          scrollsInside="page"
          showVinylWidget
        />
      ) : (
        <InvitationUnavailable
          reason={refusal(content, guestIsKnown, invitation.message)}
        />
      )}
    </div>
  );
}

/**
 * Which of the three refusals a guest is shown.
 *
 * A wedding that parsed and a guest who is still not known means the personal
 * half of the link is the part that failed. Nothing here can say which way: the
 * client folds a refusal and a fault into the same answer, so a revoked token,
 * another wedding's token and a backend that was down for a second all arrive
 * identically - which is why the words for this one cover both what the guest
 * can do now and what they can do if it lasts.
 */
function refusal(
  content: WeddingTemplate1Content | null,
  guestIsKnown: boolean,
  message: string
): Unavailable {
  if (content && !guestIsKnown) return 'GUEST_NOT_CONFIRMED';
  return message === INVITATION_NOT_PUBLISHED ? 'NOT_READY' : 'CANNOT_BE_OPENED';
}

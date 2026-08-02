import { INVITATION_NOT_PUBLISHED } from '@/action/interfaces';
import { getPublicWeddingInvitation } from '@/action/wedding-api';
import { weddingContentFrom } from '@/components/forms/wedding/wedding-invitation-types';
import WeddingTemplate1 from '@/components/wedding/wedding-template-1/WeddingTemplate1';
import { weddingTemplate1Fonts } from '@/components/wedding/wedding-template-1/fonts';

import InvitationUnavailable from './invitation-unavailable';

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
 * Whose envelope this is - the guest's name across the front of it - is not
 * answered here. That needs the guest's token off the link, which is
 * `hbd-ox7.10`.
 *
 * It lives under `(gifts)`, which is what keeps the site footer off it, per
 * `docs/adr/0003-the-route-group-says-whether-a-page-is-a-gift.md`.
 */
export default async function WeddingInvitationViewerPage({
  params,
}: {
  params: { slug: string };
}) {
  const invitation = await getPublicWeddingInvitation(params.slug);
  const content = weddingContentFrom(invitation.data?.detail_content_json_text);

  // Two things a guest can be told apart, and only two. An invitation that
  // exists but is still a draft is a link that is early, and the guest keeps it;
  // everything else - no such slug, a refused read, a record that will not parse
  // - is a link that does not work, and the guest goes back to the couple. The
  // difference between the reasons behind "does not work" is ours to look into
  // and nothing a guest could act on.
  //
  // Both are drawn inside the invitation's own fonts, because both are what the
  // invitation's own address answered with.
  return (
    <div className={`${weddingTemplate1Fonts} bg-black`}>
      {content ? (
        <WeddingTemplate1
          content={content}
          sealed
          scrollsInside="page"
          showVinylWidget
        />
      ) : (
        <InvitationUnavailable
          reason={
            invitation.message === INVITATION_NOT_PUBLISHED
              ? 'NOT_READY'
              : 'CANNOT_BE_OPENED'
          }
        />
      )}
    </div>
  );
}

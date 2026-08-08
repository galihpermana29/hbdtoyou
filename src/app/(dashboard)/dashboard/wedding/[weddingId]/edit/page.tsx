import type { Metadata } from 'next';

import InvitationRefusal, {
  couldNotBeOpened,
} from '../../invitation-refusal';
import WeddingInvitationCreateClientside from '@/app/(landing)/(core)/create/wedding-invitation/wedding-invitation-create-clientside';
import { getOwnedWeddingInvitation } from '@/action/wedding-api';
import { FlowLanguageProvider } from '@/components/forms/wedding/flow-language';
import { weddingContentFrom } from '@/components/forms/wedding/wedding-invitation-types';

export const metadata: Metadata = {
  title: 'Edit Wedding Invitation | Memoify',
};

const HEADING = 'Edit Wedding Invitation';

export interface EditWeddingInvitationPageProps {
  params: { weddingId: string };
}

/**
 * A saved wedding invitation, opened back into the flow that made it.
 *
 * The same flow, not a second editor. Every field a couple can fill in is
 * defined once, validated once and saved once, and an editor built beside it
 * would be a second place each of them has to be kept correct - the first field
 * either of them forgot would be one a couple could enter and never see again.
 * What the address carries is the invitation, and handing that identifier to
 * the flow is the whole of what makes a save here update rather than create:
 * see `use-invitation.ts`.
 *
 * Who may open it is the backend's answer rather than a check here. The owner
 * read is `GET /wedding/{uuid}` scoped to the signed-in user, so an invitation
 * belonging to somebody else is not refused by this page, it simply is not
 * answered - which is the same guard the update behind Save is under, rather
 * than a second one that could disagree with it.
 */
export default async function EditWeddingInvitationPage({
  params,
}: EditWeddingInvitationPageProps) {
  const invitation = await getOwnedWeddingInvitation(params.weddingId);

  if (!invitation.success || !invitation.data) {
    return (
      <InvitationRefusal heading={HEADING}>
        {couldNotBeOpened(invitation.message)}
      </InvitationRefusal>
    );
  }

  const content = weddingContentFrom(invitation.data.detail_content_json_text);

  // Nothing is invented for a record that cannot be read. Opening an empty form
  // over a saved invitation would look like an invitation with nothing in it,
  // and the first save would make that true.
  if (!content) {
    return (
      <InvitationRefusal heading={HEADING}>
        This invitation was found, but what was saved in it could not be read
        back, so there is nothing here to change without overwriting it.
      </InvitationRefusal>
    );
  }

  return (
    <FlowLanguageProvider>
      <WeddingInvitationCreateClientside
        slug=""
        chrome="dashboard"
        opened={{
          weddingId: invitation.data.id || params.weddingId,
          slug: invitation.data.invitation_slug ?? '',
          isPublished: invitation.data.status === 'published',
          // As it was stored. Turning it into the form's answers happens on the
          // other side of this boundary: the wedding day becomes a Dayjs, which
          // a server component cannot hand to a client one.
          content,
          // Absent on a record written before there was anywhere to keep it,
          // which the flow treats as a couple who has not written one yet.
          greetingMessage: content.greetingMessage ?? null,
        }}
      />
    </FlowLanguageProvider>
  );
}

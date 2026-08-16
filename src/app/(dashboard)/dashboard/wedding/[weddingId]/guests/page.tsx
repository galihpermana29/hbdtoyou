import type { Metadata } from 'next';

import GuestListScreen from './guest-list-screen';
import InvitationRefusal, { couldNotBeOpened } from '../../invitation-refusal';
import { getOwnedWeddingInvitation } from '@/action/wedding-api';
import { FlowLanguageProvider } from '@/components/forms/wedding/flow-language';
import {
  coupleNamedIn,
  weddingContentFrom,
} from '@/components/forms/wedding/wedding-invitation-types';

export const metadata: Metadata = {
  title: 'Guest list | Memoify',
};

export interface WeddingGuestsPageProps {
  params: { weddingId: string };
}

/**
 * One invitation's Guest List, on a screen of its own.
 *
 * The list carries six things about each guest and the Create Flow gives it a
 * column of a two-column step, so the columns scroll sideways inside a card. A
 * whole screen is what a table that wide actually wants, and here it gets one.
 *
 * The invitation is named in the address rather than remembered, which is the
 * point: guests belong to an invitation, each one is minted a personal link
 * against it, and there is no such thing as a Guest List that is not somebody's.
 * Nothing can reach this screen without saying whose wedding it is.
 *
 * Who may open it is settled by the backend, not here - see the note on the
 * edit screen, which is under the same guard for the same reason.
 */
export default async function WeddingGuestsPage({
  params,
}: WeddingGuestsPageProps) {
  const invitation = await getOwnedWeddingInvitation(params.weddingId);

  if (!invitation.success || !invitation.data) {
    return (
      <InvitationRefusal heading="Guest list">
        {couldNotBeOpened(invitation.message)}
      </InvitationRefusal>
    );
  }

  return (
    // The same language the couple chose for the flow, because the Guest List
    // card on this screen is the flow's own and reads in the flow's words.
    <FlowLanguageProvider>
      <GuestListScreen
        weddingId={invitation.data.id || params.weddingId}
        couple={coupleNamedIn(
          weddingContentFrom(invitation.data.detail_content_json_text)
        )}
      />
    </FlowLanguageProvider>
  );
}

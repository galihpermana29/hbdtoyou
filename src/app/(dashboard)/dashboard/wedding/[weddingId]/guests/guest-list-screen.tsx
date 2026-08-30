'use client';

/**
 * The Guest List of one invitation, and what it actually knows about it.
 *
 * The same roster the Create Flow uses, hung on the invitation the address
 * names. It reads the guests back off the backend, so what is on this screen is
 * what the couple's guests are actually on, and every upload, correction and
 * deletion goes to the backend before it shows.
 *
 * The count is the count of guests read back, said plainly. Not a promise about
 * how many were ever uploaded: a list that could not be read says so, and a
 * list with nobody on it says that instead of showing an empty table as though
 * it were an answer.
 */

import Link from 'next/link';

import {
  flowHint,
  flowSectionName,
} from '@/components/forms/wedding/create-flow-treatment';
import GuestListField from '@/components/forms/wedding/guest-list-field';
import {
  guestLinkFor,
  invitationPreviewLinkFor,
  renderGuestMessage,
} from '@/components/forms/wedding/guest-invites-types';
import type { Guest } from '@/components/forms/wedding/guest-list';
import { useGuestRoster } from '@/components/forms/wedding/use-guest-roster';
import type { WeddingTemplate1Content } from '@/components/forms/wedding/wedding-invitation-types';

export interface GuestListScreenProps {
  weddingId: string;
  /** The couple, as far as the record names them, or empty when it does not. */
  couple: string;
  /** The invitation's address, which every guest's personal link is built on. */
  slug: string;
  /** What the couple saved, which is where their greeting message lives. */
  content: WeddingTemplate1Content | null;
}

export default function GuestListScreen({
  weddingId,
  couple,
  slug,
  content,
}: GuestListScreenProps) {
  const { guestList, upload, correct, remove, problem, isBusy } =
    useGuestRoster(weddingId);

  /**
   * One guest's invitation, as that guest will read it.
   *
   * The couple's own message with this guest's name and personal link in it,
   * so sending two hundred invitations is two hundred presses rather than two
   * hundred edits. The same composition the Create Flow's own Guest List does
   * - see `guest-invites-step.tsx` - because it is the same list and the same
   * message either side of a save.
   *
   * Null where the message or the link is missing: an invitation saved before
   * there was anywhere to keep a greeting, or a guest the backend has not
   * minted a token for. A message still carrying its placeholders looks
   * finished and is not.
   */
  function inviteFor(guest: Guest): string | null {
    const message = content?.greetingMessage?.trim();
    const link = guest.token ? guestLinkFor(slug, guest.token) : null;
    if (!message || !link) return null;
    return renderGuestMessage(message, {
      brideNickname: content?.brideName ?? '',
      groomNickname: content?.groomName ?? '',
      guestName: guest.name,
      guestLink: link,
    });
  }

  const invited = guestList?.guests.length ?? 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col px-[32px] py-[32px] 2xl:max-w-7xl">
      <Link
        href="/dashboard/wedding"
        className="text-[14px] font-[600] leading-[20px] text-[#E34013] underline">
        Back to your invitations
      </Link>

      <div className="mt-[16px]">
        {/* The screen's own words rather than the flow's. The Create Flow's
            copy is the design's and reads in the couple's chosen language,
            which today defaults to Indonesian; the rest of the dashboard is in
            English, and a heading in one language over a sentence in the other
            is worse than either. Which language this whole area should be in is
            `hbd-bu7`, and it is not a decision to take field by field. */}
        <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
          Guest list
        </h1>
        <p className="mt-[8px] text-[16px] font-[400] leading-[24px] text-[#667085]">
          {couple === ''
            ? 'Who this invitation goes to, and the personal link each of them gets.'
            : `Who ${couple}’s invitation goes to, and the personal link each of them gets.`}
        </p>
      </div>

      <div className="mt-[24px]">
        <h2 className={flowSectionName}>
          {/* What the backend answered with, rather than what was uploaded.
              Nobody on the list is its own sentence: an empty table beside the
              word "0" reads as a list that failed to load. */}
          {invited === 0
            ? 'Nobody is on this guest list yet'
            : `${invited} ${invited === 1 ? 'guest' : 'guests'} on this list`}
        </h2>
        <p className={flowHint}>
          Uploading a file replaces the whole list. Everybody it names is given
          a personal link, and anybody it leaves out loses theirs.
        </p>

        <GuestListField
          guestList={guestList}
          onUpload={upload}
          onCorrect={correct}
          onDelete={remove}
          inviteFor={inviteFor}
          openInvitationAt={(guest) =>
            invitationPreviewLinkFor(slug, guest.token ?? '')
          }
          problem={problem}
          isBusy={isBusy}
        />
      </div>
    </div>
  );
}

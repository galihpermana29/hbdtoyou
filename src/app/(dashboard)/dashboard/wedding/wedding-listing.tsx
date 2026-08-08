'use client';

/**
 * The rows of a couple's own invitations, and the three things each one offers.
 *
 * Edit and Manage guest list are links, because they are destinations. Publish
 * is not: it asks the backend whether the invitation may go out and then puts
 * it out, and what comes back belongs beside the invitation it came back about.
 *
 * ## Publish runs the real check and prints the real refusal
 *
 * It is not hidden and it is not disabled, even though it is currently refusing
 * invitations whose couple is demonstrably filled in. The refusal is the
 * backend's own words, printed as they arrive, and a control that ran nothing
 * would have told nobody that: this is how the gap was found, and it is how
 * anybody looking at the screen finds it again.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { OwnedInvitation } from './owned-invitations';
import { attemptPublish } from '@/components/forms/wedding/publish-invitation';

export interface WeddingListingProps {
  invitations: OwnedInvitation[];
  /** What stopped the list being read at all, or null when it was read. */
  problem: string | null;
  moreThanShown: boolean;
  /** Whether this is every invitation there is rather than one person's. */
  isAdmin: boolean;
}

/** What one row is saying about the last press of its Publish. */
type PublishSaid =
  | { kind: 'published' }
  | { kind: 'notReady'; outstanding: string[] }
  | { kind: 'failed'; problem: string };

const card =
  'rounded-[12px] border border-[#EAECF0] bg-white p-[20px] flex flex-col gap-[12px]';
const action =
  'rounded-[8px] border border-[#D0D5DD] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB]';
const primaryAction =
  'rounded-[8px] border border-[#E34013] bg-[#E34013] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-white hover:opacity-90 disabled:opacity-60';
const note = 'text-[14px] font-[400] leading-[20px] text-[#667085]';
const alert = 'text-[14px] font-[400] leading-[20px] text-[#B42318]';

export default function WeddingListing({
  invitations,
  problem,
  moreThanShown,
  isAdmin,
}: WeddingListingProps) {
  const router = useRouter();
  /** What each row's Publish had to say, by the invitation it was pressed on. */
  const [said, setSaid] = useState<Record<string, PublishSaid>>({});
  /** Which invitation is being published, so its control cannot be pressed twice. */
  const [publishing, setPublishing] = useState<string | null>(null);

  async function publish(weddingId: string) {
    setPublishing(weddingId);
    // Whatever the last press of this row's control had to say. It was about
    // the press before this one, and leaving it up would put an old refusal
    // beside a press that has not answered yet.
    setSaid((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([id]) => id !== weddingId)
      )
    );

    try {
      const attempt = await attemptPublish(weddingId);
      if (attempt.outcome === 'PUBLISHED') {
        setSaid((previous) => ({
          ...previous,
          [weddingId]: { kind: 'published' },
        }));
        // The row's status and its address both change when this lands, and
        // both are read on the server, so the screen has to be asked again
        // rather than patched here into agreeing with itself.
        router.refresh();
        return;
      }
      setSaid((previous) => ({
        ...previous,
        [weddingId]:
          attempt.outcome === 'NOT_READY'
            ? { kind: 'notReady', outstanding: attempt.outstanding }
            : { kind: 'failed', problem: attempt.problem },
      }));
    } finally {
      setPublishing(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-[24px] px-[32px] py-[32px] 2xl:max-w-7xl">
      <div>
        <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
          Wedding invitations
        </h1>
        <p className={`mt-[8px] ${note}`}>
          {isAdmin
            ? 'Every wedding invitation anybody has made.'
            : 'The wedding invitations you have made, finished or not.'}
        </p>
      </div>

      {problem ? (
        <p role="alert" className={alert}>
          {problem}
        </p>
      ) : null}

      {!problem && invitations.length === 0 ? (
        <div className={card}>
          <p className="text-[16px] font-[400] leading-[24px] text-[#182230]">
            You have not made a wedding invitation yet.
          </p>
          <Link
            href="/create/wedding-invitation"
            className={`${primaryAction} w-fit`}>
            Make one
          </Link>
        </div>
      ) : null}

      {invitations.map((invitation) => {
        const answer = invitation.weddingId
          ? said[invitation.weddingId]
          : undefined;

        return (
          <div key={invitation.contentId} className={card}>
            <div className="flex flex-wrap items-center gap-[12px]">
              <h2 className="text-[18px] font-[600] leading-[28px] text-[#182230]">
                {invitation.couple}
              </h2>
              {/* Nothing at all on a row that could not be read back. Draft is
                  a claim about an invitation, and an invitation nothing here
                  could reach is one whose state nobody asked. The sentence
                  below says that; a pill saying Draft would contradict it. */}
              {invitation.unreachable ? null : (
                <span
                  className={`rounded-[16px] px-[10px] py-[2px] text-[12px] font-[600] leading-[18px] ${
                    invitation.isPublished
                      ? 'bg-[#ECFDF3] text-[#027A48]'
                      : 'bg-[#F2F4F7] text-[#344054]'
                  }`}>
                  {invitation.isPublished ? 'Published' : 'Draft'}
                </span>
              )}
              {invitation.createdOn ? (
                <span className={note}>Made {invitation.createdOn}</span>
              ) : null}
            </div>

            {/* The address, whatever state the invitation is in. A draft has one
                already - the backend generates it when the invitation is
                created - and it does not resolve until the invitation is
                published, which is said rather than left for a couple to
                discover by sending it to somebody. */}
            {invitation.address ? (
              <p className={note}>
                {invitation.isPublished ? (
                  <a
                    href={invitation.address}
                    target="_blank"
                    rel="noreferrer"
                    className="font-[600] text-[#E34013] underline">
                    {invitation.address}
                  </a>
                ) : (
                  <>
                    {invitation.address}
                    <span className="ml-[8px]">
                      - this address does not open until you publish.
                    </span>
                  </>
                )}
              </p>
            ) : null}

            {invitation.unreachable ? (
              <p role="alert" className={alert}>
                {invitation.unreachable}
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-[12px]">
                <Link
                  href={`/dashboard/wedding/${invitation.weddingId}/edit`}
                  className={action}>
                  Edit
                </Link>
                <Link
                  href={`/dashboard/wedding/${invitation.weddingId}/guests`}
                  className={action}>
                  Manage guest list
                </Link>
                {invitation.isPublished ? null : (
                  <button
                    type="button"
                    onClick={() => publish(invitation.weddingId as string)}
                    disabled={publishing === invitation.weddingId}
                    aria-busy={publishing === invitation.weddingId}
                    className={primaryAction}>
                    Publish
                  </button>
                )}
              </div>
            )}

            {answer?.kind === 'published' ? (
              <p role="status" className="text-[14px] text-[#027A48]">
                Your invitation is published. Anybody with the address can read
                it.
              </p>
            ) : null}

            {answer?.kind === 'failed' ? (
              <p role="alert" className={alert}>
                {answer.problem}
              </p>
            ) : null}

            {/* Listed rather than run together, because a couple has to go back
                and fix each one, and printed in the backend's words as they
                arrived. By position, because the backend names a field and a
                fault separately and only the fault is printed: two fields can be
                wrong in the same words. */}
            {answer?.kind === 'notReady' ? (
              <div role="alert" className={alert}>
                <p>
                  This invitation is not ready to publish yet. It is still a
                  draft, and nothing has been sent to your guests.
                </p>
                <ul className="mt-[6px] flex list-disc flex-col gap-[4px] pl-[20px]">
                  {answer.outstanding.map((issue, position) => (
                    <li key={position}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        );
      })}

      {moreThanShown ? (
        <p className={note}>
          This screen shows the first 100 invitations and there are more. Older
          ones are not listed here yet.
        </p>
      ) : null}
    </div>
  );
}

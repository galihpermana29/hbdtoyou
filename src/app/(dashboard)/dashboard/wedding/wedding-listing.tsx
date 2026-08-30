'use client';

/**
 * A couple's own invitations as a grid of cards, each wearing the invitation
 * itself.
 *
 * ## The preview is the real viewer, in an iframe
 *
 * A published card's face is the invitation as a guest receives it - the
 * same-origin viewer at `/w/{slug}`, the route the subdomain middleware
 * resolves to - scaled from its 375px design width into the card and left
 * sealed and inert (`pointer-events: none`, `tabIndex -1`). An iframe rather
 * than embedding the template component, by the owner's call (2026-08-30):
 * full isolation, the template untouched.
 *
 * Two consequences, both accepted knowingly:
 * - The public read counts a view, so opening this dashboard ticks each
 *   published invitation's view_count once per card. The iframes load lazily
 *   to soften it; a `?preview=1` the backend does not count is the clean fix
 *   when wanted.
 * - A draft cannot render this way - the public viewer refuses unpublished
 *   records - so a draft's face falls back to the couple's own cover
 *   photograph, and past that to a monogram. Nothing is invented.
 *
 * ## Publish runs the real check and prints the real refusal
 *
 * Unchanged from the row days: the control asks the backend whether the
 * invitation may go out and prints what comes back, in the backend's words,
 * inside the card it came back about.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { LinkedMemoroll } from './linked-memorolls';
import type { OwnedInvitation } from './owned-invitations';
import { attemptPublish } from '@/components/forms/wedding/publish-invitation';

export interface WeddingListingProps {
  invitations: OwnedInvitation[];
  /** What stopped the list being read at all, or null when it was read. */
  problem: string | null;
  moreThanShown: boolean;
  /** Whether this is every invitation there is rather than one person's. */
  isAdmin: boolean;
  /**
   * Each wedding's active MemoRoll, by wedding id.
   *
   * One wedding, one memoroll, so each card's MemoRoll row offers exactly
   * one of two things: Create MemoRoll when the wedding has none, or Manage
   * MemoRoll - the owner console - when it does. See `linked-memorolls.ts`
   * for where the answer comes from.
   */
  memorolls: Record<string, LinkedMemoroll>;
}

/** What one card is saying about the last press of its Publish. */
type PublishSaid =
  | { kind: 'published' }
  | { kind: 'notReady'; outstanding: string[] }
  | { kind: 'failed'; problem: string };

/** How wide the invitation is drawn; the scale every preview is computed from. */
const DESIGN_WIDTH = 375;
/** How tall a phone of that width is; enough viewer for a sealed envelope. */
const DESIGN_HEIGHT = 812;

const secondary =
  'flex-1 rounded-[8px] border border-[#D0D5DD] px-[8px] py-[8px] text-center text-[13px] font-[600] leading-[18px] text-[#344054] hover:bg-[#F9FAFB]';
const primary =
  'block w-full rounded-[8px] border border-[#E34013] bg-[#E34013] px-[14px] py-[10px] text-center text-[14px] font-[600] leading-[20px] text-white hover:opacity-90 disabled:opacity-60';
const note = 'text-[13px] font-[400] leading-[18px] text-[#667085]';
const alert = 'text-[13px] font-[400] leading-[18px] text-[#B42318]';

/** The two letters a nameless card face wears: the couple's initials. */
function monogramOf(couple: string): string {
  const letters = couple
    .split(/[^A-Za-zÀ-ɏ]+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase());
  return letters.slice(0, 2).join('') || '?';
}

/**
 * The card's face: the live invitation when the world can see it, the
 * couple's cover photograph when only they can, a monogram when there is
 * nothing to show yet.
 */
function PreviewFace({ invitation }: { invitation: OwnedInvitation }) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  // The iframe is the viewer at its real 375px width, scaled to whatever
  // width the grid gives this card; measured live so the preview survives a
  // resize the way the invitation itself would.
  useEffect(() => {
    const box = frame.current;
    if (!box) return;
    const measure = () => setScale(box.clientWidth / DESIGN_WIDTH);
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(box);
    return () => watcher.disconnect();
  }, []);

  const live = invitation.isPublished && invitation.slug;

  return (
    <div
      ref={frame}
      className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2F4F7]">
      {live && scale > 0 ? (
        <iframe
          src={`/w/${invitation.slug}`}
          title={`Preview of ${invitation.couple}`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
          }}
        />
      ) : invitation.heroPhoto ? (
        // A draft's face: the couple's own cover photograph, the same one the
        // invitation opens on.
        <img
          src={invitation.heroPhoto}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[48px] font-[600] tracking-[0.1em] text-[#D0D5DD]">
            {monogramOf(invitation.couple)}
          </span>
        </div>
      )}

      {/* A published preview is also the door: the whole face opens the real
          invitation, where the inert iframe cannot swallow the click. */}
      {live ? (
        <a
          href={invitation.address ?? `/w/${invitation.slug}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${invitation.couple}`}
          className="absolute inset-0"
        />
      ) : null}

      <span
        className={`absolute left-[12px] top-[12px] rounded-[16px] px-[10px] py-[2px] text-[12px] font-[600] leading-[18px] shadow-sm ${
          invitation.isPublished
            ? 'bg-[#ECFDF3] text-[#027A48]'
            : 'bg-white text-[#344054]'
        }`}>
        {invitation.unreachable
          ? 'Unreadable'
          : invitation.isPublished
            ? 'Published'
            : 'Draft'}
      </span>
    </div>
  );
}

export default function WeddingListing({
  invitations,
  problem,
  moreThanShown,
  isAdmin,
  memorolls,
}: WeddingListingProps) {
  const router = useRouter();
  /** What each card's Publish had to say, by the invitation it was pressed on. */
  const [said, setSaid] = useState<Record<string, PublishSaid>>({});
  /** Which invitation is being published, so its control cannot be pressed twice. */
  const [publishing, setPublishing] = useState<string | null>(null);

  async function publish(weddingId: string) {
    setPublishing(weddingId);
    // Whatever the last press of this card's control had to say. It was about
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
        // The card's status and its address both change when this lands, and
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
        <p className="mt-[8px] text-[14px] font-[400] leading-[20px] text-[#667085]">
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
        <div className="rounded-[16px] border border-[#EAECF0] bg-white p-[20px]">
          <p className="text-[16px] font-[400] leading-[24px] text-[#182230]">
            You have not made a wedding invitation yet.
          </p>
          <Link href="/create/wedding-invitation" className={`${primary} mt-[12px] w-fit`}>
            Make one
          </Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3">
        {invitations.map((invitation) => {
          const answer = invitation.weddingId
            ? said[invitation.weddingId]
            : undefined;
          const memoroll = invitation.weddingId
            ? memorolls[invitation.weddingId]
            : undefined;

          return (
            <div
              key={invitation.contentId}
              className="flex flex-col overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white shadow-sm transition-shadow hover:shadow-md">
              <PreviewFace invitation={invitation} />

              <div className="flex flex-1 flex-col gap-[12px] p-[16px]">
                <div>
                  <h2 className="text-[16px] font-[600] leading-[24px] text-[#182230]">
                    {invitation.couple}
                  </h2>
                  {invitation.createdOn ? (
                    <p className={note}>Made {invitation.createdOn}</p>
                  ) : null}
                </div>

                {/* The address, whatever state the invitation is in. A draft
                    has one already and it does not resolve until published,
                    which is said rather than left for a couple to discover by
                    sending it to somebody. */}
                {invitation.address ? (
                  invitation.isPublished ? (
                    <a
                      href={invitation.address}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-[13px] font-[600] leading-[18px] text-[#E34013] underline">
                      {invitation.address}
                    </a>
                  ) : (
                    <p className={`${note} truncate`} title={invitation.address}>
                      {invitation.address.replace('https://', '')} - opens when
                      you publish.
                    </p>
                  )
                ) : null}

                {invitation.unreachable ? (
                  <p role="alert" className={alert}>
                    {invitation.unreachable}
                  </p>
                ) : (
                  <div className="mt-auto flex flex-col gap-[8px]">
                    {/* Row one: the invitation's own two jobs, side by side. */}
                    <div className="flex gap-[8px]">
                      <Link
                        href={`/dashboard/wedding/${invitation.weddingId}/edit`}
                        className={secondary}>
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/wedding/${invitation.weddingId}/guests`}
                        className={secondary}>
                        Manage guests
                      </Link>
                    </div>

                    {/* Row two: the MemoRoll, on a row of its own - one
                        wedding, one memoroll, one of two doors: create it,
                        or manage the one that exists in its console. */}
                    {memoroll ? (
                      <Link
                        href={`/dashboard/memoroll/${memoroll.id}`}
                        className={secondary}>
                        Manage MemoRoll
                      </Link>
                    ) : (
                      <Link
                        href={`/memoroll/create?wedding_id=${invitation.weddingId}`}
                        className={secondary}>
                        Create MemoRoll
                      </Link>
                    )}

                    {invitation.isPublished ? (
                      <a
                        href={invitation.address ?? `/w/${invitation.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={primary}>
                        View invitation
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => publish(invitation.weddingId as string)}
                        disabled={publishing === invitation.weddingId}
                        aria-busy={publishing === invitation.weddingId}
                        className={primary}>
                        {publishing === invitation.weddingId
                          ? 'Publishing…'
                          : 'Publish'}
                      </button>
                    )}
                  </div>
                )}

                {answer?.kind === 'published' ? (
                  <p role="status" className="text-[13px] leading-[18px] text-[#027A48]">
                    Your invitation is published. Anybody with the address can
                    read it.
                  </p>
                ) : null}

                {answer?.kind === 'failed' ? (
                  <p role="alert" className={alert}>
                    {answer.problem}
                  </p>
                ) : null}

                {/* Listed rather than run together, because a couple has to go
                    back and fix each one, and printed in the backend's words
                    as they arrived. */}
                {answer?.kind === 'notReady' ? (
                  <div role="alert" className={alert}>
                    <p>
                      This invitation is not ready to publish yet. It is still
                      a draft, and nothing has been sent to your guests.
                    </p>
                    <ul className="mt-[6px] flex list-disc flex-col gap-[4px] pl-[20px]">
                      {answer.outstanding.map((issue, position) => (
                        <li key={position}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {moreThanShown ? (
        <p className={note}>
          This screen shows the first 100 invitations and there are more. Older
          ones are not listed here yet.
        </p>
      ) : null}
    </div>
  );
}

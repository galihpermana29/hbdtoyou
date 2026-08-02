/**
 * What a guest reads when the link they were sent does not open an invitation.
 *
 * The design draws no such screen. It was drawn for the invitation, and an
 * invitation that will not open is not one of its states - but a link travels
 * through a message and a screenshot and somebody reading it out over a phone,
 * and it will arrive early, mistyped and out of date. A guest who is handed the
 * server's error page cannot tell "not yet" from "wrong address", and the two
 * ask completely different things of them: one is to wait, the other is to go
 * back to the couple. See `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * It is drawn in the invitation's own black and the invitation's own typeface,
 * because it is the invitation's address that was opened. A guest who followed a
 * wedding link should land somewhere that looks like the wedding rather than
 * somewhere that looks like a fault in a different product.
 */

/** Which of the two things went wrong, in the words a guest is given for it. */
export type Unavailable = 'NOT_READY' | 'CANNOT_BE_OPENED';

const WORDS: Record<Unavailable, { heading: string; body: string }> = {
  NOT_READY: {
    heading: 'This invitation is not ready yet',
    body:
      'The couple are still putting it together. The link is the right one and ' +
      'it will open as soon as they publish, so keep it and come back.',
  },
  CANNOT_BE_OPENED: {
    heading: 'This invitation could not be opened',
    body:
      'The address may have been mistyped, or the invitation may have been ' +
      'taken down. Ask the couple for the link again.',
  },
};

export default function InvitationUnavailable({
  reason,
}: {
  reason: Unavailable;
}) {
  const { heading, body } = WORDS[reason];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[375px] flex-col items-center justify-center bg-[#090909] px-[24px] text-center">
      {/* The invitation's own script and its own off-white, at two thirds of
          the 48px its sections are headed in: this is the wedding answering,
          but it is not one of the wedding's headings. Held to 260px so that it
          breaks onto two balanced lines rather than running to within a few
          pixels of the screen's edge on the longer of the two messages, which
          would then overflow on any phone narrower than 375. */}
      <h1 className="mx-auto max-w-[260px] font-[family-name:var(--font-wt1-script)] text-[32px] leading-[normal] text-[rgba(250,250,250,0.98)]">
        {heading}
      </h1>
      <p className="mx-auto mt-[20px] max-w-[300px] font-[family-name:var(--font-wt1-mono)] text-[12px] leading-[20px] text-[rgba(250,250,250,0.7)]">
        {body}
      </p>
    </main>
  );
}

import Link from 'next/link';

/**
 * What a couple reads when the invitation an address names cannot be opened.
 *
 * Both screens addressed by an invitation need this and need it to read the
 * same: whether a couple pressed Edit or Manage guest list, the invitation is
 * equally missing and the reason is equally the backend's. Two copies would be
 * two accounts of one refusal, and the one they happened to press would decide
 * which they got.
 *
 * It always offers the way back, because a screen naming an invitation that
 * cannot be opened is a dead end otherwise.
 */
export interface InvitationRefusalProps {
  /** What the screen they were trying to reach is called. */
  heading: string;
  /** What went wrong, in a sentence a couple can act on. */
  children: React.ReactNode;
}

export default function InvitationRefusal({
  heading,
  children,
}: InvitationRefusalProps) {
  return (
    <div className="mx-auto max-w-6xl px-[32px] py-[32px] 2xl:max-w-7xl">
      <h1 className="text-[24px] font-[600] leading-[32px] text-[#182230]">
        {heading}
      </h1>
      <p
        role="alert"
        className="mt-[8px] text-[16px] font-[400] leading-[24px] text-[#B42318]">
        {children}
      </p>
      <Link
        href="/dashboard/wedding"
        className="mt-[16px] inline-block text-[14px] font-[600] leading-[20px] text-[#E34013] underline">
        Back to your invitations
      </Link>
    </div>
  );
}

/**
 * Why an invitation could not be read, in the backend's terms and the couple's.
 *
 * The backend's reason and then what it probably means, because "DATA_NOT_FOUND"
 * on its own tells a couple nothing about whether their wedding still exists.
 */
export function couldNotBeOpened(reason: string): string {
  return (
    `This invitation could not be opened: ${reason}. It may belong to ` +
    'somebody else, or it may no longer exist.'
  );
}

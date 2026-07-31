'use client';

import { Eye } from 'lucide-react';
import { Fragment } from 'react';

import {
  renderGuestMessage,
  SAMPLE_GUEST_NAME,
  type GuestMessageSubstitutions,
} from './guest-invites-types';

/**
 * The greeting message as one guest will receive it, drawn as the design draws
 * it: a chat thread with the message already sent.
 *
 * This is a picture of somewhere else, not a working chat. Nothing is sent from
 * here and nothing is fetched: the couple's own message is substituted and
 * rendered, and that is all.
 *
 * The avatar's letter is the design's, and the design's is a G beside a guest
 * called Johnny. That is not corrected here: the design is literal truth,
 * including its mistakes, and a correction belongs in Figma. See
 * `docs/adr/0002-figma-is-literal-truth.md`.
 */

const AVATAR_LETTER = 'G';

/** When the message was sent, in the design. Nothing here is a real clock. */
const SENT_AT = '10:00 AM ✓';

export interface GuestInvitesPreviewProps {
  /** The message as the couple wrote it, placeholders still in it. */
  message: string;
  /** What to put in place of each placeholder for this one guest. */
  substitutions: GuestMessageSubstitutions;
}

/**
 * The message text, with the guest's own link picked out in the design's green.
 *
 * The link is found by matching the text that was substituted in rather than by
 * looking for anything that resembles a URL, so a couple who writes their own
 * address into the message does not get half of it coloured.
 */
function MessageBody({ text, link }: { text: string; link: string | null }) {
  if (!link) {
    return <>{text}</>;
  }

  const parts = text.split(link);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? <span className="text-[#079455]">{link}</span> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}

export default function GuestInvitesPreview({
  message,
  substitutions,
}: GuestInvitesPreviewProps) {
  const rendered = renderGuestMessage(message, substitutions);

  return (
    <div className="flex w-[405px] flex-col gap-[24px]">
      <div className="flex items-center gap-[4px]">
        <Eye size={20} aria-hidden="true" className="text-[#1B1B1B]" />
        <p className="text-[18px] font-[600] leading-[28px] text-[#1B1B1B]">
          Invitation Preview
        </p>
      </div>

      <div className="rounded-[12px] bg-[#F7F7F7] p-[14px]">
        <div className="flex min-h-[812px] flex-col overflow-hidden rounded-[8px] border border-[#E5E7EB]">
          <div className="flex h-[60px] shrink-0 items-center gap-[12px] bg-[#075E54] px-[16px]">
            <span
              aria-hidden="true"
              className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-white text-[14px] font-[600] leading-[20px] text-[#075E54]">
              {AVATAR_LETTER}
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-[500] leading-[20px] text-white">
                {SAMPLE_GUEST_NAME}
              </p>
              <p className="text-[12px] font-[400] leading-[16px] text-[#D1D5DC]">
                online
              </p>
            </div>
          </div>

          <div className="flex-1 bg-[#ECE5DD] p-[16px]">
            {/* The bubble's width is the design's, so a line of the couple's
                message wraps where their guest's would. */}
            <div className="flex w-[290px] max-w-full flex-col gap-[8px] rounded-[8px] bg-white p-[12px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
              <p className="whitespace-pre-wrap text-[14px] font-[400] leading-[20px] tracking-[-0.15px] text-black">
                <MessageBody text={rendered} link={substitutions.guestLink} />
              </p>
              <p className="text-right text-[12px] font-[400] leading-[16px] text-[#6A7282]">
                {SENT_AT}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

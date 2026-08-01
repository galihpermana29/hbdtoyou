'use client';

import { Form, type FormInstance } from 'antd';
import { Check, Copy, Home, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import {
  flowActionHome,
  flowActionPlay,
  flowFieldBox,
  flowPreviewScreen,
  flowPreviewTray,
} from './create-flow-treatment';
import WeddingTemplate1 from '@/components/wedding/wedding-template-1/WeddingTemplate1';

import InvitationPlayer from './invitation-player';
import {
  formValuesToContent,
  type WeddingInvitationFormValues,
} from './wedding-invitation-types';

/**
 * The fourth and last step of the Create Flow: the invitation is published, and
 * here is the link to send.
 *
 * Nothing is published from here, and nothing is fetched. The product has no
 * per-content slug and no publish call, so this screen says what the couple has
 * just done and shows them the address it would live at, composed from the slug
 * they chose. Making that address real is `hbd-byb.17`.
 *
 * There is no way back. The design gives this step no Previous step action, so
 * it is the one step that is mounted when it is reached rather than kept alive
 * behind the others: it holds nothing the couple typed, so there is nothing here
 * for leaving to lose.
 *
 * ## Spacing hangs off elements rather than off the boxes between them
 *
 * The design's 60px between the two columns, its 24px under the heading and its
 * 48px above the link and the actions are written as margins on the elements the
 * check can name, rather than as gaps on the containers it cannot. They render
 * identically, and this way every distance the design states is one the check
 * reads back.
 */

/** How long the Copy action says it worked before returning to rest. */
const COPIED_FOR_MS = 2000;

/** The design's confirmation, which is the whole point of the screen. */
const SUPPORTING_TEXT =
  "We've created your wedding invitation website and it's now ready for your " +
  'final touches. Personalize your domain, review your details, and send it ' +
  'to the people who matter most.';

/** Whether the last attempt to copy the link worked, or has not happened yet. */
type CopyState = 'resting' | 'copied' | 'failed';

export interface PublishedStepProps {
  /**
   * The form the couple filled in, so the invitation they are shown is theirs.
   *
   * Watched here rather than above, so that a keystroke on the details step does
   * not re-render this one: this step only exists once that step is behind them.
   */
  form: FormInstance<WeddingInvitationFormValues>;
  /** The address the couple sends, built from the Invitation Slug they chose. */
  invitationLink: string;
}

export default function PublishedStep({
  form,
  invitationLink,
}: PublishedStepProps) {
  const content = formValuesToContent(Form.useWatch([], form));

  const [copyState, setCopyState] = useState<CopyState>('resting');
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (copyState !== 'copied') return;
    const timer = window.setTimeout(
      () => setCopyState('resting'),
      COPIED_FOR_MS
    );
    return () => window.clearTimeout(timer);
  }, [copyState]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopyState('copied');
    } catch {
      // A browser that refuses the clipboard is not a browser this screen can
      // argue with. Saying so leaves the couple somewhere to go; a Copy action
      // that quietly did nothing would not.
      setCopyState('failed');
    }
  }

  return (
    <div className="flex">
      <aside
        className={`mr-[60px] w-[405px] shrink-0 ${flowPreviewTray}`}
        aria-label="Your invitation">
        <div className={flowPreviewScreen}>
          {/* Sealed, because the frame draws the Open Invitation control in
              this panel and a sealed invitation is what a guest is sent. The
              frame draws the cards out of the envelope as well, which is the
              other end of the same interaction: a still cannot show both, and
              an element the design has weighs more than a state it caught. So
              the panel draws the envelope closed over its cards, and a couple
              presses the control to see what a guest sees.

              Sealed all the way, which is the panel taking its own comment
              seriously: nothing below the envelope is part of it until the
              control is pressed, exactly as on the invitation a guest is sent.
              The panel is 812px, the height the envelope is drawn in, so a
              sealed one fills it and there is nothing under it to scroll to.

              It is handed no scroller, because it has none to speak of: this is
              a phone-sized panel with the rest of the step beside it, and what
              scrolls around it is the step, which is the couple's. */}
          <WeddingTemplate1 content={content} sealed />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="text-[36px] font-[600] leading-[50px] text-[#1B1B1B]">
          Yeyyy!!, <br />
          Your wedding invitation is published!
        </h2>
        <p className="mt-[24px] text-[20px] font-[400] leading-[30px] text-[#7B7B7B]">
          {SUPPORTING_TEXT}
        </p>

        <div
          role="group"
          aria-label="Your invitation link"
          className={`mt-[48px] flex items-stretch ${flowFieldBox}`}>
          <p className="min-w-0 flex-1 break-all rounded-l-[8px] bg-[#F9FAFB] px-[14px] py-[12px] text-[16px] font-[400] leading-[24px] text-[#E34013]">
            {invitationLink}
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="flex shrink-0 items-center gap-[6px] rounded-r-[8px] border-l border-[#D0D5DD] bg-white px-[20px] py-[14px] text-[14px] font-[600] leading-[20px] text-[#E34013]">
            {copyState === 'copied' ? (
              <Check size={20} aria-hidden="true" />
            ) : (
              <Copy size={20} aria-hidden="true" />
            )}
            {copyState === 'copied' ? 'Copied' : 'Copy'}
          </button>
          <p role="status" className="sr-only">
            {copyState === 'copied' ? 'Invitation link copied' : ''}
          </p>
        </div>

        {copyState === 'failed' ? (
          <p
            role="alert"
            className="mt-[6px] text-[14px] font-[400] leading-[20px] text-[#D92D20]">
            This browser would not let us copy the link. Select it and copy it
            yourself.
          </p>
        ) : null}

        <div className="flex">
          <button
            ref={playRef}
            type="button"
            onClick={() => setIsPlaying(true)}
            className={`mr-[20px] mt-[48px] ${flowActionPlay}`}>
            Play My Invite
            <PlayCircle size={20} aria-hidden="true" />
          </button>
          {/* A link rather than a button: home is a place, and a couple who is
              finished should be able to open it in a tab of its own. */}
          <Link href="/" className={`mt-[48px] ${flowActionHome}`}>
            Back to home
            <Home size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {isPlaying ? (
        <InvitationPlayer
          content={content}
          onClose={() => {
            setIsPlaying(false);
            playRef.current?.focus();
          }}
        />
      ) : null}
    </div>
  );
}

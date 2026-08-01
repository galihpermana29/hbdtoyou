'use client';

import { X } from 'lucide-react';
import { useRef, type RefObject } from 'react';

import WeddingTemplate1 from '@/components/wedding/wedding-template-1/WeddingTemplate1';
import { useDialogBehaviour } from '@/hooks/use-dialog-behaviour';

import type { WeddingTemplate1Content } from './wedding-invitation-types';

/**
 * The couple's own invitation, played the way a guest will receive it.
 *
 * Two steps of the Create Flow open this, and both open the same thing: the
 * Site Preview's Play Preview beside the form, and the published step's Play My
 * Invite at the end. The panel each of them sits in shows the invitation small
 * and open; this gives it the screen, sealed, with nothing of the flow around
 * it. It is the couple's own content either way, never the sample template.
 *
 * It behaves as a dialog rather than as a page that happens to be on top, and
 * `useDialogBehaviour` is the whole of how: the flow behind it does not scroll
 * while it is open, Escape closes it, the close control takes focus when it
 * opens, Play Preview takes focus back when it goes, and Tab stays inside it in
 * between - which is what `aria-modal` promises anything reading the page
 * aloud.
 *
 * Being a dialog is also what the invitation inside has to be told about. The
 * dialog is the scroller here rather than the page, so it is the dialog a
 * sealed invitation begins at the top of. What it may not scroll past is the
 * envelope, and that is the invitation's own doing rather than the dialog's: a
 * couple who could scroll past it would not be seeing what a guest sees, which
 * is the whole of what this is for.
 */
export default function InvitationPlayer({
  content,
  onClose,
  openerRef,
}: {
  content: WeddingTemplate1Content;
  onClose: () => void;
  /**
   * The control that opened this, which takes focus back when it closes. Both
   * of the two that open it can name their own, and naming it is better than
   * the dialog guessing: a browser that does not focus a button when it is
   * pressed, which is Safari, would leave it nothing to guess from.
   */
  openerRef?: RefObject<HTMLElement>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The close control is what takes focus, rather than the dialog itself: it is
  // the one thing a couple who opened this by accident is looking for, and it
  // is the top of the dialog either way.
  //
  // What is held still here is the flow behind, not the invitation's own
  // scroller - `useBeginAtTheTop` puts that back to the top, and this is a form
  // the couple is in the middle of filling in.
  useDialogBehaviour(dialogRef, onClose, {
    initialFocus: closeRef,
    opener: openerRef,
  });

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Your wedding invitation"
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/80 py-[40px]">
      <div className="relative mx-auto w-[375px] max-w-full">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close the invitation"
          className="absolute right-[8px] top-[8px] z-[10] flex h-[36px] w-[36px] items-center justify-center rounded-full bg-black/60 text-white">
          <X size={20} aria-hidden="true" />
        </button>
        {/* The dialog is what scrolls here, not the page, so it is the dialog
            the sealed invitation is given as its scroller. The page behind is
            held still separately above, for the different reason that a dialog
            is open over it. */}
        <WeddingTemplate1 content={content} sealed scrollsInside={dialogRef} />
      </div>
    </div>
  );
}

'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import WeddingTemplate1 from '@/components/wedding/wedding-template-1/WeddingTemplate1';

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
 * It behaves as a dialog rather than as a page that happens to be on top. The
 * page behind it does not scroll while it is open, Escape closes it, the close
 * control takes focus when it opens, and Tab stays inside it - which is what
 * `aria-modal` promises anything reading the page aloud.
 *
 * Being a dialog is also what the invitation inside has to be told about. The
 * dialog is the scroller here rather than the page, so it is the dialog the
 * sealed invitation holds still: a couple who could scroll past the envelope
 * would not be seeing what a guest sees, which is the whole of what this is
 * for.
 */
export default function InvitationPlayer({
  content,
  onClose,
}: {
  content: WeddingTemplate1Content;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Not the invitation's own `useScrollLock`, which also puts what it locks
  // back to the top: this holds still a form the couple is in the middle of
  // filling in, and would throw away where they had got to in it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      // Drawn, and reachable. A sealed invitation puts everything below the
      // envelope out of reach while leaving it in the DOM and laid out, so an
      // inert control counted here would put the end of the dialog on an
      // element focus can never land on - and Tab off the real last one would
      // walk out onto the page behind instead of wrapping.
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) =>
          element.offsetParent !== null && !element.closest('[inert]')
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Tab off either end of the dialog wraps to the other, so focus can never
      // wander onto the flow behind something that says the flow is inert.
      if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      } else if (
        event.shiftKey &&
        (active === first || !dialog.contains(active))
      ) {
        event.preventDefault();
        last.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

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
            the sealed invitation is given to hold still. The page behind is
            held still separately above, for the different reason that a dialog
            is open over it. */}
        <WeddingTemplate1 content={content} sealed holdsStill={dialogRef} />
      </div>
    </div>
  );
}

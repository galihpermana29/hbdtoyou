'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * The dialogs open right now, the innermost one last.
 *
 * A key belongs to the innermost dialog and to no other. Play Preview draws an
 * invitation that can open the RSVP, so one of these can be inside another, and
 * an Escape that reached both would close the card and throw the couple out of
 * the whole preview behind it in the same press. Reading the stack is what
 * settles that, rather than where a listener is bound or which one stops the
 * event: focus can be anywhere at all - on the page's body after the control
 * that had it was pressed and unmounted - and the innermost dialog is still the
 * one the key is for.
 */
const openDialogs: HTMLElement[] = [];

/** What a dialog can be told, beyond the two things it always is. */
interface DialogBehaviour {
  /**
   * What takes focus when the dialog opens. The dialog itself by default, which
   * is what one read on a phone wants: focusing a text field there raises the
   * keyboard over half of what has just been opened, so the first thing seen
   * should be the question rather than the answer box. A dialog left to take
   * focus itself has to be able to - `tabIndex={-1}` is enough.
   */
  initialFocus?: RefObject<HTMLElement>;

  /**
   * The control that opened the dialog, which takes focus back when it closes.
   *
   * Leave it out and whatever had focus at the moment the dialog opened is
   * used, which is the only answer available to a dialog opened from somewhere
   * it cannot see - the RSVP is opened by a control several components away.
   * Naming it is better where a caller can: a browser that does not focus a
   * button when it is pressed, which is Safari, leaves nothing to give back.
   */
  opener?: RefObject<HTMLElement>;
}

/**
 * Everything that makes an element on top of the page a dialog rather than a
 * card that happens to be over one.
 *
 * Two of them ask for it: the Create Flow's Play Preview
 * (`src/components/forms/wedding/invitation-player.tsx`) and the RSVP a guest
 * replies with (`src/components/wedding/wedding-template-1/RsvpCard.tsx`).
 * They had a copy of this each, and the second was written from the first, so
 * what one of them learned the other had to be told again. There is one now,
 * and what it does is the union of the two - which is how Play Preview came by
 * giving focus back, an answer the RSVP had already found.
 *
 * Four promises, all of them what `aria-modal` tells anything reading the page
 * aloud is true:
 *
 * - the page does not scroll while the dialog is open;
 * - Escape closes it, and closes only the innermost one;
 * - something inside it takes focus when it opens, and the control that opened
 *   it takes focus back when it goes;
 * - Tab wraps at both ends, so focus can never wander onto the page behind.
 *
 * What is held still is the page, which is the scroller behind a dialog opened
 * from one. A dialog opened from inside another - the RSVP inside Play Preview
 * - leaves the outer one's own scroller moving, and that is `hbd-1zi`.
 */
export function useDialogBehaviour(
  dialogRef: RefObject<HTMLElement>,
  onClose: () => void,
  { initialFocus, opener }: DialogBehaviour = {}
) {
  // Held rather than depended on, so that a caller writing the callback inline
  // does not resubscribe the dialog on every render of the page behind it -
  // which would also take it off the top of the stack and put it back on.
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  // Somebody who reached the dialog from the keyboard would otherwise be put at
  // the top of the page they opened it from, for having closed it. The body is
  // read as nothing having had focus rather than as something to give it back
  // to, because focusing the body is not somewhere to be.
  useEffect(() => {
    const hadFocus = document.activeElement;
    (initialFocus?.current ?? dialogRef.current)?.focus();
    return () => {
      const giveBackTo = opener?.current ?? hadFocus;
      if (giveBackTo instanceof HTMLElement && giveBackTo !== document.body) {
        giveBackTo.focus();
      }
    };
  }, [dialogRef, initialFocus, opener]);

  // The page behind the dialog, held still because a dialog is open over it.
  // Its own scroll position is left alone: a dialog opened from halfway down a
  // form should not throw away where the form had got to.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    openDialogs.push(dialog);

    const onKeyDown = (event: KeyboardEvent) => {
      // Somebody else's key, if anything is open over this.
      if (openDialogs[openDialogs.length - 1] !== dialog) return;

      if (event.key === 'Escape') {
        close.current();
        return;
      }
      if (event.key !== 'Tab') return;

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
        (element) => element.offsetParent !== null && !element.closest('[inert]')
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      // A dialog that takes focus itself is focusable, and focus can also have
      // been left on the page's body by a control that unmounted. Neither is
      // one of the dialog's controls, so neither counts as being at an end of
      // them: the next Tab goes to the first, and the previous to the last.
      const onAControl = active !== dialog && dialog.contains(active);

      // Tab off either end wraps to the other, so focus can never wander onto
      // the page behind something that says the page is inert.
      if (!event.shiftKey && (!onAControl || active === last)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (!onAControl || active === first)) {
        event.preventDefault();
        last.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      const at = openDialogs.indexOf(dialog);
      if (at !== -1) openDialogs.splice(at, 1);
    };
  }, [dialogRef]);
}

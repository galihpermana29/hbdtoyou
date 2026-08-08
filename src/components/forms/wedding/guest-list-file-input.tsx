'use client';

import { forwardRef, type ChangeEvent } from 'react';

import { GUEST_LIST_ACCEPT } from './guest-list';

/**
 * The field a Guest List arrives through, in both of the step's states.
 *
 * It is one component rather than one per state because the part that is easy
 * to get wrong is the same in both: a file field holds on to what was chosen
 * last, so choosing the same file again is not a change and fires nothing, and
 * a couple who fixed their spreadsheet and picked it again would watch the page
 * do nothing at all. Clearing it after every choice is the whole reason this
 * exists, and it is not a thing to remember twice.
 */

export interface GuestListFileInputProps {
  onChoose: (file: File) => void;
  /**
   * Whether a couple reaches this field itself, or presses something else that
   * opens it.
   *
   * The design draws a control in one state - Upload File, on the card - and
   * only a drop area in the other. So the field is the tab stop where there is
   * nothing else to be one, and stays out of the way where there is, rather
   * than being a second tab stop that does what the button beside it does.
   */
  isTheTabStop: boolean;
  /**
   * Whether a Guest List is already on its way to the backend.
   *
   * A second file taken while the first is still going would be inserted as
   * well as it, leaving the invitation carrying both lists and the screen
   * showing one.
   */
  isBusy?: boolean;
}

const GuestListFileInput = forwardRef<
  HTMLInputElement,
  GuestListFileInputProps
>(function GuestListFileInput({ onChoose, isTheTabStop, isBusy }, ref) {
  return (
    <input
      ref={ref}
      type="file"
      accept={GUEST_LIST_ACCEPT}
      disabled={isBusy}
      aria-busy={isBusy}
      aria-label={isTheTabStop ? 'Guest List' : undefined}
      aria-hidden={isTheTabStop ? undefined : true}
      tabIndex={isTheTabStop ? undefined : -1}
      className={isTheTabStop ? 'sr-only' : 'hidden'}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (file) onChoose(file);
      }}
    />
  );
});

export default GuestListFileInput;

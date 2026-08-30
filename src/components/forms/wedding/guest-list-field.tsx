'use client';

/**
 * The Guest List, in the two states the design draws it: an area saying what it
 * takes and how large a file may be, or the list itself.
 *
 * Which one is showing is decided by nothing but whether there is a Guest List.
 * The list is not this component's - the backend holds it, and
 * `use-guest-roster.ts` reads it back and sends every change to it - so what
 * this does with a chosen file is hand it over, and what it does with a
 * correction or a deletion is ask for one.
 *
 * Its own file because two screens draw it: the Create Flow's guest invites
 * step, where the design puts it, and the Guest List's own screen under
 * `/dashboard/wedding/{uuid}/guests`, which is where a couple who has finished
 * the flow goes to change who is invited. A second copy would be a second set of
 * rules about what a file may contain and a second set of words for a refusal,
 * and the one a couple happened to be looking at would decide which they got.
 */

import { Upload } from 'lucide-react';
import { useId, useRef } from 'react';

import {
  flowDropZone,
  flowDropZonePrompt,
  flowDropZoneTitle,
  flowHint,
  flowInlineAction,
  flowLabel,
  flowProblem,
} from './create-flow-treatment';
import { useFlowCopy } from './flow-language';
import GuestListFileInput from './guest-list-file-input';
import GuestListTable from './guest-list-table';
import {
  GUEST_LIST_SIZE_LIMIT,
  GUEST_LIST_TEMPLATE_ACTION,
  GUEST_LIST_TEMPLATE_HREF,
  GUEST_LIST_TEMPLATE_NAME,
  type Guest,
  type GuestList,
} from './guest-list';

export interface GuestListFieldProps {
  /** The Guest List the backend holds, or null while there is none. */
  guestList: GuestList | null;
  /** Let the guests this file names replace the whole list. */
  onUpload: (file: File) => void;
  /**
   * Correct one guest, leaving the rest of the list alone, and say whether the
   * backend took it - which is what closes the row being edited.
   */
  onCorrect: (guest: Guest) => Promise<boolean>;
  onDelete: (id: string) => void;
  /** One guest's invitation message, filled in - see `GuestListTable`. */
  inviteFor?: (guest: Guest) => string | null;
  /** Where to open one guest's invitation - see `GuestListTable`. */
  openInvitationAt?: (guest: Guest) => string | null;
  /**
   * What went wrong with the last thing done to the list, or nothing.
   *
   * One line for both kinds, because a couple reads them in the same place and
   * for the same reason: a file that could not be read and a change the backend
   * refused are both a press of theirs that did not do what it looked like.
   */
  problem: string | null;
  /** Whether one of those is in flight, so none of them can be pressed twice. */
  isBusy: boolean;
}

export default function GuestListField({
  guestList,
  onUpload,
  onCorrect,
  onDelete,
  inviteFor,
  openInvitationAt,
  problem,
  isBusy,
}: GuestListFieldProps) {
  const guestListLabelId = useId();
  const dropZoneFileRef = useRef<HTMLInputElement>(null);
  const copy = useFlowCopy();

  return (
    <div className="mt-[24px] flex flex-col gap-[6px]">
      {guestList ? (
        <GuestListTable
          guestList={guestList}
          onUpload={onUpload}
          onCorrect={onCorrect}
          onDelete={onDelete}
          inviteFor={inviteFor}
          openInvitationAt={openInvitationAt}
          isBusy={isBusy}
        />
      ) : (
        <>
          <p id={guestListLabelId} className={flowLabel}>
            {copy.guestList}
          </p>
          {/* Nothing is taken while a list is on its way to the backend. The
              card the table draws does not exist yet, so there is nothing on
              the screen saying a file is already being sent, and a second one
              dropped into the gap would be inserted as well as the first -
              leaving the invitation carrying both lists and the screen showing
              one. */}
          <div
            role="group"
            aria-labelledby={guestListLabelId}
            aria-busy={isBusy}
            onClick={() => {
              if (!isBusy) dropZoneFileRef.current?.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (isBusy) return;
              const file = event.dataTransfer.files?.[0];
              if (file) onUpload(file);
            }}
            className={flowDropZone}>
            <Upload size={32} aria-hidden="true" className="text-[#141414]" />
            <div className="flex flex-col items-center gap-[4px] text-center">
              <p className={flowDropZoneTitle}>
                Drag &amp; drop up your list here
              </p>
              <p className={flowDropZonePrompt}>{copy.uploadCsvFormat}</p>
            </div>
            {/* The design draws no control here, only an area, so the field
                itself is what a couple arriving by keyboard reaches. */}
            <GuestListFileInput
              ref={dropZoneFileRef}
              onChoose={onUpload}
              isTheTabStop
              isBusy={isBusy}
            />
          </div>
        </>
      )}

      {/* The design draws the size limit and nothing beside it. The template
          goes on the end of that line, and on a line of its own once a list is
          uploaded, because a couple has nothing to go on but the word CSV: the
          list carries six things about a guest, and guessing which and in what
          order is not something to ask of anybody. Below the card rather than
          inside it - the design's card header holds three things at a stated
          spacing, and a fourth crushes all three onto two lines each. Agreed and
          recorded in `docs/adr/0002-figma-is-literal-truth.md`. */}
      <div className="flex items-center gap-[16px]">
        {guestList ? null : <p className={flowHint}>{GUEST_LIST_SIZE_LIMIT}</p>}
        <a
          href={GUEST_LIST_TEMPLATE_HREF}
          download={GUEST_LIST_TEMPLATE_NAME}
          className={`ml-auto ${flowInlineAction}`}>
          {GUEST_LIST_TEMPLATE_ACTION}
        </a>
      </div>

      {problem ? (
        <p role="alert" className={flowProblem}>
          {problem}
        </p>
      ) : null}
    </div>
  );
}

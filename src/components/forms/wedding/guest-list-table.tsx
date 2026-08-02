'use client';

import { Upload } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { flowFieldBox } from './create-flow-treatment';
import GuestListFileInput from './guest-list-file-input';
import {
  guestCell,
  GUEST_COLUMNS,
  plusOnesFrom,
  uploadedOn,
  type Guest,
  type GuestColumn,
  type GuestList,
} from './guest-list';

/**
 * The Guest List a couple has uploaded, as the design draws it: a card naming
 * the list and when it arrived, an action that replaces it, and one row per
 * guest with an action to correct or remove that guest alone.
 *
 * Nothing here reaches a network. The list lives in the step's state, and every
 * action below changes that state and nothing else - see `guest-list.ts`.
 *
 * ## Six columns where the design draws one
 *
 * The design's table has a Guest column and an Action column, and the backend
 * accepts six things about a guest. Every one of them is drawn, because whatever
 * the table does not show a couple cannot check and cannot correct, and their
 * only other recourse is to fix the spreadsheet and upload the whole list again.
 * The deviation is agreed and recorded in
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * Six columns and a couple's own notes do not fit the width the design draws the
 * card at, so the columns scroll sideways inside the card rather than widening
 * it. A table that pushed the page sideways would move every other thing on the
 * screen to make room for a phone number.
 *
 * ## The one thing the design does not draw
 *
 * The design gives an Edit action but no picture of what it opens. A row is
 * therefore edited where it sits: every column the table shows becomes a field,
 * and the row's two actions become Cancel and Save for as long as it is open.
 * Editing in place is the smallest thing that can be true to an action labelled
 * "Edit" without inventing a screen nobody designed.
 */

/** The design's card title, and the line beside it saying when the list arrived. */
const TYPE_CARD_TITLE = 'text-[18px] font-[500] leading-[28px] text-[#171717]';
const TYPE_UPLOAD_DATE = 'text-[12px] font-[500] leading-[18px] text-[#525252]';

/** The design's column heading. */
const TYPE_COLUMN_HEADING =
  'text-left text-[12px] font-[500] leading-[18px] text-[#525252]';

/** The design's guest name, worn by every column that holds their answers. */
const TYPE_GUEST = 'text-[14px] font-[500] leading-[20px] text-[#171717]';

/** The design's row action, in the two colours it gives them. */
const ACTION = 'text-[14px] font-[600] leading-[20px]';
const ACTION_QUIET = `${ACTION} text-[#525252]`;
const ACTION_LOUD = `${ACTION} text-[#F82900]`;

/** The hairline under the column headings and under every row. */
const RULE = 'border-b border-[#E5E5E5]';

/** What the design pads a heading cell and a row cell by. */
const HEADING_CELL = `${RULE} whitespace-nowrap px-[24px] py-[12px]`;
const ROW_CELL = `${RULE} whitespace-nowrap px-[24px] py-[16px]`;

/**
 * Where any width the columns do not need is put, so that Action still sits at
 * the far edge when the list is short enough to leave some.
 */
const SPARE_WIDTH = GUEST_COLUMNS[GUEST_COLUMNS.length - 1];
const spareWidth = (column: GuestColumn) =>
  column === SPARE_WIDTH ? 'w-full' : '';

export interface GuestListTableProps {
  guestList: GuestList;
  /** Replace the whole list with the one this file names. */
  onUpload: (file: File) => void;
  /** Correct one guest, leaving the rest of the list alone. */
  onCorrect: (guest: Guest) => void;
  onDelete: (id: string) => void;
}

export default function GuestListTable({
  guestList: { guests, uploadedAt },
  onUpload,
  onCorrect,
  onDelete,
}: GuestListTableProps) {
  const titleId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  // Which row is open, and what has been typed into it so far. Held apart from
  // the list so that abandoning an edit costs nothing: the guest is only
  // rewritten when the couple says so.
  const [draft, setDraft] = useState<Guest | null>(null);

  // A row with no name in it is a row nobody can tell from the one below, so
  // there is nothing to save. Saying so by turning Save off, rather than by
  // taking the action and quietly doing nothing with it: an action that closes
  // the row and leaves the old guest behind looks exactly like one that worked.
  const nothingToSave = draft !== null && draft.name.trim() === '';

  function saveEditing() {
    if (!draft || nothingToSave) return;
    onCorrect({ ...draft, name: draft.name.trim() });
    setDraft(null);
  }

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0)]">
      <div className="flex items-center gap-[16px] pb-[19px] pl-[24px] pr-[24px] pt-[20px]">
        {/* Grows so that the date and the action sit at the far edge, as the
            design places them, without either being given a width. */}
        <h4 id={titleId} className={`flex-1 ${TYPE_CARD_TITLE}`}>
          Guest List
        </h4>
        <p className={TYPE_UPLOAD_DATE}>
          Date uploaded {uploadedOn(uploadedAt)}
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#F82900] bg-[#F82900] px-[16px] py-[10px] text-[14px] font-[600] leading-[20px] text-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
          <Upload size={20} aria-hidden="true" />
          Upload File
        </button>
        <GuestListFileInput
          ref={fileRef}
          onChoose={onUpload}
          isTheTabStop={false}
        />
      </div>

      {/* The columns scroll here rather than in the page. It is a tab stop
          because a region that only a pointer can scroll is a region somebody
          navigating by keyboard cannot read the far side of, and nothing inside
          it would carry them there: the columns hold answers rather than
          controls until a row is being edited. Named, because an unnamed thing
          that takes focus is one nobody hearing the page read out can place. */}
      <div
        role="region"
        aria-label="Guest List columns"
        tabIndex={0}
        className="overflow-x-auto overflow-y-hidden">
        {/* Separated rather than collapsed, because the design gives every cell
            its own hairline underneath and nothing else, and a collapsed border
            belongs to two cells at once. */}
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {GUEST_COLUMNS.map((column) => (
                <th
                  key={column.field}
                  scope="col"
                  className={`${spareWidth(
                    column
                  )} ${HEADING_CELL} ${TYPE_COLUMN_HEADING}`}>
                  {column.heading}
                </th>
              ))}
              <th
                scope="col"
                className={`${HEADING_CELL} ${TYPE_COLUMN_HEADING}`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => {
              const editing = draft?.id === guest.id ? draft : null;
              return (
                <tr
                  key={guest.id}
                  className={index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                  {GUEST_COLUMNS.map((column) => (
                    <td
                      key={column.field}
                      className={`${spareWidth(
                        column
                      )} ${ROW_CELL} ${TYPE_GUEST}`}>
                      {editing ? (
                        <GuestAnswerField
                          column={column}
                          guest={editing}
                          isFirst={column === GUEST_COLUMNS[0]}
                          onChange={setDraft}
                          onSave={saveEditing}
                          onCancel={() => setDraft(null)}
                        />
                      ) : (
                        guestCell(guest, column)
                      )}
                    </td>
                  ))}
                  <td className={ROW_CELL}>
                    <div className="flex items-center justify-end gap-[12px]">
                      {editing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setDraft(null)}
                            className={ACTION_QUIET}>
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={saveEditing}
                            disabled={nothingToSave}
                            className={`${ACTION_LOUD} disabled:opacity-40`}>
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-label={`Delete ${guest.name}`}
                            onClick={() => onDelete(guest.id)}
                            className={ACTION_QUIET}>
                            Delete
                          </button>
                          <button
                            type="button"
                            aria-label={`Edit ${guest.name}`}
                            onClick={() => setDraft(guest)}
                            className={ACTION_LOUD}>
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface GuestAnswerFieldProps {
  column: GuestColumn;
  guest: Guest;
  /** Whether this is the field a couple lands in when the row opens. */
  isFirst: boolean;
  onChange: (guest: Guest) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * One of the guest's answers, in place of the answer being shown.
 *
 * Named by its column, so a couple hearing the row read out is told which
 * answer they are in. Every field is bound to Enter and Escape as well as to the
 * row's two actions, so correcting a typo never needs the pointer, and the first
 * one takes focus as the row opens because a couple who pressed Edit is about to
 * type.
 *
 * A column holding a count rather than words is asked for as one: a number
 * field, floored at nobody. What is typed is read by the same function that
 * reads an uploaded cell, so a couple correcting a guest by hand cannot reach a
 * value uploading the same thing could not - and anything that is not a whole
 * number of people, an emptied field included, is the couple not having said.
 */
function GuestAnswerField({
  column,
  guest,
  isFirst,
  onChange,
  onSave,
  onCancel,
}: GuestAnswerFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const isCount = column.holds === 'a count';

  useEffect(() => {
    if (isFirst) ref.current?.select();
  }, [isFirst]);

  return (
    <input
      ref={ref}
      type={isCount ? 'number' : 'text'}
      min={isCount ? 0 : undefined}
      value={guestCell(guest, column)}
      aria-label={column.heading}
      onChange={(event) => {
        const typed = event.target.value;
        onChange({
          ...guest,
          [column.field]: isCount ? plusOnesFrom(typed) : typed,
        });
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onSave();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          onCancel();
        }
      }}
      className={`w-full px-[10px] py-[4px] outline-none ${flowFieldBox}`}
    />
  );
}

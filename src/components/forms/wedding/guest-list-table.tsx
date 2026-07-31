'use client';

import { Upload } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { flowFieldBox } from './create-flow-treatment';
import GuestListFileInput from './guest-list-file-input';
import { uploadedOn, type Guest, type GuestList } from './guest-list';

/**
 * The Guest List a couple has uploaded, as the design draws it: a card naming
 * the list and when it arrived, an action that replaces it, and one row per
 * guest with an action to correct or remove that guest alone.
 *
 * Nothing here reaches a network. The list lives in the step's state, and every
 * action below changes that state and nothing else - see `guest-list.ts`.
 *
 * ## The one thing the design does not draw
 *
 * The design gives an Edit action but no picture of what it opens. A row is
 * therefore edited where it sits: the name becomes a field, and the row's two
 * actions become Cancel and Save for as long as it is open. Editing in place is
 * the smallest thing that can be true to an action labelled "Edit" without
 * inventing a screen nobody designed.
 */

/** The design's card title, and the line beside it saying when the list arrived. */
const TYPE_CARD_TITLE = 'text-[18px] font-[500] leading-[28px] text-[#171717]';
const TYPE_UPLOAD_DATE = 'text-[12px] font-[500] leading-[18px] text-[#525252]';

/** The design's column heading. */
const TYPE_COLUMN_HEADING =
  'text-left text-[12px] font-[500] leading-[18px] text-[#525252]';

/** The design's guest name. */
const TYPE_GUEST = 'text-[14px] font-[500] leading-[20px] text-[#171717]';

/** The design's row action, in the two colours it gives them. */
const ACTION = 'text-[14px] font-[600] leading-[20px]';
const ACTION_QUIET = `${ACTION} text-[#525252]`;
const ACTION_LOUD = `${ACTION} text-[#F82900]`;

/** The hairline under the column headings and under every row. */
const RULE = 'border-b border-[#E5E5E5]';

/** What the design pads a heading cell and a row cell by. */
const HEADING_CELL = `${RULE} px-[24px] py-[12px]`;
const ROW_CELL = `${RULE} px-[24px] py-[16px]`;

export interface GuestListTableProps {
  guestList: GuestList;
  /** Replace the whole list with the one this file names. */
  onUpload: (file: File) => void;
  /** Correct one guest's name, leaving the rest of the list alone. */
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function GuestListTable({
  guestList: { guests, uploadedAt },
  onUpload,
  onRename,
  onDelete,
}: GuestListTableProps) {
  const titleId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  // Which row is open, and what has been typed into it so far. Held apart from
  // the list so that abandoning an edit costs nothing: the guest is only
  // rewritten when the couple says so.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  function beginEditing(guest: Guest) {
    setEditingId(guest.id);
    setDraftName(guest.name);
  }

  // A row with no name in it is a row nobody can tell from the one below, so
  // there is nothing to save. Saying so by turning Save off, rather than by
  // taking the action and quietly doing nothing with it: an action that closes
  // the row and leaves the old name behind looks exactly like one that worked.
  const nothingToSave = draftName.trim() === '';

  function saveEditing() {
    if (nothingToSave) return;
    onRename(editingId, draftName.trim());
    setEditingId(null);
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

      {/* Separated rather than collapsed, because the design gives every cell
          its own hairline underneath and nothing else, and a collapsed border
          belongs to two cells at once. */}
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th
              scope="col"
              className={`w-full ${HEADING_CELL} ${TYPE_COLUMN_HEADING}`}>
              Guest
            </th>
            <th
              scope="col"
              className={`whitespace-nowrap ${HEADING_CELL} ${TYPE_COLUMN_HEADING}`}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => {
            const isEditing = guest.id === editingId;
            return (
              <tr
                key={guest.id}
                className={index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}>
                <td className={`w-full ${ROW_CELL} ${TYPE_GUEST}`}>
                  {isEditing ? (
                    <GuestNameField
                      value={draftName}
                      onChange={setDraftName}
                      onSave={saveEditing}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    guest.name
                  )}
                </td>
                <td className={`whitespace-nowrap ${ROW_CELL}`}>
                  <div className="flex items-center justify-end gap-[12px]">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
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
                          onClick={() => beginEditing(guest)}
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
  );
}

interface GuestNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * The name of the guest being corrected, in place of the name being shown.
 *
 * Focused as it opens, because a couple who pressed Edit is about to type, and
 * bound to Enter and Escape as well as to the row's two actions, so that
 * correcting a typo never needs the pointer.
 */
function GuestNameField({
  value,
  onChange,
  onSave,
  onCancel,
}: GuestNameFieldProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      aria-label="Guest name"
      onChange={(event) => onChange(event.target.value)}
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

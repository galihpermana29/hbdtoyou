'use client';

import { Button, Dropdown } from 'antd';
import {
  Ellipsis,
  ExternalLink,
  Copy as CopyIcon,
  Pencil,
  Trash2,
  Upload,
} from 'lucide-react';
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
 * Nothing here reaches a network itself. Every action below asks for a change
 * and waits to be given a new list, because the list belongs to the backend -
 * see `use-guest-roster.ts`, which is what sends them.
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
 * ## The Action column does not scroll away
 *
 * At the width the design draws the card, the six columns are wider than it is,
 * so Delete and Edit - the only two controls the design's own Action column
 * carries - sat past the visible edge until somebody thought to scroll. Nothing
 * on the screen said there was anything to the right of Notes, so the two
 * actions the design puts on every row were, in practice, on none of them.
 *
 * The column is therefore pinned to the right-hand edge of the scrolling region
 * and carries a seam down its left, which is a shadow rather than a border
 * because the design gives these cells one hairline and it is underneath them.
 * It keeps its row's own background, so the columns pass behind it rather than
 * through it. Nothing about that is a dimension and nothing about it moves a
 * cell, so the design's arrangement is untouched: the Action column is still
 * last, still after Notes, and still the far edge of the row.
 *
 * ## The one thing the design does not draw
 *
 * The design gives an Edit action but no picture of what it opens. A row is
 * therefore edited where it sits: every column the table shows becomes a field,
 * and the row's two actions become Cancel and Save for as long as it is open.
 * Editing in place is the smallest thing that can be true to an action labelled
 * "Edit" without inventing a screen nobody designed.
 */

/** The design's card title. */
const TYPE_CARD_TITLE = 'text-[18px] font-[500] leading-[28px] text-[#171717]';

/**
 * The small grey line the design writes beside that title and above the rows.
 *
 * One treatment rather than three, because the design sets the upload date, the
 * column headings and anything else of that rank in the same size, weight,
 * leading and colour - so writing them out separately would invite them to
 * drift apart for a difference the design does not state.
 */
const TYPE_SMALL_GREY = 'text-[12px] font-[500] leading-[18px] text-[#525252]';

/** The design's column heading, which is that line ranged left. */
const TYPE_COLUMN_HEADING = `text-left ${TYPE_SMALL_GREY}`;

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

/**
 * What holds the Action column at the right-hand edge of the scrolling region.
 *
 * The seam is a shadow rather than a border because the design gives these cells
 * exactly one hairline and it runs underneath them; a second one down the side
 * would be a rule the design does not draw. It fades to nothing, so a card with
 * nothing to scroll shows no seam at all.
 */
const PINNED =
  'sticky right-0 z-[1] [box-shadow:-8px_0_8px_-8px_rgba(0,0,0,0.12)]';

/** The card's own ground, and the stripe the design gives every other row. */
const CARD_GROUND = 'bg-white';
const rowGround = (index: number) =>
  index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white';

export interface GuestListTableProps {
  guestList: GuestList;
  /** Replace the whole list with the one this file names. */
  onUpload: (file: File) => void;
  /**
   * Correct one guest, leaving the rest of the list alone, and say whether it
   * landed.
   *
   * The answer is what closes the row. A correction the backend refused leaves
   * it open with what the couple typed still in it, so that trying again is one
   * press rather than typing the whole row out a second time.
   */
  onCorrect: (guest: Guest) => Promise<boolean>;
  onDelete: (id: string) => void;
  /**
   * One guest's invitation message, filled in and ready to send.
   *
   * Passed in rather than composed here, because the words are the couple's
   * and live on the step above with the nicknames and the address they are
   * written from - this table draws a Guest List and does not know what a
   * wedding says. Null for a guest with no personal link yet, which is what
   * leaves the control dim.
   */
  inviteFor?: (guest: Guest) => string | null;
  /**
   * Where to open one guest's invitation, or null while there is nowhere.
   *
   * Composed by the screen for the same reason the message is: this table
   * knows a Guest List and not an address. Off production that is the local
   * path the middleware rewrites a subdomain to, so the couple can look at an
   * invitation that has no DNS behind it yet - see
   * `invitationPreviewLinkFor`.
   */
  openInvitationAt?: (guest: Guest) => string | null;
  /**
   * Whether a change to the list is still on its way to the backend.
   *
   * Every action here waits for the backend to agree before the list changes, so
   * a couple who cannot tell a slow press from a dead one presses again - and a
   * Delete pressed twice is one guest deleted and one refusal about a guest who
   * is already gone.
   */
  isBusy: boolean;
}

/**
 * Everything a couple can do to one guest, behind one control.
 *
 * One press opens the list and everything is in it: the invitation to look at,
 * the message to send, the row to correct, and the deletion, which is last and
 * apart because it is the one that cannot be undone.
 *
 * The list is all of it rather than one named action beside the rest, because
 * a button reading Actions offers no clue which of the four it does, and the
 * one it did - Edit - was already in the list underneath it. Two ways to reach
 * the same thing, one of them unlabelled, is worse than one way that says what
 * it is.
 *
 * An action with nothing behind it is not offered rather than offered dead: a
 * guest whose personal link the backend has not minted has no message to copy
 * and no invitation to open, and a menu item that does nothing when pressed
 * teaches a couple to distrust the others.
 */
function GuestRowActions({
  guest,
  invite,
  openAt,
  onEdit,
  onDelete,
  isBusy,
}: {
  guest: Guest;
  invite: string | null;
  openAt: string | null;
  onEdit: () => void;
  onDelete: () => void;
  isBusy: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const clearing = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(clearing);
  }, [copied]);

  async function copyInvite() {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite);
      setCopied(true);
    } catch {
      // A browser that refuses the clipboard leaves the couple where they
      // were. Nothing is said: the thing to say is "press it again".
    }
  }

  const items = [
    openAt
      ? {
          key: 'open',
          icon: <ExternalLink size={14} aria-hidden="true" />,
          label: 'Open invitation',
        }
      : null,
    invite
      ? {
          key: 'copy',
          icon: <CopyIcon size={14} aria-hidden="true" />,
          label: copied ? 'Copied' : 'Copy invitation message',
        }
      : null,
    {
      key: 'edit',
      icon: <Pencil size={14} aria-hidden="true" />,
      label: 'Edit guest',
    },
    { type: 'divider' as const, key: 'before-delete' },
    {
      key: 'delete',
      icon: <Trash2 size={14} aria-hidden="true" />,
      label: 'Delete guest',
      danger: true,
    },
  ].filter(Boolean);

  function onMenuClick({ key }: { key: string }) {
    if (key === 'open' && openAt) {
      // A new tab rather than this one: the couple is working through a list
      // and should come back to the row they left, not to the top of it.
      window.open(openAt, '_blank', 'noopener,noreferrer');
      return;
    }
    if (key === 'copy') copyInvite();
    if (key === 'edit') onEdit();
    if (key === 'delete') onDelete();
  }

  return (
    <Dropdown
      menu={{ items, onClick: onMenuClick }}
      placement="bottomRight"
      disabled={isBusy}
      trigger={['click']}>
      {/* Antd's default size rather than its small one: an icon is the whole
          of what this control says, so it has to be big enough to read at a
          glance and to hit without aiming. It is also the only control in its
          cell now, so nothing beside it has to match its height. */}
      <Button
        aria-label={`Actions for ${guest.name}`}
        icon={<Ellipsis size={18} aria-hidden="true" />}
      />
    </Dropdown>
  );
}

export default function GuestListTable({
  guestList: { guests, uploadedAt },
  onUpload,
  onCorrect,
  onDelete,
  inviteFor,
  openInvitationAt,
  isBusy,
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

  async function saveEditing() {
    if (!draft || nothingToSave) return;
    if (await onCorrect({ ...draft, name: draft.name.trim() })) setDraft(null);
  }

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0)]">
      {/* Wraps rather than crushes. The design draws three things on one line
          at a card 560px wide; below about 500px the title, the date and the
          action cannot share a line without each of them going to two, so they
          take a line each instead. The padding and the 16px between them are
          the design's either way. */}
      <div className="flex flex-wrap items-center gap-[16px] pb-[19px] pl-[24px] pr-[24px] pt-[20px]">
        {/* Grows so that the date and the action sit at the far edge, as the
            design places them, without either being given a width. */}
        <h4 id={titleId} className={`flex-1 ${TYPE_CARD_TITLE}`}>
          Guest List
        </h4>
        <p className={TYPE_SMALL_GREY}>
          Date uploaded {uploadedOn(uploadedAt)}
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isBusy}
          aria-busy={isBusy}
          className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#F82900] bg-[#F82900] px-[16px] py-[10px] text-[14px] font-[600] leading-[20px] text-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] disabled:opacity-40">
          <Upload size={20} aria-hidden="true" />
          Upload File
        </button>
        <GuestListFileInput
          ref={fileRef}
          onChoose={onUpload}
          isTheTabStop={false}
          isBusy={isBusy}
        />
      </div>

      {/* Said, rather than left to be discovered. The columns have always
          scrolled sideways inside the card, and on a pointer a scrollbar under
          the rows says so; on a phone there is no scrollbar at all and the card
          is narrow enough that four of the six columns are past the edge, so
          nothing said it and in practice nobody scrolled.

          Gone at 1440 and wider, which is where the design exists and is taken
          literally, and it draws no such line. Everywhere below that there is
          no design and usability governs, which is the clause
          `docs/adr/0002-figma-is-literal-truth.md` closes with - so this is
          keyed to the design's own width rather than to a breakpoint, which
          would leave a laptop with neither the line nor a design to justify its
          absence.

          A `p` and not a `div` on purpose: the card's two `div` children are
          claimed by position in
          `visual/expectations/guest-invites-populated.mjs`, and a third would
          silently move one of those claims. */}
      <p
        className={`px-[24px] pb-[12px] min-[1440px]:hidden ${TYPE_SMALL_GREY}`}>
        Scroll the table sideways to see every column.
      </p>

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
                className={`${PINNED} ${CARD_GROUND} ${HEADING_CELL} ${TYPE_COLUMN_HEADING}`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => {
              const editing = draft?.id === guest.id ? draft : null;
              return (
                <tr key={guest.id} className={rowGround(index)}>
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
                  <td className={`${PINNED} ${rowGround(index)} ${ROW_CELL}`}>
                    <div className="flex items-center justify-end gap-[12px]">
                      {editing ? (
                        <>
                          {/* Cancel is never dimmed. It abandons a draft that
                              was never sent anywhere, so there is nothing in
                              flight for it to collide with, and a couple whose
                              save is being refused should always be able to
                              close the row. */}
                          <button
                            type="button"
                            onClick={() => setDraft(null)}
                            className={ACTION_QUIET}>
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={saveEditing}
                            disabled={nothingToSave || isBusy}
                            aria-busy={isBusy}
                            className={`${ACTION_LOUD} disabled:opacity-40`}>
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          {/* One control per row rather than one per verb.
                              The design draws Delete and Edit side by side and
                              knew nothing of the other two things a couple
                              wants here - the message to send, and the
                              invitation to look at - so a row that grew a
                              button each time would end up wider than the
                              guest on it. Agreed and recorded in
                              `docs/adr/0002-figma-is-literal-truth.md`. */}
                          <GuestRowActions
                            guest={guest}
                            invite={inviteFor?.(guest) ?? null}
                            openAt={openInvitationAt?.(guest) ?? null}
                            onEdit={() => setDraft(guest)}
                            onDelete={() => onDelete(guest.id)}
                            isBusy={isBusy}
                          />
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

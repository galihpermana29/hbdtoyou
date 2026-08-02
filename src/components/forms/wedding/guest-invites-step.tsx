'use client';

import { Upload } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import {
  flowActionAside,
  flowActionBack,
  flowActionForward,
  flowActionRow,
  flowDropZone,
  flowDropZonePrompt,
  flowDropZoneTitle,
  flowFieldBox,
  flowHint,
  flowInlineAction,
  flowLabel,
  flowProblem,
  flowSectionName,
} from './create-flow-treatment';
import GuestInvitesPreview from './guest-invites-preview';
import {
  guestLinkFor,
  SAMPLE_GUEST_NAME,
  SLUG_PREFIX,
  type GuestInvitesValues,
} from './guest-invites-types';
import GuestListFileInput from './guest-list-file-input';
import GuestListTable from './guest-list-table';
import {
  GUEST_LIST_SIZE_LIMIT,
  GUEST_LIST_TEMPLATE_ACTION,
  GUEST_LIST_TEMPLATE_HREF,
  GUEST_LIST_TEMPLATE_NAME,
  readGuestList,
  type Guest,
} from './guest-list';

/**
 * The third step of the Create Flow: a couple reads their invitation's address,
 * writes what their guests will receive, and uploads a Guest List.
 *
 * Two things here reach a network, and both are presses: Save as draft, the one
 * control the design does not draw, hands what the couple has entered to the
 * flow above, which keeps it; Confirm Create asks the flow to publish, which the
 * backend may refuse. Everything else on the step is composed from what the flow
 * already holds.
 *
 * The address is not one of the things a couple fills in. The design draws the
 * web domain as theirs to choose and shows the chosen name being confirmed as
 * available; there is no endpoint that can answer whether a name is free, so a
 * couple choosing one could only be told it was taken after failing. The backend
 * generates the slug instead, and the field shows it rather than taking it.
 *
 * The Guest List has the two states the design draws, and which one is showing
 * is decided by nothing but whether there is a Guest List: an area saying what
 * it takes and how large a file may be, or the list itself. The CSV is read in
 * the browser and the guests it names are held in this step's values, so
 * uploading one sends nothing anywhere.
 */

export interface GuestInvitesStepProps {
  /**
   * Whether this is the step the couple is on.
   *
   * The step stays mounted while they are elsewhere so that what they entered
   * survives, and a hidden element has no height to measure, so anything that
   * measures itself has to wait to be shown.
   */
  isCurrent: boolean;
  values: GuestInvitesValues;
  onChange: (values: GuestInvitesValues) => void;
  /** The nicknames the couple entered on the previous step. */
  brideNickname: string;
  groomNickname: string;
  /** Go back to the details and story step. */
  onPreviousStep: () => void;
  /**
   * Publish the invitation, and go on to the published step if it went out.
   *
   * Whether it did is not this step's to decide: the backend is asked first,
   * and a couple whose invitation is not ready stays here with `outstanding`
   * naming what is left. So this step draws the press and prints the answer,
   * and the flow above it decides where the couple ends up.
   */
  onConfirm: () => void;
  /**
   * Keep what the couple has entered, without going anywhere.
   *
   * The design draws no such control, and a couple who wants to stop for the
   * evening has nowhere else to say so: every other save in this flow is
   * something that happens on the way past. Agreed and recorded in
   * `docs/adr/0002-figma-is-literal-truth.md`.
   */
  onSaveAsDraft: () => void;
  /**
   * Whether something the couple pressed is still in flight, so that nothing is
   * pressed twice into one save and nothing is published while a save is on its
   * way to the same invitation.
   */
  isBusy: boolean;
  /** What a couple is told about the last press, or nothing to tell them. */
  problem: string | null;
  /**
   * What the backend says is still missing before this invitation can go out,
   * in its own words, or nothing.
   */
  outstanding: string[] | null;
}

/**
 * Keep a textarea exactly as tall as what it holds.
 *
 * The design draws the greeting message at its content's height rather than at
 * a fixed one, and a scrollbar inside a message someone is composing is a worse
 * answer than a taller box.
 */
function useHeightOfContent(value: string, whenShown: boolean) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !whenShown) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, [value, whenShown]);

  return ref;
}

export default function GuestInvitesStep({
  isCurrent,
  values,
  onChange,
  brideNickname,
  groomNickname,
  onPreviousStep,
  onConfirm,
  onSaveAsDraft,
  isBusy,
  problem,
  outstanding,
}: GuestInvitesStepProps) {
  const slugId = useId();
  const slugLabelId = useId();
  const messageId = useId();
  const guestListLabelId = useId();
  const dropZoneFileRef = useRef<HTMLInputElement>(null);

  const messageRef = useHeightOfContent(values.greetingMessage, isCurrent);

  // What was wrong with the last file a couple chose, so that a file which
  // cannot be read says so instead of appearing to do nothing.
  const [guestListProblem, setGuestListProblem] = useState<string | null>(null);

  const { guestList } = values;

  /**
   * Read a chosen file, and let it replace the whole Guest List.
   *
   * Replace rather than merge: the design's only way to change the list wholesale
   * is to upload again, and a couple doing that after fixing their spreadsheet
   * means the new file, not the new file added to the old one.
   */
  async function uploadGuestList(file: File) {
    const { guests, problem: fileProblem } = await readGuestList(file);
    setGuestListProblem(fileProblem);
    if (guests) {
      onChange({ ...values, guestList: { guests, uploadedAt: new Date() } });
    }
  }

  /** Change who is on the Guest List, keeping the date the file arrived. */
  function changeGuests(change: (guests: Guest[]) => Guest[]) {
    if (!guestList) return;
    const guests = change(guestList.guests);
    onChange({
      ...values,
      // Nobody left is the empty state again rather than a Guest List with
      // nobody on it: an upload date belongs to a file that still names someone.
      guestList: guests.length > 0 ? { ...guestList, guests } : null,
    });
  }

  /** Put one guest's corrected answers back, in the place they were in. */
  function correctGuest(corrected: Guest) {
    changeGuests((guests) =>
      guests.map((guest) => (guest.id === corrected.id ? corrected : guest))
    );
  }

  function deleteGuest(id: string) {
    changeGuests((guests) => guests.filter((guest) => guest.id !== id));
  }

  return (
    <div className="flex gap-[60px]">
      <div className="flex min-w-0 flex-1 flex-col gap-[48px]">
        <div>
          <h2 className="text-[36px] font-[600] leading-[50px] text-[#1B1B1B]">
            One more step &amp; your invitation is ready to share
          </h2>
          <p className="mt-[24px] text-[20px] font-[400] leading-[30px] text-[#7B7B7B]">
            We&apos;ve created your wedding invitation website and it&apos;s now
            ready for your final touches. Personalize your domain, review your
            details, and send it to the people who matter most.
          </p>
        </div>

        <form
          className="flex flex-col gap-[24px]"
          onSubmit={(event) => {
            // Confirming publishes, which is a request rather than a step: the
            // browser's own submit would reload the page out from under it.
            event.preventDefault();
            onConfirm();
          }}>
          <section className="flex flex-col">
            <h3 className={flowSectionName}>Customize your invitation</h3>
            <p className={flowHint}>
              Personalize your invitation domain &amp; message for your guests
              to see
            </p>

            <div className="mt-[24px] flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[6px]">
                <label id={slugLabelId} htmlFor={slugId} className={flowLabel}>
                  Custom Your Web Domain
                </label>
                <div
                  role="group"
                  aria-labelledby={slugLabelId}
                  className={`flex items-stretch ${flowFieldBox}`}>
                  {/* The address reads left to right as one line, so the part
                      the product fixes comes before the part that names this
                      invitation. The design draws it the other way round, as a
                      subdomain suffix, which the product cannot serve: see
                      `docs/adr/0001-path-urls-not-subdomains.md`. */}
                  <span className="flex items-center rounded-l-[8px] border-r border-[#D0D5DD] bg-white px-[20px] py-[10px] text-[14px] font-[600] leading-[20px] text-[#E34013]">
                    {SLUG_PREFIX}
                  </span>
                  {/* Read-only rather than disabled, and still an input: the
                      couple does not choose this, but it is the address they
                      are about to send, so it has to be reachable, selectable
                      and copyable. Nothing is said underneath it either - rules
                      for typing something nobody types, and a message naming a
                      fault nobody can have caused, would both be words a couple
                      cannot act on. */}
                  <input
                    id={slugId}
                    type="text"
                    readOnly
                    value={values.slug}
                    className="min-w-0 flex-1 rounded-r-[8px] bg-white px-[14px] py-[12px] text-[16px] font-[400] leading-[24px] text-[#101828] outline-none placeholder:text-[#667085]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label htmlFor={messageId} className={flowLabel}>
                  Invitation Greeting Message
                </label>
                <textarea
                  id={messageId}
                  ref={messageRef}
                  value={values.greetingMessage}
                  onChange={(event) =>
                    onChange({ ...values, greetingMessage: event.target.value })
                  }
                  className={`w-full resize-none overflow-hidden px-[12px] py-[8px] text-[16px] font-[400] leading-[24px] text-[#101828] outline-none ${flowFieldBox}`}
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col">
            <h3 className={flowSectionName}>Add Guest List</h3>
            <p className={flowHint}>
              Personalize your invitation domain &amp; message for your guests
              to see
            </p>

            <div className="mt-[24px] flex flex-col gap-[6px]">
              {guestList ? (
                <GuestListTable
                  guestList={guestList}
                  onUpload={uploadGuestList}
                  onCorrect={correctGuest}
                  onDelete={deleteGuest}
                />
              ) : (
                <>
                  <p id={guestListLabelId} className={flowLabel}>
                    Guest List
                  </p>
                  <div
                    role="group"
                    aria-labelledby={guestListLabelId}
                    onClick={() => dropZoneFileRef.current?.click()}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const file = event.dataTransfer.files?.[0];
                      if (file) uploadGuestList(file);
                    }}
                    className={flowDropZone}>
                    <Upload
                      size={32}
                      aria-hidden="true"
                      className="text-[#141414]"
                    />
                    <div className="flex flex-col items-center gap-[4px] text-center">
                      <p className={flowDropZoneTitle}>
                        Drag &amp; drop up your list here
                      </p>
                      <p className={flowDropZonePrompt}>
                        Upload in format .CSV
                      </p>
                    </div>
                    {/* The design draws no control here, only an area, so the
                        field itself is what a couple arriving by keyboard
                        reaches. */}
                    <GuestListFileInput
                      ref={dropZoneFileRef}
                      onChoose={uploadGuestList}
                      isTheTabStop
                    />
                  </div>
                </>
              )}

              {/* The design draws the size limit and nothing beside it. The
                  template goes on the end of that line, and on a line of its own
                  once a list is uploaded, because a couple has nothing to go on
                  but the word CSV: the list carries six things about a guest,
                  and guessing which and in what order is not something to ask of
                  anybody. Below the card rather than inside it - the design's
                  card header holds three things at a stated spacing, and a
                  fourth crushes all three onto two lines each. Agreed and
                  recorded in `docs/adr/0002-figma-is-literal-truth.md`. */}
              <div className="flex items-center gap-[16px]">
                {guestList ? null : (
                  <p className={flowHint}>{GUEST_LIST_SIZE_LIMIT}</p>
                )}
                <a
                  href={GUEST_LIST_TEMPLATE_HREF}
                  download={GUEST_LIST_TEMPLATE_NAME}
                  className={`ml-auto ${flowInlineAction}`}>
                  {GUEST_LIST_TEMPLATE_ACTION}
                </a>
              </div>

              {guestListProblem ? (
                <p role="alert" className={flowProblem}>
                  {guestListProblem}
                </p>
              ) : null}
            </div>
          </section>

          <div className={`mt-[24px] ${flowActionRow}`}>
            <button
              type="button"
              onClick={onPreviousStep}
              className={flowActionBack}>
              Previous step
            </button>
            {/* Beside Confirm Create rather than beside Previous step: it is
                the other thing a couple can do with what they have written,
                not the other way out of the step. Dimmed while it is saving,
                for the reason the Next action is. */}
            <button
              type="button"
              onClick={onSaveAsDraft}
              disabled={isBusy}
              aria-busy={isBusy}
              className={`${flowActionAside} disabled:opacity-60`}>
              Save as draft
            </button>
            {/* Dimmed while something is in flight, as its neighbour is: this
                one asks the backend two questions in turn, and a couple who
                cannot tell a slow press from a dead one presses again. */}
            <button
              type="submit"
              disabled={isBusy}
              aria-busy={isBusy}
              className={`${flowActionForward} disabled:opacity-60`}>
              Confirm Create
            </button>
          </div>

          {/* Under the row rather than over it, so a couple reads it where they
              have just pressed. Nothing is drawn while there is nothing to say,
              which is every screen the design draws. */}
          {problem ? (
            <p role="alert" className={`text-right ${flowProblem}`}>
              {problem}
            </p>
          ) : null}

          {/* What the backend named, listed rather than run together, because a
              couple has to go back and fix each one. Its words are printed as
              they arrived: see `docs/adr/0002-figma-is-literal-truth.md`. */}
          {outstanding ? (
            <div role="alert" className={`text-right ${flowProblem}`}>
              <p>
                Your invitation is not ready to publish yet. It is still a draft,
                and nothing has been sent to your guests.
              </p>
              {/* By position, because the backend names a field and a fault
                  separately and only the fault is printed: two fields can be
                  wrong in the same words, and the same words twice is a list of
                  one as far as React is concerned. */}
              <ul className="mt-[6px] flex flex-col gap-[4px]">
                {outstanding.map((issue, position) => (
                  <li key={position}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </form>
      </div>

      <div className="shrink-0 self-start border-l border-[#EAECF0] pl-[60px]">
        <GuestInvitesPreview
          message={values.greetingMessage}
          substitutions={{
            brideNickname,
            groomNickname,
            guestName: SAMPLE_GUEST_NAME,
            guestLink: guestLinkFor(values.slug, SAMPLE_GUEST_NAME),
          }}
        />
      </div>
    </div>
  );
}

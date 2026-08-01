'use client';

import { Upload } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import {
  flowActionBack,
  flowActionForward,
  flowActionRow,
  flowDropZone,
  flowDropZonePrompt,
  flowDropZoneTitle,
  flowFieldBox,
  flowHint,
  flowLabel,
  flowProblem,
  flowSectionName,
} from './create-flow-treatment';
import GuestInvitesPreview from './guest-invites-preview';
import {
  guestLinkFor,
  SAMPLE_GUEST_NAME,
  SLUG_RULES,
  SLUG_PREFIX,
  slugProblem,
  type GuestInvitesValues,
} from './guest-invites-types';
import GuestListFileInput from './guest-list-file-input';
import GuestListTable from './guest-list-table';
import { GUEST_LIST_SIZE_LIMIT, readGuestList, type Guest } from './guest-list';

/**
 * The third step of the Create Flow: a couple names their invitation, writes
 * what their guests will receive, and uploads a Guest List.
 *
 * Nothing here reaches a network. The product has no per-content slug, no
 * availability check and no fetch-by-slug, so this screen validates a slug's
 * format, keeps everything the couple types in memory, and stops there. The
 * design shows the chosen name being confirmed as available; without a backend
 * that cannot be answered truthfully, so it is not answered at all. Availability
 * and publishing are `hbd-byb.17`.
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
   * Go on to the published step.
   *
   * Only called once the slug is well formed, so the screen after this one can
   * be sure it has a link to show.
   */
  onConfirm: () => void;
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
}: GuestInvitesStepProps) {
  const slugId = useId();
  const slugLabelId = useId();
  const messageId = useId();
  const guestListLabelId = useId();
  const dropZoneFileRef = useRef<HTMLInputElement>(null);

  // The rules stay on the screen the whole time, because the moment a couple is
  // most likely to need them is while they are typing something that breaks
  // them. What is wrong is said underneath, and only once they have had a go,
  // so an untouched field is not scolded for being empty.
  const [slugTouched, setSlugTouched] = useState(false);
  const problem = slugProblem(values.slug);
  const showProblem = slugTouched && problem !== null;

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

  function renameGuest(id: string, name: string) {
    changeGuests((guests) =>
      guests.map((guest) => (guest.id === id ? { ...guest, name } : guest))
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
            // Confirming goes on to the published screen and nowhere else:
            // nothing is sent, because there is nothing to send it to yet.
            // A slug with a problem keeps the couple here, on the field that
            // has it, rather than carrying a broken address forward.
            event.preventDefault();
            setSlugTouched(true);
            if (problem) {
              document.getElementById(slugId)?.focus();
              return;
            }
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
                      the product fixes comes before the part a couple chooses.
                      The design draws it the other way round, as a subdomain
                      suffix, which the product cannot serve: see
                      `docs/adr/0001-path-urls-not-subdomains.md`. */}
                  <span className="flex items-center rounded-l-[8px] border-r border-[#D0D5DD] bg-white px-[20px] py-[10px] text-[14px] font-[600] leading-[20px] text-[#E34013]">
                    {SLUG_PREFIX}
                  </span>
                  <input
                    id={slugId}
                    type="text"
                    value={values.slug}
                    aria-invalid={showProblem}
                    aria-describedby={`${slugId}-rules`}
                    placeholder="galihpermana"
                    onChange={(event) => {
                      setSlugTouched(true);
                      onChange({ ...values, slug: event.target.value });
                    }}
                    onBlur={() => setSlugTouched(true)}
                    className="min-w-0 flex-1 rounded-r-[8px] bg-white px-[14px] py-[12px] text-[16px] font-[400] leading-[24px] text-[#101828] outline-none placeholder:text-[#667085]"
                  />

                </div>
                <p id={`${slugId}-rules`} className={flowHint}>
                  {SLUG_RULES}
                </p>
                {showProblem ? (
                  <p role="alert" className={flowProblem}>
                    {problem}
                  </p>
                ) : null}
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
                  onRename={renameGuest}
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
                  <p className={flowHint}>{GUEST_LIST_SIZE_LIMIT}</p>
                </>
              )}
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
            <button type="submit" className={flowActionForward}>
              Confirm Create
            </button>
          </div>
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

'use client';

import { Upload } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import {
  flowActionBack,
  flowActionForward,
  flowActionRow,
  flowFieldBox,
} from './create-flow-treatment';
import GuestInvitesPreview from './guest-invites-preview';
import {
  guestLinkFor,
  SAMPLE_GUEST_NAME,
  SLUG_RULES,
  SLUG_SUFFIX,
  slugProblem,
  type GuestInvitesValues,
} from './guest-invites-types';

/**
 * The third step of the Create Flow: a couple names their invitation, writes
 * what their guests will receive, and is offered a Guest List.
 *
 * Nothing here reaches a network. The product has no per-content slug, no
 * availability check and no fetch-by-slug, so this screen validates a slug's
 * format, keeps everything the couple types in memory, and stops there. The
 * design shows the chosen name being confirmed as available; without a backend
 * that cannot be answered truthfully, so it is not answered at all. Availability
 * and publishing are `hbd-byb.17`.
 *
 * The Guest List area is the design's empty state: it says what it takes and
 * how large a file may be. Reading a CSV and listing the guests it names is the
 * populated state, `hbd-byb.11`, which is why nothing here accepts a file yet.
 */

/** The design's field label. */
const TYPE_LABEL = 'text-[14px] font-[500] leading-[20px] text-[#344054]';

/** The design's hint, the grey line under a field. */
const TYPE_HINT = 'text-[14px] font-[400] leading-[20px] text-[#475467]';

/** The design's section name and the line under it. */
const TYPE_SECTION_NAME =
  'text-[18px] font-[600] leading-[28px] text-[#1B1B1B]';

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

  // The rules stay on the screen the whole time, because the moment a couple is
  // most likely to need them is while they are typing something that breaks
  // them. What is wrong is said underneath, and only once they have had a go,
  // so an untouched field is not scolded for being empty.
  const [slugTouched, setSlugTouched] = useState(false);
  const problem = slugProblem(values.slug);
  const showProblem = slugTouched && problem !== null;

  const messageRef = useHeightOfContent(values.greetingMessage, isCurrent);

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
            <h3 className={TYPE_SECTION_NAME}>Customize your invitation</h3>
            <p className={TYPE_HINT}>
              Personalize your invitation domain &amp; message for your guests
              to see
            </p>

            <div className="mt-[24px] flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[6px]">
                <label id={slugLabelId} htmlFor={slugId} className={TYPE_LABEL}>
                  Custom Your Web Domain
                </label>
                <div
                  role="group"
                  aria-labelledby={slugLabelId}
                  className={`flex items-stretch ${flowFieldBox}`}>
                  <input
                    id={slugId}
                    type="text"
                    value={values.slug}
                    aria-invalid={showProblem}
                    aria-describedby={`${slugId}-rules`}
                    placeholder="FreeAtLastWithElias"
                    onChange={(event) => {
                      setSlugTouched(true);
                      onChange({ ...values, slug: event.target.value });
                    }}
                    onBlur={() => setSlugTouched(true)}
                    className="min-w-0 flex-1 rounded-l-[8px] bg-white px-[14px] py-[12px] text-[16px] font-[400] leading-[24px] text-[#101828] outline-none placeholder:text-[#667085]"
                  />
                  <span className="flex items-center rounded-r-[8px] border-l border-[#D0D5DD] bg-white px-[20px] py-[10px] text-[14px] font-[600] leading-[20px] text-[#E34013]">
                    {SLUG_SUFFIX}
                  </span>
                </div>
                <p id={`${slugId}-rules`} className={TYPE_HINT}>
                  {SLUG_RULES}
                </p>
                {showProblem ? (
                  <p
                    role="alert"
                    className="text-[14px] font-[400] leading-[20px] text-[#D92D20]">
                    {problem}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-[6px]">
                <label htmlFor={messageId} className={TYPE_LABEL}>
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
            <h3 className={TYPE_SECTION_NAME}>Add Guest List</h3>
            <p className={TYPE_HINT}>
              Personalize your invitation domain &amp; message for your guests
              to see
            </p>

            <div className="mt-[24px] flex flex-col gap-[6px]">
              <p id={guestListLabelId} className={TYPE_LABEL}>
                Guest List
              </p>
              <div
                role="group"
                aria-labelledby={guestListLabelId}
                className="flex flex-col items-center gap-[16px] rounded-[8px] border border-dashed border-[#D9D9D9] bg-[rgba(0,0,0,0.02)] p-[16px]">
                <Upload
                  size={32}
                  aria-hidden="true"
                  className="text-[#141414]"
                />
                <div className="flex flex-col items-center gap-[4px] text-center">
                  <p className="text-[16px] font-[600] leading-[22.4px] text-[rgba(0,0,0,0.88)]">
                    Drag &amp; drop up your list here
                  </p>
                  <p className="text-[14px] font-[400] leading-[16.8px] text-[rgba(0,0,0,0.45)]">
                    Upload in format .CSV
                  </p>
                </div>
              </div>
              <p className={TYPE_HINT}>Max file size 5MB</p>
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

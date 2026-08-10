'use client';

import { useEffect, useId, useRef } from 'react';

import {
  flowActionAside,
  flowActionBack,
  flowActionForward,
  flowActionRow,
  flowFieldBox,
  flowHint,
  flowLabel,
  flowProblem,
  flowSectionName,
} from './create-flow-treatment';
import { useFlowCopy } from './flow-language';
import FlowLanguageField from './flow-language-field';
import GuestInvitesPreview from './guest-invites-preview';
import {
  guestLinkFor,
  SAMPLE_GUEST_NAME,
  SAMPLE_GUEST_TOKEN,
  SLUG_SUFFIX,
  type GuestInvitesValues,
} from './guest-invites-types';
import GuestListField from './guest-list-field';
import { type Guest, type GuestList } from './guest-list';

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
 * it takes and how large a file may be, or the list itself. The list is not this
 * step's - the backend holds it, and `use-guest-roster.ts` reads it back and
 * sends every change to it - so what this step does with a chosen file is hand
 * it over, and what it does with a correction or a deletion is ask for one.
 *
 * On an invitation opened again the Guest List is not here at all: the couple
 * manages it on its own screen, `/dashboard/wedding/{id}/guests`, and the same
 * list drawn in two places would be the same six columns this step was too
 * narrow for. Creating keeps the card, exactly as the design draws it.
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
  /** The Guest List the backend holds, or null while there is none. */
  guestList: GuestList | null;
  /** Let the guests this file names replace the whole list. */
  onUploadGuestList: (file: File) => void;
  /**
   * Correct one guest, leaving the rest of the list alone, and say whether the
   * backend took it - which is what closes the row being edited.
   */
  onCorrectGuest: (guest: Guest) => Promise<boolean>;
  onDeleteGuest: (id: string) => void;
  /**
   * What went wrong with the last thing done to the Guest List, or nothing.
   *
   * One line for both kinds, because a couple reads them in the same place and
   * for the same reason: a file that could not be read and a change the backend
   * refused are both a press of theirs that did not do what it looked like.
   */
  guestListProblem: string | null;
  /** Whether one of those is in flight, so none of them can be pressed twice. */
  isGuestListBusy: boolean;
  /**
   * Whether the invitation being filled in is one that has already gone out.
   *
   * Only ever true for an invitation opened again from the couple's own
   * listing, and it changes what the last press of this step is. There is
   * nothing left to create, nothing left to confirm, and no draft to save as:
   * there is one invitation, its address never changes, and a save is live the
   * moment it lands. So the step offers one action that says that, and does not
   * ask the backend whether the invitation may go out - it already has.
   */
  isAlreadyPublished?: boolean;
  /**
   * Whether the invitation being filled in is one opened again from the
   * couple's own listing, rather than one being made.
   *
   * An opened invitation's Guest List lives on its own screen in the
   * dashboard, so this step does not draw the card and nothing here replaces
   * it. A couple creating still sees it, exactly as the design draws it.
   */
  isOpenedAgain?: boolean;
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
  guestList,
  onUploadGuestList,
  onCorrectGuest,
  onDeleteGuest,
  guestListProblem,
  isGuestListBusy,
  isAlreadyPublished = false,
  isOpenedAgain = false,
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
  const copy = useFlowCopy();

  const messageRef = useHeightOfContent(values.greetingMessage, isCurrent);

  // Two columns as the design draws them, and one below lg. The Invitation
  // Preview is a picture of a phone 405px wide standing beside a form, and a
  // phone has no 405px to spare for it: side by side at 390 the form was left
  // with almost nothing, one word to a line and its actions off the left-hand
  // edge of the window entirely, which is the fault this was raised over. So
  // below lg the preview goes under the form rather than beside it, and the
  // form - the thing a couple came here to fill in - gets the width.
  return (
    <div className="flex flex-col gap-[40px] lg:flex-row lg:gap-[60px]">
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

        <div>
          {/* The same control the step before carries, in the same place:
              above the fields and outside the form. It is a preference about
              reading the flow rather than an answer about a wedding, and its
              placement is load-bearing here for the same reason it is there:
              the check addresses this step's labels by their position within
              the form, and a setting parked among them would renumber every
              one of them. */}
          <FlowLanguageField />
          <form
            className="flex flex-col gap-[24px]"
            onSubmit={(event) => {
              // Confirming publishes, which is a request rather than a step: the
              // browser's own submit would reload the page out from under it.
              event.preventDefault();
              onConfirm();
            }}>
            <section className="flex flex-col">
              <h3 className={flowSectionName}>{copy.customiseInvitation}</h3>
              <p className={flowHint}>
                Personalize your invitation domain &amp; message for your guests
                to see
              </p>

              <div className="mt-[24px] flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[6px]">
                  <label
                    id={slugLabelId}
                    htmlFor={slugId}
                    className={flowLabel}>
                    {copy.customDomain}
                  </label>
                  <div
                    role="group"
                    aria-labelledby={slugLabelId}
                    className={`flex items-stretch ${flowFieldBox}`}>
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
                      className="min-w-0 flex-1 rounded-l-[8px] bg-white px-[14px] py-[12px] text-[16px] font-[400] leading-[24px] text-[#101828] outline-none placeholder:text-[#667085]"
                    />
                    {/* The slug is served as the subdomain, so the fixed part of the address
                        follows it, exactly as the design draws it - the
                        deviation that put a path prefix ahead of the box is
                        withdrawn: see
                        `docs/adr/0005-an-invitation-answers-at-its-own-subdomain.md`. */}
                    <span className="flex items-center rounded-r-[8px] border-l border-[#D0D5DD] bg-white px-[20px] py-[10px] text-[14px] font-[600] leading-[20px] text-[#E34013]">
                      {SLUG_SUFFIX}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label htmlFor={messageId} className={flowLabel}>
                    {copy.greetingMessage}
                  </label>
                  <textarea
                    id={messageId}
                    ref={messageRef}
                    value={values.greetingMessage}
                    onChange={(event) =>
                      onChange({
                        ...values,
                        greetingMessage: event.target.value,
                      })
                    }
                    className={`w-full resize-none overflow-hidden px-[12px] py-[8px] text-[16px] font-[400] leading-[24px] text-[#101828] outline-none ${flowFieldBox}`}
                  />
                </div>
              </div>
            </section>

            {isOpenedAgain ? null : (
              <section className="flex flex-col">
                <h3 className={flowSectionName}>{copy.addGuestList}</h3>
                <p className={flowHint}>
                  Personalize your invitation domain &amp; message for your
                  guests to see
                </p>

                <GuestListField
                  guestList={guestList}
                  onUpload={onUploadGuestList}
                  onCorrect={onCorrectGuest}
                  onDelete={onDeleteGuest}
                  problem={guestListProblem}
                  isBusy={isGuestListBusy}
                />
              </section>
            )}

            <div className={`mt-[24px] ${flowActionRow}`}>
              <button
                type="button"
                onClick={onPreviousStep}
                className={flowActionBack}>
                {copy.actionPreviousStep}
              </button>
              {/* Beside Confirm Create rather than beside Previous step: it is
                  the other thing a couple can do with what they have written,
                  not the other way out of the step. Dimmed while it is saving,
                  for the reason the Next action is.

                  Gone on an invitation that is already published, where the word
                  draft is untrue: there is no draft copy to save to, and the
                  press beside it keeps the same thing this one would. */}
              {isAlreadyPublished ? null : (
                <button
                  type="button"
                  onClick={onSaveAsDraft}
                  disabled={isBusy}
                  aria-busy={isBusy}
                  className={`${flowActionAside} disabled:opacity-60`}>
                  {copy.actionSaveAsDraft}
                </button>
              )}
              {/* Dimmed while something is in flight, as its neighbour is: this
                  one asks the backend two questions in turn, and a couple who
                  cannot tell a slow press from a dead one presses again. */}
              <button
                type="submit"
                disabled={isBusy}
                aria-busy={isBusy}
                className={`${flowActionForward} disabled:opacity-60`}>
                {isAlreadyPublished
                  ? copy.actionSaveChanges
                  : copy.actionConfirmCreate}
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
                  Your invitation is not ready to publish yet. It is still a
                  draft, and nothing has been sent to your guests.
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
      </div>

      {/* The rule down the left is the division between two columns, so it
          goes with them: below lg there is one column and nothing to divide. */}
      <div className="w-full self-start lg:w-auto lg:shrink-0 lg:border-l lg:border-[#EAECF0] lg:pl-[60px]">
        <GuestInvitesPreview
          message={values.greetingMessage}
          substitutions={{
            brideNickname,
            groomNickname,
            guestName: SAMPLE_GUEST_NAME,
            guestLink: guestLinkFor(values.slug, SAMPLE_GUEST_TOKEN),
          }}
        />
      </div>
    </div>
  );
}

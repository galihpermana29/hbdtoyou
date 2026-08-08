'use client';

import { message } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import CreateFlowBreadcrumb from './create-flow-breadcrumb';
import CreateFlowSteps, { type CreateFlowStep } from './create-flow-steps';
import useCreateContent from '../usecase/useCreateContent';
import {
  flowActionAside,
  flowActionBack,
  flowActionForward,
  flowActionRow,
  flowProblem,
} from '@/components/forms/wedding/create-flow-treatment';
import { useInvitation } from '@/components/forms/wedding/use-invitation';
import { useGuestRoster } from '@/components/forms/wedding/use-guest-roster';
import {
  sectionHolding,
  type SectionKey,
} from '@/components/forms/wedding/required-fields';
import FlowLanguageField from '@/components/forms/wedding/flow-language-field';
import { useFlowCopy } from '@/components/forms/wedding/flow-language';
import GuestInvitesStep from '@/components/forms/wedding/guest-invites-step';
import PublishedStep from '@/components/forms/wedding/published-step';
import WeddingInvitationForm from '@/components/forms/wedding/wedding-invitation-form';
import WeddingInvitationPreview from '@/components/forms/wedding/wedding-invitation-preview';
import NavigationBar from '@/components/ui/navbar';
import { weddingTemplate1Fonts } from '@/components/wedding/wedding-template-1/fonts';
import {
  DEFAULT_GUEST_MESSAGE,
  greetingSeededWith,
  invitationLinkFor,
  type GuestInvitesValues,
} from '@/components/forms/wedding/guest-invites-types';
import {
  contentToFormValues,
  namesTheCouple,
  type WeddingInvitationFormValues,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';

/**
 * How long the Sections take to finish opening, in milliseconds.
 *
 * Measured rather than guessed: the scroll below has to land after the reflow
 * they cause, or the browser undoes it.
 */
const SECTIONS_FINISH_OPENING_MS = 250;

/** Where a couple goes back to from the first step this flow owns. */
const CHOOSE_TEMPLATE_ROUTE = '/wedding-invitation';

/** Where a couple who opened one of their own invitations came from. */
const OWN_INVITATIONS_ROUTE = '/dashboard/wedding';

/**
 * The Create Flow, one step at a time.
 *
 * Every step stays mounted and the ones a couple is not on are hidden, which is
 * what makes "the form remembers what I entered" true without copying values
 * out of one step and back into another: an antd form that unmounts loses its
 * store, and a step that never unmounts cannot.
 *
 * Hidden is `display: none` rather than a visual trick, so a step a couple
 * cannot see is also a step nothing else can find - including the style and
 * structure check, which skips anything the browser does not render.
 *
 * The published step is the exception. The design gives it no way back, so
 * nothing a couple typed can return to it, and it is mounted when it is reached
 * rather than kept alive behind the others.
 */
/**
 * An invitation this flow was opened on, rather than one it is about to make.
 *
 * What `/dashboard/wedding/{uuid}/edit` hands down, as it was stored.
 *
 * The record rather than the form values it becomes, because the screen handing
 * this over renders on the server and `contentToFormValues` produces a Dayjs for
 * the wedding day - which is not a plain object and cannot cross into a client
 * component. It arrives as what the backend stored, and is turned into answers
 * here, where the form that holds them lives.
 */
export interface OpenedWeddingInvitation {
  weddingId: string;
  /** The address it already has, or empty when the read did not carry one. */
  slug: string;
  /** Whether guests can already read it, which changes what a save means. */
  isPublished: boolean;
  /** The invitation exactly as it was saved. */
  content: WeddingTemplate1Content;
  /**
   * The words the couple wrote for their guests, or null when the record holds
   * none.
   *
   * Null is an invitation saved before there was anywhere to keep the message,
   * and it is treated as a couple who has not written one: the message seeds
   * itself from their nicknames, the way it does for anybody starting. A saved
   * message is theirs and nothing rewrites it.
   */
  greetingMessage: string | null;
}

export interface WeddingInvitationCreateClientsideProps {
  /**
   * The Invitation Slug to fall back on while no invitation has been saved, or
   * empty for the nothing a couple starts with.
   *
   * A real one is not this: saving creates the invitation, the backend generates
   * its slug, and `useInvitation` reads it back, which is the only address any
   * couple is ever shown. This is what stands in on a screen where no invitation
   * can exist - see `SLUG_PARAM` - and the read-back address wins over it the
   * moment there is one.
   */
  slug: string;
  /**
   * The saved invitation being opened again, or nothing for one being made.
   *
   * The flow is the same flow either way. That is the point: an editor built
   * beside this one would be a second place every wedding field has to be kept
   * correct, and the first field either of them forgot would be a field a couple
   * could fill in and never see again.
   */
  opened?: OpenedWeddingInvitation;
  /**
   * Whether the page around this flow already draws the site's own navigation.
   *
   * `site` is the Create Flow at its own address, which owns its chrome. On the
   * dashboard the layout has already drawn a navigation bar and the dashboard's
   * tabs, and a second one below them would be two navigations on one screen.
   */
  chrome?: 'site' | 'dashboard';
}

export default function WeddingInvitationCreateClientside({
  slug,
  opened,
  chrome = 'site',
}: WeddingInvitationCreateClientsideProps) {
  const router = useRouter();
  const { contextHolder, openNotification } = useCreateContent();
  const [form] = useForm<WeddingInvitationFormValues>();

  /**
   * The saved invitation as the form's own answers.
   *
   * Once, because the form takes these as its initial values and reads them at
   * the first render only - and because the conversion mints a Dayjs, so
   * repeating it would hand the form a new object on every render for a value
   * that has not changed.
   */
  const savedValues = useMemo(
    () => (opened ? contentToFormValues(opened.content) : undefined),
    [opened]
  );
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [step, setStep] = useState<CreateFlowStep>(
    'Fill in the details & story'
  );
  const [guestInvites, setGuestInvites] = useState<GuestInvitesValues>({
    slug: opened?.slug || slug,
    greetingMessage: opened?.greetingMessage ?? DEFAULT_GUEST_MESSAGE,
  });

  const {
    save,
    weddingId,
    slug: savedSlug,
    isSaving,
    publish,
    isPublishing,
    problem,
    outstanding,
    sayThereIsNobodyToSaveFor,
    forgetWhatWentWrong,
  } = useInvitation(
    form,
    opened && {
      weddingId: opened.weddingId,
      slug: opened.slug,
      isPublished: opened.isPublished,
      // Both nicknames, because the offer of a name-derived address is made on
      // the save where they first exist, and a record already carrying both is
      // one whose moment has passed - whatever came of it.
      namesTheCouple: namesTheCouple(
        opened.content.groomName,
        opened.content.brideName
      ),
    }
  );

  /**
   * Who is invited, as the backend holds them.
   *
   * Not part of `guestInvites`, because it is not something this page is
   * keeping: the roster reads the list back off the invitation and sends every
   * upload, correction and deletion to it. A copy here would be a second answer
   * to who is invited, and the wrong one every time a call was refused.
   *
   * It is handed the invitation as soon as there is one, and holds the list in
   * the browser until then - which is a visitor with no account, who has nothing
   * to save a wedding to either.
   */
  const guests = useGuestRoster(weddingId);

  const brideNickname = useWatch('brideName', form);
  const groomNickname = useWatch('groomName', form);

  /**
   * Whether the couple has written their own greeting message.
   *
   * Until they have, the message follows the names they type in the step
   * before, so a nickname corrected on the first step is corrected here too.
   * The moment they edit it, it is theirs and nothing rewrites it again - not
   * even if they go back and change a nickname afterwards. Silently rewording
   * something a couple wrote to their families is worse than letting one name
   * go stale, and the stale one is at least visible to them.
   *
   * A saved invitation's message is theirs from the first render. It was saved,
   * so it is what they meant to send, and seeding over it would discard a
   * message a couple wrote the moment they opened their own invitation to
   * change something else.
   */
  const [messageIsTheirs, setMessageIsTheirs] = useState(
    opened?.greetingMessage != null
  );

  useEffect(() => {
    if (messageIsTheirs) return;
    setGuestInvites((previous) => ({
      ...previous,
      greetingMessage: greetingSeededWith(
        brideNickname ?? '',
        groomNickname ?? ''
      ),
    }));
  }, [brideNickname, groomNickname, messageIsTheirs]);

  const copy = useFlowCopy();
  const [openSections, setOpenSections] = useState<SectionKey[]>([]);

  /**
   * The fields a refused Next found empty, so the couple can be taken to one.
   *
   * Held in state and acted on in an effect rather than scrolled to inside the
   * press, because a field inside a Section that has not opened yet is
   * `display: none` and scrolling to it does nothing at all, silently.
   *
   * One effect is not enough either. A Section opens itself when it sees the
   * request, which is its own state change, and a child's effect runs before
   * its parent's - so by the time this one runs, the Sections have agreed to
   * open and the browser has not laid them out yet. Waiting for a frame where
   * the field actually occupies space is what makes this land; without it the
   * scroll was skipped every time and Chrome's scroll anchoring moved the page
   * instead, which looked convincingly like a scroll going to the wrong place.
   */
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  useEffect(() => {
    if (invalidFields.length === 0) return;

    // Left until the Sections have finished expanding.
    //
    // Eight of them open under this press, and while they do Chrome keeps
    // correcting the scroll position to hold the content still - a scroll
    // issued into that reflow is applied and then quietly undone, which looks
    // exactly like a scroll that went nowhere. A frame is not long enough to
    // wait; the reflow outlasts several.
    const settling = setTimeout(() => {
      const shown = invalidFields
        .map((name) => document.getElementById(name))
        .filter((field): field is HTMLElement => Boolean(field?.offsetParent));
      if (shown.length === 0) return;

      // The field highest on the page, not the first antd happens to name. antd
      // returns them in the order the fields mounted rather than the order a
      // couple reads them, and scrolling to that one sent a couple who pressed
      // Next from the bottom of the step further down it.
      shown
        .reduce((highest, field) =>
          field.getBoundingClientRect().top <
          highest.getBoundingClientRect().top
            ? field
            : highest
        )
        .scrollIntoView({ behavior: 'instant', block: 'center' });
    }, SECTIONS_FINISH_OPENING_MS);

    return () => clearTimeout(settling);
  }, [invalidFields]);
  /** Whether this flow draws the navigation around itself, or the page did. */
  const isOwnChrome = chrome === 'site';

  /**
   * Where the first step's way back goes.
   *
   * Out of the flow either way, to whatever brought the couple into it: a
   * couple making an invitation came from choosing a template, and a couple
   * changing one came from their own list of invitations.
   */
  const wayBack = isOwnChrome ? CHOOSE_TEMPLATE_ROUTE : OWN_INVITATIONS_ROUTE;

  const isDetailsAndStory = step === 'Fill in the details & story';
  const isGuestInvites = step === 'Guest invites details';
  const isPublished = step === 'Share with guests';

  // The address the invitation was actually given, once a save has learned one,
  // and whatever this flow was handed until then. A saved invitation's own slug
  // wins outright: it is the only one that resolves.
  //
  // Derived on the way down rather than written into the state, because the slug
  // is the invitation's rather than the step's and nothing on the step edits it.
  // The step hands the whole values object back when a couple changes something
  // else, so the address does end up in the state - harmlessly, because it is
  // the same value, and because this line still decides which one is used.
  const guestInvitesValues: GuestInvitesValues = {
    ...guestInvites,
    slug: savedSlug ?? guestInvites.slug,
  };

  // Composed here rather than passed up from the step that owns the slug, so
  // that the address the couple is shown and the one their guests are shown are
  // the same function of the same value.
  const invitationLink = invitationLinkFor(guestInvitesValues.slug);

  /**
   * Move to another step, from the top of it.
   *
   * A couple presses the action at the foot of a long step, and the step that
   * replaces it is shorter, so without this they arrive at whatever happens to
   * be at that height - on the published step, that is the footer, with the news
   * that their invitation is published somewhere above them. Instantly rather
   * than smoothly, because the content underneath has already changed and
   * scrolling it past them says nothing.
   */
  function goToStep(next: CreateFlowStep) {
    // Whatever the last press had to say belonged to the step being left. It is
    // printed at the foot of whichever step is showing, so carrying it along
    // would put a message about one press under a row a couple has not pressed.
    forgetWhatWentWrong();
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /**
   * Keep what the couple has entered, and then go on to the guest invites step.
   *
   * The save is what makes the step finished, so a failed one stops it: the
   * values stay in the form, the reason is printed under the row, and pressing
   * Next again retries. A retry after a first save that failed creates rather
   * than updates, because there is still no invitation - see
   * `use-invitation.ts`.
   */
  async function goOnToGuestInvites() {
    // Asked for before anything is sent, because a step that is not finished is
    // not a step to save: the couple would be told their invitation was kept
    // and then told it was not ready, about the same press.
    //
    // Each field says for itself what is wrong with it, underneath itself, so
    // nothing is printed here. What this still owes the couple is getting them
    // to the first of those messages.
    try {
      await form.validateFields();
    } catch (refused) {
      const errorFields =
        (refused as { errorFields?: { name: (string | number)[] }[] })
          .errorFields ?? [];
      if (errorFields.length === 0) return;

      // Opened first, and scrolled to second. A collapsed Section's fields are
      // hidden, and nothing can be scrolled to something that is not laid out -
      // so asking for the scroll before the Section opens lands on whatever
      // happened to be at that height.
      setOpenSections(
        errorFields
          .map((field) => sectionHolding(String(field.name[0])))
          .filter((section): section is SectionKey => section !== null)
      );
      // Scrolled by hand rather than through `form.scrollToField`, which found
      // the field and moved nothing: every one of these controls is a component
      // of ours, and antd's own scroll leans on internals they do not satisfy.
      // The identifier is the field's name, which is what `Form.Item` puts on
      // the control it wraps, so this needs no agreement with antd at all.
      //
      setInvalidFields(errorFields.map((field) => String(field.name[0])));
      return;
    }

    setOpenSections([]);
    setInvalidFields([]);
    if ((await save(guestInvitesValues.greetingMessage)) === 'FAILED') return;
    goToStep('Guest invites details');
  }

  /**
   * Keep what the couple has entered, and stay where they are.
   *
   * A save that worked says so and goes, because nothing else on the screen
   * changes when it does: a couple who pressed the control on purpose and saw
   * nothing at all would have no way to tell a save from a dead button. A save
   * that failed is printed under the row instead, and stays there, because that
   * one is not news a couple should be able to miss.
   */
  /**
   * Keep what the couple has entered, whatever state it is in.
   *
   * Deliberately does not validate. Validation gates what a couple can reach,
   * never what they are allowed to keep: this is the way out of a step they
   * cannot finish yet, and a way out that could itself be refused is not one.
   */
  async function saveAsDraft() {
    const outcome = await save(guestInvitesValues.greetingMessage);
    if (outcome === 'SAVED') message.success('Your invitation is saved.');
    if (outcome === 'NOT_SIGNED_IN') sayThereIsNobodyToSaveFor();
  }

  /**
   * Keep what the couple has written here, publish the invitation if the backend
   * says it may go out, and then show them the screen that says it has.
   *
   * The save comes first because the greeting message is written on this step
   * and nothing has saved it since. Next saved the message as it stood when the
   * couple arrived, which is the one seeded from their nicknames; every word
   * they have written over it since is only in this page. Publishing without
   * this would publish an invitation carrying the message they did not send.
   *
   * Only a refused save stops the press. A visitor with no account answers
   * `NOT_SIGNED_IN` and is carried on exactly as Next carries them, because they
   * never had an invitation to publish either.
   *
   * The check is what makes the rest of this press finished, so anything
   * outstanding stops it: what came back is printed under the row, the
   * invitation stays the draft it already was, and the couple can go back, fix
   * what was named and press again. A refused call is the same, for the same
   * reason a refused save is.
   *
   * The Guest List is not sent here. Every guest reached the backend when the
   * file was uploaded and every correction since went with it, so there is
   * nothing left of the list for this press to carry - see `use-guest-roster.ts`.
   */
  async function confirmCreate() {
    if ((await save(guestInvitesValues.greetingMessage)) === 'FAILED') return;

    // An invitation that is already out is not published again. It has been
    // through the check once, and the save above is already live - so asking
    // again could only answer that an invitation guests are reading is not
    // ready to go out, printed underneath a banner saying the change they just
    // made has already reached them.
    if (opened?.isPublished) {
      goToStep('Share with guests');
      return;
    }

    const outcome = await publish();
    if (outcome === 'PUBLISHED' || outcome === 'NOTHING_TO_PUBLISH') {
      goToStep('Share with guests');
    }
  }

  return (
    <div className={weddingTemplate1Fonts}>
      {contextHolder}

      {isOwnChrome ? (
        <header>
          <NavigationBar />
        </header>
      ) : null}

      <div className="w-full min-h-screen overflow-x-hidden">
        {/* The same container the site navigation uses, so the breadcrumb and
            the heading line up with the logo above them. */}
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-[20px] py-[30px] pb-[50px] 2xl:max-w-7xl">
          {isOwnChrome ? <CreateFlowBreadcrumb /> : null}

          <div className={isOwnChrome ? 'mt-[32px]' : undefined}>
            <h1 className="text-[18px] font-[600] leading-[28px] text-[#1B1B1B]">
              {opened ? 'Edit Wedding Invitation' : 'Create Wedding Invitation'}
            </h1>
            <p className="mt-[4px] text-[14px] font-[400] leading-[24px] text-[#7B7B7B]">
              {opened
                ? 'Change anything you have already written, and keep it with the same invitation'
                : 'Create memorable wedding invitation for you & your special person’s big day'}
            </p>
          </div>

          {/* Said before a couple can change anything, because this is the only
              moment they can still decide not to. There is one invitation and
              its address never changes, so an edit to a published one is live
              the moment it saves and nobody who already has the link is told. */}
          {opened?.isPublished ? (
            <p
              role="status"
              className="mt-[16px] rounded-[8px] border border-[#FEDF89] bg-[#FFFAEB] px-[16px] py-[12px] text-[14px] font-[400] leading-[20px] text-[#B54708]">
              This invitation is published. Anything you save here is what your
              guests see straight away, including the ones already holding the
              link, and nobody is told that it changed.
            </p>
          ) : null}

          <div className="mt-[32px] border-b border-[#EAECF0] pb-[32px]">
            <CreateFlowSteps current={step} />
          </div>

          <div className={isDetailsAndStory ? 'contents' : 'hidden'}>
            {/* Two columns, as the design arranges them: everything the couple
                fills in on the left, the Site Preview on the right. The two
                actions belong to the left column rather than to the page, which
                is both what the design draws and what puts them ahead of the
                panel in reading order. */}
            <div className="mt-[40px] flex flex-col gap-[24px] lg:flex-row lg:items-stretch lg:gap-[40px]">
              {/* The design draws no box around the Sections: each one carries
                  its own card, and they sit on the page at the same gutter as
                  the heading above them. */}
              <div className="min-w-0 flex-1">
                {/* Above the Sections and outside the Form. It governs every
                    Section, so it cannot sit in one; and it is a preference
                    about reading the flow rather than an answer about a
                    wedding, so it is not one of the Form's fields either. That
                    second part is load-bearing: the check addresses this step's
                    labels by their position within the Form, and a setting
                    parked among them would renumber every one of them. */}
                <FlowLanguageField />
                <WeddingInvitationForm
                  form={form}
                  openNotification={openNotification}
                  openSections={openSections}
                  initialValues={savedValues}
                />

                <div className={`mt-[40px] ${flowActionRow}`}>
                  {/* A button rather than a link, because the design draws the
                      two actions as a pair and only one of them can be a
                      destination. */}
                  <button
                    type="button"
                    onClick={() => router.push(wayBack)}
                    className={flowActionBack}>
                    {copy.actionPreviousStep}
                  </button>
                  {/* Dimmed while it is saving, which is a state the design
                      does not draw: a control that cannot be pressed and looks
                      exactly as it did reads as a press that did nothing, and a
                      couple's answer to that is to press it again. The check
                      never sees it, because nothing on a designed screen is
                      mid-save. */}
                  {/* The way out of a step a couple cannot finish yet.
                      Next asks the whole step to be answered; this asks for
                      nothing and keeps whatever is there, which is the
                      difference between validation gating what a couple can
                      reach and validation gating what they are allowed to
                      keep. Only the first is defensible: what is saved here is
                      what a couple finds again under Wedding on their
                      dashboard, and what is not saved is not there to find. */}
                  <button
                    type="button"
                    onClick={saveAsDraft}
                    disabled={isSaving}
                    aria-busy={isSaving}
                    className={`${flowActionAside} disabled:opacity-60`}>
                    {/* The same press either way. On an invitation that is
                        already out there is no draft to save to - one
                        invitation, one address, and a save that is live - so
                        the word draft would be untrue while the way out of an
                        unfinished step is still needed. */}
                    {opened?.isPublished
                      ? copy.actionSaveChanges
                      : copy.actionSaveAsDraft}
                  </button>
                  <button
                    type="button"
                    onClick={goOnToGuestInvites}
                    disabled={isSaving}
                    aria-busy={isSaving}
                    className={`${flowActionForward} disabled:opacity-60`}>
                    {copy.actionNext}
                  </button>
                </div>

                {/* Only when a save has something to say, which is never on a
                    screen the design draws. */}
                {problem ? (
                  <p
                    role="alert"
                    className={`mt-[12px] text-right ${flowProblem}`}>
                    {problem}
                  </p>
                ) : null}
              </div>

              {/* The control travels with the panel rather than with the page,
                  so it is still there to bring the panel back after a couple
                  has scrolled down a form this long. The design leaves 120px
                  between the two columns; the control sits in the middle of
                  that, 40px from each side, over the rule below. */}
              <div className="relative flex w-full items-start lg:w-auto lg:shrink-0">
                {/* The design rules a hairline down the middle of the 120px
                    gutter, which is the middle of the control that sits in it:
                    20px across, the control being 40px wide and first in this
                    column.

                    The design draws it 966px tall, which is neither column's
                    height, so it runs the full height of the row instead. A
                    fixed stub down a form thousands of pixels long would read
                    as a mistake rather than as a division.

                    Hidden below lg, where the columns stack and there is no
                    gutter left to divide. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-[20px] hidden w-px bg-[#EAECF0] lg:block"
                />
                <div className="flex w-full items-start lg:sticky lg:top-[96px] lg:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
                    aria-expanded={!isPreviewCollapsed}
                    aria-label={
                      isPreviewCollapsed
                        ? 'Show the Site Preview'
                        : 'Hide the Site Preview'
                    }
                    className="hidden h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-[#EDEDED] bg-white text-[#1B1B1B] shadow-lg hover:border-[#E34013] lg:flex">
                    {isPreviewCollapsed ? (
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>

                  {/* Collapsed only where there is a control to bring it back:
                    below lg the two columns stack, the control is gone, and a
                    panel hidden by a decision taken on a wider screen would be
                    hidden with no way to ask for it. */}
                  <div
                    className={`w-full min-w-0 lg:w-auto ${
                      isPreviewCollapsed ? 'lg:hidden' : 'lg:ml-[40px]'
                    }`}>
                    <WeddingInvitationPreview form={form} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={isGuestInvites ? 'mt-[60px]' : 'hidden'}>
            <GuestInvitesStep
              isCurrent={isGuestInvites}
              values={guestInvitesValues}
              onChange={(next) => {
                if (
                  next.greetingMessage !== guestInvitesValues.greetingMessage
                ) {
                  setMessageIsTheirs(true);
                }
                setGuestInvites(next);
              }}
              // Whatever the couple has typed, and nothing where they have
              // typed nothing. These used to fall back to the sample wedding,
              // which put Elias and Freya into the preview of a message a
              // couple was about to send their own families.
              brideNickname={brideNickname?.trim() ?? ''}
              groomNickname={groomNickname?.trim() ?? ''}
              guestList={guests.guestList}
              onUploadGuestList={guests.upload}
              onCorrectGuest={guests.correct}
              onDeleteGuest={guests.remove}
              guestListProblem={guests.problem}
              isGuestListBusy={guests.isBusy}
              isAlreadyPublished={opened?.isPublished ?? false}
              onPreviousStep={() => goToStep('Fill in the details & story')}
              onConfirm={confirmCreate}
              onSaveAsDraft={saveAsDraft}
              isBusy={isSaving || isPublishing}
              problem={problem}
              outstanding={outstanding}
            />
          </div>

          {isPublished ? (
            <div className="mt-[60px]">
              <PublishedStep form={form} invitationLink={invitationLink} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

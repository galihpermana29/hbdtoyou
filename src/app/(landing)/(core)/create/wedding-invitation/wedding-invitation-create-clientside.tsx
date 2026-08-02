'use client';

import { message } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CreateFlowBreadcrumb from './create-flow-breadcrumb';
import CreateFlowSteps, { type CreateFlowStep } from './create-flow-steps';
import useCreateContent from '../usecase/useCreateContent';
import {
  flowActionBack,
  flowActionForward,
  flowActionRow,
  flowProblem,
} from '@/components/forms/wedding/create-flow-treatment';
import { useInvitation } from '@/components/forms/wedding/use-invitation';
import GuestInvitesStep from '@/components/forms/wedding/guest-invites-step';
import PublishedStep from '@/components/forms/wedding/published-step';
import WeddingInvitationForm from '@/components/forms/wedding/wedding-invitation-form';
import WeddingInvitationPreview from '@/components/forms/wedding/wedding-invitation-preview';
import NavigationBar from '@/components/ui/navbar';
import { weddingTemplate1Fonts } from '@/components/wedding/wedding-template-1/fonts';
import {
  DEFAULT_GUEST_MESSAGE,
  invitationLinkFor,
  type GuestInvitesValues,
} from '@/components/forms/wedding/guest-invites-types';
import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingInvitationFormValues,
} from '@/components/forms/wedding/wedding-invitation-types';

/** Where a couple goes back to from the first step this flow owns. */
const CHOOSE_TEMPLATE_ROUTE = '/wedding-invitation';

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
}

export default function WeddingInvitationCreateClientside({
  slug,
}: WeddingInvitationCreateClientsideProps) {
  const router = useRouter();
  const { contextHolder, openNotification } = useCreateContent();
  const [form] = useForm<WeddingInvitationFormValues>();
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [step, setStep] = useState<CreateFlowStep>(
    'Fill in the details & story'
  );
  const [guestInvites, setGuestInvites] = useState<GuestInvitesValues>({
    slug,
    greetingMessage: DEFAULT_GUEST_MESSAGE,
    guestList: null,
  });

  const {
    save,
    slug: savedSlug,
    isSaving,
    publish,
    isPublishing,
    problem,
    outstanding,
    sayThereIsNobodyToSaveFor,
    forgetWhatWentWrong,
  } = useInvitation(form);

  const brideNickname = useWatch('brideName', form);
  const groomNickname = useWatch('groomName', form);

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
    if ((await save()) === 'FAILED') return;
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
  async function saveAsDraft() {
    const outcome = await save();
    if (outcome === 'SAVED') message.success('Your invitation is saved.');
    if (outcome === 'NOT_SIGNED_IN') sayThereIsNobodyToSaveFor();
  }

  /**
   * Publish the invitation, if the backend says it may go out, and then show
   * the couple the screen that says it has.
   *
   * The check is what makes this press finished, so anything outstanding stops
   * it: what came back is printed under the row, the invitation stays the draft
   * it already was, and the couple can go back, fix what was named and press
   * again. A refused call is the same, for the same reason a refused save is.
   *
   * Somebody with no account never had an invitation to publish, so there is
   * nothing to ask about and they are carried on exactly as Next carries them -
   * see `use-invitation.ts`.
   */
  async function confirmCreate() {
    const outcome = await publish();
    if (outcome === 'PUBLISHED' || outcome === 'NOTHING_TO_PUBLISH') {
      goToStep('Share with guests');
    }
  }

  return (
    <div className={weddingTemplate1Fonts}>
      {contextHolder}

      <header>
        <NavigationBar />
      </header>

      <div className="w-full min-h-screen overflow-x-hidden">
        {/* The same container the site navigation uses, so the breadcrumb and
            the heading line up with the logo above them. */}
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-[20px] py-[30px] pb-[50px] 2xl:max-w-7xl">
          <CreateFlowBreadcrumb />

          <div className="mt-[32px]">
            <h1 className="text-[18px] font-[600] leading-[28px] text-[#1B1B1B]">
              Create Wedding Invitation
            </h1>
            <p className="mt-[4px] text-[14px] font-[400] leading-[24px] text-[#7B7B7B]">
              Create memorable wedding invitation for you &amp; your special
              person’s big day
            </p>
          </div>

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
                <WeddingInvitationForm
                  form={form}
                  openNotification={openNotification}
                />

                <div className={`mt-[40px] ${flowActionRow}`}>
                  {/* A button rather than a link, because the design draws the
                      two actions as a pair and only one of them can be a
                      destination. */}
                  <button
                    type="button"
                    onClick={() => router.push(CHOOSE_TEMPLATE_ROUTE)}
                    className={flowActionBack}>
                    Previous step
                  </button>
                  {/* Dimmed while it is saving, which is a state the design
                      does not draw: a control that cannot be pressed and looks
                      exactly as it did reads as a press that did nothing, and a
                      couple's answer to that is to press it again. The check
                      never sees it, because nothing on a designed screen is
                      mid-save. */}
                  <button
                    type="button"
                    onClick={goOnToGuestInvites}
                    disabled={isSaving}
                    aria-busy={isSaving}
                    className={`${flowActionForward} disabled:opacity-60`}>
                    Next
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
              onChange={setGuestInvites}
              brideNickname={
                brideNickname?.trim() ||
                DEFAULT_WEDDING_TEMPLATE_1_CONTENT.brideName
              }
              groomNickname={
                groomNickname?.trim() ||
                DEFAULT_WEDDING_TEMPLATE_1_CONTENT.groomName
              }
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

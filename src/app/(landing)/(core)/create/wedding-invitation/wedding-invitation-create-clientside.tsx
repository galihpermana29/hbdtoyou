'use client';

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
} from '@/components/forms/wedding/create-flow-treatment';
import GuestInvitesStep from '@/components/forms/wedding/guest-invites-step';
import WeddingInvitationForm from '@/components/forms/wedding/wedding-invitation-form';
import WeddingInvitationPreview from '@/components/forms/wedding/wedding-invitation-preview';
import NavigationBar from '@/components/ui/navbar';
import {
  instrumentSerif,
  luxuriousScript,
  publicSans,
  sometypeMono,
} from '@/components/wedding/wedding-template-1/fonts';
import {
  DEFAULT_GUEST_MESSAGE,
  type GuestInvitesValues,
} from '@/components/forms/wedding/guest-invites-types';
import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  type WeddingInvitationFormValues,
} from '@/components/forms/wedding/wedding-invitation-types';

const fontVars = `${luxuriousScript.variable} ${sometypeMono.variable} ${instrumentSerif.variable} ${publicSans.variable}`;

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
 */
export default function WeddingInvitationCreateClientside() {
  const router = useRouter();
  const { contextHolder, openNotification } = useCreateContent();
  const [form] = useForm<WeddingInvitationFormValues>();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [step, setStep] = useState<CreateFlowStep>(
    'Fill in the details & story'
  );
  const [guestInvites, setGuestInvites] = useState<GuestInvitesValues>({
    slug: '',
    greetingMessage: DEFAULT_GUEST_MESSAGE,
  });

  const brideNickname = useWatch('brideName', form);
  const groomNickname = useWatch('groomName', form);

  const isDetailsAndStory = step === 'Fill in the details & story';

  return (
    <div className={fontVars}>
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
            <div className="relative mt-[40px] flex min-h-[calc(100vh-280px)] flex-1 flex-col gap-[24px] lg:flex-row lg:items-stretch">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`absolute top-1/2 z-[10] hidden -translate-y-1/2 rounded-full border border-[#EDEDED] bg-white p-3 shadow-lg transition-all duration-200 hover:border-[#007AFF] hover:shadow-xl lg:block ${
                  isSidebarCollapsed
                    ? 'left-[20px]'
                    : 'right-[calc(400px+12px)]'
                }`}
                aria-label={
                  isSidebarCollapsed ? 'Expand form' : 'Collapse form'
                }>
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>

              {/* Form - takes remaining width */}
              <div
                className={`flex min-h-0 min-w-0 flex-col rounded-[16px] border border-[#EDEDED] transition-all duration-300 ease-in-out ${
                  isSidebarCollapsed
                    ? 'w-0 max-w-0 overflow-hidden opacity-0 lg:flex-[0]'
                    : 'min-w-0 flex-1 p-[24px] lg:pr-[32px]'
                }`}>
                <div className={isSidebarCollapsed ? 'hidden' : 'block'}>
                  <WeddingInvitationForm
                    form={form}
                    openNotification={openNotification}
                  />
                </div>
              </div>

              {/* Phone simulator - fixed narrow column, centered */}
              <div
                className={`flex min-h-0 flex-col transition-all duration-300 ease-in-out lg:sticky lg:top-[96px] lg:max-h-[calc(100vh-120px)] lg:w-[400px] lg:shrink-0 ${
                  isSidebarCollapsed
                    ? 'w-full flex-1 items-center px-[24px] py-[16px]'
                    : 'w-full items-center px-[16px] py-[16px]'
                }`}>
                <WeddingInvitationPreview form={form} />
              </div>
            </div>

            <div className={`mt-[40px] ${flowActionRow}`}>
              {/* A button rather than a link, because the design draws the two
                  actions as a pair and only one of them can be a destination. */}
              <button
                type="button"
                onClick={() => router.push(CHOOSE_TEMPLATE_ROUTE)}
                className={flowActionBack}>
                Previous step
              </button>
              <button
                type="button"
                onClick={() => setStep('Guest invites details')}
                className={flowActionForward}>
                Next
              </button>
            </div>
          </div>

          <div className={isDetailsAndStory ? 'hidden' : 'mt-[60px]'}>
            <GuestInvitesStep
              isCurrent={!isDetailsAndStory}
              values={guestInvites}
              onChange={setGuestInvites}
              brideNickname={
                brideNickname?.trim() ||
                DEFAULT_WEDDING_TEMPLATE_1_CONTENT.brideName
              }
              groomNickname={
                groomNickname?.trim() ||
                DEFAULT_WEDDING_TEMPLATE_1_CONTENT.groomName
              }
              onPreviousStep={() => setStep('Fill in the details & story')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

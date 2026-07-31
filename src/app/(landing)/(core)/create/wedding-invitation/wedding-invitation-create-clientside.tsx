'use client';

import { useForm } from 'antd/es/form/Form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import CreateFlowBreadcrumb from './create-flow-breadcrumb';
import CreateFlowSteps from './create-flow-steps';
import useCreateContent from '../usecase/useCreateContent';
import WeddingInvitationForm from '@/components/forms/wedding/wedding-invitation-form';
import WeddingInvitationPreview from '@/components/forms/wedding/wedding-invitation-preview';
import NavigationBar from '@/components/ui/navbar';
import {
  instrumentSerif,
  luxuriousScript,
  publicSans,
  sometypeMono,
} from '@/components/wedding/wedding-template-1/fonts';
import type { WeddingInvitationFormValues } from '@/components/forms/wedding/wedding-invitation-types';

const fontVars = `${luxuriousScript.variable} ${sometypeMono.variable} ${instrumentSerif.variable} ${publicSans.variable}`;

export default function WeddingInvitationCreateClientside() {
  const { contextHolder, openNotification } = useCreateContent();
  const [form] = useForm<WeddingInvitationFormValues>();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
            <CreateFlowSteps current="Fill in the details & story" />
          </div>

          <div className="relative mt-[40px] flex min-h-[calc(100vh-280px)] flex-1 flex-col gap-[24px] lg:flex-row lg:items-stretch">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`absolute top-1/2 z-[10] hidden -translate-y-1/2 rounded-full border border-[#EDEDED] bg-white p-3 shadow-lg transition-all duration-200 hover:border-[#007AFF] hover:shadow-xl lg:block ${
                isSidebarCollapsed ? 'left-[20px]' : 'right-[calc(400px+12px)]'
              }`}
              aria-label={isSidebarCollapsed ? 'Expand form' : 'Collapse form'}>
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
                <WeddingInvitationForm form={form} openNotification={openNotification} />
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
        </div>
      </div>
    </div>
  );
}

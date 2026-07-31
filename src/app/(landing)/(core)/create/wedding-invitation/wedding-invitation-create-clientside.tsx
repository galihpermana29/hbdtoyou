'use client';

import { Breadcrumb, Steps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import useCreateContent from '../usecase/useCreateContent';
import WeddingInvitationForm from '@/components/forms/wedding/wedding-invitation-form';
import WeddingInvitationPreview from '@/components/forms/wedding/wedding-invitation-preview';
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
    <div className={`${fontVars} mt-[80px]`}>
      {contextHolder}

      <div className="w-full min-h-screen overflow-x-hidden">
        <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-[20px] py-[30px] pb-[50px]">
          <Breadcrumb
            className="mb-6"
            items={[
              { title: <Link href="/">Home</Link> },
              { title: <Link href="/wedding-invitation">Wedding Invitation</Link> },
              { title: 'Create' },
            ]}
          />

          <div className="mb-8">
            <h1 className="text-[24px] font-[600] text-[#1B1B1B] md:text-[30px]">
              Create your wedding invitation
            </h1>
            <p className="mt-2 max-w-[560px] text-[14px] text-[#7B7B7B]">
              Fill in each section on the left and watch your invitation update live
              in the phone preview.
            </p>
          </div>

          <Steps
            current={1}
            className="mb-8 max-w-[720px]"
            items={[
              { title: 'Template' },
              { title: 'Fill details' },
              { title: 'Publish' },
              { title: 'Share' },
            ]}
          />

          <div className="relative flex min-h-[calc(100vh-280px)] flex-1 flex-col gap-[24px] lg:flex-row lg:items-stretch">
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

            {/* Form — takes remaining width */}
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

            {/* Phone simulator — fixed narrow column, centered */}
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

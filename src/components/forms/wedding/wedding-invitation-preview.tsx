'use client';

import { Eye } from 'lucide-react';
import Link from 'next/link';
import type { FormInstance } from 'antd';
import { Form } from 'antd';

import WeddingInvitationPreviewView from './wedding-invitation-preview-view';
import { formValuesToContent } from './wedding-invitation-types';
import type { WeddingInvitationFormValues } from './wedding-invitation-types';

const PHONE_WIDTH = 375;
const PHONE_FRAME_WIDTH = 390;

export interface WeddingInvitationPreviewProps {
  form: FormInstance<WeddingInvitationFormValues>;
}

export default function WeddingInvitationPreview({
  form,
}: WeddingInvitationPreviewProps) {
  const values = Form.useWatch([], form);
  const content = formValuesToContent(values);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center">
      <div
        className="mb-5 flex w-full shrink-0 items-center justify-between gap-3"
        style={{ maxWidth: PHONE_FRAME_WIDTH }}>
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-[#1B1B1B]" />
          <p className="font-[600] text-[16px] text-[#1B1B1B]">Live Preview</p>
        </div>
        <Link
          href="/wedding-template-1"
          target="_blank"
          className="flex h-9 shrink-0 items-center justify-center rounded-[8px] border border-[#d0d5dd] px-3 font-[600] text-[13px] text-[#1B1B1B]">
          Full Preview
        </Link>
      </div>

      <div
        className="flex min-h-0 w-full flex-1 flex-col items-center justify-center"
        style={{ maxWidth: PHONE_FRAME_WIDTH }}>
        <div
          className="flex min-h-0 w-full flex-1 flex-col rounded-[36px] border-[10px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_24px_48px_rgba(0,0,0,0.18)]"
          style={{ maxWidth: PHONE_FRAME_WIDTH }}>
          <div className="flex h-[28px] shrink-0 items-center justify-center rounded-t-[26px] bg-[#1a1a1a]">
            <div className="h-[5px] w-[72px] rounded-full bg-[#2a2a2a]" />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden rounded-b-[26px] bg-[#090909]">
            <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain">
              <div
                className="mx-auto"
                style={{ width: PHONE_WIDTH, maxWidth: '100%' }}>
                <WeddingInvitationPreviewView content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

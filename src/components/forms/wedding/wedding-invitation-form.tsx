'use client';

import { Form } from 'antd';
import type { FormInstance } from 'antd';

import { useMemoifyProfile } from '@/app/session-provider';
import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import BrideGroomIntroductionSection from '@/components/forms/wedding/bride-groom-introduction-section';
import CoverHeaderSection from '@/components/forms/wedding/cover-header-section';
import GiftRegistrySection from '@/components/forms/wedding/gift-registry-section';
import HolyVerseSection from '@/components/forms/wedding/holy-verse-section';
import LoveStorySection from '@/components/forms/wedding/love-story-section';
import MemoRollSection from '@/components/forms/wedding/memo-roll-section';
import PhotoShowcaseSection from '@/components/forms/wedding/photo-showcase-section';
import VenueDetailsSection from '@/components/forms/wedding/venue-details-section';
import {
  getDefaultFormValues,
  type WeddingInvitationFormValues,
} from '@/components/forms/wedding/wedding-invitation-types';

export interface WeddingInvitationFormProps {
  form: FormInstance<WeddingInvitationFormValues>;
  openNotification?: OpenNotificationFunction;
}

export default function WeddingInvitationForm({
  form,
  openNotification,
}: WeddingInvitationFormProps) {
  const profile = useMemoifyProfile();
  const isFreeAccount = profile?.quota < 1;

  /** The largest file the couple's plan takes, as the uploader enforces it. */
  const maxUploadMb = isFreeAccount ? 1 : 9;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={getDefaultFormValues()}
      requiredMark={false}
      className="wedding-invitation-form">
      {/* The Sections stack 24px apart, and each one opens and closes on its
          own: the design draws several of them open at the same time. */}
      <div className="flex flex-col gap-[24px]">
        <CoverHeaderSection
          maxUploadMb={maxUploadMb}
          openNotification={openNotification}
        />

        <HolyVerseSection />

        <BrideGroomIntroductionSection />

        <LoveStorySection
          maxUploadMb={maxUploadMb}
          openNotification={openNotification}
        />

        <VenueDetailsSection
          maxUploadMb={maxUploadMb}
          openNotification={openNotification}
        />

        <GiftRegistrySection
          maxUploadMb={maxUploadMb}
          openNotification={openNotification}
        />

        <PhotoShowcaseSection
          maxUploadMb={maxUploadMb}
          openNotification={openNotification}
        />

        <MemoRollSection />
      </div>
    </Form>
  );
}

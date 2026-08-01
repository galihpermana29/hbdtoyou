'use client';

import { Form, Input, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useWatch } from 'antd/es/form/Form';
import type { FormInstance } from 'antd';

import { useMemoifyProfile } from '@/app/session-provider';
import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import BrideGroomIntroductionSection from '@/components/forms/wedding/bride-groom-introduction-section';
import CoverHeaderSection from '@/components/forms/wedding/cover-header-section';
import CreateFlowSection from '@/components/forms/wedding/create-flow-section';
import HolyVerseSection from '@/components/forms/wedding/holy-verse-section';
import LoveStorySection from '@/components/forms/wedding/love-story-section';
import VenueDetailsSection from '@/components/forms/wedding/venue-details-section';
import { fieldTreatment } from '@/components/forms/wedding/field-treatment';
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
  const accountType = isFreeAccount ? AccountType.free : AccountType.premium;

  // TODO: align upload limits to Figma caps (love story 12, gallery 5, etc.)
  const multiPhotoLimit = isFreeAccount ? 5 : 20;

  /** The largest file the couple's plan takes, as the uploader enforces it. */
  const maxUploadMb = isFreeAccount ? 1 : 9;

  const photoShareCover = useWatch('photoShareCover', form);
  const galleryPhotos = useWatch('galleryPhotos', form);
  const tokenPhoto = useWatch('tokenPhoto', form);

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

        <CreateFlowSection
          name="Photo Share"
          description="Guest disposable-camera card.">
          <Form.Item name="photoShareCover" label="Card cover image">
            <DraggerUpload
              profileImageURL={photoShareCover}
              form={form}
              formItemName="photoShareCover"
              type={accountType}
              limit={1}
              openNotification={openNotification}
            />
          </Form.Item>
          <Form.Item name="photoShareUrl" label="Photo share link (optional)">
            <Input
              size="large"
              className={fieldTreatment}
              placeholder="https://..."
            />
          </Form.Item>
        </CreateFlowSection>

        <CreateFlowSection name="Gallery" description="Up to 5 gallery photos.">
          <Form.Item name="galleryPhotos" label="Gallery photos">
            <DraggerUpload
              profileImageURL={galleryPhotos}
              form={form}
              formItemName="galleryPhotos"
              type={accountType}
              multiple
              limit={multiPhotoLimit}
              openNotification={openNotification}
            />
          </Form.Item>
        </CreateFlowSection>

        <CreateFlowSection
          name="Token of Love"
          description="Gift message and bank details.">
          <Form.Item name="tokenMessage" label="Message">
            <TextArea
              rows={4}
              className={fieldTreatment}
              placeholder="Message for guests..."
            />
          </Form.Item>
          <Form.Item name="tokenPhoto" label="Token photo">
            <DraggerUpload
              profileImageURL={tokenPhoto}
              form={form}
              formItemName="tokenPhoto"
              type={accountType}
              limit={1}
              openNotification={openNotification}
            />
          </Form.Item>
          <Form.Item name="accountHolder" label="Account holder">
            <Input
              size="large"
              className={fieldTreatment}
              placeholder="Name (Bank)"
            />
          </Form.Item>
          <Form.Item name="accountNumber" label="Account number">
            <Input
              size="large"
              className={fieldTreatment}
              placeholder="0000 0000 0000"
            />
          </Form.Item>
        </CreateFlowSection>

        <CreateFlowSection
          name="Guest Messages"
          description="Show or hide the wishes section.">
          <Form.Item
            name="guestMessagesEnabled"
            label="Enable guest messages"
            valuePropName="checked">
            <Switch />
          </Form.Item>
        </CreateFlowSection>
      </div>
    </Form>
  );
}

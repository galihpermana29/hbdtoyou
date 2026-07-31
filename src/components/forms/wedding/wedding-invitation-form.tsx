'use client';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Switch, TimePicker } from 'antd';
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
import { fieldTreatment } from '@/components/forms/wedding/field-treatment';
import {
  getDefaultFormValues,
  type WeddingInvitationFormValues,
} from '@/components/forms/wedding/wedding-invitation-types';

/**
 * A field whose label carries a line of guidance under it.
 *
 * Two spans rather than a heading and a paragraph: this is the label on one
 * field, and a heading here would join the Sections' own headings in document
 * order and make "the fourth Section" mean something else.
 */
function fieldLabel(title: string, description?: string) {
  return (
    <span className="flex flex-col">
      <span className="text-[15px] font-semibold text-[#1B1B1B]">{title}</span>
      {description ? (
        <span className="text-[13px] font-normal text-[#7B7B7B]">
          {description}
        </span>
      ) : null}
    </span>
  );
}

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

  const loveStoryPhotos = useWatch('loveStoryPhotos', form);
  const polaroidPhoto = useWatch('polaroidPhoto', form);
  const mapPhoto = useWatch('mapPhoto', form);
  const loveStoryVideo = useWatch('loveStoryVideo', form);
  const eventPhotos = useWatch('eventPhotos', form);
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

        <CreateFlowSection
          name="Love Story"
          description="Photos, milestones, polaroid, map, and video.">
          <Form.Item
            name="loveStoryPhotos"
            label={fieldLabel(
              'Story photos',
              'Film strip photos (up to 12 in design).'
            )}>
            <DraggerUpload
              profileImageURL={loveStoryPhotos}
              form={form}
              formItemName="loveStoryPhotos"
              type={accountType}
              multiple
              limit={multiPhotoLimit}
              openNotification={openNotification}
            />
          </Form.Item>
          <Form.List name="milestones">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-4">
                <p className="text-[14px] font-semibold text-[#1B1B1B]">
                  Milestones
                </p>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="relative rounded-[8px] border border-[#EDEDED] p-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'year']}
                      label="Year"
                      className="mb-3">
                      <Input
                        size="large"
                        className={fieldTreatment}
                        placeholder="2020"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Title"
                      className="mb-3">
                      <Input
                        size="large"
                        className={fieldTreatment}
                        placeholder="The meeting"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'body']}
                      label="Story"
                      className="mb-0">
                      <TextArea
                        rows={3}
                        className={fieldTreatment}
                        placeholder="Tell this chapter..."
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(name)}
                        className="absolute right-3 top-3 text-[#7B7B7B]">
                        <MinusCircleOutlined />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ year: '', title: '', body: '' })}
                  icon={<PlusOutlined />}
                  className="w-full">
                  Add milestone
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item
            name="polaroidPhoto"
            label="Polaroid photo"
            className="mt-4">
            <DraggerUpload
              profileImageURL={polaroidPhoto}
              form={form}
              formItemName="polaroidPhoto"
              type={accountType}
              limit={1}
              openNotification={openNotification}
            />
          </Form.Item>
          <Form.Item name="mapPhoto" label="Map keepsake photo">
            <DraggerUpload
              profileImageURL={mapPhoto}
              form={form}
              formItemName="mapPhoto"
              type={accountType}
              limit={1}
              openNotification={openNotification}
            />
          </Form.Item>
          <Form.Item name="loveStoryVideo" label="Love story video (optional)">
            <DraggerUpload
              profileImageURL={loveStoryVideo}
              form={form}
              formItemName="loveStoryVideo"
              type={accountType}
              limit={1}
              openNotification={openNotification}
              acceptTypes=".mp4"
              allowedMimeTypes={['video/mp4']}
            />
          </Form.Item>
        </CreateFlowSection>

        <CreateFlowSection
          name="Event Details"
          description="Schedule, address, dress code, and polaroid.">
          <Form.Item name="eventPhotos" label="Event polaroid photo">
            <DraggerUpload
              profileImageURL={eventPhotos}
              form={form}
              formItemName="eventPhotos"
              type={accountType}
              multiple
              limit={multiPhotoLimit}
              openNotification={openNotification}
            />
          </Form.Item>
          <Form.Item name="eventStartTime" label="Start time">
            <TimePicker
              size="large"
              className={`w-full ${fieldTreatment}`}
              format="HH:mm"
            />
          </Form.Item>
          <Form.Item name="eventEndTime" label="End time">
            <TimePicker
              size="large"
              className={`w-full ${fieldTreatment}`}
              format="HH:mm"
            />
          </Form.Item>
          {/* The venue's name is asked for once, in the Cover Header,
                  where the design puts it. */}
          <Form.Item name="address" label="Address">
            <TextArea
              rows={3}
              className={fieldTreatment}
              placeholder="Full venue address"
            />
          </Form.Item>
          <Form.Item name="mapsUrl" label="Google Maps link (optional)">
            <Input
              size="large"
              className={fieldTreatment}
              placeholder="https://maps.google.com/..."
            />
          </Form.Item>
          <Form.Item name="dressCode" label="Dress code">
            <Input
              size="large"
              className={fieldTreatment}
              placeholder="Black, white, or both"
            />
          </Form.Item>
        </CreateFlowSection>

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

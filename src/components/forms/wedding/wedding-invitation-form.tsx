'use client';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  TimePicker,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useWatch } from 'antd/es/form/Form';
import type { FormInstance } from 'antd';

import { useMemoifyProfile } from '@/app/session-provider';
import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import DraggerUpload, { AccountType } from '@/components/ui/uploader/uploader';
import { fieldTreatment } from '@/components/forms/wedding/field-treatment';
import {
  DUMMY_BACKGROUND_MUSIC_OPTIONS,
  getDefaultFormValues,
  type WeddingInvitationFormValues,
} from '@/components/forms/wedding/wedding-invitation-types';

function sectionLabel(title: string, description?: string) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-[#1B1B1B]">{title}</h3>
      {description ? (
        <p className="text-[13px] font-normal text-[#7B7B7B]">{description}</p>
      ) : null}
    </div>
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

  // TODO: align upload limits to Figma caps (hero 5, love story 12, gallery 5, etc.)
  const multiPhotoLimit = isFreeAccount ? 5 : 20;

  const heroPhotos = useWatch('heroPhotos', form);
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
      <Collapse
        accordion
        defaultActiveKey={['hero']}
        expandIconPosition="end"
        className="border-none bg-transparent"
        items={[
          {
            key: 'hero',
            label: sectionLabel(
              'Hero',
              'Couple photo, names, wedding date, and background music.'
            ),
            children: (
              <>
                <Form.Item
                  name="heroPhotos"
                  label={sectionLabel('Couple photos', 'Up to 5 photos for the hero envelope.')}>
                  <DraggerUpload
                    profileImageURL={heroPhotos}
                    form={form}
                    formItemName="heroPhotos"
                    type={accountType}
                    multiple
                    limit={multiPhotoLimit}
                    openNotification={openNotification}
                  />
                </Form.Item>
                <Form.Item
                  name="groomName"
                  label="Groom name (short)"
                  rules={[{ required: true, message: 'Please enter groom name' }]}>
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Elias"
                  />
                </Form.Item>
                <Form.Item
                  name="brideName"
                  label="Bride name (short)"
                  rules={[{ required: true, message: 'Please enter bride name' }]}>
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Freya"
                  />
                </Form.Item>
                <Form.Item name="weddingDate" label="Wedding date">
                  <DatePicker
                    size="large"
                    className={`w-full ${fieldTreatment}`}
                    format="DD MMMM YYYY"
                  />
                </Form.Item>
                <Form.Item name="backgroundMusic" label="Background music">
                  <Select
                    size="large"
                    className={fieldTreatment}
                    options={DUMMY_BACKGROUND_MUSIC_OPTIONS}
                    placeholder="Select a song"
                  />
                </Form.Item>
              </>
            ),
          },
          {
            key: 'verse',
            label: sectionLabel('Holy Verse', 'Opening verse and citation.'),
            children: (
              <>
                <Form.Item name="verseText" label="Verse text">
                  <TextArea
                    rows={5}
                    className={fieldTreatment}
                    placeholder="Enter the holy verse..."
                  />
                </Form.Item>
                <Form.Item name="verseCitation" label="Citation">
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Q.S Ar-Rum : 21"
                  />
                </Form.Item>
              </>
            ),
          },
          {
            key: 'bridegroom',
            label: sectionLabel(
              'Bride & Groom',
              'Full names and parents. Short names come from Hero.'
            ),
            children: (
              <>
                <Form.Item name="groomFullName" label="Groom full name">
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Elias Frank Simanjuntak"
                  />
                </Form.Item>
                <Form.Item name="groomParents" label="Groom parents">
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Frank & Esther"
                  />
                </Form.Item>
                <Form.Item name="brideFullName" label="Bride full name">
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Freya Putri Magellan"
                  />
                </Form.Item>
                <Form.Item name="brideParents" label="Bride parents">
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Ferdinand & Tuti"
                  />
                </Form.Item>
              </>
            ),
          },
          {
            key: 'lovestory',
            label: sectionLabel('Love Story', 'Photos, milestones, polaroid, map, and video.'),
            children: (
              <>
                <Form.Item
                  name="loveStoryPhotos"
                  label={sectionLabel('Story photos', 'Film strip photos (up to 12 in design).')}>
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
                      <p className="text-[14px] font-semibold text-[#1B1B1B]">Milestones</p>
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
                <Form.Item name="polaroidPhoto" label="Polaroid photo" className="mt-4">
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
              </>
            ),
          },
          {
            key: 'event',
            label: sectionLabel('Event Details', 'Venue, schedule, dress code, and polaroid.'),
            children: (
              <>
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
                <Form.Item name="venueName" label="Venue name">
                  <Input
                    size="large"
                    className={fieldTreatment}
                    placeholder="Mandarin Hotel, Jakarta"
                  />
                </Form.Item>
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
              </>
            ),
          },
          {
            key: 'photoshare',
            label: sectionLabel('Photo Share', 'Guest disposable-camera card.'),
            children: (
              <>
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
              </>
            ),
          },
          {
            key: 'gallery',
            label: sectionLabel('Gallery', 'Up to 5 gallery photos.'),
            children: (
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
            ),
          },
          {
            key: 'token',
            label: sectionLabel('Token of Love', 'Gift message and bank details.'),
            children: (
              <>
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
              </>
            ),
          },
          {
            key: 'messages',
            label: sectionLabel('Guest Messages', 'Show or hide the wishes section.'),
            children: (
              <Form.Item
                name="guestMessagesEnabled"
                label="Enable guest messages"
                valuePropName="checked">
                <Switch />
              </Form.Item>
            ),
          },
        ]}
      />
    </Form>
  );
}

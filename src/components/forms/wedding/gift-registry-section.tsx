'use client';

import { Form } from 'antd';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import { flowFieldStack } from './create-flow-treatment';
import FlowChoiceField from './flow-choice-field';
import FlowSwitch from './flow-switch';
import FlowTextField from './flow-text-field';
import PhotoDropZone from './photo-drop-zone';
import { BANK_PROVIDER_OPTIONS } from './wedding-invitation-types';

/**
 * The sixth Section of the details-and-story step: where a gift can be sent.
 *
 * The provider is asked for on its own rather than written into the account
 * holder's name, the same way a bride's father and mother are two fields rather
 * than one line. Two answers are two answers, and the invitation is where they
 * are joined for display.
 *
 * The design draws no field for the message printed above the account, though
 * the invitation prints one, so it shows the sample's until a design exists for
 * it. Filed as `hbd-byb.22` rather than answered by inventing a field.
 *
 * Whether the block appears at all is the couple's, and the switch that says so
 * sits in the header rather than among the fields: asking for a gift is a
 * decision about the whole block, and a couple who has decided against one
 * should not have to open the Section and read five questions to say so.
 */

/** How many photos the design says this Section takes. */
const GIFT_PHOTO_LIMIT = 1;

/** What the design calls this Section, which is what its switch is named for. */
const NAME = 'Gift Registry';

export interface GiftRegistrySectionProps {
  /** The largest file the couple's plan allows, in megabytes. */
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
}

export default function GiftRegistrySection({
  maxUploadMb,
  openNotification,
}: GiftRegistrySectionProps) {
  return (
    <CreateFlowSection
      name={NAME}
      description="Include Bank Account/e-Wallet Information for gift collection"
      headerSwitch={
        <Form.Item name="digitalGiftEnabled" noStyle>
          <FlowSwitch label={NAME} />
        </Form.Item>
      }>
      <div className={flowFieldStack}>
        <Form.Item name="tokenPhoto" noStyle>
          <PhotoDropZone
            label="Gift Section Photo"
            limit={GIFT_PHOTO_LIMIT}
            hint="We recommend to add more than 3 images in the ratio of 4:3 for more interactivity"
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        {/* The words printed above the account on the invitation. */}
        <Form.Item name="tokenMessage" noStyle>
          <FlowTextField
            label="Gift Headline"
            placeholder="Your presence is the greatest gift of all"
          />
        </Form.Item>

        <Form.Item name="bankProvider" noStyle>
          <FlowChoiceField
            label="Bank/e-Wallet Provider"
            placeholder="BRI"
            options={BANK_PROVIDER_OPTIONS}
          />
        </Form.Item>

        <Form.Item name="accountNumber" noStyle>
          <FlowTextField label="Account Number" placeholder="3331 0908 1766" />
        </Form.Item>

        <Form.Item name="accountHolder" noStyle>
          <FlowTextField
            label="Account Holder Name"
            placeholder="Elias Frank Simajuntak"
          />
        </Form.Item>
      </div>
    </CreateFlowSection>
  );
}

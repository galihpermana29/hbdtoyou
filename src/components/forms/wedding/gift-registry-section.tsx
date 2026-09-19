'use client';

import { Form } from 'antd';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import { useFlowCopy } from './flow-language';
import { requiredPhotos, requiredText } from './required-fields';
import { flowFieldStack } from './create-flow-treatment';
import FlowChoiceField from './flow-choice-field';
import { useEffect, useRef } from 'react';

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
const GIFT_PHOTO_LIMIT = 3;

/** What the design calls this Section, which is what its switch is named for. */

export interface GiftRegistrySectionProps {
  /** The largest file the couple's plan allows, in megabytes. */
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
  /** Raised by a refused Next, to show the couple what is missing. */
  openIt?: boolean;
}

export default function GiftRegistrySection({
  maxUploadMb,
  openNotification,
  openIt,
}: GiftRegistrySectionProps) {
  const copy = useFlowCopy();
  const form = Form.useFormInstance();
  const isOn = Form.useWatch('digitalGiftEnabled', form);

  /**
   * Empty the Section when its switch goes off.
   *
   * Watched rather than handled on the control, because `Form.Item` injects its
   * own `onChange` into the child and would overwrite one passed beside it -
   * the clearing would simply never run, silently, which is the worst way for
   * this particular thing to fail.
   *
   * The switch answers "does this block appear on the invitation", and turning
   * it off decides the account details are not part of this wedding. Keeping
   * them would leave a couple who turned the block off with their bank account
   * still stored under their invitation; the whole invitation is sent on every
   * save rather than a diff, so the next save clears them on the backend too.
   *
   * Nothing is restored by turning it back on. That is the cost of the
   * decision, and it was taken deliberately.
   */
  const wasOn = useRef(isOn);
  useEffect(() => {
    if (wasOn.current && isOn === false) {
      form.setFieldsValue({
        tokenPhoto: [],
        tokenMessage: '',
        bankProvider: '',
        accountNumber: '',
        accountHolder: '',
      });
    }
    wasOn.current = isOn;
  }, [isOn, form]);
  return (
    <CreateFlowSection
      openIt={openIt}
      name={copy.giftRegistryName}
      description={copy.giftRegistryDescription}
      headerSwitch={
        <Form.Item name="digitalGiftEnabled" noStyle>
          <FlowSwitch label={copy.giftRegistryName} />
        </Form.Item>
      }>
      <div className={flowFieldStack}>
        <Form.Item
          name="tokenPhoto"
          className="!mb-0"
          rules={isOn ? requiredPhotos(copy, 'giftSectionPhoto', 3) : []}>
          <PhotoDropZone
            required={isOn}
            label={copy.giftSectionPhoto}
            limit={GIFT_PHOTO_LIMIT}
            ratio="ratioStandard"
            atLeast={3}
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        {/* The words printed above the account on the invitation. */}
        <Form.Item
          name="tokenMessage"
          className="!mb-0"
          rules={isOn ? requiredText(copy, 'giftHeadline') : []}>
          <FlowTextField
            required={isOn}
            label={copy.giftHeadline}
            placeholder="Your presence is the greatest gift of all"
          />
        </Form.Item>

        <Form.Item
          name="bankProvider"
          className="!mb-0"
          rules={isOn ? requiredText(copy, 'bankProvider') : []}>
          <FlowChoiceField
            required={isOn}
            label={copy.bankProvider}
            placeholder="BRI"
            options={BANK_PROVIDER_OPTIONS}
          />
        </Form.Item>

        <Form.Item
          name="accountNumber"
          className="!mb-0"
          rules={isOn ? requiredText(copy, 'accountNumber') : []}>
          <FlowTextField
            required={isOn}
            label={copy.accountNumber}
            placeholder="3331 0908 1766"
          />
        </Form.Item>

        <Form.Item
          name="accountHolder"
          className="!mb-0"
          rules={isOn ? requiredText(copy, 'accountHolderName') : []}>
          <FlowTextField
            required={isOn}
            label={copy.accountHolderName}
            placeholder="Elias Frank Simajuntak"
          />
        </Form.Item>
      </div>
    </CreateFlowSection>
  );
}

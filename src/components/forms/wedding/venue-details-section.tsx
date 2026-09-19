'use client';

import { Form } from 'antd';
import { Clock } from 'lucide-react';
import { useId } from 'react';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import { useFlowCopy } from './flow-language';
import {
  requiredMapEmbed,
  requiredPhotos,
  requiredText,
} from './required-fields';
import { mapEmbedFrom } from './wedding-map';
import {
  flowFieldParts,
  flowFieldRange,
  flowFieldStack,
  flowLabel,
} from './create-flow-treatment';
import FlowMarkedField from './flow-marked-field';
import FlowTextField from './flow-text-field';
import PhotoDropZone from './photo-drop-zone';
import WeddingLocationField from './wedding-location-field';

/**
 * The fifth Section of the details-and-story step: where the wedding is and
 * when it starts.
 *
 * The design asks for three things here and no more. There is no field for the
 * street address and none for the dress code, though the invitation prints
 * both, so both show the sample's until a design exists for them - filed as its
 * own issue rather than answered by adding fields the design does not draw.
 *
 * The reception's start and its end share one label, because they are two
 * halves of one answer rather than two answers. That is a group with a name
 * rather than two labelled fields, which is also what the design draws: one
 * caption above a pair of boxes that say only Start and End.
 */

/** How many photos the design says this Section takes. */
const VENUE_PHOTO_LIMIT = 5;

/**
 * A time of day, as far as one can be typed.
 *
 * Digits only, a colon put in where it belongs, and neither half allowed past
 * what a clock has: 23 hours and 59 minutes. A couple therefore cannot leave a
 * reception starting at 45:70, and the field needs no way to tell them off for
 * one.
 */
function asTime(typed: string): string {
  const digits = typed.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;

  const hour = Math.min(Number(digits.slice(0, 2)), 23);
  const minutes = digits.slice(2);
  const minute =
    minutes.length === 2 ? String(Math.min(Number(minutes), 59)) : minutes;
  return `${String(hour).padStart(2, '0')}:${minute.padStart(minutes.length, '0')}`;
}

/**
 * The same time once a couple has left the field, finished.
 *
 * "19" is an hour with its minutes still to come and "19:3" is half past
 * something, and neither is a time the invitation can print. The digits are
 * read the way they were typed - hours first, then the tens of the minutes -
 * so both finish as the couple was plainly heading: 19:00 and 19:30. An hour
 * that could only ever have been out of range, like 95, comes back to 23.
 */
function completeTime(typed: string): string {
  const digits = typed.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';
  const hour = digits.length === 1 ? `0${digits}` : digits.slice(0, 2);
  const minute = digits.length <= 2 ? '00' : digits.slice(2).padEnd(2, '0');
  return asTime(`${hour}${minute}`);
}

export interface VenueDetailsSectionProps {
  /** The largest photo the couple's plan allows, in megabytes. */
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
  /** Raised by a refused Next, to show the couple what is missing. */
  openIt?: boolean;
}

export default function VenueDetailsSection({
  maxUploadMb,
  openNotification,
  openIt,
}: VenueDetailsSectionProps) {
  const receptionTimeId = useId();
  const copy = useFlowCopy();

  return (
    <CreateFlowSection
      openIt={openIt}
      name={copy.venueDetailsName}
      description={copy.venueDetailsDescription}>
      <div className={flowFieldStack}>
        <Form.Item
          name="eventPhotos"
          className="!mb-0"
          rules={requiredPhotos(copy, 'venuePhotos', 1)}>
          <PhotoDropZone
            required
            label={copy.venuePhotos}
            limit={VENUE_PHOTO_LIMIT}
            ratio="ratioWide"
            atLeast={1}
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        <div
          role="group"
          aria-labelledby={receptionTimeId}
          className={flowFieldParts}>
          <p id={receptionTimeId} className={flowLabel}>
            {copy.receptionTime}
          </p>
          <div className={flowFieldRange}>
            <Form.Item
              name="eventStartTime"
              className="!mb-0"
              rules={requiredText(copy, 'receptionStart')}>
              <FlowMarkedField
                required
                name={copy.receptionStart}
                mark={<Clock size={20} aria-hidden="true" />}
                placeholder={copy.receptionStart}
                format={asTime}
                complete={completeTime}
                inputMode="numeric"
              />
            </Form.Item>
            <Form.Item
              name="eventEndTime"
              className="!mb-0"
              rules={requiredText(copy, 'receptionEnd')}>
              <FlowMarkedField
                required
                name={copy.receptionEnd}
                mark={<Clock size={20} aria-hidden="true" />}
                placeholder={copy.receptionEnd}
                format={asTime}
                complete={completeTime}
                inputMode="numeric"
              />
            </Form.Item>
          </div>
        </div>

        {/* The address the invitation prints. The location link below it is
            for directions; a guest still needs somewhere written down. */}
        <Form.Item
          name="address"
          className="!mb-0"
          rules={requiredText(copy, 'weddingAddress')}>
          <FlowTextField
            required
            label={copy.weddingAddress}
            placeholder="Jl. Imam Bonjol, Menteng"
          />
        </Form.Item>

        <Form.Item
          name="mapsUrl"
          className="!mb-0"
          rules={requiredMapEmbed(
            copy,
            (value) => mapEmbedFrom(value) !== null
          )}>
          <WeddingLocationField required />
        </Form.Item>
      </div>
    </CreateFlowSection>
  );
}

'use client';

import { DatePicker, Form, Select } from 'antd';
import { Calendar, Music } from 'lucide-react';
import { useId } from 'react';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import {
  flowFieldPair,
  flowFieldParts,
  flowFieldStack,
  flowHint,
  flowLabel,
} from './create-flow-treatment';
import { fieldTreatment } from './field-treatment';
import FlowSwitch from './flow-switch';
import FlowTextField from './flow-text-field';
import { useFlowCopy } from './flow-language';
import {
  requiredPhotos,
  requiredText,
  requiredValue,
} from './required-fields';
import PhotoDropZone from './photo-drop-zone';
import { BACKGROUND_TRACK_OPTIONS } from './background-track-catalog';

/**
 * The first Section of the details-and-story step: what a guest sees when the
 * invitation opens.
 *
 * Every word here is the design's, including "Wedding Place Name" for the venue
 * and the run-on line under Background Track: the design is literal truth, see
 * `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * The design draws every field of this Section empty, with grey placeholder
 * text, so the form starts empty too and the placeholders are the design's own
 * examples. The Site Preview is not left blank by that - it falls back to the
 * sample invitation for anything the couple has not answered yet.
 *
 * The two nicknames sit side by side because the design pairs them, bride
 * first. Everything else takes the full width of the card.
 */

/** How many photos the design says the cover takes. */
const COUPLES_PHOTO_LIMIT = 1;

export interface CoverHeaderSectionProps {
  /** The largest file the couple's plan allows, in megabytes. */
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
  /** Raised by a refused Next, to show the couple what is missing. */
  openIt?: boolean;
}

export default function CoverHeaderSection({
  maxUploadMb,
  openNotification,
  openIt,
}: CoverHeaderSectionProps) {
  const weddingDateId = useId();
  const backgroundTrackId = useId();
  const copy = useFlowCopy();

  return (
    <CreateFlowSection
      openIt={openIt}
      name={copy.coverHeaderName}
      description={copy.coverHeaderDescription}
      defaultOpen>
      <div className={flowFieldStack}>
        <Form.Item
          name="heroPhotos"
          className="!mb-0"
          rules={requiredPhotos(copy, 'couplesPhotos', 1)}>
          <PhotoDropZone
            required
            label={copy.couplesPhotos}
            limit={COUPLES_PHOTO_LIMIT}
            ratio="ratioWide"
            atLeast={1}
            maxSizeMb={maxUploadMb}
            openNotification={openNotification}
          />
        </Form.Item>

        <div className={flowFieldPair}>
          <Form.Item
          name="brideName"
          className="!mb-0"
          rules={requiredText(copy, 'brideNickname')}>
            <FlowTextField
            required label={copy.brideNickname} placeholder="Freya" />
          </Form.Item>
          <Form.Item
          name="groomName"
          className="!mb-0"
          rules={requiredText(copy, 'groomNickname')}>
            <FlowTextField
            required label={copy.groomNickname} placeholder="Elias" />
          </Form.Item>
        </div>

        <Form.Item
          name="venueName"
          className="!mb-0"
          rules={requiredText(copy, 'weddingPlaceName')}>
          <FlowTextField
            required
            label={copy.weddingPlaceName}
            placeholder="MANDARIN HOTEL, JAKARTA"
          />
        </Form.Item>

        <div className={flowFieldParts}>
          <label
            htmlFor={weddingDateId}
            className={`${flowLabel} wedding-required-label`}>
            {copy.weddingDate}
          </label>
          {/* A picker rather than a typed date, so a day that does not exist
              cannot be entered. The design puts the calendar mark before the
              date rather than after it, which is what `prefix` is for. */}
          <Form.Item
          name="weddingDate"
          className="!mb-0"
          rules={requiredValue(copy, 'weddingDate')}>
            <DatePicker
              id={weddingDateId}
              size="large"
              format="DD/MM/YYYY"
              placeholder="03/05/2026"
              prefix={<Calendar size={20} aria-hidden="true" />}
              suffixIcon={null}
              className={`w-full ${fieldTreatment}`}
            />
          </Form.Item>
        </div>

        <div className={flowFieldParts}>
          {/* The only field of this Section a couple may leave off the
              invitation entirely, so its switch sits on the label's own line,
              in the shape MemoRoll's is drawn in. See
              `docs/adr/0002-figma-is-literal-truth.md`. */}
          <div className="flex items-center justify-between gap-[12px]">
            <label htmlFor={backgroundTrackId} className={flowLabel}>
              {copy.backgroundTrack}
            </label>
            <Form.Item name="songRequestEnabled" noStyle>
              <FlowSwitch label={copy.backgroundTrack} />
            </Form.Item>
          </div>
          <p className={flowHint}>
            Add a backtrack that represent you &amp; your partner story or
            something that you both shared
          </p>
          {/* Searched by artist or by song, as the design's placeholder says,
              against the tracks the product currently offers. */}
          <Form.Item name="backgroundTrack" noStyle>
            <Select
              id={backgroundTrackId}
              size="large"
              showSearch
              optionFilterProp="label"
              placeholder={copy.backgroundTrackPlaceholder}
              options={BACKGROUND_TRACK_OPTIONS}
              prefix={<Music size={20} aria-hidden="true" />}
              suffixIcon={null}
              className={`w-full ${fieldTreatment}`}
            />
          </Form.Item>
        </div>
      </div>
    </CreateFlowSection>
  );
}

'use client';

import { Form } from 'antd';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import PhotoDropZone from './photo-drop-zone';

/**
 * The seventh Section of the details-and-story step: the collage of photos the
 * invitation ends on.
 *
 * One field, which is all the design draws.
 *
 * It takes twenty photos for every couple, where the form previously took five
 * on the free plan and twenty on a paid one. The design writes one number into
 * the prompt a couple reads - "up to 20 images" - and draws no second version
 * of this Section for a free account, so enforcing five behind that sentence
 * would make the design's own words untrue for the couples it was shown to. The
 * plan still decides how large each file may be, which is the limit the
 * uploader actually enforces.
 *
 * The invitation lays out five of the twenty and drops the rest without saying
 * so, which is `hbd-byb.24`.
 */

/** How many photos the design says this Section takes. */
const PHOTO_GALLERY_LIMIT = 20;

export interface PhotoCollectionSectionProps {
  /** The largest file the couple's plan allows, in megabytes. */
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
}

export default function PhotoCollectionSection({
  maxUploadMb,
  openNotification,
}: PhotoCollectionSectionProps) {
  return (
    <CreateFlowSection
      name="Photo Collection"
      description="Showcase all your pre-wedding photos">
      <Form.Item name="galleryPhotos" noStyle>
        <PhotoDropZone
          label="Photo Gallery"
          limit={PHOTO_GALLERY_LIMIT}
          hint="We recommend to add more than 5 images in the ratio of 4:3 for more interactivity"
          maxSizeMb={maxUploadMb}
          openNotification={openNotification}
        />
      </Form.Item>
    </CreateFlowSection>
  );
}

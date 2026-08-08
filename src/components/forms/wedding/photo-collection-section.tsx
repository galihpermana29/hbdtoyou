'use client';

import { Form } from 'antd';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import CreateFlowSection from './create-flow-section';
import { useFlowCopy } from './flow-language';
import { requiredPhotos } from './required-fields';
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
 * The invitation used to lay out five of the twenty and drop the rest without
 * saying so, which was `hbd-byb.24`. It now prints every photograph the couple
 * adds, in masonry, and this Section asks for a number the invitation can
 * actually show.
 */

/**
 * How many photographs this Section takes, at least and at most.
 *
 * Fifteen rather than the design's twenty, and never fewer than five. Both are
 * stated here because the guidance a couple reads is built from them. The
 * invitation lays these out in two columns that grow with the count, so both
 * ends are about what the page reads like: fewer than five leaves a section
 * that barely exists, and beyond fifteen a guest is scrolling through somebody
 * else's album looking for the end of the invitation.
 */
const PHOTO_GALLERY_MINIMUM = 5;
const PHOTO_GALLERY_LIMIT = 15;

export interface PhotoCollectionSectionProps {
  /** The largest file the couple's plan allows, in megabytes. */
  maxUploadMb: number;
  openNotification?: OpenNotificationFunction;
  /** Raised by a refused Next, to show the couple what is missing. */
  openIt?: boolean;
}

export default function PhotoCollectionSection({
  maxUploadMb,
  openNotification,
  openIt,
}: PhotoCollectionSectionProps) {
  const copy = useFlowCopy();
  return (
    <CreateFlowSection
      openIt={openIt}
      name={copy.photoCollectionName}
      description={copy.photoCollectionDescription}>
      <Form.Item
          name="galleryPhotos"
          className="!mb-0"
          rules={requiredPhotos(copy, 'photoGallery', 5)}>
        <PhotoDropZone
            required
          label={copy.photoGallery}
          limit={PHOTO_GALLERY_LIMIT}
          ratio="ratioStandard"
          atLeast={PHOTO_GALLERY_MINIMUM}
          maxSizeMb={maxUploadMb}
          openNotification={openNotification}
        />
      </Form.Item>
    </CreateFlowSection>
  );
}

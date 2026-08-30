'use client';

import { X } from 'lucide-react';
import { useId, useRef, useState } from 'react';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import FlowFileField, { uploadFile } from './flow-file-field';

/**
 * The area the design hands a couple to add their wedding teaser.
 *
 * It is the photo area's twin in shape and its opposite in arithmetic: one file
 * rather than a gallery, so there is no room to run out of and no order to
 * keep. Choosing a second video replaces the first, which is what a couple
 * means by choosing another one.
 *
 * The size the design states is the size enforced. It is not the couple's plan
 * limit, which governs photos: the design writes 15MB under this field and
 * nowhere else, and a teaser refused for being 2MB would contradict the words
 * directly beneath it.
 */

/** What the design says a couple may add here, and what the backend accepts. */
const ACCEPTED_TYPE = '.mp4';
const ACCEPTED_MIME_TYPE = 'video/mp4';

/** The largest teaser the design takes, in megabytes. */
/**
 * The number the design writes under this field, and the number enforced.
 *
 * Smaller than the 50MB the backend takes, deliberately: a teaser is a minute
 * of film and a guest opens an invitation on a phone. The words under the field
 * are printed from this constant, so what a couple is told and what they are
 * held to cannot disagree.
 */
const MAX_SIZE_MB = 15;

export interface VideoDropZoneProps {
  /** The words above the area, as the design writes them. */
  label: string;
  /** Whether the invitation cannot go out without one. */
  required?: boolean;
  /**
   * The field's identifier, supplied by `Form.Item` from the field's name.
   */
  id?: string;
  value?: string;
  onChange?: (video: string) => void;
  openNotification?: OpenNotificationFunction;
}

export default function VideoDropZone({
  label,
  required,
  id,
  value,
  onChange,
  openNotification,
}: VideoDropZoneProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;

  const [isUploading, setIsUploading] = useState(false);
  // What was wrong with the last file chosen, so a video that cannot be added
  // says why instead of appearing to do nothing.
  const [problem, setProblem] = useState<string | null>(null);

  const video = value ?? '';

  /**
   * The upload this field is waiting on.
   *
   * A couple can choose a second video while the first is still going, and both
   * would finish by writing the field. The later choice is the one they meant,
   * so an upload that is no longer the current one throws its result away
   * rather than putting an older video over a newer one.
   */
  const uploadRef = useRef(0);

  /** Why this file cannot be added, or null when it can. */
  function refuse(file: File): string | null {
    if (file.type !== ACCEPTED_MIME_TYPE) {
      return `${file.name} is not ${ACCEPTED_TYPE}`;
    }
    // Greater than rather than at least: the words under the field say 15MB is
    // the largest a teaser may be, so one that is exactly that is allowed.
    if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
      return `${file.name} is larger than ${MAX_SIZE_MB}MB`;
    }
    return null;
  }

  /** Add the video a couple chose, in place of whatever was there. */
  async function add(chosen: File[]) {
    const file = chosen[0];
    const reason = refuse(file);
    if (reason) {
      setProblem(reason);
      return;
    }

    const upload = uploadRef.current + 1;
    uploadRef.current = upload;

    setIsUploading(true);
    const address = await uploadFile(file, openNotification);
    if (uploadRef.current !== upload) return;

    setIsUploading(false);
    setProblem(address ? null : `${file.name} could not be uploaded`);
    if (address) onChange?.(address);
  }

  return (
    <FlowFileField
      label={label}
      id={fieldId}
      accept={ACCEPTED_TYPE}
      multiple={false}
      required={required}
      title={isUploading ? 'Adding Your Video' : 'Add a Video'}
      prompt="Drag & drop video file from your gallery"
      hint={`Max video size ${MAX_SIZE_MB}MB`}
      problem={problem}
      onFiles={add}>
      {video ? (
        <div className="relative w-[192px]">
          {/* No captions track: a teaser a couple uploaded comes with none,
              and there is nowhere in the design to ask them for one. */}
          <video
            src={video}
            controls
            className="h-[108px] w-full rounded-[8px] border border-[#D0D5DD] object-cover"
          />
          <button
            type="button"
            aria-label="Remove video"
            onClick={() => onChange?.('')}
            className="absolute -right-[6px] -top-[6px] rounded-full border border-[#D0D5DD] bg-white p-[2px] text-[#475467]">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </FlowFileField>
  );
}

'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useFlowCopy } from './flow-language';
import { useId, useRef, useState } from 'react';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import FlowFileField, { uploadFile } from './flow-file-field';

/**
 * The area the design hands a couple to add photos to a Section.
 *
 * It is this flow's own rather than the product's shared uploader, which draws
 * a row of picture cards and says "Drop file here or click to upload". The
 * design draws one dashed area with words of its own, and the shared uploader
 * is used by every other form in the product, so it is left alone: see the
 * spec's note that shared form primitives are not modified.
 *
 * Photos are uploaded as they are chosen and the field holds the addresses they
 * came back as, so what a couple sees after choosing is the photo itself rather
 * than a promise to upload it later.
 */

/** What the design says a couple may add here, and what the backend accepts. */
const ACCEPTED_TYPES = '.jpg, .jpeg, .png';
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'];

export interface PhotoDropZoneProps {
  /** The words above the area, as the design writes them. */
  label: string;
  /** How many photos the design says belong here. */
  limit: number;
  /**
   * The line of guidance the design prints under the area.
   *
   * Optional because the design does not print one everywhere: the Proposal
   * Photo takes a single photo and is left to say so in its prompt.
   */
  /**
   * The shape of photograph this field wants, as the design states it.
   *
   * Only the ratio, never the number. The guidance a couple reads is built from
   * `limit` below, so it cannot disagree with what the field will accept - the
   * design's own guidance did, on four fields out of six, and a couple was told
   * to add more than two photographs to a field that takes one.
   */
  ratio: 'ratioStandard' | 'ratioWide';
  /**
   * The fewest this field accepts.
   *
   * The same number the field's rule enforces, so the guidance and the refusal
   * cannot tell a couple different things. Venue Photos said "exactly 5" while
   * its rule wanted one, which is the same class of mistake as the guidance
   * that said "more than 2" over a field that took one.
   */
  atLeast: number;
  /** Whether the field must be answered, which draws the mark beside its label. */
  required?: boolean;
  /** The largest file the couple's plan allows, in megabytes. */
  maxSizeMb: number;
  /**
   * The field's identifier, supplied by `Form.Item` from the field's name.
   */
  id?: string;
  value?: string[];
  onChange?: (photos: string[]) => void;
  openNotification?: OpenNotificationFunction;
}

/**
 * What this field asks for, said once, from the numbers that enforce it.
 *
 * Four sentences rather than one with a number in it, because "1 photographs"
 * and "between 1 and 5" both read like a machine that could not be bothered.
 */
function photoGuidance(
  copy: Record<string, string>,
  atLeast: number,
  most: number,
  ratio: string
): string {
  if (most === 1) return copy.photoGuidanceOne.replace('{ratio}', ratio);
  if (atLeast === most) {
    return copy.photoGuidanceMany
      .replace('{count}', String(most))
      .replace('{ratio}', ratio);
  }
  if (atLeast <= 1) {
    return copy.photoGuidanceUpTo
      .replace('{most}', String(most))
      .replace('{ratio}', ratio);
  }
  return copy.photoGuidanceBetween
    .replace('{count}', String(atLeast))
    .replace('{most}', String(most))
    .replace('{ratio}', ratio);
}

export default function PhotoDropZone({
  label,
  limit,
  ratio,
  atLeast,
  required,
  maxSizeMb,
  id,
  value,
  onChange,
  openNotification,
}: PhotoDropZoneProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const copy = useFlowCopy();

  const [isUploading, setIsUploading] = useState(false);
  // What was wrong with the last files chosen, so a photo that cannot be added
  // says why instead of appearing to do nothing.
  const [problem, setProblem] = useState<string | null>(null);

  const photos = value ?? [];

  /**
   * What the field holds right now, readable from inside an upload.
   *
   * Uploading takes as long as it takes, and a couple can drop a second batch
   * while the first is still going. Both would then finish holding the list as
   * it was when they started, and whichever finished last would write the other
   * one's photos away. The ref is what both read and what both write, so the
   * second batch is added to the first rather than instead of it.
   */
  const photosRef = useRef(photos);
  photosRef.current = photos;

  /** Why this file cannot be added, or null when it can. */
  function refuse(file: File): string | null {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      return `${file.name} is not one of ${ACCEPTED_TYPES}`;
    }
    if (file.size / 1024 / 1024 >= maxSizeMb) {
      return `${file.name} is larger than ${maxSizeMb}MB`;
    }
    return null;
  }

  /**
   * Add the files a couple chose, in the order they chose them.
   *
   * Anything past the limit is refused by name rather than dropped quietly, so
   * a couple who picked eight photos for a field that takes five is told which
   * three did not make it.
   */
  async function add(chosen: File[]) {
    const room = Math.max(limit - photosRef.current.length, 0);
    const considered = chosen.slice(0, room).map((file) => ({
      file,
      reason: refuse(file),
    }));
    const refused = considered
      .map(({ reason }) => reason)
      .filter((reason): reason is string => reason !== null);
    const overflow = chosen
      .slice(room)
      .map((file) =>
        copy.tooManyPhotos
          .replace('{file}', file.name)
          .replace('{limit}', String(limit))
      );

    const acceptable = considered
      .filter(({ reason }) => reason === null)
      .map(({ file }) => file);
    if (acceptable.length === 0) {
      setProblem([...refused, ...overflow].join('. ') || null);
      return;
    }

    setIsUploading(true);
    const added: string[] = [];
    const failed: string[] = [];
    for (const file of acceptable) {
      const address = await uploadFile(file, openNotification);
      if (address) {
        added.push(address);
      } else {
        failed.push(`${file.name} could not be uploaded`);
      }
    }
    setIsUploading(false);

    setProblem([...refused, ...overflow, ...failed].join('. ') || null);
    if (added.length > 0) {
      const next = [...photosRef.current, ...added].slice(0, limit);
      photosRef.current = next;
      onChange?.(next);
    }
  }

  return (
    <FlowFileField
      label={label}
      id={fieldId}
      accept={ACCEPTED_TYPES}
      multiple={limit > 1}
      title={isUploading ? copy.uploadInProgress : copy.uploadAddPhotos}
      prompt={copy.uploadDragPrompt.replace('{limit}', String(limit))}
      required={required}
      hint={photoGuidance(copy, atLeast, limit, copy[ratio])}
      problem={problem}
      onFiles={add}>
      {/* Counted by position rather than keyed on the address, because the same
          photo uploaded twice comes back as the same address twice, and
          removing "the one with that address" would remove both of them. */}
      {photos.length > 0 ? (
        <ul className="flex flex-wrap gap-[12px]">
          {photos.map((photo, position) => (
            <li key={`${position}-${photo}`} className="relative">
              <Image
                src={photo}
                alt=""
                width={96}
                height={72}
                className="h-[72px] w-[96px] rounded-[8px] border border-[#D0D5DD] object-cover"
              />
              <button
                type="button"
                aria-label={`Remove photo ${position + 1}`}
                onClick={() => {
                  const next = photos.filter((_, at) => at !== position);
                  photosRef.current = next;
                  onChange?.(next);
                }}
                className="absolute -right-[6px] -top-[6px] rounded-full border border-[#D0D5DD] bg-white p-[2px] text-[#475467]">
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </FlowFileField>
  );
}

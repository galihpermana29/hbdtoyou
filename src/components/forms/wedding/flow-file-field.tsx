'use client';

import { Upload } from 'lucide-react';
import { useRef, type ReactNode } from 'react';

import type { OpenNotificationFunction } from '@/app/(landing)/(core)/create/usecase/useCreateContent';
import { newUploadImageWithAPI } from '@/lib/upload';
import {
  flowDropZone,
  flowDropZonePrompt,
  flowDropZoneTitle,
  flowFieldParts,
  flowHint,
  flowLabel,
  flowProblem,
} from './create-flow-treatment';

/**
 * A field a couple gives files to, and the one call that sends them.
 *
 * The design draws one shape wherever the flow takes a file - photos on the
 * details-and-story step, a video beside them, a Guest List on the step after -
 * and only the words inside it change. What differs between two such fields is
 * how many files they keep and what they show of them, so that is what a field
 * built on this one is left to say; everything the design draws the same is
 * here.
 *
 * The file field sits beside the dashed area rather than inside it. Inside, the
 * click the area sends it would bubble straight back into the area's own
 * handler and send another.
 *
 * The file field is also the only tab stop: the design draws no control inside
 * the area, so the area is a click target rather than a second way to reach the
 * same thing.
 */

/**
 * Send one file, and answer with where it now lives, or null.
 *
 * Shared so that two fields cannot disagree about what a successful upload
 * looks like coming back.
 */
export async function uploadFile(
  file: File,
  openNotification?: OpenNotificationFunction
): Promise<string | null> {
  const body = new FormData();
  body.append('file', file);
  const result = await newUploadImageWithAPI(body, openNotification, file.name);
  return (result.success ? result.data?.data : null) ?? null;
}

export interface FlowFileFieldProps {
  /** The words above the field, as the design writes them. */
  label: string;
  /** Whether the field must be answered, which draws the mark beside it. */
  required?: boolean;
  /** The file field's identifier, so the label points at what a couple uses. */
  id: string;
  /** The types the field takes, as the file dialog filters them. */
  accept: string;
  /** Whether a couple may choose more than one file at a time. */
  multiple: boolean;
  /** What the dashed area invites a couple to do. */
  title: string;
  /** How it says to do it. */
  prompt: string;
  /** The line of guidance under the area, where the design prints one. */
  hint?: string;
  /** What is wrong with the last files chosen, or null when nothing is. */
  problem: string | null;
  /** What a couple chose, in the order they chose it. */
  onFiles: (chosen: File[]) => void;
  /** What the field shows of the files it is holding. */
  children?: ReactNode;
}

export default function FlowFileField({
  label,
  required,
  id,
  accept,
  multiple,
  title,
  prompt,
  hint,
  problem,
  onFiles,
  children,
}: FlowFileFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={flowFieldParts}>
      <label
        htmlFor={id}
        className={`${flowLabel}${required ? ' wedding-required-label' : ''}`}>
        {label}
      </label>

      <input
        ref={fileRef}
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const chosen = Array.from(event.target.files ?? []);
          // A file field holds on to what was chosen last, so choosing the same
          // file again would be no change at all and fire nothing.
          event.target.value = '';
          if (chosen.length > 0) onFiles(chosen);
        }}
      />

      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const dropped = Array.from(event.dataTransfer.files ?? []);
          if (dropped.length > 0) onFiles(dropped);
        }}
        className={flowDropZone}>
        <Upload size={32} aria-hidden="true" className="text-[#141414]" />
        <div className="flex flex-col items-center gap-[4px] text-center">
          <p className={flowDropZoneTitle}>{title}</p>
          <p className={flowDropZonePrompt}>{prompt}</p>
        </div>
      </div>

      {children}

      {hint ? <p className={flowHint}>{hint}</p> : null}

      {problem ? (
        <p role="alert" className={flowProblem}>
          {problem}
        </p>
      ) : null}
    </div>
  );
}

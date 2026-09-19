'use client';

import { useRef, useState } from 'react';
import Cover, { type CoverStyle } from '../guest/cover';
import ChoicePill from '../ui/choice-pill';
import { PencilIcon, PhotoIcon } from '../ui/icons';
import PhoneMock from '../ui/phone-mock';
import { colour, type } from '../ui/tokens';
import StepShell from './step-shell';
import { COVER_STYLES } from './draft';

/** How wide the design draws the phone on this step. */
const PREVIEW_WIDTH = 154.06;

/** The number in the corner of an upload slot, which is SemiBold where the design's other 10s are Medium. */
const SLOT_NUMBER =
  'text-[10px] font-semibold leading-[150%] tracking-[-0.011em]';

/**
 * Step three: the Cover a guest meets when they scan the QR (creator-03 to 05).
 *
 * The preview is the Cover itself, shrunk - the same component a guest is sent,
 * fed the creator's own half-finished draft (ADR 0007). That is the only way
 * "this is what they will see" stays true: a second Cover built to fit a small
 * box would look like the first one until the day somebody changed one of them.
 *
 * The three Cover Styles differ in how many photographs they have room for, so
 * the upload row is as long as the chosen style needs rather than always six.
 * Choosing Simple after filling a Collage does not throw the other five away;
 * they are still there if the creator changes their mind back.
 */
export default function CoverStep({
  eventName,
  coverStyle,
  photos,
  onStyleChange,
  onPhotoChange,
  onBack,
  onContinue,
}: {
  eventName: string;
  coverStyle: CoverStyle;
  photos: (string | null)[];
  onStyleChange: (style: CoverStyle) => void;
  /**
   * The file the creator picked, handed up as it came off their phone.
   *
   * Not a URL. How a photograph is held is the surface's decision - the demo
   * makes an object URL of it and the product will upload it - and a screen
   * that minted one here would leave the product with no file left to send
   * (ADR 0007).
   */
  onPhotoChange: (slot: number, photo: File) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  /**
   * Which slot the creator is on. The design rings it and draws a pencil over
   * it where the others carry their number, which is what makes a row of
   * six say where the next photograph is going.
   */
  const [chosenSlot, setChosenSlot] = useState(0);

  const slots =
    COVER_STYLES.find((option) => option.key === coverStyle)?.slots ?? 1;

  return (
    <StepShell
      step={3}
      heading="Put some photos on"
      blurb="Set the cover your guests will see when they scan your QR"
      onBack={onBack}
      primary={{ label: 'Continue', onClick: onContinue }}>
      <div className="flex w-full flex-col items-center gap-[16px]">
        {/* The design clips the phone off before its bottom edge, so the mock
            reads as a screen the page is looking down at rather than as a
            product photograph sitting in a box. */}
        <div className="flex h-[276px] w-full justify-center overflow-hidden">
          <PhoneMock width={PREVIEW_WIDTH}>
            <Cover
              eventName={eventName}
              photos={photos.slice(0, slots)}
              style={coverStyle}
              draft
              onEnter={() => {}}
            />
          </PhoneMock>
        </div>

        <div className="flex w-full flex-col gap-[12px]">
          <p
            className={type.label}
            style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
            Cover style
          </p>

          <div className="flex gap-[12px]">
            {COVER_STYLES.map((option) => (
              <ChoicePill
                key={option.key}
                chosen={option.key === coverStyle}
                onClick={() => onStyleChange(option.key)}>
                {option.copy}
              </ChoicePill>
            ))}
          </div>

          <div className="flex flex-col gap-[12px]">
            <p
              className={type.body}
              style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
              Upload your photo(s)
            </p>

            {/* Six slots are wider than the column, and the design draws the
                last one cut off at the edge rather than shrinking them all. */}
            <div className="flex gap-[12px] overflow-x-auto">
              {Array.from({ length: slots }, (unused, slot) => (
                <UploadSlot
                  key={slot}
                  number={slot + 1}
                  photo={photos[slot] ?? null}
                  chosen={slot === chosenSlot}
                  onPick={(photo) => onPhotoChange(slot, photo)}
                  onChoose={() => setChosenSlot(slot)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

/**
 * One place a photograph goes.
 *
 * Empty, it is dashed and carries the frame of a photograph with a plus on it.
 * Filled, it is the photograph, darkened so its number stays readable over
 * whatever was taken. The slot the creator is on wears the flame and a pencil
 * instead of its number.
 */
function UploadSlot({
  number,
  photo,
  chosen,
  onPick,
  onChoose,
}: {
  number: number;
  photo: string | null;
  chosen: boolean;
  onPick: (photo: File) => void;
  onChoose: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          onChoose();
          input.current?.click();
        }}
        aria-label={photo ? `Change photo ${number}` : `Add photo ${number}`}
        className="relative flex h-[52.77px] w-[56px] items-center justify-center overflow-hidden rounded-[12px]"
        style={{
          background: photo ? undefined : colour.paper,
          color: colour.flame,
          border: photo
            ? chosen
              ? `2px solid ${colour.flame}`
              : '1px solid rgba(0, 0, 0, 0.2)'
            : '1px dashed rgba(33, 33, 33, 0.2)',
        }}>
        {photo ? (
          <>
            <img
              src={photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            />
            {chosen ? (
              <PencilIcon className="relative h-[22px] w-[22px]" />
            ) : (
              <span
                className={`absolute bottom-[3px] right-[6px] ${SLOT_NUMBER}`}
                style={{ color: '#ffffff', fontFamily: 'var(--font-mr-body)' }}>
                {number}
              </span>
            )}
          </>
        ) : (
          <>
            <PhotoIcon
              className="h-[32px] w-[32px]"
              plus
              ground={colour.paper}
            />
            <span
              className={`absolute bottom-[3px] right-[6px] ${SLOT_NUMBER}`}
              style={{
                color: colour.flame,
                fontFamily: 'var(--font-mr-body)',
              }}>
              {number}
            </span>
          </>
        )}
      </button>

      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onPick(file);
          // Picking the same file twice in a row is a real thing a creator
          // does, and an input that still holds it fires no change event.
          event.target.value = '';
        }}
      />
    </div>
  );
}

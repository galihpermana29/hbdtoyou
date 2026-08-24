'use client';

import Cover, { type CoverStyle } from '../guest/cover';
import Cta from '../ui/cta';
import { QrIcon } from '../ui/icons';
import PhoneMock from '../ui/phone-mock';
import StepShell from './step-shell';

/** How wide the design draws the phone on this step. */
const PREVIEW_WIDTH = 209;

/**
 * Step eight: the roll, finished (creator-11).
 *
 * The whole screen is the Cover at nearly half size, because there is nothing
 * left to ask and everything left to check. It is the same component again, fed
 * the same draft, so what the creator signs off on is what a guest is sent
 * (ADR 0007).
 *
 * Three ways out and one way on. Edit goes back to the first question, Preview
 * opens the Cover at full size, and the middle button - the only one in the
 * design with a picture on it instead of a word - opens the QR a guest scans.
 * Publish is what finishes it, and in the demo the only thing publishing can do
 * is hand over that same QR, since there is nothing here to publish to.
 */
export default function PublishStep({
  eventName,
  coverStyle,
  photos,
  onEdit,
  onPreview,
  onShowQr,
  onPublish,
}: {
  eventName: string;
  coverStyle: CoverStyle;
  photos: (string | null)[];
  onEdit: () => void;
  onPreview: () => void;
  onShowQr: () => void;
  onPublish: () => void;
}) {
  return (
    <StepShell
      step={8}
      heading="Your roll is ready"
      footer={
        <>
          <div className="flex gap-[12px]">
            <Cta tone="outline" onClick={onEdit} className="h-[44px] flex-1">
              Edit
            </Cta>
            <Cta
              tone="outline"
              onClick={onShowQr}
              label="Share QR Code"
              className="h-[44px] flex-1">
              <QrIcon className="h-[24px] w-[24px]" />
            </Cta>
            <Cta tone="outline" onClick={onPreview} className="h-[44px] flex-1">
              Preview
            </Cta>
          </div>
          <Cta onClick={onPublish} className="w-full">
            Publish
          </Cta>
        </>
      }>
      <div className="flex w-full justify-center">
        <PhoneMock width={PREVIEW_WIDTH}>
          <Cover
            eventName={eventName}
            photos={photos}
            style={coverStyle}
            onEnter={() => {}}
          />
        </PhoneMock>
      </div>
    </StepShell>
  );
}

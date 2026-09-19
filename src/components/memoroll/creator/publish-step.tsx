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
  busy = false,
  published,
  onOpenDashboard,
}: {
  eventName: string;
  coverStyle: CoverStyle;
  photos: (string | null)[];
  onEdit: () => void;
  onPreview: () => void;
  onShowQr: () => void;
  onPublish: () => void;
  /**
   * Whether the publish is in flight. The first live run had the backend's
   * proxy hold the create for 92 seconds while this button said nothing
   * (2026-08-30); a press that starts real work says so until the work
   * answers.
   */
  busy?: boolean;
  /**
   * Where the roll stands, and what the footer therefore offers - the
   * owner's rules, 2026-08-30. `false` is a roll that does not exist yet:
   * only Publish, because Edit is the Back button's job and a QR of nothing
   * helps nobody. `true` is a published roll: the three pills appear and
   * the one big button becomes the way onward, See In Dashboard. Left
   * `undefined` - the demo - the footer stays exactly the drawn frame
   * (creator-11), all four controls at once.
   */
  published?: boolean;
  /** Where See In Dashboard goes: the owner's console for this roll. */
  onOpenDashboard?: () => void;
}) {
  return (
    <StepShell
      step={8}
      heading="Your roll is ready"
      footer={
        <>
          {published !== false && (
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
              <Cta
                tone="outline"
                onClick={onPreview}
                className="h-[44px] flex-1">
                Preview
              </Cta>
            </div>
          )}
          {published === true ? (
            <Cta onClick={onOpenDashboard} className="w-full">
              See In Dashboard
            </Cta>
          ) : (
            <Cta
              onClick={onPublish}
              disabled={busy}
              className="w-full"
              label={busy ? 'Publishing' : undefined}>
              {busy ? 'Publishing…' : 'Publish'}
            </Cta>
          )}
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

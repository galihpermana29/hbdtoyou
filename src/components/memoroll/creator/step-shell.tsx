'use client';

import Cta from '../ui/cta';
import Stepper from '../ui/stepper';
import { colour, type } from '../ui/tokens';
import { CREATOR_STEPS, LAST_STEP } from './draft';

/**
 * Everything the eight creator steps share, which is most of what they are.
 *
 * The design draws the same three bands on every one: the stepper and the name
 * of the step, a heading with a line under it, and a footer holding Back and
 * whatever moves the creator forward. Only the middle changes. So the shell is
 * one component and a step is what it puts in the middle, rather than eight
 * screens that each grew their own header and drifted a pixel at a time.
 *
 * The gap between the heading and the answers is the one thing the design does
 * not keep constant - 28 nearly everywhere, 46 on the vibe, and 165 on the
 * shots, which is what drops the counter into the middle of an otherwise empty
 * screen. So it is a number the caller gives.
 */
export default function StepShell({
  step,
  heading,
  blurb,
  gap = 28,
  onBack,
  primary,
  footer,
  children,
}: {
  /** 1-based, the way the design's own marks are numbered. */
  step: number;
  heading: string;
  /** The line under the heading. "Ready to publish" is the one step with none. */
  blurb?: string;
  gap?: number;
  /** Absent on the first step, which has nowhere to go back to. */
  onBack?: () => void;
  /** What moves the creator on. "Ready to publish" replaces the whole footer. */
  primary?: { label: string; onClick: () => void };
  /** The footer, whole, for the one step whose footer is not Back and Continue. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      style={{ background: colour.paper }}>
      <Stepper step={step} total={LAST_STEP} title={CREATOR_STEPS[step - 1]} />

      <div
        className="flex flex-col items-center px-[16px] pt-[16px]"
        style={{ gap }}>
        <div className="flex w-full flex-col items-center gap-[4px] text-center">
          <h1
            className={type.heading}
            style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
            {heading}
          </h1>
          {blurb ? (
            <p
              className={type.body}
              style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
              {blurb}
            </p>
          ) : null}
        </div>

        {children}
      </div>

      {/* The design pins its footer to the bottom of an 812-tall phone. Here it
          is pushed there instead, so a taller window puts more paper between the
          answers and the buttons rather than stranding the buttons mid-screen. */}
      <div className="flex-1" />

      <div className="flex flex-col gap-[20px] px-[16px] pb-[34px] pt-[10px]">
        {footer ?? (
          <div className="flex gap-[12px]">
            {onBack ? (
              <Cta tone="outline" onClick={onBack} className="flex-1">
                Back
              </Cta>
            ) : null}
            {primary ? (
              <Cta onClick={primary.onClick} className="flex-1">
                {primary.label}
              </Cta>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import ChoicePill from '../ui/choice-pill';
import { type } from '../ui/tokens';
import StepShell from './step-shell';
import { VIBES, type Vibe } from './draft';

/**
 * Step one: what kind of event this MemoRoll is for (creator-02).
 *
 * It is the first question because it is the one that settles the tone
 * everything else is offered in, and it is the reason MemoRoll is standalone:
 * a birthday and a weekend away are on this list, and neither has a wedding
 * invitation to hang off (ADR 0007).
 *
 * The emoji beside each answer is an emoji in the design too, drawn as vector
 * outlines because Figma draws every glyph that way. Here it is the character,
 * so it is the reader's own emoji rather than a picture of somebody else's -
 * and it sits in a span of its own, out of the accessibility tree, so the
 * answer a screen reader hears is the words.
 */
export default function VibeStep({
  vibe,
  onChange,
  onContinue,
}: {
  vibe: Vibe;
  onChange: (vibe: Vibe) => void;
  onContinue: () => void;
}) {
  return (
    <StepShell
      step={1}
      heading="This Memoroll is for?"
      blurb="Tell us the vibe of the moments you want to capture"
      gap={46}
      primary={{ label: 'Continue', onClick: onContinue }}>
      <div className="flex w-full flex-col gap-[12px]">
        <p
          className={type.label}
          style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
          What’s the vibe?
        </p>

        <div className="flex flex-col gap-[10px]">
          {VIBES.map((option) => (
            <ChoicePill
              key={option.key}
              chosen={option.key === vibe}
              onClick={() => onChange(option.key)}
              className="w-full">
              <span aria-hidden className="text-[26px] leading-[32px]">
                {option.emoji}
              </span>
              <span>{option.copy}</span>
            </ChoicePill>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

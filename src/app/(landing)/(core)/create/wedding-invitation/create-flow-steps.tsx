import { Check } from 'lucide-react';

import { useFlowCopy } from '@/components/forms/wedding/flow-language';
import type { FlowCopyKey } from '@/components/forms/wedding/copy';

/**
 * How far along the Create Flow a couple is, drawn as the design draws it.
 *
 * Four steps, each with the title and description written for couples rather
 * than for developers. The wording is the design's, taken literally: step 3's
 * description really does read "Config guest details on your the invites", and
 * step 4 is titled "Share with guests" by the one agreed deviation. Both are
 * recorded in `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * ## Two things vary, and they vary differently
 *
 * The icon and the connector after it follow the flow's state: a step before the
 * current one is a filled check with an orange line after it, the current one is
 * a ringed dot, and a step still to come is a hollow grey dot.
 *
 * The words do not. The design gives each step its own resting colour, which it
 * keeps whether that step has been completed or not, and only the current step
 * is recoloured. That reading is not a guess: it is the only rule that holds
 * across all three designed frames, where step 2 is #344054 both before it is
 * reached and after it is done, and step 4 stays #7B7B7B until it is current.
 */

type Step = {
  /**
   * The step's identity, in English, and never what a couple reads.
   *
   * A screen says which step it is by this, so it has to stay put while the
   * words on the page change language. What is drawn comes from `copyKey` and
   * `descriptionKey` below.
   */
  title: string;
  description: string;
  /** What the stepper draws for this step, in the language being read. */
  copyKey: FlowCopyKey;
  descriptionKey: FlowCopyKey;
  /** The class colouring this step's title while it is not the current one. */
  restingTitleClass: string;
  /** The same, for its description. */
  restingDescriptionClass: string;
};

const CREATE_FLOW_STEPS = [
  {
    title: 'Choose your template',
    copyKey: 'stepChooseTemplate',
    descriptionKey: 'stepChooseTemplateDescription',
    description: 'Pick a template design that calls to your dream wedding',
    restingTitleClass: 'text-[#1B1B1B]',
    restingDescriptionClass: 'text-[#7B7B7B]',
  },
  {
    title: 'Fill in the details & story',
    copyKey: 'stepDetailsAndStory',
    descriptionKey: 'stepDetailsAndStoryDescription',
    description: 'Add photos, music, and story details.',
    restingTitleClass: 'text-[#344054]',
    restingDescriptionClass: 'text-[#475467]',
  },
  {
    title: 'Guest invites details',
    copyKey: 'stepGuestInvites',
    descriptionKey: 'stepGuestInvitesDescription',
    description: 'Config guest details on your the invites',
    restingTitleClass: 'text-[#344054]',
    restingDescriptionClass: 'text-[#475467]',
  },
  {
    title: 'Share with guests',
    copyKey: 'stepShareWithGuests',
    descriptionKey: 'stepShareWithGuestsDescription',
    description: 'Easily share your invitation to invited guests.',
    restingTitleClass: 'text-[#7B7B7B]',
    restingDescriptionClass: 'text-[#7B7B7B]',
  },
] as const satisfies readonly Step[];

/**
 * A step, named rather than numbered.
 *
 * A screen says which step it is by its title, so a call site reads as the step
 * a couple is on instead of as an index they would have to count.
 */
export type CreateFlowStep = (typeof CREATE_FLOW_STEPS)[number]['title'];

/** The class colouring the current step's title and description alike. */
const CURRENT_CLASS = 'text-[#E34013]';

/** The 24px marker at the head of a step, in whichever state that step is in. */
function StepMarker({
  state,
}: {
  state: 'complete' | 'current' | 'upcoming';
}) {
  if (state === 'complete') {
    return (
      <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#E34013]">
        <Check size={20} strokeWidth={3.5} className="text-white" />
      </span>
    );
  }

  if (state === 'current') {
    // The ring is a shadow rather than a border so that it does not take part in
    // layout: the design lets it spill over the connector on either side.
    return (
      <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#E34013] shadow-[0_0_0_4px_rgba(227,64,19,0.24)]">
        <span className="h-[8px] w-[8px] rounded-full bg-white" />
      </span>
    );
  }

  return (
    <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[#EAECF0] bg-[#F9FAFB]">
      <span className="h-[8px] w-[8px] rounded-full bg-[#D0D5DD]" />
    </span>
  );
}

export default function CreateFlowSteps({
  current,
}: {
  current: CreateFlowStep;
}) {
  const copy = useFlowCopy();
  const currentIndex = CREATE_FLOW_STEPS.findIndex(
    (step) => step.title === current
  );

  return (
    <ol className="flex">
      {CREATE_FLOW_STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === CREATE_FLOW_STEPS.length - 1;

        return (
          <li key={step.title} className="min-w-0 max-w-[240px] flex-1">
            <div className="flex items-center">
              <StepMarker
                state={
                  isComplete ? 'complete' : isCurrent ? 'current' : 'upcoming'
                }
              />
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`h-[2px] flex-1 ${
                    isComplete ? 'bg-[#E34013]' : 'bg-[#EAECF0]'
                  }`}
                />
              )}
            </div>

            {/* 200px of text, then a gutter, so the words never run into the
                next step's when the steps are narrower than the design's. */}
            <div className="mt-[12px] max-w-[216px] pr-[16px]">
              <p
                className={`text-[14px] font-[600] leading-[20px] ${
                  isCurrent ? CURRENT_CLASS : step.restingTitleClass
                }`}>
                {copy[step.copyKey]}
              </p>
              <p
                className={`text-[14px] font-[400] leading-[20px] ${
                  isCurrent ? CURRENT_CLASS : step.restingDescriptionClass
                }`}>
                {copy[step.descriptionKey]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

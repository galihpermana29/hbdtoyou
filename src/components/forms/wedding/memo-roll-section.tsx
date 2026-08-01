'use client';

import { Form } from 'antd';

import { flowHint, flowSectionName } from './create-flow-treatment';
import MemoRollCamera from './memo-roll-camera';

/**
 * The eighth Section of the details-and-story step: whether guests take the
 * wedding's photographs too.
 *
 * It is the one Section that asks a single question rather than holding a card
 * of fields, and the design draws it as one: no disclosure to open, a switch
 * where every other Section has a chevron, and a card padded 12px all round
 * rather than the 24px and 12px the others carry. So it is its own `<section>`
 * rather than a `CreateFlowSection` with one child, which would have to be
 * opened before it could be answered.
 *
 * The switch turns the invitation's photo sharing on and off. That is what
 * MemoRoll is: the block inviting guests to send back the day as they saw it.
 *
 * "Learn more" is the design's copy and is deliberately not a link. The design
 * names nowhere for it to go and the product has no page explaining MemoRoll
 * yet, and a link that goes nowhere would be worse than the words alone. Filed
 * as `hbd-byb.23` rather than answered by inventing a destination.
 */

/** What the design calls this Section, and what it says the Section is for. */
const NAME = 'Enable MemoRoll?';
const DESCRIPTION =
  "Create a collective photo experience for the wedding. Capture your wedding through every guest's lens.";

/**
 * The card, which the design fills with a wash of the flow's orange.
 *
 * The gradient runs almost straight down and finishes well before the card
 * does, which is why it is written as an angle and a stop rather than as one of
 * Tailwind's directions: `to bottom right` on a card this wide would run the
 * wash out sideways instead.
 */
const CARD =
  'relative overflow-hidden rounded-[8px] border border-[#D0D5DD] p-[12px] ' +
  'bg-[linear-gradient(171deg,#FAE1D9_0%,#FFFFFF_39%)]';

/** The words under the description, in the flow's orange. */
const LEARN_MORE =
  'col-start-1 mt-[6px] text-[14px] font-[600] leading-[20px] text-[#E34013]';

/**
 * The switch, and the knob that slides across it.
 *
 * The design draws it on, and draws nothing for off, so off is the flow's own
 * hairline grey rather than a colour invented for it.
 */
const SWITCH =
  'col-start-2 row-span-2 row-start-1 inline-flex h-[20px] w-[36px] ' +
  'shrink-0 items-center justify-self-end self-center rounded-full p-[2px]';
const KNOB = 'block h-[16px] w-[16px] rounded-full bg-white';

interface MemoRollSwitchProps {
  /** The field's identifier, supplied by `Form.Item` from the field's name. */
  id?: string;
  value?: boolean;
  onChange?: (enabled: boolean) => void;
}

/**
 * The answer itself, split out so that `Form.Item` has something to inject
 * `value` and `onChange` into, and the Section can hold its own field the way
 * every other Section does.
 */
function MemoRollSwitch({ id, value, onChange }: MemoRollSwitchProps) {
  const isOn = value ?? false;

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isOn}
      aria-label={NAME}
      onClick={() => onChange?.(!isOn)}
      className={`${SWITCH} ${
        isOn ? 'justify-end bg-[#E34013]' : 'justify-start bg-[#D0D5DD]'
      }`}>
      <span aria-hidden="true" className={KNOB} />
    </button>
  );
}

export default function MemoRollSection() {
  return (
    <section className={CARD}>
      <MemoRollCamera />

      {/* Positioned, so that it paints over the camera rather than under it,
          which is the order the design draws them in.

          The second column is the camera's width rather than the switch's, so
          that the words stop where the camera starts. The design's stop there
          on their own, because the design is set in a narrower typeface than
          the application's; ours would otherwise run across the illustration.
          See `docs/adr/0002-figma-is-literal-truth.md` on the typeface. */}
      <div className="relative grid grid-cols-[minmax(0,1fr)_106px] items-center gap-x-[12px]">
        <h3 className={`col-start-1 ${flowSectionName}`}>{NAME}</h3>
        <p className={`col-start-1 ${flowHint}`}>{DESCRIPTION}</p>
        <p className={LEARN_MORE}>Learn more</p>
        <Form.Item name="memoRollEnabled" noStyle>
          <MemoRollSwitch />
        </Form.Item>
      </div>
    </section>
  );
}

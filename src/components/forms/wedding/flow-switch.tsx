'use client';

/**
 * The switch a couple turns a block of their invitation on and off with.
 *
 * The design draws exactly one of these, on the MemoRoll Section, and draws no
 * off state for it at all. Two more are needed - the gift block and the
 * background track are both a couple's choice, and the create payload has
 * carried a flag for each of them all along with nothing on the screen to set
 * it - so the shape the design does state is written once here and worn by all
 * three, rather than being drawn again slightly differently twice. The
 * deviation is recorded in `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * It is a `button` with the standard ARIA pattern rather than Ant Design's
 * `Switch`, because the design's is a plain track and knob and antd's brings a
 * wave animation, its own colours and a shadow that would each have to be
 * argued back out again.
 *
 * Where it sits belongs to whoever draws it, so the caller passes that in. The
 * switch itself only knows its own size, its shape and its two colours.
 */

/** The track, in the two states, and the knob that slides across it. */
const TRACK =
  'inline-flex h-[20px] w-[36px] shrink-0 items-center rounded-full p-[2px]';
const ON = 'justify-end bg-[#E34013]';
/** The design draws nothing for off, so off is the flow's own hairline grey. */
const OFF = 'justify-start bg-[#D0D5DD]';
const KNOB = 'block h-[16px] w-[16px] rounded-full bg-white';

export interface FlowSwitchProps {
  /**
   * What the switch turns on, for anybody who cannot see which words it sits
   * beside. A switch says nothing itself: it is a shape and a colour.
   */
  label: string;
  /** The field's identifier, supplied by `Form.Item` from the field's name. */
  id?: string;
  /** Where it sits in the layout the caller draws it into. */
  className?: string;
  value?: boolean;
  onChange?: (enabled: boolean) => void;
}

export default function FlowSwitch({
  label,
  id,
  className = '',
  value,
  onChange,
}: FlowSwitchProps) {
  const isOn = value ?? false;

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={() => onChange?.(!isOn)}
      className={`${TRACK} ${className} ${isOn ? ON : OFF}`}>
      <span aria-hidden="true" className={KNOB} />
    </button>
  );
}

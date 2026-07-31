/**
 * The treatments the wedding invitation Create Flow shares between its steps.
 *
 * This sits beside `field-treatment.ts` and answers the other half of the same
 * question. That one corrects an Ant Design control from the outside; this one
 * dresses the plain elements a step builds for itself, so neither has to repeat
 * a colour, a shadow or a shape the design states once.
 *
 * The plain fields deliberately do not wear `fieldTreatment`. That class is
 * shaped around antd's own hover and focus rules - it steps aside on hover and
 * on focus so antd keeps its affordances - and a plain input has no antd rule
 * behind it to step aside for, so it would simply lose its border colour under
 * the pointer.
 */

/**
 * The design's one drop shadow, written as the property rather than as
 * Tailwind's `shadow-*` utility.
 *
 * The utility composes its value with the ring variables, so the browser ends
 * up reporting three shadow layers where the design has one, two of them fully
 * transparent. They paint nothing, and they are still a difference from the
 * design as far as any comparison is concerned.
 */
export const flowShadow = '[box-shadow:0_1px_2px_0_rgba(16,24,40,0.05)]';

/** The white, hairline, rounded box the design draws a field in. */
export const flowFieldBox = `rounded-[8px] border border-[#D0D5DD] bg-white ${flowShadow}`;

/**
 * The pair of actions that ends every step.
 *
 * The design draws the same two buttons at the foot of each step - an outlined
 * one that goes back and a filled one that goes on - and only their words
 * change. They are class names rather than components because a button needs to
 * submit a form on one step and change the step on another, and wrapping that
 * would hide which it is at the call site.
 */
const ACTION =
  'inline-flex items-center justify-center gap-[6px] rounded-[8px] ' +
  `px-[18px] py-[12px] text-[16px] font-[700] leading-[24px] ${flowShadow}`;

/** The action that goes back a step. */
export const flowActionBack = `${ACTION} border border-[#E34013] bg-white text-[#E34013]`;

/** The action that goes on to the next step. */
export const flowActionForward = `${ACTION} bg-[#E34013] text-white`;

/** The row those two sit in, ranged right as the design ranges them. */
export const flowActionRow = 'flex justify-end gap-[20px]';

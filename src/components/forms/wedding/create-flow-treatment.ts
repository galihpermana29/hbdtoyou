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
 *
 * Padding and weight are not part of the shape below, because the design does
 * not give them the same ones everywhere. The published screen's two actions
 * each carry an icon, and the design pads the icon's side of them by two less
 * than the words' side; it also sets Play My Invite in 600 where every other
 * action in the flow is 700. Each action therefore names its own padding and
 * weight, as one class rather than as an override, because two Tailwind
 * utilities for one property are settled by the order they were written into the
 * stylesheet rather than the order they appear on the element.
 */
const ACTION =
  'inline-flex items-center justify-center gap-[6px] rounded-[8px] ' +
  `text-[16px] leading-[24px] ${flowShadow}`;

const OUTLINED = `${ACTION} border border-[#E34013] bg-white text-[#E34013]`;
const FILLED = `${ACTION} bg-[#E34013] text-white`;

/** The action that goes back a step. */
export const flowActionBack = `${OUTLINED} px-[18px] py-[12px] font-[700]`;

/** The action that goes on to the next step. */
export const flowActionForward = `${FILLED} px-[18px] py-[12px] font-[700]`;

/** The published screen's Play My Invite, outlined as the back action is. */
export const flowActionPlay = `${OUTLINED} py-[10px] pl-[18px] pr-[16px] font-[600]`;

/** The published screen's Back to home, filled as the forward action is. */
export const flowActionHome = `${FILLED} py-[12px] pl-[20px] pr-[18px] font-[700]`;

/** The row those two sit in, ranged right as the design ranges them. */
export const flowActionRow = 'flex justify-end gap-[20px]';

/**
 * The tray the design rests a phone-shaped preview in, on every screen that
 * shows one: a soft grey card with the invitation inset in it.
 */
export const flowPreviewTray = 'rounded-[12px] bg-[#F7F7F7] p-[14px]';

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
 * A plain text field, box and type together.
 *
 * Nothing turns the focus ring off. The design draws no focus state at all, so
 * the browser's own is what a couple gets, and taking it away would leave a
 * field somebody navigating by keyboard cannot see they are in.
 */
export const flowTextField =
  `${flowFieldBox} w-full px-[12px] py-[8px] text-[16px] font-[400] ` +
  'leading-[24px] text-[#101828] placeholder:text-[#667085]';

/** The name the design gives a Section, and the line of guidance under it. */
export const flowSectionName =
  'text-[18px] font-[600] leading-[28px] text-[#1B1B1B]';

/** The words above a field. */
export const flowLabel = 'text-[14px] font-[500] leading-[20px] text-[#344054]';

/**
 * The grey line of guidance the design prints under a field, and under a
 * Section's name.
 *
 * One treatment rather than two, because the design sets both in the same size,
 * weight, leading and colour, and writing them separately would invite them to
 * drift apart for no reason the design gives.
 */
export const flowHint = 'text-[14px] font-[400] leading-[20px] text-[#475467]';

/**
 * The card the design presents every Section of the details-and-story step in.
 *
 * The 24px is a gap rather than margins on what it separates, because a Section
 * holds a header and a body and nothing else, and a collapsed Section drops its
 * body entirely - a gap disappears with it, where a margin would not.
 */
export const flowSectionCard =
  'flex flex-col gap-[24px] rounded-[8px] border border-[#D0D5DD] px-[12px] py-[24px]';

/**
 * The dashed area the design draws wherever a file is dropped, and the two
 * treatments its words wear.
 *
 * The same area appears on two steps - photos on the details-and-story step, a
 * Guest List on the guest invites step - and the design draws one shape for
 * both. The colours are Ant Design's own, because the design's area is antd's,
 * drawn at the opacities Figma names on those layers.
 */
export const flowDropZone =
  'flex cursor-pointer flex-col items-center gap-[16px] rounded-[8px] ' +
  'border border-dashed border-[#D9D9D9] bg-[rgba(0,0,0,0.02)] p-[16px]';

/** What the dashed area invites a couple to do. */
export const flowDropZoneTitle =
  'text-[16px] font-[600] leading-[22.4px] text-[rgba(0,0,0,0.88)]';

/** How it says to do it. */
export const flowDropZonePrompt =
  'text-[14px] font-[400] leading-[16.8px] text-[rgba(0,0,0,0.45)]';

/** What a couple is told when a field will not take what they gave it. */
export const flowProblem =
  'text-[14px] font-[400] leading-[20px] text-[#D92D20]';

/** The distance the design leaves between one field and the next. */
export const flowFieldStack = 'flex flex-col gap-[24px]';

/** A field's own parts: its label, its guidance, and its control. */
export const flowFieldParts = 'flex flex-col gap-[6px]';

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

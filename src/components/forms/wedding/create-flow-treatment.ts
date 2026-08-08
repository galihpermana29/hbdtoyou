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

/**
 * The same field given over to a long answer.
 *
 * Box and type are the plain field's, because the design draws them the same.
 * What differs is the browser's resize grip, which is turned off: the design
 * draws no grip in the corner of the box, and nothing is lost by removing it
 * because a verse longer than the box scrolls inside it.
 */
export const flowTextArea = `${flowTextField} block resize-none`;

/**
 * The box the design draws around more than one thing: a mark, the answer, and
 * sometimes an action attached to the end of it.
 *
 * The border, the radius, the shadow and the insets belong to the box, and what
 * sits inside carries its own type - the same division the guest invites step's
 * web domain field is built on. It matters beyond tidiness. A `<label>` points
 * at a control, so when the control is the bordered box the two are the same
 * element and everything can find the field by its label; when the box is
 * around the control they cannot be, which is the whole of `hbd-byb.16`. A box
 * of this shape is therefore marked `role="group"` and named by its label, and
 * the style and structure check looks it up that way.
 */
export const flowMarkedField = `flex items-center gap-[8px] px-[12px] py-[8px] ${flowFieldBox}`;

/** The answer inside such a box, which has no box of its own to draw. */
const ANSWER =
  'min-w-0 flex-1 bg-transparent text-[16px] font-[400] leading-[24px] outline-none';

export const flowMarkedFieldAnswer = `${ANSWER} text-[#101828] placeholder:text-[#667085]`;

/**
 * The same answer when it is chosen from a list rather than typed.
 *
 * A `<select>` has no placeholder to colour, so the colour is left out here and
 * named at the call site by whether anything has been chosen yet. Writing both
 * colours on the element and letting one win would not work: two Tailwind
 * utilities for one property are settled by the order they were written into the
 * stylesheet rather than by the order they appear on the element.
 */
export const flowChoiceAnswer = `${ANSWER} cursor-pointer appearance-none`;

/** The colour of an answer a couple has given, and of the example standing in for one. */
export const flowAnswered = 'text-[#101828]';
export const flowUnanswered = 'text-[#667085]';

/** The mark before the answer, in the grey the design also writes examples in. */
export const flowFieldMark = 'shrink-0 text-[#667085]';

/**
 * An action the design attaches to the end of a field, inside the field's box.
 *
 * The negative margins are what let one hairline divide the box full height:
 * the box insets everything it holds by 8px and 12px, and this reaches back out
 * over those so its left border runs from the top of the box to the bottom.
 */
export const flowFieldAction =
  'flex shrink-0 items-center self-stretch -my-[8px] -mr-[12px] ' +
  'border-l border-[#D0D5DD] px-[16px] text-[14px] font-[600] ' +
  'leading-[20px] text-[#344054]';

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

/**
 * A small action set in a line of guidance rather than drawn as a control.
 *
 * The design draws no such thing, so this borrows what it does state: the
 * accent every action in the flow is drawn in, at the size and weight it gives
 * a row's own actions. Underlined, because a line of words in a paragraph is
 * only a link if it looks like one.
 */
export const flowInlineAction =
  'text-[14px] font-[600] leading-[20px] text-[#E34013] underline';

/** What a couple is told when a field will not take what they gave it. */
export const flowProblem =
  'text-[14px] font-[400] leading-[20px] text-[#D92D20]';

/** The distance the design leaves between one field and the next. */
export const flowFieldStack = 'flex flex-col gap-[24px]';

/** A field's own parts: its label, its guidance, and its control. */
export const flowFieldParts = 'flex flex-col gap-[6px]';

/**
 * The row the design puts two related fields in, split evenly.
 *
 * The design pairs a bride's answer with a groom's, and a father with a mother,
 * and draws every such row the same way. Written once so a pair added later
 * cannot end up a few pixels from the pairs beside it.
 */
export const flowFieldPair = 'grid grid-cols-2 gap-[24px]';

/**
 * The row the design puts a start and an end in.
 *
 * Closer together than `flowFieldPair`, and deliberately so: a bride's nickname
 * and a groom's are two answers that happen to be related, where a reception's
 * start and its end are two halves of one answer, and the design draws that
 * difference as 6px against 24px.
 */
export const flowFieldRange = 'grid grid-cols-2 gap-[6px]';

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

/** The outlined action the design draws beside the filled one at a step's foot. */
const OUTLINED_STEP_ACTION = `${OUTLINED} px-[18px] py-[12px] font-[700]`;

/** The action that goes back a step. */
export const flowActionBack = OUTLINED_STEP_ACTION;

/** The action that goes on to the next step. */
export const flowActionForward = `${FILLED} px-[18px] py-[12px] font-[700]`;

/**
 * An action in that row that neither goes back nor goes on.
 *
 * The design draws no such thing - Save as draft is ours, and is recorded in
 * `docs/adr/0002-figma-is-literal-truth.md` - so it wears the shape the design
 * does state for the action beside the one it draws filled. That is the same
 * shape as the action that goes back, written once above and given two names
 * rather than two definitions: what a treatment is called at the call site is
 * how anybody reading a row knows what the button does, and a control named
 * "back" that saves would be a small lie in every file that used it.
 */
export const flowActionAside = OUTLINED_STEP_ACTION;

/** The published screen's Play My Invite, outlined as the back action is. */
export const flowActionPlay = `${OUTLINED} py-[10px] pl-[18px] pr-[16px] font-[600]`;

/**
 * The Site Preview's Play Preview, which is the small version of that action.
 *
 * Written out rather than composed from `OUTLINED`, because the design sets it
 * a size smaller - 14px over 20px where every other action is 16px over 24px,
 * and 4px between the words and the mark where the others leave 6px. Adding
 * those as overrides would put two Tailwind utilities for one property on one
 * element, and which of them wins is decided by the order they were written
 * into the stylesheet rather than the order they appear here.
 */
export const flowActionPlayPreview =
  'inline-flex items-center justify-center gap-[4px] rounded-[8px] ' +
  'border border-[#E34013] bg-white px-[14px] py-[10px] text-[14px] ' +
  `font-[600] leading-[20px] text-[#E34013] ${flowShadow}`;

/** The published screen's Back to home, filled as the forward action is. */
export const flowActionHome = `${FILLED} py-[12px] pl-[20px] pr-[18px] font-[700]`;

/**
 * The row those two sit in, ranged right as the design ranges them.
 *
 * Wrapping, because a step can end in three actions and a phone is not always
 * wide enough for three. Nothing moves while they fit, which is every screen
 * the design draws; what wrapping buys is that the last of them ends up on a
 * second line rather than past the edge of the window.
 */
export const flowActionRow = 'flex flex-wrap justify-end gap-[20px]';

/**
 * The column a preview panel stands in, on both screens that show one.
 *
 * The width is the design's and it is a maximum rather than a floor, because
 * below the width the design is drawn at there is not always 405px to give it,
 * and a panel wider than the page it is on is a panel nobody can scroll to.
 */
export const flowPreviewPanel = 'flex w-[405px] max-w-full flex-col gap-[24px]';

/** What the design titles such a panel, above the phone it stands over. */
export const flowPreviewHeading =
  'text-[18px] font-[600] leading-[28px] text-[#1B1B1B]';

/**
 * The tray the design rests a phone-shaped preview in, on every screen that
 * shows one: a soft grey card with the invitation inset in it.
 */
export const flowPreviewTray = 'rounded-[12px] bg-[#F7F7F7] p-[14px]';

/**
 * The screen inside that tray: the phone's own glass, and the only thing the
 * design's mockup puts on it.
 *
 * It scrolls and clips on the one element, so the invitation runs under a
 * rounded corner rather than past a square one.
 *
 * The design's mockup adds phone furniture as well - a status bar reading 9:41 -
 * and none of it is drawn here. That is Figma's furniture rather than a decision
 * about either screen, and a fabricated clock over the top of a couple's live
 * preview would cost them 44px of the thing the panel exists to show. The same
 * line is drawn in `published.mjs`.
 */
export const flowPreviewScreen =
  'h-[812px] overflow-y-auto overflow-x-hidden overscroll-contain rounded-[10px]';

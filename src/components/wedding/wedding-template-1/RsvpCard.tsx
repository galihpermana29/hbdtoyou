'use client';

/**
 * Wedding Template 1 - the RSVP a guest replies with. Figma node 312:3846.
 *
 * A torn-paper card under a paperclip, opened by the invitation's RSVP Now
 * control, asking a guest their name, whether they are coming, whether they
 * bring somebody, and a Guest Message the design marks Optional.
 *
 * Nothing here reaches a network. A reply is handed to whoever opened the card
 * and lives in the page's state until it is reloaded. The card says so above
 * the Submit control rather than letting a guest find out afterwards, which is
 * the one line of copy on it the design does not draw - see
 * `docs/adr/0002-figma-is-literal-truth.md`. Persisting a reply is integration
 * work and is deliberately not attempted.
 *
 * It behaves as a dialog rather than as a card that happens to be on top, the
 * same way `src/components/forms/wedding/invitation-player.tsx` does: the page
 * behind it does not scroll, Escape closes it, the first field takes focus when
 * it opens, and Tab stays inside it - which is what `aria-modal` promises
 * anything reading the page aloud.
 */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';

const ASSET = '/templates/wedding-template-1';

/** A guest's reply to the invitation. */
export interface Rsvp {
  /** Who replied, which is the one thing the couple always gets. */
  name: string;
  /** Whether they are coming. */
  attending: boolean;
  /** Whether they bring somebody. */
  plusOne: boolean;
  /** What they wrote for the couple, empty when they wrote nothing. */
  message: string;
  /** When they replied, which is what their Guest Message is dated by. */
  repliedAt: Date;
}

/**
 * The two answers the design draws to "Will you be attending?", in its own
 * words. Its apostrophes are the typographic ones it sets them with.
 */
const ATTENDING = [
  { value: true, label: 'I wouldn’t miss it for anything!' },
  { value: false, label: 'Sadly can’t make it :(' },
];

/** The two answers the design draws to "Will you be bringing a plus one?". */
const PLUS_ONE = [
  { value: true, label: 'YES' },
  { value: false, label: 'NO' },
];

/**
 * The size the design draws this card's torn edges at.
 *
 * Every piece of `torn-paper.png` around it, `image 513` to `image 523`, is one
 * of the Love Story's own two crops scaled by this - Figma states it on the
 * card as a stroke weight of 0.9504556 and on each piece as a size 0.95046 of
 * the Love Story's. The crops themselves are identical, to the last decimal.
 */
const TORN = 0.9504556;
const LONG_WIDTH = 147 * TORN;
const LONG_HEIGHT = 375 * TORN;
const SHORT_WIDTH = 52 * TORN;
const SHORT_HEIGHT = 290 * TORN;

/**
 * One piece of the card's torn edge.
 *
 * `box` places the piece's rotated bounding box against the card, `spin` turns
 * and mirrors the crop inside it, and the two sizes are the crop's own, before
 * it is turned. The design lays ten of these around the card at fixed offsets
 * down a 534-tall paper; they are anchored to the card's four edges here
 * instead, because this card is a line of copy taller than the design's and a
 * guest's own answer can make it taller still.
 */
function TornEdge({
  box,
  spin,
  long = true,
}: {
  box: string;
  spin: string;
  long?: boolean;
}) {
  const width = long ? LONG_WIDTH : SHORT_WIDTH;
  const height = long ? LONG_HEIGHT : SHORT_HEIGHT;
  const crop = long
    ? 'absolute left-[-81.51%] top-[-13.38%] h-[134.36%] w-[192.99%] max-w-none'
    : 'absolute left-[-413.1%] top-[-6.61%] h-[173.74%] w-[545.57%] max-w-none';

  return (
    <div className={`absolute flex items-center justify-center ${box}`}>
      <div className={`flex-none ${spin}`}>
        <div className="relative" style={{ width, height }}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img alt="" className={crop} src={`${ASSET}/torn-paper.png`} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The paper the reply is written on: a flat ground of `paper.jpg` under the
 * design's two tints, with torn edges hanging off all four sides of it.
 *
 * The tints are Figma's own two fills over the image on `Rectangle 1`, in the
 * order it stacks them - cream at 30% and then black at 4%, which CSS writes
 * topmost first.
 */
function Paper() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Along the top, a long piece and a short one. */}
      <TornEdge
        box="left-[-22px] top-[-45px] h-[139.72px] w-[356.42px]"
        spin="-rotate-90 -scale-y-100"
      />
      <TornEdge
        box="left-[-48px] top-[-45px] h-[49.42px] w-[275.63px]"
        spin="-rotate-90"
        long={false}
      />

      {/* The same pair along the bottom, turned the other way. */}
      <TornEdge
        box="bottom-[-33px] left-[-22px] h-[139.72px] w-[356.42px]"
        spin="rotate-90"
      />
      <TornEdge
        box="bottom-[-33px] left-[-48px] h-[49.42px] w-[275.63px]"
        spin="rotate-90 -scale-y-100"
        long={false}
      />

      {/* Down the left, one piece from the top and one from the bottom. */}
      <TornEdge
        box="left-[-40px] top-0 h-[356.42px] w-[139.72px]"
        spin="rotate-180 -scale-y-100"
      />
      <TornEdge
        box="bottom-0 left-[-36px] h-[356.42px] w-[139.72px]"
        spin="rotate-180"
      />

      {/* And the mirror of those two down the right. */}
      <TornEdge box="right-[-40px] top-0 h-[356.42px] w-[139.72px]" spin="" />
      <TornEdge
        box="bottom-0 right-[-36px] h-[356.42px] w-[139.72px]"
        spin="-scale-y-100"
      />

      <div className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute left-0 top-[-67.47%] h-[247.47%] w-[307.6%] max-w-none"
          src={`${ASSET}/paper.jpg`}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.04) 100%), ' +
            'linear-gradient(90deg, rgba(239,233,226,0.3) 0%, rgba(239,233,226,0.3) 100%)',
        }}
      />
    </div>
  );
}

/**
 * One answer a guest picks, drawn as the hairline box the design draws every
 * choice in. Figma's `Option`, node 312:3868.
 *
 * The radio itself covers the box and is invisible, so the whole box is what a
 * guest presses and what a screen reader announces, and the keyboard still
 * moves between the answers of one question with the arrow keys.
 *
 * The design draws only the resting box, so what a chosen one looks like is
 * read off the two boxes it does draw: the Name it drew answered is filled
 * #d9d8d6 and the Guest Message it drew empty is not, so that fill is the
 * design's own word for a field holding an answer.
 */
function Choice({
  question,
  chosen,
  onChoose,
  className = '',
  children,
}: {
  question: string;
  chosen: boolean;
  onChoose: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={`relative flex items-center gap-[10px] rounded-[2px] border border-solid border-[#000000] px-[12px] py-[8px] font-[family-name:var(--font-wt1-mono)] text-[10px] font-normal leading-[normal] text-[#000000] has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-[#000000] ${
        chosen ? 'bg-[#d9d8d6]' : ''
      } ${className}`}>
      <input
        type="radio"
        name={question}
        checked={chosen}
        onChange={onChoose}
        required
        className="absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-[2px] opacity-0"
      />
      {children}
    </label>
  );
}

/** The question above a pair of answers. Figma's `TextField`, node 312:3865. */
function Question({
  legend,
  className = '',
  children,
}: {
  legend: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-[12px]">
      <legend className="font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#000000]">
        {legend}
      </legend>
      <div className={`flex gap-[10px] ${className}`}>{children}</div>
    </fieldset>
  );
}

export default function RsvpCard({
  onClose,
  onSubmit,
}: {
  /** Put the card away, changing nothing. */
  onClose: () => void;
  /** Take a guest's reply, which is all this card does with one. */
  onSubmit: (rsvp: Rsvp) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const nameId = useId();
  const messageId = useId();
  const optionalId = useId();

  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOne, setPlusOne] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  // The card takes focus itself rather than handing it to the Name field. It
  // is read on a phone, where focusing a text field raises the keyboard over
  // half of what a guest has just opened, and the first thing they should see
  // is the question rather than the answer box.
  //
  // Whatever had focus gets it back when the card goes, which is RSVP Now: a
  // guest who reached the card from the keyboard would otherwise be put at the
  // top of a five-thousand-pixel invitation for having closed it.
  useEffect(() => {
    const opener = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Escape and Tab are listened for on the card rather than on the window, and
  // stopped there.
  //
  // Play Preview draws this invitation inside a dialog of its own, which is
  // watching the window for Escape too, and a key that reached both would close
  // the card and throw the couple out of the whole preview behind it in the
  // same press. Stopping propagation on the window would not help - both
  // listeners would be on the same target - so the card takes the key first,
  // which it can do because focus never leaves it while it is open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      event.stopPropagation();

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      // The card itself is focusable and is where focus starts, so it counts
      // as being at neither end rather than as one of the fields.
      const onAField = active !== dialog && dialog.contains(active);

      // Tab off either end of the card wraps to the other, so focus can never
      // wander onto the invitation behind something that says it is inert.
      if (!event.shiftKey && (!onAField || active === last)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (!onAField || active === first)) {
        event.preventDefault();
        last.focus();
      }
    };

    dialog.addEventListener('keydown', onKeyDown);
    return () => dialog.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const reply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The browser will not submit the form until every question is answered,
    // so an unanswered one cannot arrive here. Both are still read as answered
    // or not rather than coerced, because a reply that quietly said "not
    // coming" for somebody who had said nothing would be worse than no reply.
    if (attending === null || plusOne === null) return;
    onSubmit({
      name: name.trim(),
      attending,
      plusOne,
      message: message.trim(),
      repliedAt: new Date(),
    });
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#090909]/80 outline-none">
      <form
        onSubmit={reply}
        className="relative mx-auto w-[375px] max-w-full overflow-hidden pb-[43px] pt-[52px]">
        {/* The paper card, Figma `Rectangle 1` 312:3858, and what is on it. */}
        <div className="relative ml-[42px] w-[312px] pb-[5px] pr-[15px] pt-[25px]">
          <Paper />

          {/*
            "Kindly Reply" over its rule. Figma `Frame 23`, node 312:3885, which
            is 31 tall with the rule at 30. The rule is drawn at 50 instead, and
            the block is as tall, for the same reason the Guest Messages heading
            is: a 48px script line set at the browser's own leading rather than
            the design's sits about 20 lower in its box than Figma draws it, so
            a rule at 30 would be struck through the words instead of under
            them. Both move together, and both move back when `hbd-a09.13` sets
            the leading the design asks for.
          */}
          <div className="relative ml-[40px] h-[51px] w-[206px]">
            <p
              id={titleId}
              className="absolute left-[12px] top-0 w-[184px] font-[family-name:var(--font-wt1-script)] text-[48px] font-normal leading-[normal] text-[#090909]">
              Kindly Reply
            </p>
            <div className="absolute left-0 top-[50px] h-[0.5px] w-[200px] bg-[#090909]" />
          </div>

          {/* The questions. Figma `Frame 43`, node 312:3860. */}
          <div className="relative mt-[21px] flex flex-col gap-[21px]">
            <div className="flex flex-col gap-[12px]">
              <label
                htmlFor={nameId}
                className="font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#000000]">
                Name
              </label>
              <input
                id={nameId}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-[2px] border border-solid border-[#000000] bg-[#d9d8d6] px-[12px] py-[8px] font-[family-name:var(--font-wt1-mono)] text-[10px] font-normal leading-[normal] text-[#000000] outline-1 outline-offset-[3px] outline-[#090909] focus-visible:outline"
              />
            </div>

            <Question legend="Will you be attending?" className="flex-col">
              {ATTENDING.map(({ value, label }) => (
                <Choice
                  key={label}
                  question="attending"
                  chosen={attending === value}
                  onChoose={() => setAttending(value)}>
                  {label}
                </Choice>
              ))}
            </Question>

            <Question
              legend={
                <>
                  Will you be bringing{' '}
                  {/*
                    The face is named again on the underlined words because
                    `globals.css` sets one on `*`, which no element inherits
                    past: a span without a class of its own is drawn in the
                    application's face rather than the invitation's.
                  */}
                  <u className="font-[family-name:var(--font-wt1-mono)]">
                    a plus one
                  </u>
                  ?
                </>
              }>
              {PLUS_ONE.map(({ value, label }) => (
                <Choice
                  key={label}
                  question="plus-one"
                  chosen={plusOne === value}
                  onChoose={() => setPlusOne(value)}
                  className="flex-1">
                  {label}
                </Choice>
              ))}
            </Question>

            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <label
                  htmlFor={messageId}
                  className="font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#000000]">
                  Message to the happy couple?
                </label>
                <p
                  id={optionalId}
                  className="font-[family-name:var(--font-wt1-mono)] text-[10px] font-semibold leading-[normal] text-[#898989]">
                  Optional
                </p>
              </div>
              <textarea
                id={messageId}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-describedby={optionalId}
                rows={3}
                className="w-full resize-none rounded-[2px] border border-solid border-[#000000] bg-transparent px-[12px] py-[8px] font-[family-name:var(--font-wt1-mono)] text-[10px] font-normal leading-[normal] text-[#000000] outline-1 outline-offset-[3px] outline-[#090909] focus-visible:outline"
              />
            </div>

            {/* Submit and Close. Figma `Frame 44`, node 312:3880. */}
            <div className="flex flex-col gap-[12px]">
              <p className="font-[family-name:var(--font-wt1-mono)] text-[10px] font-semibold leading-[normal] text-[#898989]">
                Nothing is saved yet. Your reply stays on this page and goes
                when you reload it.
              </p>
              <button
                type="submit"
                className="flex items-center justify-center gap-[10px] border border-solid border-[#fafafa] bg-[#000000] p-[10px]">
                <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#fafafa]">
                  Submit
                </p>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center gap-[10px] border border-solid border-[#000000] p-[10px]">
                <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#000000]">
                  Close
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* The paperclip holding the card. Figma `image 520`, node 312:3859. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[47.22px] top-0 h-[69.97px] w-[32.48px]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute left-[-145.77%] top-[-32.79%] h-[169.98%] w-[366.17%] max-w-none"
              src={`${ASSET}/lovestory-torn-strip.png`}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

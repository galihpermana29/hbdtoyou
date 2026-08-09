'use client';

/**
 * Wedding Template 1 - Hero ("You're Invited to"). Figma nodes 312:1632 open
 * and 332:30920 sealed. Fixed 375x812 mobile composition, built pixel-accurate
 * to the design. The iOS status bar in the mockup (9:41 / battery) is
 * intentionally omitted: a real device renders its own, so a faux bar would
 * double up.
 *
 * Interaction: a sealed invitation arrives with the closed envelope drawn, its
 * seal unbroken and the cards not drawn at all, and opening it is a guest's own
 * act. It runs in the order the design gives it - the seal lifts, the closed
 * envelope cross-fades to the open one, the cards rise out of the pocket, and
 * only then does the page become the guest's to scroll.
 *
 * The two envelopes are separate photographs, each with its own baked lighting
 * and shadow, so the flap is never rotated: a cross-fade conceals that they are
 * two images where a rotation would advertise it. Both hang off the same 387x442
 * box, at the offsets the design gives each, or the fade would jump.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
  DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  pickPhoto,
  type WeddingTemplate1Content,
} from '@/components/forms/wedding/wedding-invitation-types';
import { FitText } from './FitText';
import { AutoFitText } from './AutoFitText';
import { TornEdge } from './TornPaper';
import { useSealed } from './sealed-context';
import { EASE, pressTap } from './variants';
import { formatWeddingDateLabel } from './wedding-date-label';

const ASSET = '/templates/wedding-template-1';

const cardShadow = {
  filter:
    'drop-shadow(1.783px 0px 6.686px rgba(0,0,0,0.1)) drop-shadow(0px 1.783px 5.705px rgba(0,0,0,0.17))',
};

/** How far (px) the cards are tucked down into the envelope when closed. */
const TUCK = 58;

/**
 * The widest a line of the couple's own words may be drawn on the Hero's cards,
 * in the 264.046px of the card it is printed on.
 *
 * The design states no width for any of the three lines a couple owns here. All
 * of them are auto-width text layers hugging whatever the designer's own wedding
 * happened to need, and a frame says nothing about a longer one. What bounds
 * them instead is the rule the design draws 4.7px inside each card. A line this
 * wide centred on its card stops 22px short of that rule; the date, which is
 * centred where the design's own date is rather than on the middle of its card,
 * stops 18px short on the closer side. The design's own SAVE THE DATE lockup is
 * narrower still, at 163.855px, so a line long enough to reach this is already
 * the widest thing on its card - about as far as one can go and still look like
 * the design drew it.
 */
const CARD_LINE_MAX_WIDTH = 210;

/**
 * The opening, step by step, in seconds.
 *
 * Each step says when it starts and how long it runs, so the sequence the design
 * describes is one object rather than delays scattered down the composition. The
 * page unlocks when the last of them has finished, which is what makes opening
 * feel like one act rather than a lock that lets go while the envelope is still
 * moving.
 *
 * A step with a `bounce` moves as a spring rather than a tween: the seal snaps
 * free and the cards settle like paper rather than easing like a slide. Bounce
 * is kept subtle (0.35 at most) so the overshoot reads as weight, not play, and
 * a spring's visible motion completes at its `duration`, so the unlock
 * arithmetic below still holds.
 *
 * Exported because the opening is not only the Hero's: the record arrives in
 * the corner during it, and reading the timing from here is what keeps the two
 * in step if the choreography is ever retimed.
 */
export const OPENING = {
  seal: { delay: 0, duration: 0.3, bounce: 0.35 },
  envelope: { delay: 0.3, duration: 0.6 },
  cards: { delay: 0.75, duration: 0.95, bounce: 0.18 },
};

/**
 * When the whole opening is over, which is when the page is the guest's.
 *
 * Read off every step rather than off the last one written down, so that
 * lengthening any of them moves the unlock with it instead of letting the page
 * go while something is still moving.
 */
const OPENING_SECONDS = Math.max(
  ...Object.values(OPENING).map(({ delay, duration }) => delay + duration)
);

/**
 * What an addressee may grow to before it steps down.
 *
 * Measured off the paper rather than off the photograph's box. The image ends
 * at 452.8, but its lower 46px are transparent and the envelope inside it is
 * tilted, so the paper itself ends at 413.5 under the left of the line and
 * 422.5 under the right. The design draws the line at 374, so the tighter side
 * gives 39.5px, and keeping 8 clear of the edge leaves 32.
 *
 * Writing 64 here instead, which is what the image's box suggests, put a third
 * line of a long name off the bottom of the envelope onto the black behind it.
 *
 * It is fitted rather than trusted, because this is the one line on the
 * invitation a guest supplies and nobody reviews: "Bhadrakumara & Keluarga
 * Besar Sastrowardoyo Poerbonegoro" is an ordinary way to address an Indonesian
 * family and three times the length the design drew.
 */
const ADDRESSEE_MAX_HEIGHT = 32;

/** One step of the opening, or no movement at all where none is wanted. */
const step = (
  reduce: boolean | null,
  {
    delay,
    duration,
    bounce,
  }: { delay: number; duration: number; bounce?: number }
) =>
  reduce
    ? { duration: 0 }
    : bounce !== undefined
      ? { type: 'spring' as const, duration, bounce, delay }
      : { duration, delay, ease: EASE };

/** The envelope with the two cards (save-the-date + couple photo) tucked inside. */
function EnvelopeCard({
  sealed,
  addressee,
  opened,
  reduce,
  content,
}: {
  /** Whether this invitation has a closed envelope to open at all. */
  sealed: boolean;
  /** Who this invitation was sent to, drawn on the closed envelope. */
  addressee?: string;
  opened: boolean;
  reduce: boolean | null;
  content: WeddingTemplate1Content;
}) {
  const couplePhoto = pickPhoto(content.heroPhotos, 0);
  const dateLabel = formatWeddingDateLabel(content.weddingDateIso, {
    beforeYear: ', ',
  });
  const coupleLabel = `${content.groomName} & ${content.brideName}`;

  return (
    <div className="absolute left-1/2 top-[31px] h-[442px] w-[387px] -translate-x-1/2">
      {/* envelope flap (back layer), of the open envelope */}
      <motion.div
        className="absolute left-[7px] top-[25px] z-0 h-[171.869px] w-[370.514px]"
        initial={false}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={step(reduce, OPENING.envelope)}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-0 top-[-34.32%] h-[323.37%] w-full max-w-none"
            src={`${ASSET}/envelope.png`}
          />
        </div>
      </motion.div>

      {/* Cards group - tucked inside when closed, rising up and out when
          opened. A closed envelope is drawn with them not drawn at all rather
          than merely covered (Figma gives Frame 18 opacity 0), so a guest who
          has not opened it has nothing to read yet - and neither has anything
          reading the page. */}
      <motion.div
        className="absolute left-[21px] top-[41.67px] h-[356.062px] w-[345px]"
        style={{
          zIndex: opened ? 30 : -1,
          visibility: opened ? 'visible' : 'hidden',
        }}
        initial={false}
        animate={{
          opacity: opened ? 1 : 0,
          y: opened ? 0 : TUCK,
          scale: opened ? 1 : 0.82,
        }}
        transition={step(reduce, OPENING.cards)}>
        {/* couple photo card (tilted -8.41deg). Tucked in the envelope it lies
            nearly straight, and it splays out to the tilt the design draws as
            it rises - two cards fanning apart is what hands do with them. The
            tucked pose is the animation's own, not a frame the design draws,
            and it is never seen: the group above holds the cards
            `visibility: hidden` until the envelope is opened. At rest it is
            exactly the design's -8.41deg. */}
        <div className="absolute left-0 top-[141.41px] flex h-[214.646px] w-[287.231px] items-center justify-center">
          <motion.div
            className="flex-none"
            initial={false}
            animate={{ scale: 1, rotate: opened ? -8.41 : -2.5 }}
            transition={step(reduce, OPENING.cards)}>
            <div
              className="relative h-[177.944px] w-[264.046px]"
              style={cardShadow}>
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={`${ASSET}/paper.jpg`}
              />
              <div className="absolute left-[4.7px] top-[4.7px] h-[167.769px] w-[255.436px] border-[1.044px] border-solid border-[#201e1f]" />
              {/* The frame is drawn either way, because it is the design's
                  card rather than the couple's photograph. What goes inside it
                  is theirs, and a couple who has not chosen one yet gets the
                  empty frame rather than a stranger's wedding photo. */}
              <div className="absolute left-1/2 top-[11.74px] h-[132.023px] w-[232.736px] -translate-x-1/2">
                {couplePhoto ? (
                  <img
                    alt={coupleLabel}
                    className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                    src={couplePhoto}
                  />
                ) : null}
              </div>
              {/* The wedding day, captioning the photograph above it.

                  The design writes one date and leaves the line where that date
                  happened to end: Figma hugs "May 3rd, 2026" in a box at
                  x 105.409 and says nothing about a longer one. Left anchored
                  there, a couple married in September prints a line 27px longer
                  that can only grow rightwards, and it ends up visibly off the
                  middle of the picture it captions. It is centred here on the
                  point the design's own line is centred on, which leaves the
                  designer's wedding within a quarter of a pixel of where the
                  design draws it and grows a longer one into both margins
                  rather than one.

                  It is fitted like the two lines on the card in front of it.
                  The longest date this can print, "September 30th, 2026", is
                  90px against a 210px ceiling, so the fitting is a guarantee
                  rather than a rescue - but it is the same guarantee every
                  other line a couple owns on these cards carries, and the
                  alternative is one line held inside the card by arithmetic
                  nobody wrote down. */}
              {/* A date the formatter could not read is an empty label, and
                  the card omits the line rather than drawing a blank one. */}
              {dateLabel && (
                <div className="absolute left-[136.91px] top-[147.16px] -translate-x-1/2 font-[family-name:var(--font-wt1-script)] text-[16.699px] leading-[normal] text-black">
                  <FitText maxWidth={CARD_LINE_MAX_WIDTH}>{dateLabel}</FitText>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* save the date card (tilted +6.05deg), splaying the other way as the
            pair rises - see the couple photo card above. */}
        <div className="absolute left-[63.66px] top-0 flex h-[204.793px] w-[281.337px] items-center justify-center">
          <motion.div
            className="flex-none"
            initial={false}
            animate={{ scale: 1, rotate: opened ? 6.05 : 1.8 }}
            transition={step(reduce, OPENING.cards)}>
            <div
              className="relative h-[177.944px] w-[264.046px]"
              style={cardShadow}>
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                src={`${ASSET}/paper.jpg`}
              />
              <div className="absolute left-[4.7px] top-[4.7px] h-[167.769px] w-[255.436px] border-[1.044px] border-solid border-[#201e1f]" />

              {/* SAVE THE DATE lettering */}
              <div className="absolute left-[calc(50%-0.26px)] top-[-0.26px] flex -translate-x-1/2 flex-col items-center leading-[normal] text-black">
                <div className="relative mb-[-3.131px] h-[64.968px] w-[98.626px] whitespace-nowrap">
                  <p className="absolute left-0 top-[2.61px] font-[family-name:var(--font-wt1-script)] text-[62.62px]">
                    S
                  </p>
                  <p className="absolute left-[32.62px] top-[18.53px] font-[family-name:var(--font-wt1-serif)] text-[46.965px]">
                    AVE
                  </p>
                </div>
                <p className="w-[163.855px] font-[family-name:var(--font-wt1-serif)] text-[46.965px]">
                  THE DATE
                </p>
              </div>

              {/* Venue and the couple, each centred on its own line where the
                  design draws it. One line each, because the card's lower left
                  is where the photograph card in front of it sits: a second
                  line of black script lands on a dark photograph and is gone.
                  A long venue or a long pair of names is scaled down to the
                  card instead of wrapping into it.

                  Each line's typeface and size sit on the box holding it rather
                  than on the text, and the text inherits them. A line box is
                  sized by the font of the box it is in, so a wrapper left at
                  the inherited face would put a script line four pixels below
                  where the design draws it. */}
              <div className="absolute left-1/2 top-[133.59px] -translate-x-1/2 font-[family-name:var(--font-wt1-script)] text-[26.092px] leading-[normal] text-black">
                <FitText maxWidth={CARD_LINE_MAX_WIDTH}>
                  {content.groomName} &amp; {content.brideName}
                </FitText>
              </div>
              <div className="absolute left-1/2 top-[118.98px] -translate-x-1/2 font-[family-name:var(--font-wt1-sans)] text-[6.262px] uppercase leading-[normal] tracking-[0.1252px] text-black">
                <FitText maxWidth={CARD_LINE_MAX_WIDTH}>
                  {content.venueName}
                </FitText>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* envelope body (front pocket) - hides the tucked cards */}
      <motion.div
        className="absolute left-[7px] top-[194.87px] z-10 h-[247.13px] w-[370.514px]"
        initial={false}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={step(reduce, OPENING.envelope)}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-0 top-[-91.8%] h-[224.89%] w-full max-w-none"
            src={`${ASSET}/envelope.png`}
          />
        </div>
      </motion.div>

      {/* the broken wax seal, where the design leaves it once the flap is open */}
      <motion.div
        className="absolute left-[17.91px] top-[101.04px] z-40 flex h-[69.913px] w-[69.18px] items-center justify-center"
        initial={false}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={step(reduce, OPENING.envelope)}>
        <div className="flex-none rotate-[-13.79deg]">
          <WaxSeal />
        </div>
      </motion.div>

      {/* The closed envelope, and the seal still holding it shut. Figma node
          394:3061 with 332:30839, both offset from the same box the open
          envelope hangs off, so the cross-fade between them does not jump.
          Drawn over everything while it lasts, so the open envelope is
          uncovered rather than laid on top. */}
      {sealed && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50"
          initial={false}
          animate={{ opacity: opened ? 0 : 1 }}
          transition={step(reduce, OPENING.envelope)}>
          <img
            alt=""
            className="absolute left-[-0.026px] top-[184.063px] h-[268.744px] w-[384.566px] max-w-none"
            src={`${ASSET}/envelope-closed.png`}
          />
          {/*
            Who the invitation was sent to, drawn on the face of the envelope
            where a guest can read it.

            The design puts it here - node 332:30838, 152x19 at 115,374, clear
            of the seal above it - and then draws the envelope's own photograph
            over the top, where nobody can read a word of it. That is the frame
            stating a line of copy and hiding it in the same breath rather than
            a decision, so the line is kept and the hiding is not:
            `docs/adr/0002-figma-is-literal-truth.md`.

            Nothing is drawn when there is no addressee. An envelope addressed
            to a placeholder is worse than an unaddressed one, because the one
            surface of the invitation that is supposed to be a guest's own would
            be carrying somebody else's name.
          */}
          {addressee ? (
            <div className="absolute left-[115px] top-[374px] w-[152px]">
              <AutoFitText
                maxFontSize={16}
                minFontSize={8}
                maxHeight={ADDRESSEE_MAX_HEIGHT}
                className="w-full font-[family-name:var(--font-wt1-mono)] leading-[normal] text-[#090909]">
                {addressee}
              </AutoFitText>
            </div>
          ) : null}

          {/* The seal only lifts. Fading it out here as well would take it off
              the envelope before the lift could be seen, and it is part of the
              closed envelope: the cross-fade above carries it away. */}
          <motion.div
            className="absolute left-[164px] top-[307px] h-[58px] w-[57px]"
            initial={false}
            animate={{ y: opened ? -22 : 0 }}
            transition={step(reduce, OPENING.seal)}>
            <WaxSeal />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * The wax seal, at the 57x58 the design draws it in both of its places.
 *
 * One photograph, cropped the same way on the closed envelope and on the open
 * one - the design gives both the same fill and moves only where it sits and
 * whether it is turned - so the two would drift apart if each wrote the crop
 * out for itself.
 */
function WaxSeal() {
  return (
    <div className="relative h-[58px] w-[57px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute left-[-21.14%] top-[-36.63%] h-[174.45%] w-[142.11%] max-w-none"
          src={`${ASSET}/wax-seal.png`}
        />
      </div>
    </div>
  );
}

export default function Hero({
  content = DEFAULT_WEDDING_TEMPLATE_1_CONTENT,
  addressee,
  onOpen,
  onOpened,
}: {
  content?: WeddingTemplate1Content;
  /** Who this invitation was sent to, drawn on the closed envelope. */
  addressee?: string;
  /**
   * Say that the guest has pressed Open Invitation, inside the press itself.
   *
   * Called synchronously from the click handler rather than folded into
   * `onOpened`, because this is the gesture the Background Track starts on and
   * a browser only lets audio start inside one: `onOpened` arrives on a timer
   * 1.7s later, which Safari no longer counts as the guest asking.
   */
  onOpen?: () => void;
  /**
   * Say that the opening is over and the rest of the invitation is the guest's.
   *
   * The Hero runs the opening, so the Hero is what knows when it has finished;
   * what the rest of the invitation does until then is not the Hero's to decide
   * and is decided by whoever draws it.
   */
  onOpened?: () => void;
}) {
  const sealed = useSealed();
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState(!sealed);
  const envelopeOpened = sealed ? opened : true;

  // Held rather than depended on, so that the opening is timed once. A caller
  // writing the callback inline would otherwise hand over a new one on every
  // render, restart the clock each time, and leave the invitation shut.
  const report = useRef(onOpened);
  useEffect(() => {
    report.current = onOpened;
  }, [onOpened]);

  // The invitation is handed over at the end of the opening rather than at the
  // start of it, so a guest is not scrolling past the envelope while it is
  // still moving. Nothing waits when nothing moves: a guest who has asked for
  // reduced motion is given the invitation at once.
  useEffect(() => {
    if (!sealed || !envelopeOpened) return;
    if (reduce) {
      report.current?.();
      return;
    }
    const opening = window.setTimeout(
      () => report.current?.(),
      OPENING_SECONDS * 1000
    );
    return () => window.clearTimeout(opening);
  }, [sealed, envelopeOpened, reduce]);

  // Drawn at rest wherever the invitation is not Sealed, the same principle
  // `useWeddingReveal` follows: the Site Preview is a picture of the
  // invitation, not the invitation arriving.
  const still = reduce || !sealed;
  const fadeUpMount = (delay: number) => ({
    initial: still ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: still ? undefined : { duration: 0.6, ease: EASE, delay },
  });

  return (
    <section className="relative h-[812px] w-full overflow-hidden bg-[#090909]">
      {/* faint decorative cards behind the envelope */}
      <div className="absolute left-[-32px] top-[16px] flex h-[313px] w-[235px] items-center justify-center">
        <div className="rotate-180 -scale-y-100">
          <div className="relative h-[313px] w-[235px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={`${ASSET}/hero-bg-card.png`}
            />
          </div>
        </div>
      </div>
      <div className="absolute left-[197px] top-[9px] h-[313px] w-[235px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={`${ASSET}/hero-bg-card.png`}
        />
      </div>

      <EnvelopeCard
        sealed={sealed}
        addressee={addressee}
        opened={envelopeOpened}
        reduce={reduce}
        content={content}
      />

      {/* torn paper edge at the bottom */}
      <TornEdge
        box="left-1/2 top-[666px] h-[147px] w-[375px] -translate-x-1/2"
        spin="-rotate-90"
      />

      {/* Open Invitation - only a sealed invitation has anything to open */}
      {sealed && (
        <div className="absolute left-1/2 top-[487px] z-40 -translate-x-1/2">
          <motion.button
            type="button"
            onClick={() => {
              setOpened(true);
              onOpen?.();
            }}
            aria-label="Open invitation"
            className="flex items-center justify-center border border-solid border-[#fafafa] gap-[10px] p-[10px]"
            initial={false}
            animate={{ opacity: opened ? 0 : 1 }}
            whileTap={reduce ? undefined : pressTap}
            // Timed with the seal's lift but as a plain fade: the seal's spring
            // would bounce an opacity, which only clamps.
            transition={step(reduce, {
              delay: OPENING.seal.delay,
              duration: OPENING.seal.duration,
            })}
            style={{ pointerEvents: opened ? 'none' : 'auto' }}>
            <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] leading-[normal] text-[#fafafa]">
              Open Invitation
            </p>
          </motion.button>
        </div>
      )}

      {/* You're Invited heading + subtitle */}
      <motion.div
        className="absolute left-[16px] top-[545px] flex w-[343px] flex-col items-start gap-[2px]"
        {...fadeUpMount(0.35)}>
        <div className="relative h-[82px] w-full">
          <p className="absolute left-[43px] top-0 whitespace-nowrap font-[family-name:var(--font-wt1-script)] text-[64px] leading-[normal] text-[rgba(250,250,250,0.98)]">
            You&rsquo;re Invited
          </p>
          <div className="absolute left-0 top-[74px] h-[0.5px] w-[343px] bg-[#fafafa]" />
        </div>
        <p className="w-full text-center font-[family-name:var(--font-wt1-mono)] text-[12px] leading-[normal] text-white">
          As we begin our journey together, we&rsquo;d love for you to join us
          in celebrating our big day.
        </p>
      </motion.div>
    </section>
  );
}

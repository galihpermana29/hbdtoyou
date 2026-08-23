'use client';

/**
 * Wedding Template 1 - the RSVP a guest replies with. Figma node 312:3846.
 *
 * A torn-paper card under a paperclip, opened by the invitation's RSVP Now
 * control, asking a guest their name, whether they are coming, whether they
 * bring somebody, and a Guest Message the design marks Optional.
 *
 * A reply goes to the couple when there is a guest to sign it with, and stays
 * in the page when there is not. Which of those it is is the whole of what
 * `guest` decides: a personal link resolves to somebody on the Guest List and
 * their reply is posted against the invitation, while the Showcase and the
 * Create Flow's previews are pictures of an invitation that nobody was sent, so
 * a reply left on one has nowhere to go and the card says so above the Submit
 * control rather than letting a guest find out afterwards.
 *
 * A guest is identified by their token, so their name is read out of the Guest
 * List rather than typed: the design draws a Name field, so it stays drawn and
 * becomes read-only wherever the list holds a name, because a guest confirming
 * who they are is truer than typing a name the backend discards.
 *
 * The lines this card prints about what became of a reply are copy the design
 * does not draw - see `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * It behaves as a dialog rather than as a card that happens to be on top, and
 * it shares the whole of how with the Create Flow's Play Preview - see
 * `src/hooks/use-dialog-behaviour.ts`.
 */

import { motion, useReducedMotion } from 'framer-motion';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from 'react';

import { GUEST_ALREADY_RESPONDED, RATE_LIMITED } from '@/action/interfaces';
import { submitWeddingRsvp } from '@/action/wedding-api';
import { useDialogBehaviour } from '@/hooks/use-dialog-behaviour';

import { PaperGround, TornEdge } from './TornPaper';
import { EASE, pressTap, REDUCED_FADE } from './variants';
import { useFitToPhone } from './use-fit-to-phone';

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
 * The guest a reply is signed with, and the invitation it is posted against.
 *
 * Present only where the invitation is somebody's and the link that opened it
 * was one guest's: the Showcase and the Create Flow's previews have neither, and
 * a published invitation opened at its bare address has an invitation but no
 * guest on the end of it.
 */
export interface ReplyingGuest {
  /** The invitation's public address, which the reply is posted against. */
  slug: string;
  /** The half of the personal link that says which guest is replying. */
  token: string;
  /**
   * Their name as the Guest List holds it, or empty where the row carries
   * none. The token is what says who they are, so a nameless row is still a
   * guest who can reply - it is only the name that has to be asked for.
   */
  name: string;
  /**
   * How many people a yes to the plus one question counts as: the MaxPlusOnes
   * the Guest List holds for this guest, or one where their row carries no
   * number. The design asks whether they bring somebody rather than how many,
   * so yes claims every seat the couple allowed them - a guest allowed two who
   * could only ever say one was the gap `hbd-381` was about.
   */
  maxPlusOnes: number;
}

/** What became of a reply, in the shape a save's outcome is told in. */
type ReplyOutcome =
  /** The couple has it. */
  | 'SENT'
  /** The couple already had one from this guest, and keeps that first one. */
  | 'ALREADY_REPLIED'
  /** It was refused or never arrived, and `problem` says so. */
  | 'FAILED';

/**
 * What a guest is told for the two outcomes that are nobody's fault.
 *
 * Already replied is a refusal rather than a failure: a guest may answer once,
 * the backend is what enforces it, and saying which answer counts is different
 * from telling somebody who did nothing wrong that something went wrong.
 */
const REPLY_WORDS: Record<Exclude<ReplyOutcome, 'FAILED'>, string> = {
  SENT: 'Thank you. Your reply is with the couple.',
  ALREADY_REPLIED:
    'You have already replied to this invitation. The couple has that first ' +
    'answer, and it is the one that counts.',
};

/**
 * How long a reply that landed stays on the screen before the card puts itself
 * away.
 *
 * Long enough to read the line above Submit, which is the only place a guest is
 * told their reply arrived. Closing on the same tick would take the answer away
 * before it could be read, which is the same as never having said it: a guest
 * would be left looking at the invitation wondering whether the press worked.
 * Long enough to read one short sentence and no longer - a card that lingers
 * after it has nothing left to say is a card somebody has to dismiss twice.
 */
const DWELL_ON_A_SENT_REPLY = 1600;

/**
 * What a rate-limited guest reads: a failure, but one with its own words.
 *
 * The backend limits replies by IP, so a wedding party replying from one
 * venue's wifi can be told to wait through no fault of their own. Waiting is
 * the whole of the remedy, so the line says so rather than printing the
 * backend's `RATE_LIMITED` at them - and it stays a failure rather than a
 * settled reply, so Submit stays pressable for the retry it asks for.
 */
const RATE_LIMITED_WORDS =
  'Your reply has not gone through just yet: too many replies arrived at ' +
  'once. Nothing you have written has been lost - wait a moment, then press ' +
  'Submit again.';

/**
 * What they read when the reply did not reach the couple.
 *
 * The same three things the Create Flow tells a couple whose save failed: what
 * did not happen, what the backend gave as the reason, and that nothing they
 * wrote is gone. Only the failures the backend has named get words of their
 * own - `GUEST_ALREADY_RESPONDED` and `RATE_LIMITED` above - and everything
 * else stays this generic on purpose, because inventing a friendlier reason
 * for an unnamed failure would be guessing.
 */
function replyProblem(reason: string): string {
  return (
    `Your reply did not reach the couple: ${reason}. Nothing you have ` +
    'written has been lost, so you can try again.'
  );
}

/**
 * The line the card prints where a reply has nowhere to go.
 *
 * Recorded in `docs/adr/0002-figma-is-literal-truth.md` and claimed in
 * `visual/expectations/wedding-template-1-rsvp.mjs`, which is the Showcase's
 * card and is exactly such a one.
 */
const UNSENT_NOTE =
  'Nothing is saved yet. Your reply stays on this page and goes when you ' +
  'reload it.';

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

/**
 * One piece of this card's torn edge.
 *
 * The size is said here rather than on each of the eight below, because it is a
 * fact about the card and not about any one tear: a ninth piece that forgot it
 * would be drawn at the Love Story's size in the middle of the card's.
 */
function CardEdge(props: Omit<ComponentProps<typeof TornEdge>, 'scale'>) {
  return <TornEdge {...props} scale={TORN} />;
}

/**
 * The paper the reply is written on: the invitation's own ground with torn
 * edges hanging off all four sides of it.
 *
 * The design lays ten pieces around the card at fixed offsets down a 534-tall
 * paper; they are anchored to the card's four edges here instead, because this
 * card is a line of copy taller than the design's and a guest's own answer can
 * make it taller still.
 */
function Paper() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Along the top, a long piece and a short one. */}
      <CardEdge
        box="left-[-22px] top-[-45px] h-[139.72px] w-[356.42px]"
        spin="-rotate-90 -scale-y-100"
      />
      <CardEdge
        box="left-[-48px] top-[-45px] h-[49.42px] w-[275.63px]"
        spin="-rotate-90"
        long={false}
      />

      {/* The same pair along the bottom, turned the other way. */}
      <CardEdge
        box="bottom-[-33px] left-[-22px] h-[139.72px] w-[356.42px]"
        spin="rotate-90"
      />
      <CardEdge
        box="bottom-[-33px] left-[-48px] h-[49.42px] w-[275.63px]"
        spin="rotate-90 -scale-y-100"
        long={false}
      />

      {/* Down the left, one piece from the top and one from the bottom. */}
      <CardEdge
        box="left-[-40px] top-0 h-[356.42px] w-[139.72px]"
        spin="rotate-180 -scale-y-100"
      />
      <CardEdge
        box="bottom-0 left-[-36px] h-[356.42px] w-[139.72px]"
        spin="rotate-180"
      />

      {/* And the mirror of those two down the right. */}
      <CardEdge box="right-[-40px] top-0 h-[356.42px] w-[139.72px]" spin="" />
      <CardEdge
        box="bottom-0 right-[-36px] h-[356.42px] w-[139.72px]"
        spin="-scale-y-100"
      />

      <PaperGround />
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
  guest,
  onClose,
  onKeep,
  onSent,
}: {
  /**
   * Who is replying and where their reply goes, or nothing where the
   * invitation was sent to nobody.
   */
  guest?: ReplyingGuest;
  /** Put the card away, changing nothing. */
  onClose: () => void;
  /** Take a reply that has nowhere to go, which is all a preview can do. */
  onKeep: (rsvp: Rsvp) => void;
  /**
   * The couple has this reply. Called once, a moment after it landed, so that
   * whoever holds the card can put it away and read the wall back.
   *
   * It must not change between renders, or the moment restarts on every one and
   * never arrives.
   */
  onSent: (rsvp: Rsvp) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const titleId = useId();
  const nameId = useId();
  const messageId = useId();
  const optionalId = useId();

  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOne, setPlusOne] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<ReplyOutcome | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  /** The reply the couple now has, which is what closes the card. */
  const [landed, setLanded] = useState<Rsvp | null>(null);

  /**
   * The name the Guest List holds for whoever is replying, where it holds one.
   *
   * A row with no name leaves the field to the guest: the token is what says
   * who they are either way, and a read-only empty box would be asking them to
   * confirm nothing.
   */
  const knownName = guest?.name.trim() ?? '';

  /** A reply the couple has, or already had, is one no further press changes. */
  const settled = outcome === 'SENT' || outcome === 'ALREADY_REPLIED';

  /**
   * The one line above Submit, which says whatever is true of this reply: what
   * became of it where there was somewhere to send it, and that there is not
   * where there is not.
   *
   * Nothing at all until a reply that can be sent has been, so a card nobody
   * has pressed yet is the card the design draws.
   */
  const saidOfTheReply = guest
    ? outcome === 'FAILED'
      ? problem
      : outcome && REPLY_WORDS[outcome]
    : UNSENT_NOTE;

  // The card takes focus itself rather than handing it to the Name field, which
  // is what leaving `initialFocus` out asks for: it is read on a phone, where
  // focusing a text field raises the keyboard over half of what a guest has
  // just opened, and the first thing they should see is the question rather
  // than the answer box.
  //
  // What gets focus back when the card goes is RSVP Now, the control that
  // opened it: a guest who reached the card from the keyboard would otherwise
  // be put at the top of a five-thousand-pixel invitation for having closed it.
  useDialogBehaviour(dialogRef, onClose);

  // A reply that landed closes the card itself rather than leaving a guest to
  // dismiss a form they have finished with, and it is handed on so the wall can
  // be read back with their own words on it. The timer is cleared if the card
  // goes first, so a guest who closes it themselves in that moment is not
  // followed by a page that reloads under the invitation they went back to.
  useEffect(() => {
    if (!landed) return;
    const closing = window.setTimeout(
      () => onSent(landed),
      DWELL_ON_A_SENT_REPLY
    );
    return () => window.clearTimeout(closing);
  }, [landed, onSent]);

  // The card is a 375px-wide composition like the invitation behind it, and
  // it opens over the window, so on a phone narrower than that it is scaled
  // rather than sliced: see `use-fit-to-phone.ts`.
  const fit = useFitToPhone<HTMLFormElement>();

  const reply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The browser will not submit the form until every question is answered,
    // so an unanswered one cannot arrive here. Both are still read as answered
    // or not rather than coerced, because a reply that quietly said "not
    // coming" for somebody who had said nothing would be worse than no reply.
    if (attending === null || plusOne === null) return;
    // A reply already in flight, and one the couple already has, are both
    // presses that cannot do anything: the control is disabled for each, and
    // this is the other half of that, for a form submitted some other way.
    if (sending || settled) return;

    const rsvp: Rsvp = {
      name: knownName || name.trim(),
      attending,
      plusOne,
      message: message.trim(),
      repliedAt: new Date(),
    };

    // Nobody to sign it with, so it goes no further than the page that took it.
    if (!guest) {
      onKeep(rsvp);
      return;
    }

    setSending(true);
    // Whatever the last press had to say, because this one is what the line
    // above Submit is about now.
    setOutcome(null);
    setProblem(null);
    try {
      const sent = await submitWeddingRsvp(
        {
          is_attending: rsvp.attending,
          // The design asks whether a guest brings somebody and the backend
          // counts how many, so yes is every seat the Guest List allows this
          // guest and no is none - `hbd-381`.
          plus_one_count: rsvp.plusOne ? guest.maxPlusOnes : 0,
          // An empty message is left out rather than sent as nothing, so the
          // couple's reply list holds a message only where a guest wrote one.
          message: rsvp.message || undefined,
        },
        guest.slug,
        guest.token
      );
      if (sent.success) {
        setOutcome('SENT');
        setLanded(rsvp);
      } else if (sent.message === GUEST_ALREADY_RESPONDED) {
        setOutcome('ALREADY_REPLIED');
      } else if (sent.message === RATE_LIMITED) {
        setProblem(RATE_LIMITED_WORDS);
        setOutcome('FAILED');
      } else {
        setProblem(replyProblem(sent.message));
        setOutcome('FAILED');
      }
    } catch (error) {
      // The wedding client answers with a result rather than throwing, network
      // failures included, so this is only reached if it ever stops doing that
      // or the action itself cannot be reached. A guest is told either way,
      // because the alternative is a press that appeared to do nothing.
      setProblem(
        replyProblem(error instanceof Error ? error.message : String(error))
      );
      setOutcome('FAILED');
    } finally {
      setSending(false);
    }
  };

  /**
   * How the card arrives and leaves. Opening a reply card is a guest's own
   * act, once, so it earns a modal's full animation: the dark ground fades in
   * and the card rises into place with a paper-weight settle. Closing is the
   * same path back at half the time - leaving should never make anybody wait.
   * A guest who asked for reduced motion still sees the card arrive and leave
   * rather than a hard cut - a brief opacity-only fade, with the movement (the
   * rise and the settle) dropped. Gentler, not zero.
   *
   * The card's rise rides on the form, which is safe because `useFitToPhone`
   * scales with `zoom` rather than `transform` - the two never fight.
   */
  const gentleFade = {
    initial: { opacity: 0 },
    transition: REDUCED_FADE,
    exit: { opacity: 0, transition: REDUCED_FADE },
  };
  const backdrop = reduce
    ? gentleFade
    : {
        initial: { opacity: 0 },
        transition: { duration: 0.25, ease: EASE },
        exit: { opacity: 0, transition: { duration: 0.2, ease: EASE } },
      };
  const card = reduce
    ? gentleFade
    : {
        initial: { opacity: 0, y: 24, scale: 0.97 },
        transition: { type: 'spring' as const, duration: 0.45, bounce: 0.15 },
        exit: {
          opacity: 0,
          y: 12,
          scale: 0.98,
          transition: { duration: 0.2, ease: EASE },
        },
      };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      {...backdrop}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#090909]/80 outline-none">
      <motion.form
        ref={fit.frame}
        style={fit.style}
        onSubmit={reply}
        {...card}
        animate={{ opacity: 1, y: 0, scale: 1 }}
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
              {/*
                A guest who came by their own link is shown the name the Guest
                List holds for them and cannot change it: the backend knows who
                they are from the token, so a typed name would be discarded and
                a field that took one would be asking for something nobody
                reads. Read-only rather than disabled, because it is still
                theirs to read, select and copy, and a disabled field is
                skipped by everything that walks a form.
              */}
              <input
                id={nameId}
                type="text"
                value={knownName || name}
                onChange={(event) => setName(event.target.value)}
                readOnly={knownName !== ''}
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
              {/*
                One line above Submit, in the small grey setting the design
                already uses for the Optional beside a question.

                Drawn only when there is something to say, because an empty one
                would still take its 12 of the gap the design draws between
                these three and put a band of nothing above Submit. It is a live
                region so that what became of a press is announced and not only
                shown - a guest who cannot see the line has pressed a control
                that would otherwise appear to have done nothing.
              */}
              {saidOfTheReply && (
                // What became of a press eases in rather than snapping, so the
                // eye is led to the one line that answers it.
                <motion.p
                  role="status"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="font-[family-name:var(--font-wt1-mono)] text-[10px] font-semibold leading-[normal] text-[#898989]">
                  {saidOfTheReply}
                </motion.p>
              )}
              <motion.button
                type="submit"
                disabled={sending || settled}
                whileTap={reduce ? undefined : pressTap}
                className="flex items-center justify-center gap-[10px] border border-solid border-[#fafafa] bg-[#000000] p-[10px]">
                <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#fafafa]">
                  Submit
                </p>
              </motion.button>
              <motion.button
                type="button"
                onClick={onClose}
                whileTap={reduce ? undefined : pressTap}
                className="flex items-center justify-center gap-[10px] border border-solid border-[#000000] p-[10px]">
                <p className="whitespace-nowrap font-[family-name:var(--font-wt1-mono)] text-[12px] font-normal leading-[normal] text-[#000000]">
                  Close
                </p>
              </motion.button>
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
      </motion.form>
    </motion.div>
  );
}

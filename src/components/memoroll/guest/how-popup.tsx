'use client';

import howDay from '@/assets/memoroll/how-day.png';
import howReveal from '@/assets/memoroll/how-reveal.png';
import howShots from '@/assets/memoroll/how-shots.png';
import { motion, useReducedMotion } from 'framer-motion';
import Cta from '../ui/cta';

/**
 * "Here's how Memoroll works" (guest-11/12): the three rules of the product,
 * shown once over the camera on a guest's first entry - the designer's own
 * note on the frame says so ("Muncul sekali aja pas awal masuk"). Whether
 * this is that first entry is the caller's to know; this is only the card.
 *
 * The card wears the viewfinder's chrome - the same #3b3a3a, the same radius,
 * the same stroke - so the rules read as something the camera itself is
 * telling you. The stroke is a gradient in the design (#232323 -> #808080 ->
 * #5e5e5e), which CSS borders cannot hold; the mid-grey the frame shows
 * stands in for it, the same stand-in the viewfinder uses.
 *
 * The three icons are the designer's own illustrations, cropped from the
 * captured frame at 2x (docs/design/memoroll/frames/guest-11-popup-how-a.jpg)
 * because the capture holds them only as vector soup. Their grounds carry the
 * card's own composite colour, so they sit seamlessly on it.
 */

const RULES = [
  {
    icon: howDay.src,
    copy: (
      <>
        Memoroll <strong className="font-bold">starts</strong> on the day of the
        event.
      </>
    ),
    read: 'Memoroll starts on the day of the event.',
  },
  {
    icon: howShots.src,
    copy: (shots: number) => (
      <>
        Each person gets <strong className="font-bold">{shots} shots</strong>.
        That&apos;s it. No retakes, no camera roll uploads.
      </>
    ),
    read: (shots: number) =>
      `Each person gets ${shots} shots. That's it. No retakes, no camera roll uploads.`,
  },
  {
    icon: howReveal.src,
    copy: (
      <>
        Nobody sees anything until the big reveal.{' '}
        <strong className="font-bold">Suspense is the point.</strong>
      </>
    ),
    read: 'Nobody sees anything until the big reveal. Suspense is the point.',
  },
];

/**
 * The card itself, for anything the camera has to tell a guest: a title, a
 * few rows of an illustration beside a sentence, and one way forward. The
 * rules popup is one; the note under a print that has not opened yet
 * (locked-popup.tsx) is another, and they are the same card on purpose.
 *
 * `pinned` holds it to the viewport rather than to its parent: the camera
 * screen is exactly one screen tall, the gallery scrolls.
 */
export function PopupCard({
  title,
  rows,
  action,
  onAction,
  onDismiss,
  pinned = false,
}: {
  title: string;
  rows: Array<{ icon: string; read: string; copy: React.ReactNode }>;
  action: string;
  onAction: () => void;
  /** A tap on the dimmed ground, where the card may be waved away. */
  onDismiss?: () => void;
  pinned?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.12 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={onDismiss}
      className={
        pinned
          ? 'fixed inset-0 z-50 flex items-center justify-center px-[30px]'
          : 'absolute inset-0 z-30 flex items-center justify-center px-[30px]'
      }
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={
          reduce
            ? { duration: 0.12, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[316px] rounded-[16px] p-[8px]"
        style={{
          background: '#3b3a3a',
          border: '1px solid #808080',
          boxShadow:
            'inset -2px 2px 6.1px rgba(35, 35, 35, 1), inset 2px -2px 6.1px rgba(35, 35, 35, 1)',
        }}>
        <div className="flex flex-col gap-[24px] rounded-[8px] pb-[24px] pl-[12px] pr-[12px] pt-[10px]">
          <h2
            className="py-[8px] text-center text-[20px] font-bold leading-[150%] tracking-[-0.011em]"
            style={{ color: '#eee9e8' }}>
            {title}
          </h2>
          <div className="flex flex-col gap-[12px]">
            {rows.map((row) => (
              <div
                key={row.read}
                className="rounded-[20px] p-[10px]"
                style={{ background: 'rgba(239, 234, 233, 0.3)' }}>
                <div className="flex items-center gap-[12px]">
                  <img
                    src={row.icon}
                    alt=""
                    aria-hidden
                    className="h-[56px] w-[56px] shrink-0 rounded-[12px]"
                  />
                  <p
                    className="text-[14px] font-normal leading-[150%] tracking-[-0.011em]"
                    style={{ color: '#eee9e8' }}>
                    {row.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Cta onClick={onAction} className="w-full">
            {action}
          </Cta>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HowPopup({
  shots,
  onDone,
}: {
  /**
   * The Roll this event hands out. The design's frame says 10 because its
   * creator configured 10; the designer's note on it says the number follows
   * the config ("'10 Shots' nya ngikutin config harusnya", 2026-08-25).
   */
  shots: number;
  onDone: () => void;
}) {
  return (
    <PopupCard
      title="Here’s how Memoroll works"
      rows={RULES.map((rule) => ({
        icon: rule.icon,
        read: typeof rule.read === 'function' ? rule.read(shots) : rule.read,
        copy: typeof rule.copy === 'function' ? rule.copy(shots) : rule.copy,
      }))}
      action="Got it"
      onAction={onDone}
    />
  );
}

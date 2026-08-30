import { colour, type } from './tokens';

/**
 * The creator's stepper: a window of numbers, and the name of the step under
 * them.
 *
 * The design lays its creator frames out in a different order than they run,
 * and this is what settles the argument - the numbers are drawn on every frame
 * and the highest lit one is the step you are on. The order the frames sit in
 * is not evidence of anything.
 *
 * It is a window rather than the whole eight. The design never shows more than
 * three marks: the step before, the step you are on, and the step after, and it
 * pads the missing side rather than filling it, so the first step opens with
 * empty track to its left and the last ends with empty track to its right. That
 * is what makes an eight-step flow fit across a phone at a size somebody can
 * read.
 *
 * The bar behind the current mark is filled the whole way, the bar in front of
 * it is filled half: what is done is done, and what you are on is half done.
 */
export default function Stepper({
  step,
  total,
  title,
}: {
  /** 1-based, the way the design's own marks are numbered. */
  step: number;
  total: number;
  /** The step's own name: "Choose your vibe", "Venue & Location". */
  title: string;
}) {
  const before = step > 1 ? step - 1 : null;
  const after = step < total ? step + 1 : null;

  return (
    <div className="flex w-full flex-col pt-[4px]">
      <div
        role="group"
        aria-label={`Step ${step} of ${total}: ${title}`}
        className="flex w-full items-center py-[4px]">
        {before === null ? (
          <span className="w-[175px] shrink-0" />
        ) : (
          <>
            <Mark number={before} lit />
            <Bar filled="all" />
          </>
        )}

        <Mark number={step} lit />

        {after === null ? (
          <span className="flex-1" />
        ) : (
          <>
            <Bar filled="half" />
            <Mark number={after} />
          </>
        )}
      </div>

      <p
        className={`text-center ${type.mark}`}
        style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
        {title}
      </p>
    </div>
  );
}

/** One numbered mark: the flame once it is reached, grey until then. */
function Mark({ number, lit = false }: { number: number; lit?: boolean }) {
  return (
    <span
      className={`z-10 inline-flex shrink-0 items-center justify-center rounded-full px-[4px] py-[4px] ${type.mark}`}
      style={{
        minWidth: 25,
        background: lit ? colour.flame : colour.track,
        color: lit ? '#ffffff' : colour.muted,
        fontFamily: 'var(--font-mr-body)',
      }}>
      {number}
    </span>
  );
}

/**
 * The track between two marks.
 *
 * Tucked two pixels under the marks on either side, which is the design's own
 * negative gap and what stops a hairline of paper showing where a round mark
 * meets a square-ended bar.
 *
 * The track is square and only the flame inside it is rounded, at its leading
 * end alone: the design gives the fill a corner of 100 on its right and 0 on
 * its left, so a half-filled bar ends in a cap and begins under a mark.
 */
function Bar({ filled }: { filled: 'all' | 'half' }) {
  return (
    <span className="-mx-[2px] h-[4px] flex-1" style={{ background: colour.track }}>
      <span
        className="block h-full rounded-r-full"
        style={{
          background: colour.flame,
          width: filled === 'all' ? '100%' : '50%',
        }}
      />
    </span>
  );
}

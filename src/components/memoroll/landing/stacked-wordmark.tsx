import Image from 'next/image';

/**
 * The MEMO / R▭LL logo as the landing page draws it: two lines of Passion One
 * with the camera lozenge set over the gap where the second line's O would be.
 *
 * This is not `ui/wordmark.tsx`, which is the same name on one line for the
 * phone screens. The landing's logo is a different arrangement of the same
 * letters, so it is its own component rather than a prop on that one.
 *
 * The three text runs are placed on the design's own coordinates, which is why
 * they are absolute inside a 230x120 box: the camera overlaps the R and the
 * first L, and flow layout would push them apart. The family is set on each
 * run, not on the box, because globals.css sets one on every `p`.
 */
const run =
  'absolute font-bold [font-family:var(--font-mr-display)] not-italic leading-[1.5] tracking-[-0.011em] text-[#232323] text-[86.331px] [text-box:trim-both_cap_alphabetic]';

export default function StackedWordmark({
  className = '',
  scale = 1,
}: {
  className?: string;
  /** 1 is the 230x120 the first design draws; the redesign draws it at 0.6335. */
  scale?: number;
}) {
  return (
    <div
      role="img"
      aria-label="MemoRoll"
      className={`relative shrink-0 ${className}`}
      style={{ width: 229.64 * scale, height: 120 * scale }}>
      <div
        className="absolute left-0 top-0 h-[120px] w-[229.64px] overflow-clip"
        style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <p
          aria-hidden="true"
          className={`${run} left-[110.5px] top-[1.73px] w-[221.007px] -translate-x-1/2 text-center`}>
          MEMO
        </p>
        <p
          aria-hidden="true"
          className={`${run} left-0 top-[66.47px] w-[50.935px]`}>
          R
        </p>
        <p
          aria-hidden="true"
          className={`${run} left-[227.91px] top-[66.47px] w-[73.381px] -translate-x-full text-right`}>
          LL
        </p>
        <Image
          src="/memoroll-landing/camera.svg"
          alt=""
          width={107.05}
          height={56.1152}
          className="absolute left-[48.35px] top-[63.88px] h-[56.115px] w-[107.051px] max-w-none"
          unoptimized
        />
      </div>
    </div>
  );
}

import { colour } from './tokens';

/**
 * The split-flap counter the design counts down on.
 *
 * It appears twice at two sizes: large under "Come back when the function
 * begins", with days / hours / Minutes / seconds written beneath it, and small
 * beside "Ends in" at the top of the gallery. One component, because a second
 * implementation of a flap tile is a second thing to get subtly wrong.
 *
 * The design draws each tile as vector artwork with the digit baked in, which
 * is fine for a mockup showing 6 and 7 forever and no use to a counter that has
 * to say 09. So the tile is rebuilt rather than exported: a dark rounded card,
 * a white digit, and the hairline seam across the middle where the flap folds.
 * Style and arrangement match; the dimensions are ours, which is what ADR 0002
 * asks for.
 *
 * It does not animate. Nothing in the capture says a flap turns, and inventing
 * a flip that the design never asked for would be louder than the screen it
 * sits on.
 */

/** One digit on one flap. */
function Tile({ digit, size }: { digit: string; size: Size }) {
  const s = SIZES[size];
  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden"
      style={{
        width: s.tileW,
        height: s.tileH,
        borderRadius: s.radius,
        background: colour.inkSoft,
      }}>
      <span
        className="font-bold leading-none text-white"
        style={{ fontSize: s.digit, fontFamily: 'var(--font-mr-body)' }}>
        {digit}
      </span>
      {/* The fold. The paper ground shows through it, so it is the ground's
          own colour rather than a translucent black that would go muddy on the
          camera's dark screens. */}
      <span
        aria-hidden
        className="absolute inset-x-0"
        style={{
          top: '50%',
          height: s.seam,
          marginTop: -s.seam / 2,
          background: colour.paper,
        }}
      />
    </span>
  );
}

type Size = 'large' | 'small';

const SIZES = {
  /** The countdown screen. */
  large: {
    tileW: 35.43,
    tileH: 47.64,
    digit: 34,
    radius: 4,
    seam: 1,
    gap: 5.95,
  },
  /** "Ends in", at the top of the gallery. */
  small: { tileW: 17, tileH: 22, digit: 16, radius: 2.5, seam: 0.75, gap: 2.5 },
} as const;

/**
 * A number as flaps, always at least two digits, because a counter that
 * narrows from 10 to 9 makes the row beside it jump.
 */
export function FlipNumber({
  value,
  size = 'large',
  label,
}: {
  value: number;
  size?: Size;
  /** Read out in place of the digits, which are meaningless one at a time. */
  label: string;
}) {
  const s = SIZES[size];
  const digits = String(Math.max(0, Math.floor(value))).padStart(2, '0');
  return (
    <span
      className="inline-flex"
      style={{ gap: s.gap }}
      role="text"
      aria-label={`${value} ${label}`}>
      {digits.split('').map((digit, i) => (
        <Tile key={i} digit={digit} size={size} />
      ))}
    </span>
  );
}

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * The countdown screen's four units. The unit words are the design's own,
 * including the capital M on "Minutes" that its neighbours do not have.
 */
export function FlipCountdown({ remaining }: { remaining: Remaining }) {
  const units: Array<[keyof Remaining, string]> = [
    ['days', 'days'],
    ['hours', 'hours'],
    ['minutes', 'Minutes'],
    ['seconds', 'seconds'],
  ];

  return (
    <div className="flex items-start justify-center" style={{ gap: 11.91 }}>
      {units.map(([key, word]) => (
        <div
          key={key}
          className="flex flex-col items-center"
          style={{ gap: 4 }}>
          <FlipNumber value={remaining[key]} label={word} />
          <span
            className="text-center text-[12px] font-semibold leading-[150%]"
            style={{
              color: colour.inkSoft,
              fontFamily: 'var(--font-mr-body)',
            }}>
            {word}
          </span>
        </div>
      ))}
    </div>
  );
}

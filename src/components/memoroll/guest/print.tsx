import { colour } from '../ui/tokens';

/**
 * One photograph as the gallery prints it: a white paper border, the stacked
 * drop shadow that lifts it off the page, and the two things burned into its
 * bottom edge - the Date Stamp in the flame-orange a point-and-shoot exposes
 * it in, and the shooter's name signing the print in white.
 *
 * The design draws this print at three sizes and they are the same print, so
 * this is one component with a size rather than three drifting copies: `grid`
 * in the gallery's rows of three, `bath` in the Dark Room's developer tray,
 * `card` in the swipeable preview. Each size keeps its own capture's numbers -
 * border, shadow, stamp and signature do not scale linearly in the design, so
 * they are read per size rather than derived.
 *
 * What covers the photograph is the whole product (docs/design/memoroll,
 * "the two gates"):
 *
 * - `veiled` is an Undeveloped Shot, or somebody else's before the Reveal:
 *   near-black under an 80% veil, softly blurred, with nothing printed on it.
 *   There is no way to peek, so the veil hides the stamp and the signature
 *   along with the pixels.
 * - `blur` is the Dark Room mid-develop: the photograph is visible but not yet
 *   sharp, and its stamp and signature sharpen with it because they sit inside
 *   the blurred layer, exactly as the design draws them.
 * - neither is a developed print, sharp and signed.
 *
 * The blur is a real `filter: blur()` on the clipped layer, never a colour
 * overlay: CSS applies the filter after the clip the same way Figma applies
 * LAYER_BLUR, so the darkness bleeds softly over the white border, which is
 * what makes a hidden print read as latent rather than censored.
 *
 * A guest's own baked Shot already carries its Date Stamp in the pixels
 * (ADR 0006), so a renderer passes `stamp: null` for those rather than
 * printing it a second time. The signature is the renderer's to draw - a name
 * is never baked.
 *
 * Everything here is a span, so a caller may wrap the print in a real
 * `<button>` and stay valid HTML.
 */

export type PrintSize = 'grid' | 'bath' | 'card';

const SIZES: Record<
  PrintSize,
  {
    pad: number;
    aspect: string;
    shadow: string;
    stamp: number;
    name: number;
    chipPad: string;
  }
> = {
  /** The gallery's rows of three (guest-13/14/15/16/18). */
  grid: {
    pad: 3,
    aspect: '108.36 / 143.41',
    shadow: [
      '0.48px 0.48px 1.19px rgba(0,0,0,0.12)',
      '1.66px 1.66px 2.38px rgba(0,0,0,0.11)',
      '3.56px 3.8px 3.09px rgba(0,0,0,0.06)',
      '6.18px 6.89px 3.8px rgba(0,0,0,0.02)',
      '9.74px 10.69px 4.04px rgba(0,0,0,0)',
    ].join(', '),
    stamp: 5.5,
    name: 8,
    chipPad: '4.48px 5.98px',
  },
  /** The Dark Room's developer tray (guest-17). */
  bath: {
    pad: 6,
    aspect: '242.13 / 290.39',
    shadow: [
      '0.96px 0.96px 2.4px rgba(0,0,0,0.12)',
      '3.37px 3.37px 4.81px rgba(0,0,0,0.11)',
      '7.21px 7.7px 6.25px rgba(0,0,0,0.06)',
      '12.51px 13.95px 7.7px rgba(0,0,0,0.02)',
      '19.72px 21.64px 8.18px rgba(0,0,0,0)',
    ].join(', '),
    stamp: 11.13,
    name: 16.2,
    chipPad: '9.07px 12.1px',
  },
  /** The preview's swipeable deck (guest-19/20). */
  card: {
    pad: 7,
    aspect: '281.88 / 338.06',
    shadow: [
      '1.12px 1.12px 2.8px rgba(0,0,0,0.12)',
      '3.92px 3.92px 5.6px rgba(0,0,0,0.11)',
      '8.4px 8.96px 7.28px rgba(0,0,0,0.06)',
      '14.56px 16.24px 8.96px rgba(0,0,0,0.02)',
      '22.96px 25.2px 9.52px rgba(0,0,0,0)',
    ].join(', '),
    stamp: 10,
    name: 18.86,
    chipPad: '10.56px 14.09px',
  },
};

export default function RollPrint({
  src,
  size,
  veiled = false,
  blur = 0,
  stamp = null,
  shooter = null,
  className = '',
  style,
}: {
  src: string;
  size: PrintSize;
  /** Undeveloped, or not yet Revealed: the 80% veil and the soft blur. */
  veiled?: boolean;
  /** Mid-develop in the Dark Room: how far from sharp, in pixels. */
  blur?: number;
  /** The Date Stamp, unless it is already baked into the pixels (ADR 0006). */
  stamp?: string | null;
  /** Who took this. Not printed in the collective ALL grid, where that is the secret. */
  shooter?: string | null;
  className?: string;
  style?: React.CSSProperties;
}) {
  const s = SIZES[size];
  const softened = veiled ? 4 : blur;

  return (
    <span
      role="img"
      aria-label={
        veiled
          ? 'A shot, still undeveloped'
          : shooter
            ? `A shot ${shooter} took`
            : 'A shot'
      }
      className={`block bg-white ${className}`}
      style={{ padding: s.pad, boxShadow: s.shadow, ...style }}>
      <span
        className="relative block overflow-hidden transition-[filter] duration-700 ease-out motion-reduce:transition-none"
        style={{
          aspectRatio: s.aspect,
          filter: softened > 0 ? `blur(${softened}px)` : undefined,
        }}>
        <img src={src} alt="" className="block h-full w-full object-cover" />
        {veiled ? (
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          />
        ) : (
          (stamp || shooter) && (
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between">
              <span className="flex" style={{ padding: s.chipPad }}>
                {stamp && (
                  <span
                    className="font-medium leading-[150%] tracking-[-0.011em]"
                    style={{
                      fontSize: s.stamp,
                      color: colour.stamp,
                      fontFamily: 'var(--font-mr-body)',
                    }}>
                    {stamp}
                  </span>
                )}
              </span>
              <span className="flex" style={{ padding: s.chipPad }}>
                {shooter && (
                  <span
                    className="font-medium leading-[150%] tracking-[-0.011em] text-white"
                    style={{
                      fontSize: s.name,
                      fontFamily: 'var(--font-mr-body)',
                    }}>
                    {shooter}
                  </span>
                )}
              </span>
            </span>
          )
        )}
      </span>
    </span>
  );
}

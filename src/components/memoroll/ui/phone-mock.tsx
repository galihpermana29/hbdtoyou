import { colour, PHONE_WIDTH } from './tokens';

/** The design's phone is 375 by 812, and the mock is that at a smaller size. */
const PHONE_HEIGHT = 812;

/**
 * The bezel, in the phone's own 375-wide space.
 *
 * The design draws this mock twice at two sizes - 154 wide on "Make it yours",
 * 209 on "Ready to publish" - and every value in both is the same number times
 * the same scale. So it is recorded once, at full size, and scaled: 7.56 of
 * padding at 209 and 5.58 at 154 are both 14.6 here, and 22.69 and 16.73 of
 * corner are both 43.9.
 */
const BEZEL = { padding: 14.6, radius: 43.9, screenRadius: 29.3 };

/** How wide the whole mock is at full size: the phone, plus its bezel. */
const MOCK_WIDTH = PHONE_WIDTH + BEZEL.padding * 2;

/**
 * A screen shown inside a phone, which is how the creator sees the Cover they
 * are making.
 *
 * What goes inside is the real screen at its real size, shrunk. Not a drawing
 * of one, and not a second Cover built to fit a small box: the creator is being
 * shown what a guest will get, and the only way that stays true is if it is the
 * same component (ADR 0007). Scaling is what makes that affordable - the Cover
 * lays itself out at 375 as it always does, and a transform makes it small.
 *
 * It is out of reach as well as out of the accessibility tree. The Cover has a
 * button on it and the creator is not the guest who presses it, so nothing here
 * can be tabbed to or read out as a control.
 */
export default function PhoneMock({
  width,
  className = '',
  children,
}: {
  /**
   * How wide the design draws this mock: 154 on "Make it yours", 209 on "Ready
   * to publish". The scale follows from it, so a caller states the number that
   * is in the design rather than one worked out from it.
   */
  width: number;
  className?: string;
  children: React.ReactNode;
}) {
  const scale = width / MOCK_WIDTH;
  const outerWidth = MOCK_WIDTH;
  const outerHeight = PHONE_HEIGHT + BEZEL.padding * 2;

  return (
    <div
      aria-hidden
      // @ts-expect-error React 18's types predate `inert`, and `inert` is what takes a preview out of the focus order without also taking it off the screen
      inert=""
      className={`pointer-events-none select-none ${className}`}
      style={{ width: outerWidth * scale, height: outerHeight * scale }}>
      <div
        style={{
          width: outerWidth,
          height: outerHeight,
          padding: BEZEL.padding,
          borderRadius: BEZEL.radius,
          background: 'rgba(27, 26, 26, 0.7)',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}>
        <div
          className="flex overflow-hidden"
          style={{
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            borderRadius: BEZEL.screenRadius,
            background: colour.paper,
          }}>
          {children}
        </div>
      </div>
    </div>
  );
}

'use client';

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';

import FlameLine from './flame-line';
import { useLandingCopy } from './language-provider';
import PhotoCard, { PRINT_HEIGHT, PRINT_WIDTH, type Photo } from './photo-card';

/**
 * The arc of prints behind the hero heading. Prints travel left to right along
 * the arc; each is undeveloped until it crosses the flame line in the middle,
 * and develops as it passes: the part of a print left of the line is still a
 * dark plate, the part right of it is the photograph.
 *
 * That is done with two copies of the whole arc rather than a mask per print.
 * Underneath, every print is developed. On top, every print is undeveloped,
 * and that copy is masked to everything left of the line, with an edge as soft
 * as the blur the design gives that edge. Both copies are moved by the same
 * numbers, so a print is simply split by a vertical line in screen space
 * however far it has turned, which a per-print mask would have to work out in
 * the print's own rotated frame.
 *
 * The prints stand on a circle. Read off the design, their centres sit 903px
 * from a point 721px across and 1127px down the 1440x970 frame, 16 degrees
 * apart, and each is turned by the same angle as its place on the circle. So
 * a print is placed by one number, how many places it is from the middle, and
 * moving it is changing that number. Thirteen prints are laid out, six places
 * either side of the middle: the two outermost are below the frame, where a
 * print can be handed from one end of the arc to the other unseen.
 *
 * The frame is laid out at the design's 1440px width and scaled down below it
 * rather than re-flowed, because an arc has no meaningful reflow: on a phone
 * it is the same picture, smaller.
 *
 * Every frame of the travel is worked out on the main thread, for 39 prints
 * (the developed copy, and the undeveloped one drawn in two boxes - see
 * DEVELOPED below),
 * so it only runs while the arc is on screen: scrolled past, it waits where
 * it stopped. Under reduced motion it never starts, and the arc is a still.
 */

const FRAME = { width: 1440, height: 970 };
const CIRCLE = { x: 721, y: 1127, radius: 903 };
const DEGREES_PER_PLACE = 16;

const FIRST_PLACE = -6;
const COUNT = 13;

/** Where the flame line stands in the frame, and the stretch of picture it runs down. */
const LINE_X = 730;
const LINE_TOP = 72;
const LINE_HEIGHT = 262;

/**
 * How far from the line a print's middle can be and still light it: half a
 * print, plus a lead.
 */
const REACH = PRINT_WIDTH / 2 + 34;
/** How far the line's bright strip tilts as a print goes by, in degrees. */
const SWAY = 2.5;

/**
 * Where the dark copy fades out, as the cumulative edge of a 4.866px Gaussian
 * blur: nearly all dark 10px before the line, half at it, nearly clear 10px
 * after. Offsets are from the line.
 */
const FADE = [
  [-12, 1],
  [-10, 0.98],
  [-5, 0.85],
  [0, 0.5],
  [5, 0.15],
  [10, 0.02],
  [12, 0],
] as const;

/**
 * A mask only paints inside its own box, and the prints reach well outside the
 * frame, so the masked layer is drawn on a box wider than the frame by this
 * much to the left. A print still above the frame's foot reaches under 400px
 * past its sides, which a screen wider than the frame shows.
 *
 * The box stops just right of the line, where the fade has already cleared:
 * nothing of the undeveloped copy shows past there, and every pixel of the
 * box is a pixel the browser has to keep as a layer.
 *
 * Vertically it is the frame and no more (2026-11-12, scroll profiling). The
 * hero clips the arc to the frame's height, and no print rises above the
 * frame's top, so room above and below was never seen - but it was still
 * composited, masked, every frame: the box was 1930px tall for 970px of
 * picture, and that masked layer was the single largest cost of scrolling
 * past the hero.
 */
const MASK_ROOM = 480;

/**
 * Where the fade begins and ends. Left of FADE_LEFT the undeveloped copy is
 * fully there (the gradient's first stop is opaque), right of FADE_RIGHT it
 * is gone. Only the 24px between needs a mask at all.
 */
const FADE_LEFT = LINE_X + FADE[0][0];
const FADE_RIGHT = LINE_X + FADE[FADE.length - 1][0];

/** The gradient, in the coordinates of the 24px strip that carries it. */
const STRIP_STOPS = FADE.map(
  ([offset, alpha]) => `rgba(0, 0, 0, ${alpha}) ${offset - FADE[0][0]}px`
).join(', ');

/** A stretch of the frame, in frame coordinates. */
type Region = { left: number; right: number; top: number; bottom: number };

/**
 * Where each copy of the arc can be seen (2026-11-12, scroll profiling).
 *
 * The undeveloped copy used to be one box 1222px wide with the gradient mask
 * over all of it, recomposited every frame with all thirteen prints inside -
 * the single largest cost of scrolling past the hero. It is now two boxes
 * that draw exactly the same picture: everything left of the fade clipped by
 * a plain rectangle, which costs next to nothing, and only the 24px fade
 * itself masked. And a print is only drawn in a box it can be seen in: at
 * any moment about half the undeveloped prints are past the line, and the
 * two lowest prints of either copy are under the frame's foot, where the
 * hero clips them anyway.
 */
const DEVELOPED: Region = {
  left: -Infinity,
  right: Infinity,
  top: 0,
  bottom: FRAME.height,
};
const UNDEVELOPED_SOLID: Region = {
  left: -MASK_ROOM,
  right: FADE_LEFT,
  top: 0,
  bottom: FRAME.height,
};
const UNDEVELOPED_FADE: Region = {
  left: FADE_LEFT,
  right: FADE_RIGHT,
  top: 0,
  bottom: FRAME.height,
};

/** Whether a print at this place overlaps the region at all. */
function seen(place: number, region: Region) {
  const { x, y, angle } = at(place);
  const radians = (angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const halfWidth = (PRINT_WIDTH / 2) * cos + (PRINT_HEIGHT / 2) * sin;
  const halfHeight = (PRINT_WIDTH / 2) * sin + (PRINT_HEIGHT / 2) * cos;
  return (
    x + halfWidth > region.left &&
    x - halfWidth < region.right &&
    y + halfHeight > region.top &&
    y - halfHeight < region.bottom
  );
}

/**
 * The photographs on the arc, handed out to the prints in turn with what was
 * written under each (`hero.captions` in `copy.tsx`). There are thirteen
 * prints and six photographs, so some appear twice; the repeats land six
 * places apart, never beside their twin.
 */
const PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => `/memoroll-landing/arc-${n}.webp`);

/**
 * How long a print takes to move one place. A print needs roughly two and a
 * half of these to cross the line, which is the pace the reveal is meant to be
 * watched at.
 */
const PLACE_SECONDS = 2.5;

/**
 * How much of a print the line has to be inside before it says "developing…":
 * it fades in over the first 24px of the print the line passes, and out over
 * the last 24px.
 */
const DEVELOPING_RAMP = 24;

const round = (value: number) => Math.round(value * 1000) / 1000;

/** A place on the circle: where a print's middle is, and how far it is turned. */
function at(place: number) {
  const angle = place * DEGREES_PER_PLACE;
  const radians = (angle * Math.PI) / 180;

  // Rounded because the server and the browser disagree about sin and cos in
  // the last digit or two, which React reports as a mismatch on hydration.
  return {
    x: round(CIRCLE.x + CIRCLE.radius * Math.sin(radians)),
    y: round(CIRCLE.y - CIRCLE.radius * Math.cos(radians)),
    angle,
  };
}

function Print({
  index,
  phase,
  undeveloped,
  region,
}: {
  index: number;
  phase: MotionValue<number>;
  undeveloped: boolean;
  /** Where this copy can be seen; outside it the print is not drawn. */
  region: Region;
}) {
  const place = useTransform(
    phase,
    (value) => ((index + value) % COUNT) + FIRST_PLACE
  );
  const x = useTransform(place, (p) => at(p).x - PRINT_WIDTH / 2);
  const y = useTransform(place, (p) => at(p).y - PRINT_HEIGHT / 2);
  const rotate = useTransform(place, (p) => at(p).angle);
  // Hidden, not unmounted: it keeps its layer and comes back the frame it is
  // needed, without a mount mid-animation.
  const visibility = useTransform(place, (p) =>
    seen(p, region) ? 'visible' : 'hidden'
  );
  const copy = useLandingCopy().hero;
  const photo: Photo = {
    src: PHOTOS[index % PHOTOS.length],
    caption: copy.captions[index % copy.captions.length],
  };

  const developing = useTransform(place, (p) => {
    const inside = PRINT_WIDTH / 2 - Math.abs(at(p).x - LINE_X);
    return Math.min(Math.max(inside / DEVELOPING_RAMP, 0), 1);
  });

  return (
    <motion.div
      className="absolute left-0 top-0 will-change-transform"
      style={{ x, y, rotate, visibility }}>
      <PhotoCard
        developing={developing}
        photo={photo}
        exposure={copy.exposures[index % copy.exposures.length]}
        developingLabel={copy.developing}
        undeveloped={undeveloped}
      />
    </motion.div>
  );
}

export default function HeroCarousel({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();
  const phase = useMotionValue(0);
  const prints = Array.from({ length: COUNT }, (_, index) => index);

  // The signed distance from the line to whichever print is nearest it.
  const nearest = useTransform(phase, (value) => {
    let closest = Infinity;
    for (let index = 0; index < COUNT; index++) {
      const place = ((index + value) % COUNT) + FIRST_PLACE;
      const distance = at(place).x - LINE_X;
      if (Math.abs(distance) < Math.abs(closest)) closest = distance;
    }
    return closest;
  });
  const crossing = useTransform(nearest, (distance) => {
    const t = Math.min(Math.max(1 - Math.abs(distance) / REACH, 0), 1);
    return t * t * (3 - 2 * t);
  });
  const sway = useTransform(
    nearest,
    (distance) => Math.min(Math.max(distance / (PRINT_WIDTH / 2), -1), 1) * SWAY
  );

  useEffect(() => {
    if (reduceMotion || !inView) return;

    // Carries on from wherever the arc stopped, one full turn per loop.
    const start = phase.get() % COUNT;
    const loop = animate(phase, [start, start + COUNT], {
      duration: COUNT * PLACE_SECONDS,
      ease: 'linear',
      repeat: Infinity,
    });
    return () => loop.stop();
  }, [phase, inView, reduceMotion]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute left-1/2 top-0 origin-top -translate-x-1/2 scale-[0.45] sm:scale-[0.7] lg:scale-100"
      style={{ width: FRAME.width, height: FRAME.height }}>
      <div className="absolute inset-0">
        {prints.map((index) => (
          <Print
            key={index}
            index={index}
            phase={phase}
            undeveloped={false}
            region={DEVELOPED}
          />
        ))}
      </div>
      {/* The undeveloped copy, left of the fade: wholly there, so a plain
          clip does what the mask did. */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: -MASK_ROOM,
          top: 0,
          width: MASK_ROOM + FADE_LEFT,
          height: FRAME.height,
        }}>
        <div className="absolute" style={{ left: MASK_ROOM, top: 0 }}>
          {prints.map((index) => (
            <Print
              key={index}
              index={index}
              phase={phase}
              undeveloped
              region={UNDEVELOPED_SOLID}
            />
          ))}
        </div>
      </div>
      {/* The fade itself: the same copy, masked, but only 24px of it. */}
      <div
        className="absolute"
        style={{
          left: FADE_LEFT,
          top: 0,
          width: FADE_RIGHT - FADE_LEFT,
          height: FRAME.height,
          maskImage: `linear-gradient(90deg, ${STRIP_STOPS})`,
          WebkitMaskImage: `linear-gradient(90deg, ${STRIP_STOPS})`,
        }}>
        <div className="absolute" style={{ left: -FADE_LEFT, top: 0 }}>
          {prints.map((index) => (
            <Print
              key={index}
              index={index}
              phase={phase}
              undeveloped
              region={UNDEVELOPED_FADE}
            />
          ))}
        </div>
      </div>
      <div className="absolute" style={{ left: LINE_X, top: LINE_TOP }}>
        <FlameLine
          height={LINE_HEIGHT}
          crossing={crossing}
          sway={sway}
          running={inView}
        />
      </div>
      {children}
    </div>
  );
}

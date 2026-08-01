'use client';

/**
 * Wedding Template 1 - the paper the invitation is printed on, and the torn
 * edges around it.
 *
 * The design tears the Hero, the Love Story and the RSVP card with the same two
 * crops of `torn-paper.png` - one for a long edge and one for a short one -
 * turned and mirrored and scaled, but never recut. They are written down here
 * once so that a crop read off Figma has one place to be corrected rather than
 * three.
 *
 * Those three are not every torn edge on the invitation. The Bride & Groom's
 * Introduction is torn with a third crop of the same image, which nothing else
 * uses, and it stays in `BrideGroom.tsx` - lifting a crop with one caller here
 * would say the module holds the design's crops when it holds the shared ones.
 */

import { type CSSProperties } from 'react';

const ASSET = '/templates/wedding-template-1';

/**
 * The two crops, at the size the design draws each of them.
 *
 * `crop` is where `torn-paper.png` sits inside the piece's box: the design
 * frames a different part of the one image for each, and the numbers are
 * Figma's own. `width` and `height` are the piece before it is turned, so a
 * long edge laid along the top is 147 wide and 375 tall here and the caller's
 * `spin` is what puts it on its side.
 */
const LONG = {
  width: 147,
  height: 375,
  crop: 'absolute left-[-81.51%] top-[-13.38%] h-[134.36%] w-[192.99%] max-w-none',
};

const SHORT = {
  width: 52,
  height: 290,
  crop: 'absolute left-[-413.1%] top-[-6.61%] h-[173.74%] w-[545.57%] max-w-none',
};

/**
 * One piece of a torn edge.
 *
 * `box` places the piece's rotated bounding box against whatever it is torn
 * around, and `spin` turns and mirrors the crop inside it. The two are separate
 * because a rotation does not change the box a piece occupies: the design lays
 * the same 147x375 crop along a top edge as 375x147, and only the caller knows
 * where that box goes.
 */
export function TornEdge({
  box,
  spin,
  long = true,
  scale = 1,
}: {
  /** Where the piece's box sits, as position and size classes. */
  box: string;
  /** How the crop is turned and mirrored inside that box. */
  spin: string;
  /** Which crop: the long edge, or the short one. */
  long?: boolean;
  /**
   * What this copy is drawn at, as a factor of the crop's own size. A card the
   * design draws smaller than the Love Story's paper wears the same edges
   * scaled rather than a second pair of crops.
   */
  scale?: number;
}) {
  const { width, height, crop } = long ? LONG : SHORT;

  return (
    <div className={`absolute flex items-center justify-center ${box}`}>
      <div className={`flex-none ${spin}`}>
        <div
          className="relative"
          style={{ width: width * scale, height: height * scale }}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img alt="" className={crop} src={`${ASSET}/torn-paper.png`} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The design's two fills over the paper, in the order Figma stacks them on
 * `Rectangle 1` - cream at 30% and then black at 4%, which CSS writes topmost
 * first.
 */
const TINT: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.04) 100%), ' +
    'linear-gradient(90deg, rgba(239,233,226,0.3) 0%, rgba(239,233,226,0.3) 100%)',
};

/**
 * The paper a card is printed on: a flat ground of `paper.jpg` under those two
 * tints, filling whatever box it is put in.
 *
 * The image is cropped rather than fitted, and the crop is the design's own:
 * `paper.jpg` is a sheet far larger than any card, and the part of it the
 * design frames is the part whose grain the cards are drawn with. It is
 * decoration all the way down, so nothing here is announced.
 */
export function PaperGround() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute left-0 top-[-67.47%] h-[247.47%] w-[307.6%] max-w-none"
          src={`${ASSET}/paper.jpg`}
        />
      </div>
      <div className="absolute inset-0" style={TINT} />
    </div>
  );
}

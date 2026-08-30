'use client';

import mark from '@/assets/memoroll/memoify-mark.png';
import Cta from '../ui/cta';
import Wordmark from '../ui/wordmark';
import { colour, type } from '../ui/tokens';

/**
 * The way in (creator-01): the one screen a creator meets before the eight
 * questions start.
 *
 * It is the only MemoRoll screen drawn on the dark ground rather than the
 * paper, and the only one that sets anything at 44. Both say the same thing:
 * this is the pitch, not the product. The photographs behind it are somebody
 * else's night out, blurred and stacked at angles, and the sentence over them
 * is the whole argument for a shared disposable camera.
 *
 * Its footer says "Presented by Memoify.live" where every guest screen says
 * "Created by". That is the design's own distinction and it is kept: the guest
 * is looking at something a couple made, and the creator is being sold
 * something Memoify made.
 */
export default function WelcomeScreen({
  photos,
  onStart,
}: {
  /** The stack behind the words. Four in the design, and any number works. */
  photos: string[];
  onStart: () => void;
}) {
  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-hidden"
      style={{ background: colour.ink }}>
      {/* The stack runs off the right of the screen and past the bottom of it,
          which is what makes it a pile somebody left rather than an
          illustration in a box. All of it is blurred but one print: that is
          what puts the sentence in front of the night instead of among it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{
          left: '-10.4%',
          top: '33.25%',
          width: '151.7%',
          height: '85.7%',
        }}>
        {PRINTS.map((print, index) => (
          <div
            key={index}
            className="absolute bg-white"
            style={{
              left: `${print.left}%`,
              top: `${print.top}%`,
              width: `${print.width}%`,
              aspectRatio: '240.74 / 343.22',
              padding: '4.08%',
              transform: `rotate(${print.rotate}deg)`,
              filter: print.blurred ? 'blur(5.2px)' : undefined,
              boxShadow:
                '1.89px 1.89px 4.73px rgba(0,0,0,0.12), 6.62px 6.62px 9.46px rgba(0,0,0,0.11), 14.2px 15.14px 12.3px rgba(0,0,0,0.06)',
            }}>
            <img
              src={photos[index % Math.max(photos.length, 1)]}
              alt=""
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div
        className="relative z-10 flex flex-col gap-[20px] px-[16px] pt-[36px]"
        style={{ color: colour.paper }}>
        <Wordmark className="h-[15px] w-[128px]" />
        <h1
          className={type.display}
          style={{ color: colour.paper, fontFamily: 'var(--font-mr-body)' }}>
          Experience the function through everyone’s eyes
        </h1>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col items-center gap-[6px] px-[16px] pb-[34px]">
        <Cta onClick={onStart} className="w-[220px]">
          Setup My Memoroll
        </Cta>
        <div className="flex items-center gap-[12px]">
          <span
            className="text-[10px] font-normal leading-none"
            style={{ color: '#ffffff', fontFamily: 'var(--font-mr-mono)' }}>
            Presented by Memoify.live
          </span>
          <img
            src={mark.src}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * The four prints, as fractions of the box they are stacked in.
 *
 * Read off the design's own bounds; the rotations come from the exported frame,
 * because a rotated node reports its bounding box rather than its angle. The
 * front one is the only one in focus, which is the design's way of saying the
 * others are the rest of the night.
 */
const PRINTS = [
  { left: 59.7, top: -0.6, width: 42.3, rotate: 8, blurred: true },
  { left: 38.5, top: 6.1, width: 42.3, rotate: -6, blurred: true },
  { left: 23.3, top: 16.2, width: 42.3, rotate: 3, blurred: false },
  { left: 1.5, top: 48.3, width: 46.3, rotate: -4, blurred: true },
];

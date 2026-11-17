'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * The beat a hero's signature plays on, shared by the product landings
 * (journal, scrapbook). The home deck has its own, with a leaving card.
 *
 * The timer is the leading pill's CSS animation, exactly as on the home
 * page: pausing the animation pauses the autoplay, so the two cannot drift,
 * and there is no interval to clean up.
 */
export function useBeat(count: number) {
  const [active, setActive] = useState(0);
  const lead = useRef(0);

  const jump = useCallback((index: number) => {
    lead.current = index;
    setActive(index);
  }, []);
  const next = useCallback(
    () => jump((lead.current + 1) % count),
    [count, jump]
  );

  return { active, next, jump };
}

export function BeatPills({
  labels,
  active,
  running,
  still,
  ms = 4200,
  onNext,
  onJump,
}: {
  /** What each pill shows, for a screen reader: "Show the love letter". */
  labels: string[];
  active: number;
  /** False while the pointer is over the piece or it is off screen. */
  running: boolean;
  /** Reduced motion: no autoplay at all. */
  still: boolean;
  ms?: number;
  onNext: () => void;
  onJump: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-[6px]">
      {labels.map((label, index) => {
        const on = index === active;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onJump(index)}
            aria-label={label}
            aria-current={on}
            className="flex h-6 items-center">
            <span className="relative block h-[5px] w-7 overflow-hidden rounded-full bg-[#e3d8cb]">
              {on ? (
                <span
                  key={active}
                  onAnimationEnd={onNext}
                  className="absolute inset-0 origin-left rounded-full bg-[#ff3e09]"
                  style={
                    still
                      ? undefined
                      : {
                          animation: `home-beat ${ms}ms linear both`,
                          animationPlayState: running ? 'running' : 'paused',
                        }
                  }
                />
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

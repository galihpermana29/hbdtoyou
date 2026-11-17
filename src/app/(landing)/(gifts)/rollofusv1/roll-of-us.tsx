'use client';

import { Mail, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Caveat, Share_Tech_Mono } from 'next/font/google';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

import {
  CAMERA_COLORS,
  dateStamp,
  type RollFrame,
  type RollOfUsData,
} from './roll-of-us-data';
import styles from './roll-of-us.module.css';

/**
 * Roll of Us: a disposable camera to operate.
 *
 * The recipient winds the film with their thumb, presses the shutter, the
 * flash fires on a dark screen and a print comes out and develops, stamped
 * with its real date. When the roll is finished it goes to the lab and
 * comes back as a contact sheet, with the letter in the envelope.
 *
 * The selling point is the ritual, not the grid (the idea's own risk note),
 * so the camera really does refuse to shoot until it has been wound.
 *
 * Cheap on a slow phone, as the idea asks:
 * - a print's look (grain, warmth, the stamp, a blooper's blur) is static:
 *   drawn once, never animated;
 * - developing is one blank sheet fading out over the picture (opacity);
 * - everything that moves moves by transform or opacity.
 *
 * Motion (emilkowalski/skills): the print leaving the camera is an entrance
 * (strong ease-out); the film in the lab is constant (linear); presses give
 * (0.96); the flash is one burst per press, softened when the visitor asks
 * for less motion. See roll-of-us.module.css.
 */

const hand = Caveat({ subsets: ['latin'], weight: ['500', '700'] });
const stamp = Share_Tech_Mono({ subsets: ['latin'], weight: '400' });

/** Thumb travel, in pixels, for one click of the wheel. */
const NOTCH_PX = 16;
/** Clicks to bring the next frame up. */
const NOTCHES = 4;

/** Film grain, as one static image laid over a print. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

type Phase = 'shoot' | 'lab' | 'sheet';

/** Small sounds made on the spot: a wheel click, the shutter, the flash. */
function useSounds(muted: boolean) {
  const context = useRef<AudioContext | null>(null);
  const play = useCallback(
    (kind: 'tick' | 'shutter' | 'dud') => {
      if (muted || typeof window === 'undefined') return;
      try {
        const Audio =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!Audio) return;
        const ctx = (context.current ??= new Audio());
        if (ctx.state === 'suspended') void ctx.resume();
        const blip = (at: number, hz: number, ms: number, gain: number) => {
          const osc = ctx.createOscillator();
          const amp = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = hz;
          amp.gain.setValueAtTime(gain, ctx.currentTime + at);
          amp.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + at + ms / 1000
          );
          osc.connect(amp).connect(ctx.destination);
          osc.start(ctx.currentTime + at);
          osc.stop(ctx.currentTime + at + ms / 1000);
        };
        if (kind === 'tick') blip(0, 1400, 22, 0.035);
        if (kind === 'dud') blip(0, 180, 70, 0.04);
        if (kind === 'shutter') {
          blip(0, 2200, 26, 0.06);
          blip(0.05, 900, 60, 0.06);
          blip(0.12, 320, 110, 0.035);
        }
      } catch {
        // No sound is not a reason to stop the camera.
      }
    },
    [muted]
  );
  return play;
}

/** One print: the picture, its film look, the date stamp, the handwriting. */
function Print({
  frame,
  developing = false,
  small = false,
}: {
  frame: RollFrame;
  developing?: boolean;
  small?: boolean;
}) {
  const look: CSSProperties =
    frame.blooper === 'blurry'
      ? { filter: 'blur(2.6px) saturate(0.9)', transform: 'scale(1.04)' }
      : frame.blooper === 'overexposed'
        ? { filter: 'brightness(1.55) contrast(0.82) saturate(0.8)' }
        : {};
  return (
    <div
      className={`bg-[#fbf8f1] ${
        small
          ? 'p-[5px] pb-0'
          : 'p-[10px] pb-0 shadow-[0_18px_36px_-14px_rgba(0,0,0,0.75)]'
      }`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d9d2c2]">
        <img
          src={frame.imageUrl}
          alt={frame.alt ?? frame.caption}
          draggable={false}
          className="h-full w-full object-cover"
          style={look}
        />
        {/* The film look: warmth, a darker edge, grain. Static layers. */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,176,96,0.10) 35%, rgba(20,10,0,0.42) 100%)',
          }}
        />
        {frame.blooper === 'overexposed' ? (
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 62% 38%, rgba(255,255,255,0.85), rgba(255,255,255,0) 62%)',
            }}
          />
        ) : null}
        <span
          aria-hidden
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        <span
          className={`${stamp.className} absolute bottom-[6%] right-[5%] leading-none text-[#ff8a1f] ${
            small ? 'text-[9px]' : 'text-[15px]'
          } ${developing ? styles.appearLate : ''}`}
          style={{ textShadow: '0 0 6px rgba(255,120,20,0.85)' }}>
          {dateStamp(frame.date)}
        </span>
        {developing ? (
          <span
            aria-hidden
            className={`${styles.develop} absolute inset-0 bg-[#e6dfcf]`}
          />
        ) : null}
      </div>
      <p
        className={`${hand.className} truncate text-center text-[#2b2620] ${
          small
            ? 'py-[3px] text-[13px] leading-[1.1]'
            : 'py-[9px] text-[22px] leading-[1.15]'
        } ${developing ? styles.appearLate : ''}`}>
        {frame.caption}
      </p>
    </div>
  );
}

export default function RollOfUs({ data }: { data: RollOfUsData }) {
  const total = data.frames.length;
  const color = CAMERA_COLORS[data.cameraColor] ?? CAMERA_COLORS.lime;

  const [phase, setPhase] = useState<Phase>('shoot');
  const [shot, setShot] = useState(0);
  const [notches, setNotches] = useState(0);
  const [flash, setFlash] = useState(0);
  const [refused, setRefused] = useState(0);
  const [muted, setMuted] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const play = useSounds(muted);

  const wound = notches >= NOTCHES;
  const finished = shot >= total;
  const left = total - shot;

  // The wheel: how far the thumb has travelled since the last click.
  const drag = useRef<{ x: number; travelled: number } | null>(null);
  const dragged = useRef(false);
  const [ridge, setRidge] = useState(0);

  const click = useCallback(() => {
    if (finished) return;
    setNotches((value) => {
      if (value >= NOTCHES) return value;
      play('tick');
      return value + 1;
    });
  }, [finished, play]);
  /** A tap or a key turns the wheel one click's worth. */
  const turn = () => {
    setRidge((value) => (value + NOTCH_PX) % 48);
    click();
  };

  const press = () => {
    if (finished) return;
    if (!wound) {
      play('dud');
      setRefused((value) => value + 1);
      return;
    }
    play('shutter');
    setFlash((value) => value + 1);
    setNotches(0);
    setShot((value) => value + 1);
  };

  // The lab takes a moment, then the sheet is back.
  useEffect(() => {
    if (phase !== 'lab') return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setPhase('sheet'), calm ? 900 : 2800);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'sheet') window.scrollTo({ top: 0 });
  }, [phase]);

  const again = () => {
    setShot(0);
    setNotches(0);
    setLetterOpen(false);
    setPhase('shoot');
  };

  const current = shot > 0 ? data.frames[shot - 1] : null;
  const hint = finished
    ? 'That was the last frame.'
    : wound
      ? 'Now press the shutter'
      : notches > 0
        ? 'Keep winding…'
        : shot === 0
          ? 'Slide the wheel to wind the film'
          : 'Wind the film for the next one';

  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-[#0f0e0d] text-[#f4efe6]">
      {/* One burst per press, over everything. */}
      {flash > 0 ? (
        <span
          key={flash}
          aria-hidden
          className={`${styles.flash} pointer-events-none fixed inset-0 z-50 bg-white`}
        />
      ) : null}

      <button
        type="button"
        onClick={() => setMuted((value) => !value)}
        aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
        aria-pressed={muted}
        className="fixed right-4 top-4 z-40 flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#f4efe6] transition-transform duration-150 active:scale-[0.96]">
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {phase === 'shoot' ? (
        <section className="mx-auto flex min-h-[100svh] w-full max-w-[460px] flex-col items-center px-5 pb-8 pt-9">
          <p className={`${hand.className} text-[34px] leading-none`}>
            {data.title}
          </p>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#a39b91]">
            for {data.recipientName}
          </p>

          {/* The camera, from behind: what you look at when you hold one. */}
          <div className="relative z-20 mt-12 w-full max-w-[360px]">
            <button
              type="button"
              onClick={press}
              aria-label={
                finished
                  ? 'The roll is finished'
                  : wound
                    ? 'Press the shutter'
                    : 'Shutter. Wind the film first'
              }
              key={`shutter-${refused}`}
              className={`absolute -top-[15px] right-[13%] z-10 h-[22px] w-[64px] rounded-t-[10px] border border-b-0 border-black/40 transition-transform duration-100 active:translate-y-[5px] ${
                refused > 0 && !wound ? styles.refuse : ''
              }`}
              style={{
                background: wound ? '#ff5a1f' : '#6b6660',
                boxShadow: wound ? '0 0 18px rgba(255,90,31,0.75)' : 'none',
              }}
            />
            <div
              className="relative overflow-hidden rounded-[22px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
              style={{ background: color.body }}>
              {/* The top plate: counter, viewfinder, wheel. */}
              <div
                className="flex h-[74px] items-center justify-between px-4"
                style={{ background: color.plate }}>
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`${stamp.className} flex size-[38px] items-center justify-center rounded-full border-2 border-white/25 bg-[#f4efe6] text-[18px] text-[#1b1b1b]`}
                    aria-label={`${left} frames left`}>
                    <span key={left} className={styles.rise}>
                      {left}
                    </span>
                  </span>
                  <span className="text-[8px] font-bold tracking-[0.16em] text-white/55">
                    LEFT
                  </span>
                </div>

                <span
                  aria-hidden
                  className="h-[34px] w-[58px] rounded-[7px] border-[3px] border-black/50 bg-[radial-gradient(circle_at_35%_30%,#5d6b7a,#12161b_70%)]"
                />

                <div className="flex flex-col items-center gap-1.5">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={
                      wound
                        ? 'Film wound. Press the shutter'
                        : `Wind the film, ${notches} of ${NOTCHES}`
                    }
                    // A tap is one click of the wheel; a drag makes its own
                    // clicks as it goes, and the tap that ends it is not one
                    // more.
                    onClick={() => {
                      if (dragged.current) dragged.current = false;
                      else turn();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        turn();
                      }
                    }}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      drag.current = { x: event.clientX, travelled: 0 };
                      dragged.current = false;
                    }}
                    onPointerMove={(event) => {
                      if (!drag.current) return;
                      const step = Math.abs(event.clientX - drag.current.x);
                      drag.current.travelled += step;
                      drag.current.x = event.clientX;
                      if (step > 0) setRidge((value) => (value + step) % 48);
                      while (drag.current.travelled >= NOTCH_PX) {
                        drag.current.travelled -= NOTCH_PX;
                        dragged.current = true;
                        click();
                      }
                    }}
                    onPointerUp={() => (drag.current = null)}
                    onPointerCancel={() => (drag.current = null)}
                    className={`relative h-[30px] w-[96px] cursor-grab touch-none overflow-hidden rounded-[8px] border border-black/60 bg-[#0c0c0c] active:cursor-grabbing ${
                      !wound && !finished ? styles.nudge : ''
                    }`}>
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-[300%]"
                      style={{
                        transform: `translateX(-${ridge}px)`,
                        background:
                          'repeating-linear-gradient(90deg, #3a3a3a 0 3px, #101010 3px 8px)',
                      }}
                    />
                  </div>
                  <span className="flex gap-1" aria-hidden>
                    {Array.from({ length: NOTCHES }, (_, index) => (
                      <span
                        key={index}
                        className="size-[5px] rounded-full transition-colors duration-150"
                        style={{
                          background: index < notches ? '#ff5a1f' : '#4a4642',
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>

              {/* The back of the shell: the sticker every disposable has. */}
              <div className="flex h-[150px] items-center justify-between gap-3 px-5">
                <div className="-rotate-2 rounded-[6px] bg-[#fbf8f1] px-3 py-2 text-[#1b1b1b] shadow-[0_3px_0_rgba(0,0,0,0.18)]">
                  <p className={`${hand.className} text-[24px] leading-none`}>
                    {data.title}
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b655f]">
                    roll for {data.recipientName}
                  </p>
                  <p
                    className={`${stamp.className} mt-1.5 text-[11px] text-[#e34013]`}>
                    {total} EXP · FLASH
                  </p>
                </div>
                <ol
                  className="text-[10px] font-bold uppercase leading-[1.7] tracking-[0.12em]"
                  style={{ color: color.ink }}>
                  <li>1 · wind</li>
                  <li>2 · press</li>
                  <li>3 · smile</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Where the print comes out: from behind the camera, downward. */}
          <div className="relative z-10 -mt-3 flex min-h-[300px] w-full max-w-[290px] justify-center">
            {current ? (
              <div
                key={shot}
                className={`${styles.eject} w-full pt-7`}
                aria-live="polite">
                <div
                  className={shot % 2 ? 'rotate-[1.6deg]' : '-rotate-[1.4deg]'}>
                  <Print frame={current} developing />
                </div>
              </div>
            ) : (
              <p className="mt-16 max-w-[220px] text-center text-[14px] leading-[1.6] text-[#8a847d]">
                {total} photos are waiting on this roll. Take them one by one.
              </p>
            )}
          </div>

          <div className="mt-auto flex flex-col items-center gap-3 pt-6">
            {finished ? (
              <button
                type="button"
                onClick={() => setPhase('lab')}
                className={`${styles.rise} inline-flex h-12 items-center justify-center rounded-full bg-[#ff5a1f] px-7 text-[16px] font-semibold text-white transition-transform duration-150 active:scale-[0.96]`}
                style={{ ['--at' as string]: '1800ms' }}>
                Develop the whole roll
              </button>
            ) : null}
            <p className="text-[13px] font-medium text-[#a39b91]" role="status">
              {hint}
            </p>
          </div>
        </section>
      ) : null}

      {phase === 'lab' ? (
        <section
          className="flex min-h-[100svh] flex-col items-center justify-center gap-8 px-5"
          role="status">
          <div className="w-full max-w-[420px] overflow-hidden border-y-[10px] border-[#050505] bg-[#050505]">
            <div className={`${styles.pass} flex w-max gap-2`}>
              {[...data.frames, ...data.frames].map((frame, index) => (
                <img
                  key={index}
                  src={frame.imageUrl}
                  alt=""
                  className="h-[70px] w-[94px] object-cover opacity-80 sepia"
                />
              ))}
            </div>
          </div>
          <p className={`${hand.className} text-[30px] leading-none`}>
            at the lab…
          </p>
          <p className="text-[13px] text-[#a39b91]">
            Developing {total} frames for {data.recipientName}
          </p>
        </section>
      ) : null}

      {phase === 'sheet' ? (
        <section className="mx-auto w-full max-w-[720px] px-4 pb-16 pt-[72px]">
          <div
            className={`${styles.rise} bg-[#f4efe6] px-4 pb-6 pt-5 text-[#1b1b1b] md:px-7`}>
            <div className="flex items-end justify-between gap-3 border-b-2 border-[#1b1b1b] pb-3">
              <div>
                <p className={`${hand.className} text-[36px] leading-none`}>
                  {data.title}
                </p>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b655f]">
                  contact sheet · for {data.recipientName}
                </p>
              </div>
              <p
                className={`${stamp.className} text-right text-[12px] text-[#e34013]`}>
                {total} EXP
                <br />
                {dateStamp(data.frames[0].date)} –{' '}
                {dateStamp(data.frames[total - 1].date)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
              {data.frames.map((frame, index) => (
                <div
                  key={frame.imageUrl + index}
                  className={styles.rise}
                  style={{
                    ['--at' as string]: `${Math.min(120 + index * 55, 520)}ms`,
                  }}>
                  {/* A strip of negative: black, with its sprocket holes. */}
                  <div
                    className="bg-[#0b0b0b] px-[6px] py-[9px]"
                    style={{
                      // The same row of holes, along the top and the bottom.
                      backgroundImage:
                        'repeating-linear-gradient(90deg, transparent 0 7px, #f4efe6 7px 12px, transparent 12px 16px), repeating-linear-gradient(90deg, transparent 0 7px, #f4efe6 7px 12px, transparent 12px 16px)',
                      backgroundSize: '100% 4px, 100% 4px',
                      backgroundRepeat: 'no-repeat, no-repeat',
                      backgroundPosition: '0 2px, 0 calc(100% - 2px)',
                    }}>
                    <Print frame={frame} small />
                  </div>
                  <p
                    className={`${stamp.className} mt-1 text-[10px] text-[#6b655f]`}>
                    {String(index + 1).padStart(2, '0')}
                    {frame.blooper ? ' · oops' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* The envelope the prints came back in, and what is in it. */}
          <div
            className={`${styles.rise} mt-8`}
            style={{ ['--at' as string]: '600ms' }}>
            {letterOpen ? (
              <div
                className={`${styles.rise} bg-[#fbf8f1] px-6 py-7 text-[#2b2620] shadow-[0_18px_36px_-14px_rgba(0,0,0,0.75)]`}>
                <p
                  className={`${hand.className} whitespace-pre-line text-[24px] leading-[1.35]`}>
                  {data.letter}
                </p>
                {data.senderName ? (
                  <p
                    className={`${hand.className} mt-5 text-right text-[26px] leading-none`}>
                    - {data.senderName}
                  </p>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLetterOpen(true)}
                className="relative block w-full overflow-hidden rounded-[6px] bg-[#c9a779] px-6 pb-7 pt-12 text-left text-[#3a2a17] shadow-[0_18px_36px_-14px_rgba(0,0,0,0.75)] transition-transform duration-150 active:scale-[0.98]">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[46px] bg-[#b8935f]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                />
                <span className="flex items-center gap-3">
                  <Mail aria-hidden size={22} />
                  <span>
                    <span
                      className={`${hand.className} block text-[28px] leading-none`}>
                      {data.envelopeNote || 'there is a letter in here'}
                    </span>
                    <span className="mt-1.5 block text-[11px] font-bold uppercase tracking-[0.18em]">
                      tap to open
                    </span>
                  </span>
                </span>
              </button>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={again}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[14px] font-semibold text-[#f4efe6] transition-transform duration-150 active:scale-[0.96]">
              <RotateCcw aria-hidden size={16} />
              Shoot the roll again
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

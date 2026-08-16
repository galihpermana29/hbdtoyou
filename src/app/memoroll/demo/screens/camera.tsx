'use client';

import { developWeddingFilm } from '@/lib/wedding-film';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_FILM,
  DEFAULT_VARIANT,
  IS_PRODUCTION_ENV,
  PREVIEW_CSS,
  PREVIEW_VIGNETTE,
  ROLL_FILMS,
  RollFilmId,
  WeddingVariant,
  normalizeStoredFilm,
  storedFilmId,
} from '../films';
import { homemadeApple, poppins } from '../fonts';
import { STAMP_DATE, VIEWFINDER_FALLBACK } from '../mock';
import { Shot } from '../use-shots';
import { EASE, REDUCED_FADE } from '../variants';

const FRAME_W = 480;
const FRAME_H = 640;

/** The guest's last film pick survives a reload along with the roll. */
const FILM_STORAGE_KEY = 'memoroll-demo:film';

/**
 * Camera (guest-06) with the shutter variants of guest-07. The viewfinder is
 * the real camera when the browser grants it and a styled placeholder when it
 * does not. Ten shots, counted down where the guest can feel it, and a dead
 * shutter at zero: the scarcity is the product.
 *
 * The shot develops through the Wedding Film engine (src/lib/wedding-film.ts,
 * hbd-15j): a canvas pixel pipeline that runs everywhere, Safari included -
 * no ctx.filter anywhere. The viewfinder wears an ordinary CSS approximation
 * of the look; the developed pixels are the truth (ADR 0006). Party is
 * experimental and only offered off-production until approved.
 */
export default function CameraScreen({
  remaining,
  lastShot,
  onCapture,
  onOpenGallery,
}: {
  remaining: number;
  lastShot: Shot | null;
  onCapture: (dataUrl: string, film: string) => void;
  onOpenGallery: () => void;
}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [rollDone, setRollDone] = useState(false);
  const [film, setFilm] = useState<RollFilmId>(DEFAULT_FILM);
  const [variant, setVariant] = useState<WeddingVariant>(DEFAULT_VARIANT);
  const counterControls = useAnimationControls();

  useEffect(() => {
    try {
      const stored = normalizeStoredFilm(
        window.localStorage.getItem(FILM_STORAGE_KEY)
      );
      setFilm(stored.film);
      setVariant(stored.variant);
    } catch {
      // A blocked store just means the roll opens on the default film.
    }
    // The stamp and watermark draw onto a canvas, which never falls back the
    // way CSS does - warm the fonts up before the first shutter press.
    document.fonts
      ?.load(`26px ${homemadeApple.style.fontFamily}`)
      .catch(() => undefined);
    document.fonts
      ?.load(`500 15px ${poppins.style.fontFamily}`)
      .catch(() => undefined);
  }, []);

  const persistFilm = (nextFilm: RollFilmId, nextVariant: WeddingVariant) => {
    setFilm(nextFilm);
    setVariant(nextVariant);
    try {
      window.localStorage.setItem(
        FILM_STORAGE_KEY,
        storedFilmId(nextFilm, nextVariant)
      );
    } catch {
      // Quota or privacy mode: the pick still holds in memory.
    }
  };

  useEffect(() => {
    let cancelled = false;
    const video = videoRef.current;
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (video) {
          video.srcObject = stream;
          video.play().catch(() => undefined);
        }
        setLive(true);
      })
      .catch(() => setLive(false));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  /** Draw whatever the viewfinder is showing onto an undeveloped frame. */
  const takeFrame = useCallback((): Promise<HTMLCanvasElement> => {
    const makeStage = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const canvas = document.createElement('canvas');
      canvas.width = FRAME_W;
      canvas.height = FRAME_H;
      draw(canvas.getContext('2d')!);
      return canvas;
    };
    const coverDraw = (
      ctx: CanvasRenderingContext2D,
      source: CanvasImageSource,
      sw: number,
      sh: number
    ) => {
      const scale = Math.max(FRAME_W / sw, FRAME_H / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      ctx.drawImage(source, (FRAME_W - dw) / 2, (FRAME_H - dh) / 2, dw, dh);
    };
    const gradientStage = () =>
      makeStage((ctx) => {
        const g = ctx.createLinearGradient(0, 0, FRAME_W, FRAME_H);
        g.addColorStop(0, '#3a3a3a');
        g.addColorStop(1, '#141414');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, FRAME_W, FRAME_H);
        ctx.fillStyle = '#f7f5f3';
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('memoroll demo shot', FRAME_W / 2, FRAME_H / 2);
      });

    const video = videoRef.current;
    if (live && video && video.videoWidth > 0) {
      try {
        return Promise.resolve(
          makeStage((ctx) =>
            coverDraw(ctx, video, video.videoWidth, video.videoHeight)
          )
        );
      } catch {
        return Promise.resolve(gradientStage());
      }
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          resolve(
            makeStage((ctx) =>
              coverDraw(ctx, img, img.naturalWidth, img.naturalHeight)
            )
          );
        } catch {
          resolve(gradientStage());
        }
      };
      img.onerror = () => resolve(gradientStage());
      img.src = VIEWFINDER_FALLBACK;
    });
  }, [live]);

  // The moment the tenth shot lands the roll is finished, and the way to the
  // gallery is offered right away rather than after a press of a dead shutter.
  useEffect(() => {
    if (remaining <= 0) setRollDone(true);
  }, [remaining]);

  const shoot = async () => {
    if (remaining <= 0) {
      if (!reduce) {
        counterControls.start({
          x: [0, -7, 7, -5, 5, 0],
          transition: { duration: 0.4 },
        });
      }
      return;
    }
    setFlashKey((k) => k + 1);
    const stage = await takeFrame();
    onCapture(developShot(stage, film, variant), storedFilmId(film, variant));
  };

  const empty = remaining <= 0;
  const showVariantControl = film === 'wedding' && !IS_PRODUCTION_ENV;

  return (
    <div className="flex flex-1 flex-col bg-[#212121] px-3 pb-6 pt-4">
      <div className="relative flex-1 overflow-hidden rounded-[22px] border border-white/20 bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 ${live ? '' : 'hidden'}`}
          style={{
            filter: film === 'wedding' ? PREVIEW_CSS[variant] : undefined,
          }}
        />
        {!live && (
          <>
            <img
              src={VIEWFINDER_FALLBACK}
              alt="Placeholder viewfinder"
              className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300"
              style={{
                filter: film === 'wedding' ? PREVIEW_CSS[variant] : undefined,
              }}
            />
            <span
              className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/80"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              demo viewfinder · camera not granted
            </span>
          </>
        )}
        {film === 'wedding' && (
          <span
            className="pointer-events-none absolute inset-0 transition-shadow duration-300"
            style={{
              boxShadow: `inset 0 0 ${Math.round(PREVIEW_VIGNETTE[variant] * 180)}px rgba(15, 15, 15, ${PREVIEW_VIGNETTE[variant]})`,
            }}
          />
        )}
        <AnimatePresence>
          {flashKey > 0 && (
            <motion.div
              key={flashKey}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={
                reduce ? REDUCED_FADE : { duration: 0.35, ease: 'easeOut' }
              }
              className="pointer-events-none absolute inset-0 bg-white"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {rollDone && (
            <motion.button
              type="button"
              onClick={onOpenGallery}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduce ? REDUCED_FADE : { duration: 0.3, ease: EASE }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ffccce] px-4 py-2 text-[13px] text-[#ff1e1e]"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              Roll’s finished · see the gallery
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* The variant control is a sibling, not a child, of the film group:
          nested radiogroups read as one flat list to assistive tech. */}
      <div
        className="mt-4 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-mr-ui)' }}>
        <div
          className="flex items-center gap-2"
          role="radiogroup"
          aria-label="The film this shot develops through">
          {ROLL_FILMS.map((f) => {
            const active = f.id === film;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => persistFilm(f.id, variant)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[12px] transition-colors ${
                  active
                    ? 'bg-white text-[#212121]'
                    : 'border border-white/30 text-white/85'
                }`}>
                {f.name}
              </button>
            );
          })}
        </div>
        {showVariantControl && (
          <div
            className="ml-auto flex items-center gap-1 rounded-full border border-white/20 p-0.5"
            role="radiogroup"
            aria-label="Wedding Film lighting variant (staging test control)">
            {(
              [
                ['daylight', 'Daylight'],
                ['party', 'Party · testing'],
              ] as [WeddingVariant, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={variant === v}
                onClick={() => persistFilm('wedding', v)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                  variant === v
                    ? 'bg-[#ff3e09] text-white'
                    : 'text-white/70'
                }`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p
        className="mt-1.5 text-[9px] uppercase tracking-[0.12em] text-white/40"
        style={{ fontFamily: 'var(--font-mr-ui)' }}>
        preview approximates the developed look
      </p>

      <div className="flex items-center justify-between px-6 pb-1 pt-3">
        <motion.div
          animate={counterControls}
          className="w-[72px] text-center text-white"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          <span className="relative block h-[44px] overflow-visible">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={remaining}
                initial={
                  reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 1.25 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                transition={
                  reduce
                    ? REDUCED_FADE
                    : { type: 'spring', stiffness: 420, damping: 26 }
                }
                className={`block text-[34px] leading-[44px] ${
                  remaining <= 3 ? 'text-[#ff3e09]' : 'text-white'
                }`}>
                {remaining}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="block text-[19px]">shots</span>
        </motion.div>

        <motion.button
          type="button"
          onClick={shoot}
          aria-label={empty ? 'No shots left' : 'Take a shot'}
          aria-disabled={empty}
          whileTap={reduce || empty ? undefined : { scale: 0.9 }}
          transition={{ duration: 0.12, ease: EASE }}
          className={`flex h-[88px] w-[88px] items-center justify-center rounded-full ${
            empty
              ? 'bg-[#5a5a5a] shadow-inner'
              : 'bg-[#ff3e09] shadow-[inset_0_-6px_10px_rgba(0,0,0,0.25),0_6px_18px_rgba(255,62,9,0.45)]'
          }`}
          style={{
            backgroundImage: empty
              ? undefined
              : 'radial-gradient(circle at 32% 28%, #ff6a3d 0%, #ff3e09 55%, #e42f00 100%)',
          }}>
          <span
            className={`text-[15px] font-bold italic tracking-wide ${
              empty ? 'text-[#2f2f2f]' : 'text-[#8f1d00]'
            }`}
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            SHOOT
          </span>
        </motion.button>

        <button
          type="button"
          onClick={onOpenGallery}
          className="relative w-[72px] text-center text-white">
          <span className="relative mx-auto block h-[40px] w-[48px]">
            <span className="absolute inset-0 -rotate-6 rounded-[4px] border border-white/40 bg-white/15" />
            <AnimatePresence initial={false}>
              {lastShot ? (
                <motion.img
                  key={lastShot.id}
                  src={lastShot.dataUrl}
                  alt="Your last shot"
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 1.6, rotate: 8 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: 3 }}
                  exit={{ opacity: 0 }}
                  transition={
                    reduce
                      ? REDUCED_FADE
                      : { type: 'spring', stiffness: 300, damping: 22 }
                  }
                  className="absolute inset-0 h-full w-full rounded-[4px] border-2 border-white object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex rotate-3 items-center justify-center rounded-[4px] border-2 border-white bg-white/90 text-[18px]">
                  🖼️
                </span>
              )}
            </AnimatePresence>
          </span>
          <span
            className="mt-1 block text-[19px]"
            style={{ fontFamily: 'var(--font-mr-hand)' }}>
            gallery
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * Develop the frame through the Wedding Film engine, then burn in the date
 * stamp (Wedding Film only) and the watermark, and encode. The engine's
 * pixel pass is the color truth; nothing here uses ctx.filter.
 */
function developShot(
  stage: HTMLCanvasElement,
  film: RollFilmId,
  variant: WeddingVariant
): string {
  const { canvas } = developWeddingFilm(
    stage,
    FRAME_W,
    FRAME_H,
    film === 'none' ? 'none' : variant
  );
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 4;
  ctx.textBaseline = 'alphabetic';

  if (film !== 'none') {
    // The stamp the design burns onto every developed photo (Figma 220:919):
    // white Homemade Apple in the bottom-right corner. The date is the
    // demo's fictional wedding day; only the time is real.
    const at = new Date();
    const stamp = `${STAMP_DATE} ${at.getHours()}:${String(
      at.getMinutes()
    ).padStart(2, '0')}`;
    ctx.font = `26px ${homemadeApple.style.fontFamily}, cursive`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(stamp, FRAME_W - 16, FRAME_H - 20);
  }

  ctx.font = `500 15px ${poppins.style.fontFamily}, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.textAlign = 'left';
  ctx.fillText('memoify.live', 16, FRAME_H - 20);
  ctx.shadowBlur = 0;

  return canvas.toDataURL('image/jpeg', 0.78);
}

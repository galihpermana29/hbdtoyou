'use client';

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_FILM_ID, FILMS, Film, filmById } from '../films';
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
 * The film strip is the guest's choice (hbd-xs7): every shot develops through
 * the film active when the shutter fires, baked into the JPEG per ADR 0006 -
 * filter, date stamp and watermark are pixels, not metadata.
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
  const [filmId, setFilmId] = useState(DEFAULT_FILM_ID);
  const counterControls = useAnimationControls();
  const film = filmById(filmId);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FILM_STORAGE_KEY);
      if (stored && FILMS.some((f) => f.id === stored)) setFilmId(stored);
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

  const pickFilm = (id: string) => {
    setFilmId(id);
    try {
      window.localStorage.setItem(FILM_STORAGE_KEY, id);
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
    onCapture(developShot(stage, film), film.id);
  };

  const empty = remaining <= 0;

  return (
    <div className="flex flex-1 flex-col bg-[#212121] px-3 pb-6 pt-4">
      <div className="relative flex-1 overflow-hidden rounded-[22px] border border-white/20 bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 ${live ? '' : 'hidden'}`}
          style={{ filter: film.filter || undefined }}
        />
        {!live && (
          <>
            <img
              src={VIEWFINDER_FALLBACK}
              alt="Placeholder viewfinder"
              className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300"
              style={{ filter: film.filter || undefined }}
            />
            <span
              className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/80"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              demo viewfinder · camera not granted
            </span>
          </>
        )}
        {/* The wash, leak, scan lines and vignette preview what developShot
            will bake; grain, soft focus and flash bloom have no honest CSS
            twin and appear at develop time. The previewed leak sits in one
            corner - the developed one picks its own. */}
        {film.lightLeak && (
          <span
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{
              background:
                'radial-gradient(circle at 92% 20%, rgba(255, 120, 40, 0.85), rgba(255, 60, 90, 0.35) 50%, rgba(255, 60, 90, 0) 70%)',
            }}
          />
        )}
        {film.vhs && (
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.16) 0px, rgba(0, 0, 0, 0.16) 1.4px, transparent 1.4px, transparent 4px)',
            }}
          />
        )}
        {film.wash && (
          <span
            className="pointer-events-none absolute inset-0 transition-colors duration-300"
            style={{ backgroundColor: film.wash }}
          />
        )}
        {film.vignette > 0 && (
          <span
            className="pointer-events-none absolute inset-0 transition-shadow duration-300"
            style={{
              boxShadow: `inset 0 0 ${Math.round(film.vignette * 180)}px rgba(15, 15, 15, ${film.vignette})`,
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

      <div
        className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="radiogroup"
        aria-label="The film this shot develops through"
        style={{ fontFamily: 'var(--font-mr-ui)' }}>
        {FILMS.map((f) => {
          const active = f.id === film.id;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => pickFilm(f.id)}
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

      <div className="flex items-center justify-between px-6 pb-1 pt-4">
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
 * Develop the undeveloped frame through a film: filter, wash, grain and
 * vignette, then the date stamp any film burns in and the watermark every
 * shot carries. The result is the only artifact - the negative never
 * survives this function (ADR 0006).
 */
function developShot(stage: HTMLCanvasElement, film: Film): string {
  const canvas = document.createElement('canvas');
  canvas.width = FRAME_W;
  canvas.height = FRAME_H;
  const ctx = canvas.getContext('2d')!;

  // Canvas 2D `filter` shipped in Safari 18 (2024); on anything older this
  // pass is a no-op and the shot develops plain while the preview showed the
  // film. Accepted for the demo; the real product needs a pixel fallback.
  ctx.filter = film.filter || 'none';
  ctx.drawImage(stage, 0, 0);
  ctx.filter = 'none';

  if (film.softFocus) {
    // Toy-cam dreaminess: a blurred copy breathed over the sharp frame.
    ctx.globalAlpha = film.softFocus;
    ctx.filter = 'blur(3px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
  }

  if (film.bloom) {
    // On-camera flash: a bright blurred pass screened over the frame.
    ctx.globalAlpha = film.bloom;
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = 'blur(6px) brightness(1.5)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  if (film.lightLeak) {
    // Light leaks in from one edge, a different corner every shot, the way
    // a toy camera's seams never leak twice the same.
    const rightSide = Math.random() < 0.5;
    const x = rightSide ? FRAME_W * 0.92 : FRAME_W * 0.08;
    const y = FRAME_H * (0.12 + Math.random() * 0.3);
    ctx.globalCompositeOperation = 'screen';
    let leak = ctx.createRadialGradient(x, y, 20, x, y, FRAME_H * 0.55);
    leak.addColorStop(0, 'rgba(255, 120, 40, 0.85)');
    leak.addColorStop(0.5, 'rgba(255, 60, 90, 0.35)');
    leak.addColorStop(1, 'rgba(255, 60, 90, 0)');
    ctx.fillStyle = leak;
    ctx.fillRect(0, 0, FRAME_W, FRAME_H);
    leak = rightSide
      ? ctx.createLinearGradient(FRAME_W, 0, FRAME_W - 90, 0)
      : ctx.createLinearGradient(0, 0, 90, 0);
    leak.addColorStop(0, 'rgba(255, 200, 120, 0.55)');
    leak.addColorStop(1, 'rgba(255, 200, 120, 0)');
    ctx.fillStyle = leak;
    ctx.fillRect(rightSide ? FRAME_W - 90 : 0, 0, 90, FRAME_H);
    ctx.globalCompositeOperation = 'source-over';
  }

  if (film.vhs) {
    // Camcorder color bleed: a hue-shifted ghost nudged sideways, then the
    // tape's scan lines.
    ctx.globalAlpha = 0.35;
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'saturate(2) hue-rotate(90deg) opacity(0.35)';
    ctx.drawImage(canvas, 2.5, 0);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    for (let y = 0; y < FRAME_H; y += 4) {
      ctx.fillRect(0, y, FRAME_W, 1.4);
    }
  }

  if (film.wash) {
    ctx.fillStyle = film.wash;
    ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  }

  if (film.grain) {
    const noise = document.createElement('canvas');
    noise.width = FRAME_W / 4;
    noise.height = FRAME_H / 4;
    const nctx = noise.getContext('2d')!;
    const speckle = nctx.createImageData(noise.width, noise.height);
    for (let i = 0; i < speckle.data.length; i += 4) {
      const v = Math.floor(Math.random() * 256);
      speckle.data[i] = v;
      speckle.data[i + 1] = v;
      speckle.data[i + 2] = v;
      speckle.data[i + 3] = 255;
    }
    nctx.putImageData(speckle, 0, 0);
    ctx.globalAlpha = film.grain;
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(noise, 0, 0, FRAME_W, FRAME_H);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  if (film.vignette > 0) {
    const g = ctx.createRadialGradient(
      FRAME_W / 2,
      FRAME_H / 2,
      FRAME_H * 0.28,
      FRAME_W / 2,
      FRAME_H / 2,
      FRAME_H * 0.72
    );
    g.addColorStop(0, 'rgba(15, 15, 15, 0)');
    g.addColorStop(1, `rgba(15, 15, 15, ${film.vignette})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  }

  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 4;
  ctx.textBaseline = 'alphabetic';

  if (film.id !== 'none') {
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

  return canvas.toDataURL('image/jpeg', 0.72);
}

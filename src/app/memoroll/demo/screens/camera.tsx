'use client';

import { developMemoRollFilm } from '@/lib/memoroll-film';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PhotoCapturer,
  defaultImageCaptureFactory,
  detectLightingCapabilities,
  setTorch,
} from '../camera-capabilities';
import {
  DEFAULT_FILM,
  PREVIEW_CSS,
  PREVIEW_VIGNETTE,
  ROLL_FILMS,
  SelectableFilmId,
  filmStamps,
  normalizeStoredFilm,
} from '../films';
import { homemadeApple, poppins } from '../fonts';
import { STAMP_DATE, VIEWFINDER_FALLBACK } from '../mock';
import { Shot } from '../use-shots';
import { EASE, REDUCED_FADE } from '../variants';

/** The developed keeper: 960x1280, the report's resolution contract. */
const FRAME_W = 960;
const FRAME_H = 1280;
const JPEG_QUALITY = 0.78;

/** The guest's last film pick survives a reload along with the roll. */
const FILM_STORAGE_KEY = 'memoroll-demo:film';

/**
 * Camera (guest-06) with the shutter variants of guest-07. The viewfinder is
 * the real camera when the browser grants it and a styled placeholder when it
 * does not. Ten shots, counted down where the guest can feel it, and a dead
 * shutter at zero: the scarcity is the product.
 *
 * Every keeper develops through the MemoRoll film renderer
 * (src/lib/memoroll-film.ts) into a 960x1280 JPEG blob - baked at capture
 * per ADR 0006, no ctx.filter anywhere. The viewfinder wears an ordinary
 * CSS approximation of the look; the developed pixels are the truth.
 *
 * Lighting is hardware-honest: Flash (synchronized fill light via
 * ImageCapture.takePhoto) and Torch (continuous LED via applyConstraints)
 * appear only when the granted track really supports them, and a runtime
 * failure downgrades the control with a visible note instead of faking.
 * The white-screen flash on the shutter is feedback animation only.
 */
export default function CameraScreen({
  remaining,
  lastShot,
  onCapture,
  onOpenGallery,
}: {
  remaining: number;
  lastShot: Shot | null;
  onCapture: (blob: Blob, film: string) => void;
  onOpenGallery: () => void;
}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturerRef = useRef<PhotoCapturer | null>(null);
  const [live, setLive] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [rollDone, setRollDone] = useState(false);
  const [film, setFilm] = useState<SelectableFilmId>(DEFAULT_FILM);
  const [flashSupported, setFlashSupported] = useState(false);
  const [torchSupportedState, setTorchSupportedState] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [lightingNote, setLightingNote] = useState<string | null>(null);
  const counterControls = useAnimationControls();

  useEffect(() => {
    try {
      setFilm(normalizeStoredFilm(window.localStorage.getItem(FILM_STORAGE_KEY)));
    } catch {
      // A blocked store just means the roll opens on the default film.
    }
    // The stamp and watermark draw onto a canvas, which never falls back the
    // way CSS does - warm the fonts up before the first shutter press.
    document.fonts
      ?.load(`52px ${homemadeApple.style.fontFamily}`)
      .catch(() => undefined);
    document.fonts
      ?.load(`500 30px ${poppins.style.fontFamily}`)
      .catch(() => undefined);
  }, []);

  const pickFilm = (id: SelectableFilmId) => {
    setFilm(id);
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
      // A high-quality rear 4:3 stream: enough pixels that the 960x1280
      // keeper crops from real detail rather than upscaling.
      .getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1440 },
          aspectRatio: { ideal: 4 / 3 },
        },
        audio: false,
      })
      .then(async (stream) => {
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
        // Lighting capabilities exist only after permission is granted.
        const track = stream.getVideoTracks()[0];
        if (track) {
          capturerRef.current = defaultImageCaptureFactory(track);
          const caps = await detectLightingCapabilities(track);
          if (!cancelled) {
            setFlashSupported(caps.flash);
            setTorchSupportedState(caps.torch);
          }
        }
      })
      .catch(() => setLive(false));
    return () => {
      cancelled = true;
      // The torch must never outlive the camera: off before the stream stops.
      const track = streamRef.current?.getVideoTracks()[0];
      if (track) {
        setTorch(track, false).catch(() => undefined);
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      capturerRef.current = null;
    };
  }, []);

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const next = !torchOn;
    try {
      await setTorch(track, next);
      setTorchOn(next);
    } catch {
      // A previously supported operation failed: downgrade honestly.
      setTorchSupportedState(false);
      setTorchOn(false);
      setLightingNote('Torch stopped responding on this camera, so it was turned off.');
    }
  };

  /** Draw a source onto the 960x1280 stage with the viewfinder's cover crop. */
  const stageFrom = (
    source: CanvasImageSource,
    sw: number,
    sh: number
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = FRAME_W;
    canvas.height = FRAME_H;
    const ctx = canvas.getContext('2d')!;
    const scale = Math.max(FRAME_W / sw, FRAME_H / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    ctx.drawImage(source, (FRAME_W - dw) / 2, (FRAME_H - dh) / 2, dw, dh);
    return canvas;
  };

  /** The no-flash path: whatever the viewfinder is showing right now. */
  const takeFrame = useCallback((): Promise<HTMLCanvasElement> => {
    const gradientStage = () => {
      const canvas = document.createElement('canvas');
      canvas.width = FRAME_W;
      canvas.height = FRAME_H;
      const ctx = canvas.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, FRAME_W, FRAME_H);
      g.addColorStop(0, '#3a3a3a');
      g.addColorStop(1, '#141414');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, FRAME_W, FRAME_H);
      ctx.fillStyle = '#f7f5f3';
      ctx.font = '56px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('memoroll demo shot', FRAME_W / 2, FRAME_H / 2);
      return canvas;
    };

    const video = videoRef.current;
    if (live && video && video.videoWidth > 0) {
      try {
        return Promise.resolve(
          stageFrom(video, video.videoWidth, video.videoHeight)
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
          resolve(stageFrom(img, img.naturalWidth, img.naturalHeight));
        } catch {
          resolve(gradientStage());
        }
      };
      img.onerror = () => resolve(gradientStage());
      img.src = VIEWFINDER_FALLBACK;
    });
  }, [live]);

  /**
   * The flash path: a synchronized still via ImageCapture, decoded with its
   * EXIF orientation applied before cropping. Any failure downgrades Flash
   * and falls back to the video frame - the shot is never lost.
   */
  const takeFlashFrame = async (): Promise<HTMLCanvasElement> => {
    const capturer = capturerRef.current;
    if (!capturer) throw new Error('no capturer');
    const blob = await capturer.takePhoto({ fillLightMode: 'flash' });
    const bitmap = await createImageBitmap(blob, {
      imageOrientation: 'from-image',
    });
    try {
      return stageFrom(bitmap, bitmap.width, bitmap.height);
    } finally {
      bitmap.close();
    }
  };

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
    // White-screen animation: shutter feedback only, never a light source.
    setFlashKey((k) => k + 1);
    let stage: HTMLCanvasElement;
    if (flashOn && flashSupported && capturerRef.current) {
      try {
        stage = await takeFlashFrame();
      } catch {
        setFlashSupported(false);
        setFlashOn(false);
        setLightingNote(
          'Flash failed on this camera, so this shot used the live view instead.'
        );
        stage = await takeFrame();
      }
    } else {
      stage = await takeFrame();
    }
    const blob = await developShot(stage, film);
    onCapture(blob, film);
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
          style={{ filter: PREVIEW_CSS[film] }}
        />
        {!live && (
          <>
            <img
              src={VIEWFINDER_FALLBACK}
              alt="Placeholder viewfinder"
              className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300"
              style={{ filter: PREVIEW_CSS[film] }}
            />
            <span
              className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/80"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              demo viewfinder · camera not granted
            </span>
          </>
        )}
        {PREVIEW_VIGNETTE[film] > 0 && (
          <span
            className="pointer-events-none absolute inset-0 transition-shadow duration-300"
            style={{
              boxShadow: `inset 0 0 ${Math.round(PREVIEW_VIGNETTE[film] * 180)}px rgba(15, 15, 15, ${PREVIEW_VIGNETTE[film]})`,
            }}
          />
        )}
        {/* Hardware lighting controls: shown only when truly supported. */}
        {(flashSupported || torchSupportedState) && (
          <div className="absolute right-3 top-3 flex gap-2">
            {flashSupported && (
              <button
                type="button"
                aria-pressed={flashOn}
                onClick={() => setFlashOn((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                  flashOn
                    ? 'bg-white text-[#212121]'
                    : 'bg-black/60 text-white/85'
                }`}
                style={{ fontFamily: 'var(--font-mr-ui)' }}>
                Flash {flashOn ? 'on' : 'off'}
              </button>
            )}
            {torchSupportedState && (
              <button
                type="button"
                aria-pressed={torchOn}
                onClick={toggleTorch}
                className={`rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                  torchOn
                    ? 'bg-white text-[#212121]'
                    : 'bg-black/60 text-white/85'
                }`}
                style={{ fontFamily: 'var(--font-mr-ui)' }}>
                Torch {torchOn ? 'on' : 'off'}
              </button>
            )}
          </div>
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
        {ROLL_FILMS.map((f) => {
          const active = f.id === film;
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
      <p
        className="mt-1.5 text-[9px] uppercase tracking-[0.12em] text-white/40"
        style={{ fontFamily: 'var(--font-mr-ui)' }}>
        preview approximates the developed look
      </p>
      {lightingNote && (
        <p
          className="mt-1 text-[10px] text-[#ffccce]"
          style={{ fontFamily: 'var(--font-mr-body)' }}>
          {lightingNote}
        </p>
      )}

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
                  src={lastShot.url}
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
 * Develop the frame through the MemoRoll film renderer, then burn in the
 * date stamp (any film except None) and the watermark, and encode a JPEG
 * blob. The renderer's pixel pass is the color truth; nothing here uses
 * ctx.filter. Overlay sizes scale with the 960x1280 frame.
 */
async function developShot(
  stage: HTMLCanvasElement,
  film: SelectableFilmId
): Promise<Blob> {
  const { canvas } = developMemoRollFilm(stage, FRAME_W, FRAME_H, film);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 8;
  ctx.textBaseline = 'alphabetic';

  if (filmStamps(film)) {
    // The stamp the design burns onto every developed photo (Figma 220:919):
    // white Homemade Apple in the bottom-right corner. The date is the
    // demo's fictional wedding day; only the time is real.
    const at = new Date();
    const stamp = `${STAMP_DATE} ${at.getHours()}:${String(
      at.getMinutes()
    ).padStart(2, '0')}`;
    ctx.font = `52px ${homemadeApple.style.fontFamily}, cursive`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(stamp, FRAME_W - 32, FRAME_H - 40);
  }

  ctx.font = `500 30px ${poppins.style.fontFamily}, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.textAlign = 'left';
  ctx.fillText('memoify.live', 32, FRAME_H - 40);
  ctx.shadowBlur = 0;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('JPEG encode failed'))),
      'image/jpeg',
      JPEG_QUALITY
    );
  });
}

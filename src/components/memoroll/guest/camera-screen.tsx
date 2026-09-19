'use client';

import {
  detectLightingCapabilities,
  defaultImageCaptureFactory,
  setTorch,
  type PhotoCapturer,
} from '@/lib/memoroll-camera';
import { bakeMemoRollFilm } from '@/lib/memoroll-film';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderRule from '../ui/header-rule';
import { colour, pillShadow } from '../ui/tokens';
import {
  PREVIEW_CSS,
  PREVIEW_VIGNETTE,
  ROLL_FILMS,
  type SelectableFilmId,
  filmStamps,
} from './films';
import folderArt from '@/assets/memoroll/camera-gallery-folder.png';
import HowPopup from './how-popup';

/** The baked keeper: 960x1280, the film report's resolution contract. */
const FRAME_W = 960;
const FRAME_H = 1280;
const JPEG_QUALITY = 0.78;

/**
 * The camera (guest-09/10): the shots counter over the viewfinder, the film
 * strip, and the mauve dock carrying the shutter and the gallery.
 *
 * The chrome is the 2026-08-24 design; the stack under it is the one that
 * already works (ADR 0007: this screen was re-skinned, not re-engineered).
 * Every Shot is baked at capture through src/lib/memoroll-film.ts into a
 * 960x1280 JPEG blob - film, date stamp and watermark burned into the pixels,
 * no negative kept (ADR 0006). The viewfinder wears an ordinary CSS
 * approximation of the look; the baked pixels are the truth.
 *
 * Lighting is hardware-honest: Flash (synchronized fill light via
 * ImageCapture.takePhoto) and Torch (continuous LED via applyConstraints)
 * appear only when the granted track really supports them, and a runtime
 * failure downgrades the control with a visible note instead of faking.
 * `simulatedLighting` is the demo's stand-in for hardware nobody's laptop
 * has, the same stand-in its dock already is for clocks and venues; a
 * simulated light draws the control without ever touching a track.
 *
 * There is no last-shot preview anywhere on this screen. The gallery button
 * is a stack of prints with a count, and the prints are dark: a guest's own
 * Shots are Undeveloped until they Develop them, and a thumbnail would be a
 * peek the product forbids.
 *
 * Approximations from the capture, named: the viewfinder's and the dock's
 * gradient strokes ship as solid mid-tones read off the frame; the dock's
 * two stacked Figma gradients ship as one vertical ramp sampled from the
 * frame; the LED's LAYER_BLUR ships as a glow shadow so the dot stays a dot.
 */
export default function CameraScreen({
  remaining,
  rollSize,
  galleryCount,
  film,
  onPickFilm,
  onShot,
  onOpenGallery,
  showHow = false,
  onHowSeen,
  fallbackSrc,
  stampDate,
  stampFonts,
  simulatedLighting,
}: {
  remaining: number;
  /** The whole Roll this event hands out; the How popup says this number. */
  rollSize: number;
  /** The number on the gallery button: how many prints the roll holds. */
  galleryCount: number;
  film: SelectableFilmId;
  onPickFilm: (film: SelectableFilmId) => void;
  onShot: (blob: Blob, film: string) => void;
  onOpenGallery: () => void;
  /** First entry: the "Here's how Memoroll works" popup, shown once. */
  showHow?: boolean;
  onHowSeen?: () => void;
  /** What the viewfinder shows when the browser grants no camera. */
  fallbackSrc: string;
  /** The stamp, burned verbatim in the redesign's own spelling: `5 3 ‘26` -
   *  month, day, curly-quoted year, no clock (mock.ts PRINT_STAMP). */
  stampDate: string;
  /** The families the bake burns the stamp and watermark in. */
  stampFonts: { hand: string; ui: string };
  /** Demo-only: pretend the hardware has these lights. Never set in product. */
  simulatedLighting?: { flash: boolean; torch: boolean };
}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturerRef = useRef<PhotoCapturer | null>(null);
  const [live, setLive] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [flashSupported, setFlashSupported] = useState(false);
  const [torchSupportedState, setTorchSupportedState] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [lightingNote, setLightingNote] = useState<string | null>(null);
  const counterControls = useAnimationControls();

  useEffect(() => {
    // The stamp and watermark draw onto a canvas, which never falls back the
    // way CSS does - warm the fonts up before the first shutter press.
    document.fonts?.load(`52px ${stampFonts.hand}`).catch(() => undefined);
    document.fonts?.load(`500 30px ${stampFonts.ui}`).catch(() => undefined);
  }, [stampFonts.hand, stampFonts.ui]);

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

  const offersFlash = flashSupported || Boolean(simulatedLighting?.flash);
  const offersTorch = torchSupportedState || Boolean(simulatedLighting?.torch);

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) {
      // A simulated torch has no LED to drive; the control still answers.
      if (simulatedLighting?.torch) setTorchOn((v) => !v);
      return;
    }
    const next = !torchOn;
    try {
      await setTorch(track, next);
      setTorchOn(next);
    } catch {
      // A previously supported operation failed: downgrade honestly.
      setTorchSupportedState(false);
      setTorchOn(false);
      setLightingNote(
        'Torch stopped responding on this camera, so it was turned off.'
      );
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
      img.src = fallbackSrc;
    });
  }, [live, fallbackSrc]);

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
    const blob = await bakeShot(stage, film, stampDate, stampFonts);
    onShot(blob, film);
  };

  const empty = remaining <= 0;

  return (
    <section
      aria-label="Camera"
      className="relative flex min-h-full flex-1 flex-col"
      style={{ background: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
      {/* The shots counter: the mauve outer pill and its two dark cards, the
          same counter the Dark Room borrows to say "Developing...". The outer
          stroke is a gradient in the design; the half-white hairline the Dark
          Room already stands in with is repeated here so one element cannot
          drift into two. */}
      <motion.div
        animate={counterControls}
        className="px-[16px] pb-[12px] pt-[10px]">
        <div
          className="rounded-[16px] p-[8px]"
          style={{
            background: colour.mauve,
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 0 1px 2px rgba(58, 44, 52, 0.25)',
          }}>
          <div className="flex items-center gap-[8px]">
            <div
              className="flex shrink-0 items-center justify-center gap-[10px] rounded-[8px] px-[16px] py-[10px]"
              style={{
                background: colour.pill,
                boxShadow:
                  'inset 4px 4px 40.9px 12px rgba(0, 0, 0, 0.1), inset 0 3.6px 5.2px 1px rgba(0, 0, 0, 0.45), inset 0 -3.6px 5.2px 1px rgba(0, 0, 0, 0.17)',
              }}>
              <span
                aria-hidden
                className="h-[10px] w-[10px] shrink-0 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #2bfa32, #19941d)',
                  boxShadow:
                    '0 2px 4.6px 1px rgba(43, 250, 50, 0.25), 0 -2px 6.9px rgba(43, 250, 50, 0.25)',
                }}
              />
              <span className="relative block h-[27px] min-w-[24px] text-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={remaining}
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: -12, scale: 1.2 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    transition={
                      reduce
                        ? { duration: 0.12 }
                        : { type: 'spring', stiffness: 420, damping: 26 }
                    }
                    className="block text-[18px] font-extrabold italic leading-[150%] tracking-[0.12em]"
                    style={{ color: colour.cream }}>
                    {remaining}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div
              className="flex flex-1 items-center justify-center rounded-[8px] px-[16px] py-[10px]"
              style={{
                background: colour.pill,
                boxShadow:
                  'inset 4px 4px 40.9px 12px rgba(0, 0, 0, 0.1), inset 0 3.6px 5.2px 1px rgba(0, 0, 0, 0.45), inset 0 -3.6px 5.2px 1px rgba(0, 0, 0, 0.17)',
              }}>
              <span
                className="text-[18px] font-extrabold italic leading-[150%] tracking-[-0.011em]"
                style={{ color: colour.cream }}>
                SHOTS LEFT
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <HeaderRule tint="rgba(77, 77, 77, 0.7)" />

      {/* The viewfinder: radius 16, the design's own dark card, its stroke a
          gradient (#232323 -> #808080 -> #5e5e5e) that ships as the mid-grey
          the frame shows. The photo inside keeps the keeper's 3:4. */}
      <div className="px-[16px] pb-[10px] pt-[12px]">
        <div
          className="mx-auto w-full max-w-[316px] rounded-[16px] p-[8px]"
          style={{
            background: '#3b3a3a',
            border: '1px solid #808080',
            boxShadow:
              'inset -2px 2px 6.1px rgba(35, 35, 35, 1), inset 2px -2px 6.1px rgba(35, 35, 35, 1)',
          }}>
          <div
            className="relative overflow-hidden rounded-[8px] bg-black"
            style={{ aspectRatio: '3 / 4' }}>
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 ${live ? '' : 'hidden'}`}
              style={{ filter: PREVIEW_CSS[film] }}
            />
            {!live && (
              <img
                src={fallbackSrc}
                alt="Viewfinder placeholder - the browser granted no camera"
                className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300"
                style={{ filter: PREVIEW_CSS[film] }}
              />
            )}
            {PREVIEW_VIGNETTE[film] > 0 && (
              <span
                className="pointer-events-none absolute inset-0 transition-shadow duration-300"
                style={{
                  boxShadow: `inset 0 0 ${Math.round(PREVIEW_VIGNETTE[film] * 180)}px rgba(15, 15, 15, ${PREVIEW_VIGNETTE[film]})`,
                }}
              />
            )}
            {/* The rule-of-thirds grid, drawn over whatever the lens sees. */}
            <span aria-hidden className="pointer-events-none absolute inset-0">
              <span
                className="absolute bottom-0 top-0 left-1/3 w-px"
                style={{ background: colour.ink }}
              />
              <span
                className="absolute bottom-0 top-0 left-2/3 w-px"
                style={{ background: colour.ink }}
              />
              <span
                className="absolute left-0 right-0 top-1/3 h-px"
                style={{ background: colour.ink }}
              />
              <span
                className="absolute left-0 right-0 top-2/3 h-px"
                style={{ background: colour.ink }}
              />
            </span>
            {/* Hardware lighting, offered only when the hardware answers for
                it (or the demo says to pretend it does). Flash sits where the
                design draws it, bottom right inside the glass. */}
            {(offersFlash || offersTorch) && (
              <span className="absolute bottom-[10px] right-[10px] flex gap-[8px]">
                {offersTorch && (
                  <button
                    type="button"
                    aria-label="Torch"
                    aria-pressed={torchOn}
                    onClick={toggleTorch}
                    className="flex h-[24px] items-center gap-[4px] rounded-full px-[8px] py-[4px]"
                    style={{ background: colour.pill, boxShadow: pillShadow }}>
                    <svg
                      aria-hidden
                      width="9"
                      height="12"
                      viewBox="0 0 9 12"
                      fill="none">
                      <path
                        d="M1 0.5h7v2.2L6.4 4.5v6a1 1 0 0 1-1 1H3.6a1 1 0 0 1-1-1v-6L1 2.7V0.5Z"
                        fill="#e3dec5"
                      />
                    </svg>
                    <span
                      className="text-[12px] font-extrabold italic leading-[150%] tracking-[-0.011em]"
                      style={{ color: colour.cream }}>
                      {torchOn ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}
                {offersFlash && (
                  <button
                    type="button"
                    aria-label="Flash"
                    aria-pressed={flashOn}
                    onClick={() => setFlashOn((v) => !v)}
                    className="flex h-[24px] items-center gap-[4px] rounded-full px-[8px] py-[4px]"
                    style={{ background: colour.pill, boxShadow: pillShadow }}>
                    <svg
                      aria-hidden
                      width="8"
                      height="13"
                      viewBox="0 0 8 13"
                      fill="none">
                      <path
                        d="M4.9 0.3 0.4 7.2h2.5L2.6 12.6l4.9-7.4H5.1L5.9 0.3H4.9Z"
                        fill="#e3dec5"
                      />
                    </svg>
                    <span
                      className="text-[12px] font-extrabold italic leading-[150%] tracking-[-0.011em]"
                      style={{ color: colour.cream }}>
                      {flashOn ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )}
              </span>
            )}
            <AnimatePresence>
              {flashKey > 0 && (
                <motion.span
                  key={flashKey}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={
                    reduce
                      ? { duration: 0.12 }
                      : { duration: 0.35, ease: 'easeOut' }
                  }
                  className="pointer-events-none absolute inset-0 block bg-white"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* The film strip: RAW and the five recipes, scrolled sideways. The
          chosen film is cream on dark, the rest dark with cream text - the
          same selection the gallery's tabs speak. */}
      <div
        className="flex gap-[16px] overflow-x-auto px-[16px] py-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="radiogroup"
        aria-label="The film this shot bakes through">
        {ROLL_FILMS.map((f) => {
          const chosen = f.id === film;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={chosen}
              onClick={() => onPickFilm(f.id)}
              className="whitespace-nowrap rounded-full px-[12px] py-[8px] text-[12px] font-extrabold italic leading-[150%] tracking-[-0.011em]"
              style={{
                background: chosen ? colour.cream : colour.pill,
                color: chosen ? colour.ink : colour.cream,
                boxShadow: pillShadow,
              }}>
              {f.name}
            </button>
          );
        })}
      </div>

      {lightingNote && (
        <p
          className="px-[16px] pb-[8px] text-[10px] leading-[150%]"
          style={{ color: colour.cream }}>
          {lightingNote}
        </p>
      )}

      {/* The shutter dock: the mauve silhouette with the SHOOT button in its
          bump and the gallery's stack of prints at its edge. The silhouette's
          two stacked gradients ship as one vertical ramp read off the frame. */}
      <div className="mt-auto pb-[34px] pt-[4px]">
        <div className="relative h-[109px]">
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 375 109"
            preserveAspectRatio="none">
            <defs>
              <linearGradient
                id="memoroll-dock"
                x1="0"
                y1="0"
                x2="0"
                y2="109"
                gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#c9b5c0" />
                <stop offset="0.35" stopColor="#b3a0aa" />
                <stop offset="0.75" stopColor="#94848d" />
                <stop offset="1" stopColor="#7b7076" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="45"
              width="375"
              height="64"
              rx="25"
              fill="url(#memoroll-dock)"
            />
            <circle cx="187.5" cy="45" r="44" fill="url(#memoroll-dock)" />
            <circle cx="47.5" cy="53.5" r="34.5" fill="url(#memoroll-dock)" />
          </svg>
          <span
            aria-hidden
            className="absolute left-1/2 top-[7px] h-[80px] w-[80px] -translate-x-1/2 rounded-full"
            style={{
              background: '#b79fad',
              border: '1px solid #a18294',
              boxShadow: 'inset 0 1px 2px rgba(58, 44, 52, 0.1)',
            }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-[12px] h-[70px] w-[70px] -translate-x-1/2 rounded-full"
            style={{
              background: '#b79fad',
              border: '1px solid #a18294',
              boxShadow: 'inset 0 1px 2px rgba(58, 44, 52, 0.1)',
            }}
          />
          <motion.button
            type="button"
            onClick={shoot}
            aria-label={empty ? 'No shots left' : 'Take a shot'}
            aria-disabled={empty}
            whileTap={reduce || empty ? undefined : { scale: 0.92 }}
            transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
            // Centred by its left edge, never by transform: framer-motion
            // owns this element's transform for the tap scale, and the first
            // press would rewrite it without the -translate-x-1/2, jumping the
            // button half its width off the dock's hump.
            className="absolute left-[calc(50%-32px)] top-[15px] flex h-[64px] w-[64px] items-center justify-center rounded-full"
            style={{
              background: empty ? '#5a5a5a' : colour.flame,
              boxShadow:
                'inset 2px 4px 5.2px rgba(255, 255, 255, 0.25), inset 0 -4px 4.5px rgba(102, 24, 3, 0.98)',
            }}>
            <span
              className="text-[13px] font-extrabold italic leading-[150%]"
              style={{ color: empty ? '#2f2f2f' : '#a52400' }}>
              SHOOT
            </span>
          </motion.button>
          <span
            aria-hidden
            className="absolute right-[22px] top-[69px] h-[3px] w-[53px] rounded-full"
            style={{ background: colour.pill, filter: 'blur(5.1px)' }}
          />
          {/* The gallery: the design's own folder of prints, exported from
              the file, with how many it holds. The prints in it are the
              artwork's - product decoration the same on every camera - not a
              preview of anybody's Shot, which this camera never shows. The
              live count is drawn over the artwork's baked badge in the same
              ink, so whatever number the file was exported with never shows
              through. */}
          <button
            type="button"
            onClick={onOpenGallery}
            aria-label="Open the gallery"
            className="absolute right-[19px] top-[13px] h-[56px] w-[60px]">
            <img
              src={folderArt.src}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full"
            />
            <span
              className="absolute right-0 top-0 flex h-[24px] w-[24px] items-center justify-center rounded-full"
              style={{ background: '#40363b' }}>
              <span className="text-[10px] font-bold leading-[150%] tracking-[-0.011em] text-white">
                {galleryCount}
              </span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHow && <HowPopup shots={rollSize} onDone={() => onHowSeen?.()} />}
      </AnimatePresence>
    </section>
  );
}

/**
 * Bake the frame: the film's pixel pass, then the date stamp (any film
 * except RAW) and the memoify.live watermark, burned in and encoded as a
 * JPEG blob. Nothing here uses ctx.filter; the renderer's pixel pass is the
 * colour truth (ADR 0006).
 *
 * The stamp still burns in the hand-written face of the pre-redesign camera.
 * Reconciling the baked stamp with the orange print stamp the redesigned
 * gallery draws is hbd-3i5's, not this screen's: the bead that re-skinned the
 * camera deliberately changed what the camera looks like, not what it makes.
 */
async function bakeShot(
  stage: HTMLCanvasElement,
  film: SelectableFilmId,
  stampDate: string,
  stampFonts: { hand: string; ui: string }
): Promise<Blob> {
  const { canvas } = bakeMemoRollFilm(stage, FRAME_W, FRAME_H, film);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  ctx.textBaseline = 'alphabetic';

  // Where the marks are burned is dictated by where the prints can crop.
  // Every print window is a taller ratio than the 3:4 frame (the widest,
  // card and bath at 281.88/338.06, keeps only ~90% of the height under
  // object-cover), so up to 64px vanishes off the top and the bottom of
  // this frame on every render. Marks at the old 40px inset were baked
  // straight into that band - a guest's first real roll came back with the
  // watermark and the date sliced off (found live, 2026-08-29).
  //
  // Both marks live in the bottom-LEFT, stacked, above the crop line: the
  // left corner is where the print's own stamp overlay sits, and the right
  // corner stays clean for the signature RollPrint draws over My Roll
  // prints. They speak the redesign's own voice (owner asked for prettier,
  // 2026-08-30): the date in the flame-orange a point-and-shoot exposes it
  // in - `colour.stamp`, the exact colour the gallery's overlay stamps use -
  // small and quiet, with the watermark a whisper beneath it. The legacy
  // 52px handwriting is gone; this closes what hbd-3i5 opened.
  if (filmStamps(film)) {
    // The stamp verbatim, the way the redesign writes it: `5 3 ‘26` - no
    // slashes, no clock, the curly quote included (mock.ts PRINT_STAMP).
    ctx.font = `600 34px ${stampFonts.ui}, sans-serif`;
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 6;
    // The glow a real date-back burns: the orange itself, bleeding a little.
    ctx.fillStyle = 'rgba(241, 126, 3, 0.35)';
    ctx.fillText(stampDate, 33, FRAME_H - 119);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f17e03';
    ctx.fillText(stampDate, 32, FRAME_H - 120);
  }

  ctx.font = `500 20px ${stampFonts.ui}, sans-serif`;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'left';
  ctx.fillText('memoify.live', 32, FRAME_H - 84);
  ctx.shadowBlur = 0;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('JPEG encode failed')),
      'image/jpeg',
      JPEG_QUALITY
    );
  });
}

'use client';

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { VIEWFINDER_FALLBACK } from '../mock';
import { Shot } from '../use-shots';
import { EASE, REDUCED_FADE } from '../variants';

/**
 * Camera (guest-06) with the shutter variants of guest-07. The viewfinder is
 * the real camera when the browser grants it and a styled placeholder when it
 * does not. Ten shots, counted down where the guest can feel it, and a dead
 * shutter at zero: the scarcity is the product.
 */
export default function CameraScreen({
  remaining,
  lastShot,
  onCapture,
  onOpenGallery,
}: {
  remaining: number;
  lastShot: Shot | null;
  onCapture: (dataUrl: string) => void;
  onOpenGallery: () => void;
}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [rollDone, setRollDone] = useState(false);
  const counterControls = useAnimationControls();

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

  /** Draw whatever the viewfinder is showing into a small JPEG. */
  const takeFrame = useCallback((): Promise<string> => {
    const toJpeg = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 640;
      const ctx = canvas.getContext('2d')!;
      draw(ctx);
      return canvas.toDataURL('image/jpeg', 0.72);
    };
    const coverDraw = (
      ctx: CanvasRenderingContext2D,
      source: CanvasImageSource,
      sw: number,
      sh: number
    ) => {
      const scale = Math.max(480 / sw, 640 / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      ctx.drawImage(source, (480 - dw) / 2, (640 - dh) / 2, dw, dh);
    };
    const gradientFallback = () =>
      toJpeg((ctx) => {
        const g = ctx.createLinearGradient(0, 0, 480, 640);
        g.addColorStop(0, '#3a3a3a');
        g.addColorStop(1, '#141414');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 480, 640);
        ctx.fillStyle = '#f7f5f3';
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('memoroll demo shot', 240, 320);
      });

    const video = videoRef.current;
    if (live && video && video.videoWidth > 0) {
      try {
        return Promise.resolve(
          toJpeg((ctx) =>
            coverDraw(ctx, video, video.videoWidth, video.videoHeight)
          )
        );
      } catch {
        return Promise.resolve(gradientFallback());
      }
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          resolve(
            toJpeg((ctx) =>
              coverDraw(ctx, img, img.naturalWidth, img.naturalHeight)
            )
          );
        } catch {
          resolve(gradientFallback());
        }
      };
      img.onerror = () => resolve(gradientFallback());
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
    const dataUrl = await takeFrame();
    onCapture(dataUrl);
  };

  const empty = remaining <= 0;

  return (
    <div className="flex flex-1 flex-col bg-[#212121] px-3 pb-6 pt-4">
      <div className="relative flex-1 overflow-hidden rounded-[22px] border border-white/20 bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover ${live ? '' : 'hidden'}`}
        />
        {!live && (
          <>
            <img
              src={VIEWFINDER_FALLBACK}
              alt="Placeholder viewfinder"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/80"
              style={{ fontFamily: 'var(--font-mr-ui)' }}>
              demo viewfinder · camera not granted
            </span>
          </>
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

      <div className="flex items-center justify-between px-6 pb-1 pt-5">
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

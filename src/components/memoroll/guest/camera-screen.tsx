'use client';

import { screenShape, trackMemoRoll } from '@/lib/memoroll-analytics';
import {
  detectLightingCapabilities,
  defaultImageCaptureFactory,
  setTorch,
  withTorchPulse,
  type PhotoCapturer,
} from '@/lib/memoroll-camera';
import { bakeMemoRollFilm, warmMemoRollGrain } from '@/lib/memoroll-film';
import { EASE_OUT, tick } from '../ui/motion';
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

/**
 * The baked keeper's sizes, largest first. All 3:4, the viewfinder's ratio.
 *
 * A keeper is as large as the camera's own pixels allow and no larger
 * (owner, 2026-11-22: on a phone whose stream is 1440x1920, the old fixed
 * 960x1280 threw away more than half the detail already in hand, and the
 * difference showed). The smallest is the film report's original contract
 * and stays the floor: a camera that hands over less than that is enlarged
 * to it, as it always was.
 *
 * The larger sizes are encoded a little harder. Side by side on a phone the
 * two qualities could not be told apart, and the file is a fifth smaller,
 * which matters on a venue's network.
 */
const KEEPERS = [
  { width: 1440, height: 1920, quality: 0.7 },
  { width: 1200, height: 1600, quality: 0.7 },
  { width: 960, height: 1280, quality: 0.78 },
] as const;
const FLOOR = KEEPERS[KEEPERS.length - 1];

/**
 * The last thing the viewfinder showed, kept for this page load. Coming back
 * to the camera from the gallery starts the stream again, and until the
 * phone hands it over the viewfinder was black (or showed the stand-in
 * photo), which read as the camera having broken (found 2026-11-22). The
 * frame it left on is shown, softened, until the live picture is moving
 * again. A small JPEG as a data URL: it is only ever a backdrop.
 */
let lastViewfinder: { src: string; mirrored: boolean } | null = null;

/**
 * Which way the camera points. The back camera is the default: a guest is
 * photographing the event, not themselves (owner, 2026-11-26: the front
 * camera is offered, never opened on first).
 */
type Facing = 'back' | 'front';

/**
 * The side the guest last chose, kept for this page load only, so coming
 * back from the gallery does not turn the camera round on them. A reload,
 * or the next roll, opens on the back camera again.
 */
let lastFacing: Facing = 'back';

/**
 * Set once a phone has shown it has no camera on the other side (the
 * browser answered OverconstrainedError or NotFoundError, or handed back the
 * same camera), so the switch is not offered again for this page load.
 */
let otherSideMissing = false;

/** The stream size every request asks for; only the direction differs. */
const STREAM_SIZE = {
  width: { ideal: 1920 },
  height: { ideal: 1440 },
  aspectRatio: { ideal: 4 / 3 },
} as const;

/**
 * What to ask the browser for. The back camera is asked for exactly as it
 * always was, as a preference, so a phone or laptop with only one camera
 * still opens. The front camera is asked for exactly: a preference would
 * quietly hand back the same camera and the switch would seem to do nothing.
 */
function constraintsFor(facing: Facing): MediaStreamConstraints {
  return {
    video: {
      facingMode: facing === 'back' ? 'environment' : { exact: 'user' },
      ...STREAM_SIZE,
    },
    audio: false,
  };
}

/**
 * Which way the stream actually points, where the browser says; otherwise
 * the way it was asked for. A laptop's webcam or a tablet with only a front
 * camera answers a request for the back one with a front one, and saying so
 * keeps the mirror and the analytics truthful.
 */
function facingOf(stream: MediaStream, asked: Facing): Facing {
  const said = stream.getVideoTracks()[0]?.getSettings?.().facingMode;
  if (said === 'user') return 'front';
  if (said === 'environment') return 'back';
  return asked;
}

/** The size the marks below were drawn for; every other size scales them. */
const MARK_BASE_WIDTH = 960;

/**
 * The largest keeper a source can fill without being enlarged, under the
 * viewfinder's cover crop. A source too small for any of them gets the floor.
 */
function keeperFor(sourceWidth: number, sourceHeight: number) {
  return (
    KEEPERS.find((k) => sourceWidth >= k.width && sourceHeight >= k.height) ??
    FLOOR
  );
}

/**
 * The camera (guest-09/10): the shots counter over the viewfinder, the film
 * strip, and the mauve dock carrying the shutter and the gallery.
 *
 * The chrome is the 2026-08-24 design; the stack under it is the one that
 * already works (ADR 0007: this screen was re-skinned, not re-engineered).
 * Every Shot is baked at capture through src/lib/memoroll-film.ts into a
 * 3:4 JPEG blob, as large as the camera's stream allows (see KEEPERS) - film, date stamp and watermark burned into the pixels,
 * no negative kept (ADR 0006). The viewfinder wears an ordinary CSS
 * approximation of the look; the baked pixels are the truth.
 *
 * Lighting is hardware-honest: Flash appears only when the granted track can
 * light the shot, and a runtime failure downgrades it with a visible note
 * instead of faking. Flash fires the synchronized fill light via
 * ImageCapture.takePhoto where the browser exposes one; most phones expose
 * only the torch, so there Flash pulses the torch around the shot - on at the
 * shutter, off straight after (owner, 2026-11-12: a torch left burning is not
 * a flash). The product no longer offers a standalone Torch; only the demo's
 * dial still draws one.
 * `simulatedLighting` is the demo's stand-in for hardware nobody's laptop
 * has, the same stand-in its dock already is for clocks and venues; a
 * simulated light draws the control without ever touching a track.
 *
 * The camera opens on the back and can be turned round to the front on a
 * phone that lists two cameras (2026-11-26; see switchCamera). The front
 * previews mirrored and is saved the right way round.
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
  revealLabel,
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
  requireCamera = false,
}: {
  remaining: number;
  /**
   * When the Reveal is, worded for a guest ("Fri 13 Nov, 21:00"). Turns on
   * the out-of-shots card over the viewfinder (owner, 2026-11-12): an empty
   * roll used to show only a greyed shutter, with nothing to say why or what
   * comes next. The demo passes nothing and draws the designed camera.
   */
  revealLabel?: string;
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
  /**
   * Product-only (2026-11-27, before a 200-guest wedding): a Shot is only ever
   * what the lens sees. Without a live camera the shutter takes nothing and
   * the viewfinder says why, with a way to ask again - rather than baking
   * the Cover photo into a spent Shot, which the demo's stand-in still does.
   */
  requireCamera?: boolean;
}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturerRef = useRef<PhotoCapturer | null>(null);
  const [live, setLive] = useState(false);
  /** Why there is no live camera, once the browser has answered. */
  const [cameraIssue, setCameraIssue] = useState<
    null | 'denied' | 'unavailable' | 'unsupported'
  >(null);
  /** Bumped by "Try again": the camera is asked for afresh. */
  const [cameraAttempt, setCameraAttempt] = useState(0);
  /** Whether the live picture is actually moving, not merely granted. */
  const [rolling, setRolling] = useState(false);
  const [resumeFrame, setResumeFrame] = useState(() => lastViewfinder);
  const [facing, setFacing] = useState<Facing>(() => lastFacing);
  const facingRef = useRef<Facing>(lastFacing);
  /** Whether this phone has a second camera worth offering. */
  const [canSwitch, setCanSwitch] = useState(false);
  /** The camera is being turned round: the old stream is stopped and the
   *  new one not yet granted. The shutter waits it out. */
  const [switching, setSwitching] = useState(false);
  const switchingRef = useRef(false);
  /** A shot is being taken or baked; the switch waits for it. */
  const [shotBusy, setShotBusy] = useState(false);
  /** Each stream handed to the viewfinder gets a number, so a lighting
   *  check that answers after the camera was turned round is ignored. */
  const streamSeq = useRef(0);
  const mounted = useRef(true);
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
    // The looks' grain is made once and kept; make it while the guest is
    // still framing, not on the first press of the shutter.
    // The grain is made for one size, the keeper's, and that is only known
    // once the stream has said how many pixels it carries. Before then the
    // floor is the best guess, and it is what the demo's fallback bakes at.
    const video = videoRef.current;
    const warm = () => {
      const keeper =
        video && video.videoWidth > 0
          ? keeperFor(video.videoWidth, video.videoHeight)
          : FLOOR;
      warmMemoRollGrain(keeper.width, keeper.height);
    };
    const id = window.setTimeout(warm, 600);
    video?.addEventListener('loadedmetadata', warm);
    return () => {
      window.clearTimeout(id);
      video?.removeEventListener('loadedmetadata', warm);
    };
  }, []);

  /**
   * A small copy of what the viewfinder is showing, as it was shown (the
   * front camera's mirror included), or null when there is no picture.
   */
  const snapshotViewfinder = useCallback((): {
    src: string;
    mirrored: boolean;
  } | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth <= 0 || !streamRef.current) return null;
    try {
      const keep = document.createElement('canvas');
      keep.width = 270;
      keep.height = 360;
      const scale = Math.max(
        keep.width / video.videoWidth,
        keep.height / video.videoHeight
      );
      keep
        .getContext('2d')!
        .drawImage(
          video,
          (keep.width - video.videoWidth * scale) / 2,
          (keep.height - video.videoHeight * scale) / 2,
          video.videoWidth * scale,
          video.videoHeight * scale
        );
      return {
        src: keep.toDataURL('image/jpeg', 0.6),
        mirrored: facingRef.current === 'front',
      };
    } catch {
      // A frame that cannot be read is simply not kept.
      return null;
    }
  }, []);

  /**
   * Let go of the camera. The torch must never outlive it: off before the
   * stream stops. Awaited when the camera is turned round, so the LED is out
   * before the other camera is asked for.
   */
  const releaseCamera = useCallback(async () => {
    const stream = streamRef.current;
    streamRef.current = null;
    capturerRef.current = null;
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      await setTorch(track, false).catch(() => undefined);
    }
    stream.getTracks().forEach((t) => t.stop());
  }, []);

  /** Put a granted stream in the viewfinder and learn what it can light. */
  const attachStream = useCallback(
    async (stream: MediaStream, pointing: Facing) => {
      const seq = ++streamSeq.current;
      streamRef.current = stream;
      facingRef.current = pointing;
      lastFacing = pointing;
      setFacing(pointing);
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.play().catch(() => undefined);
      }
      setLive(true);
      // Lighting belongs to the track, so a new camera is asked afresh; it
      // exists only after permission is granted.
      setFlashSupported(false);
      setTorchSupportedState(false);
      const track = stream.getVideoTracks()[0];
      if (track) {
        capturerRef.current = defaultImageCaptureFactory(track);
        const caps = await detectLightingCapabilities(track);
        if (mounted.current && seq === streamSeq.current) {
          setFlashSupported(caps.flash);
          setTorchSupportedState(caps.torch);
        }
      }
    },
    []
  );

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      // No camera API at all: an insecure page or a browser without it.
      setCameraIssue('unsupported');
      return () => {
        mounted.current = false;
      };
    }
    const media = navigator.mediaDevices;
    // A high-quality 4:3 stream: enough pixels that the keeper crops from
    // real detail rather than upscaling. The back camera unless the guest
    // turned it round earlier on this page load.
    const asked = lastFacing;
    (async () => {
      let stream: MediaStream;
      let pointing = asked;
      try {
        stream = await media.getUserMedia(constraintsFor(asked));
      } catch (error) {
        const reason = (error as DOMException)?.name ?? 'unknown';
        if (asked === 'back' || reason === 'NotAllowedError') {
          // NotAllowedError is a guest saying no; NotFoundError and
          // NotReadableError are a phone that cannot. They want different
          // fixes.
          trackMemoRoll('memoroll_camera_failed', {
            reason,
            attempt: cameraAttempt,
          });
          if (!cancelled) {
            setLive(false);
            setCameraIssue(
              reason === 'NotAllowedError' || reason === 'SecurityError'
                ? 'denied'
                : 'unavailable'
            );
          }
          return;
        }
        // The front camera the guest left on would not start again: the
        // back one is the camera that matters, so open that instead.
        try {
          stream = await media.getUserMedia(constraintsFor('back'));
          pointing = 'back';
          if (!cancelled) {
            setLightingNote(
              'The front camera did not start, so this is the back camera.'
            );
          }
        } catch (second) {
          const secondReason = (second as DOMException)?.name ?? 'unknown';
          trackMemoRoll('memoroll_camera_failed', {
            reason: secondReason,
            attempt: cameraAttempt,
          });
          if (!cancelled) {
            setLive(false);
            setCameraIssue(
              secondReason === 'NotAllowedError' ||
                secondReason === 'SecurityError'
                ? 'denied'
                : 'unavailable'
            );
          }
          return;
        }
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      setCameraIssue(null);
      pointing = facingOf(stream, pointing);
      {
        const settings = stream.getVideoTracks()[0]?.getSettings?.() ?? {};
        trackMemoRoll('memoroll_camera_ready', {
          stream_width: settings.width ?? null,
          stream_height: settings.height ?? null,
          facing: pointing,
          ...screenShape(),
        });
      }
      const attached = attachStream(stream, pointing);
      // The switch is offered only to a phone that lists a second camera.
      // The list is read now, after permission: before it, browsers name no
      // devices and may list only one, so a phone with two would look like
      // a phone with one.
      try {
        const devices = await media.enumerateDevices();
        const cameras = devices.filter((d) => d.kind === 'videoinput');
        if (!cancelled) {
          setCanSwitch(cameras.length >= 2 && !otherSideMissing);
        }
      } catch {
        // A browser that will not list its cameras is not offered the switch.
      }
      await attached;
    })();
    return () => {
      cancelled = true;
      mounted.current = false;
      // Keep what the viewfinder is showing, for the next time it opens.
      const frame = snapshotViewfinder();
      if (frame) lastViewfinder = frame;
      releaseCamera();
    };
    // cameraAttempt: "Try again" asks for the camera afresh.
  }, [attachStream, releaseCamera, snapshotViewfinder, cameraAttempt]);

  /**
   * Turn the camera round. The old stream is stopped before the other camera
   * is asked for: many Android phones cannot open a second camera while the
   * first is held, and iOS stops the first one anyway. While the new stream
   * starts, the frame the viewfinder was on stays up, softened, so it does
   * not go black. If the other camera will not start, the one that worked is
   * opened again and the guest is told, in one line, under the film strip.
   */
  const switchCamera = async () => {
    if (switchingRef.current || shooting.current || !streamRef.current) return;
    const media = navigator.mediaDevices;
    switchingRef.current = true;
    setSwitching(true);
    setLightingNote(null);
    const from = facingRef.current;
    const to: Facing = from === 'back' ? 'front' : 'back';
    const started = performance.now();
    const frame = snapshotViewfinder();
    if (frame) setResumeFrame(frame);
    setRolling(false);
    setTorchOn(false);
    await releaseCamera();
    let outcome: 'switched' | 'same_camera' | 'fell_back' | 'failed';
    let reason: string | null = null;
    let landed: Facing | null = null;
    try {
      const stream = await media.getUserMedia(constraintsFor(to));
      if (!mounted.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      landed = facingOf(stream, to);
      await attachStream(stream, landed);
      if (landed === to) {
        outcome = 'switched';
      } else {
        // The browser answered with the camera it already had: there is no
        // other side to offer.
        outcome = 'same_camera';
        otherSideMissing = true;
        setCanSwitch(false);
        setLightingNote('This phone has only the one camera here.');
      }
    } catch (error) {
      reason = (error as DOMException)?.name ?? 'unknown';
      if (!mounted.current) return;
      if (reason === 'OverconstrainedError' || reason === 'NotFoundError') {
        otherSideMissing = true;
        setCanSwitch(false);
      }
      try {
        const stream = await media.getUserMedia(constraintsFor(from));
        if (!mounted.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        landed = facingOf(stream, from);
        await attachStream(stream, landed);
        outcome = 'fell_back';
        setLightingNote(
          `The ${to} camera did not start, so you are still on the ${landed} camera.`
        );
      } catch (second) {
        // Neither camera will start now: the viewfinder falls back to the
        // stand-in it shows when no camera is granted, and the shutter
        // still takes that, as it always has.
        outcome = 'failed';
        reason = (second as DOMException)?.name ?? reason;
        setLive(false);
        setCanSwitch(false);
        setCameraIssue('unavailable');
        setLightingNote(
          'The camera stopped responding. Try reloading the page.'
        );
      }
    } finally {
      switchingRef.current = false;
      if (mounted.current) setSwitching(false);
    }
    const settings =
      streamRef.current?.getVideoTracks()[0]?.getSettings?.() ?? {};
    trackMemoRoll('memoroll_camera_switched', {
      from,
      to,
      landed,
      outcome,
      reason,
      stream_width: settings.width ?? null,
      stream_height: settings.height ?? null,
      switch_ms: Math.round(performance.now() - started),
    });
  };

  /** The demo pretends the back camera has lights; no front camera does, so
   *  turned round, the demo stops pretending (2026-11-26). */
  const simulated = facing === 'back' ? simulatedLighting : undefined;
  /** Flash is offered for either light: the real flash, or the torch fired
   *  as one (`withTorchPulse`). Lighting is read off the track in use, so a
   *  front camera with no LED hides Flash rather than drawing a dead one; a
   *  front camera that does report a light keeps it. The guest's choice is
   *  kept, and comes back with the back camera. */
  const offersFlash =
    flashSupported || torchSupportedState || Boolean(simulated?.flash);
  /** What the shutter will actually do: Flash on, on a camera that has it. */
  const flashLive = flashOn && offersFlash;
  /** A standalone, always-on Torch is the demo dial's alone now. */
  const offersTorch = Boolean(simulated?.torch);
  /** A pulse holds the shutter for its settle time; a second press inside
   *  it must not take a second shot. */
  const shooting = useRef(false);

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

  /**
   * Draw a source onto a stage the size of the keeper it can fill, with the
   * viewfinder's cover crop.
   */
  const stageFrom = (
    source: CanvasImageSource,
    sw: number,
    sh: number
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const { width, height } = keeperFor(sw, sh);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const scale = Math.max(width / sw, height / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    ctx.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh);
    return canvas;
  };

  /**
   * The no-flash path: whatever the viewfinder is showing right now.
   *
   * Drawn from the stream itself, never from the mirrored preview, so a
   * front-camera shot comes out the right way round: writing in the frame
   * reads, and the guest sees themselves as others do, which is what an
   * iPhone saves by default (owner's call to make; 2026-11-26). The stamp
   * and watermark are burned after, onto the unmirrored frame, so they can
   * never come out backwards.
   */
  const takeFrame = useCallback((): Promise<HTMLCanvasElement> => {
    const gradientStage = () => {
      const canvas = document.createElement('canvas');
      const { width: FRAME_W, height: FRAME_H } = FLOOR;
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
    // While the camera is being turned round there is no live picture to
    // take, only the softened frame left up over the gap.
    if (shooting.current || switchingRef.current) return;
    // Product: no picture from the lens, no Shot. A stream that is granted
    // but has no frame yet counts as no picture - takeFrame would otherwise
    // fall back to the Cover photo and spend a Shot on it.
    if (requireCamera) {
      const video = videoRef.current;
      if (!live || !streamRef.current || !video || video.videoWidth <= 0) {
        return;
      }
    }
    shooting.current = true;
    setShotBusy(true);
    // A click under the finger where the phone can (Android): a native
    // shutter is felt as much as seen.
    tick();
    try {
      // White-screen animation: shutter feedback only, never a light source.
      setFlashKey((k) => k + 1);
      const started = performance.now();
      const stage = await lightAndTake();
      // A look is a few hundred milliseconds of arithmetic on the main
      // thread (2026-11-13: soft lens, halation, grain). Let the shutter's
      // white flash reach the screen first - once painted it fades on the
      // compositor, whatever the main thread is doing.
      await painted();
      const blob = await bakeShot(stage, film, stampDate, stampFonts);
      onShot(blob, film);
      // After the shot is safely handed on: what was shot, on what, and how
      // the phone was held as far as the browser can tell. A phone with its
      // rotation locked reports portrait however it is held.
      const video = videoRef.current;
      trackMemoRoll('memoroll_shot_taken', {
        shot_number: rollSize - remaining + 1,
        roll_size: rollSize,
        film,
        flash: flashLive,
        live_camera: Boolean(streamRef.current),
        // Which camera took it; the stand-in has none.
        facing: streamRef.current ? facingRef.current : null,
        stream_width: video?.videoWidth || null,
        stream_height: video?.videoHeight || null,
        keeper_width: stage.width,
        keeper_height: stage.height,
        bytes: blob.size,
        shutter_ms: Math.round(performance.now() - started),
        ...screenShape(),
      });
    } catch (error) {
      trackMemoRoll('memoroll_shot_failed', {
        reason: (error as Error)?.name ?? 'unknown',
      });
      throw error;
    } finally {
      shooting.current = false;
      setShotBusy(false);
    }
  };

  /**
   * The frame, lit the best way this camera can when Flash is on: the real
   * flash first, then the torch pulsed as one. Each failure downgrades that
   * light with a note and falls through - the shot is never lost.
   */
  const lightAndTake = async (): Promise<HTMLCanvasElement> => {
    if (!flashLive) return takeFrame();
    if (flashSupported && capturerRef.current) {
      try {
        return await takeFlashFrame();
      } catch {
        setFlashSupported(false);
        if (!torchSupportedState) {
          setFlashOn(false);
          setLightingNote(
            'Flash failed on this camera, so this shot used the live view instead.'
          );
          return takeFrame();
        }
      }
    }
    const track = streamRef.current?.getVideoTracks()[0];
    if (torchSupportedState && track) {
      try {
        return await withTorchPulse(track, takeFrame);
      } catch {
        setTorchSupportedState(false);
        setFlashOn(false);
        setLightingNote(
          'Flash stopped responding on this camera, so this shot used the live view instead.'
        );
      }
    }
    return takeFrame();
  };

  const empty = remaining <= 0;
  /** Product: the shutter only answers once the lens is actually showing. */
  const cameraReady = !requireCamera || (live && !cameraIssue);
  const shutterOff = empty || !cameraReady;
  const issueCopy: Record<
    'denied' | 'unavailable' | 'unsupported',
    { title: string; body: string }
  > = {
    denied: {
      title: 'Your camera is blocked',
      body: 'MemoRoll needs the camera to take your shots. Tap Try again and choose Allow. If nothing asks, tap the icon beside the address bar, allow Camera, then tap Try again.',
    },
    unavailable: {
      title: 'The camera did not start',
      body: 'Another app may be using it. Close any other camera or video call, then tap Try again.',
    },
    unsupported: {
      title: 'This browser cannot open the camera',
      body: 'Open this link in Safari or Chrome to take your shots.',
    },
  };

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
              onPlaying={(event) => {
                // "Playing" can come a frame before there is a picture to
                // show; where the browser can say when the first one is on
                // screen, wait for that.
                const el = event.currentTarget as HTMLVideoElement & {
                  requestVideoFrameCallback?: (done: () => void) => void;
                };
                if (el.requestVideoFrameCallback) {
                  el.requestVideoFrameCallback(() => setRolling(true));
                } else {
                  setRolling(true);
                }
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 ${live ? '' : 'hidden'}`}
              style={{
                filter: PREVIEW_CSS[film],
                // The front camera previews as a mirror, the way every
                // selfie camera does; the shot itself is taken the right
                // way round (see takeFrame).
                transform: facing === 'front' ? 'scaleX(-1)' : undefined,
              }}
            />
            {/* The frame the camera was left on, until the live one moves:
                on coming back from the gallery, and while the camera is
                being turned round. */}
            {resumeFrame && !rolling ? (
              <img
                src={resumeFrame.src}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform: resumeFrame.mirrored
                    ? 'scale(-1.05, 1.05)'
                    : 'scale(1.05)',
                  filter:
                    PREVIEW_CSS[film] && PREVIEW_CSS[film] !== 'none'
                      ? `${PREVIEW_CSS[film]} blur(6px)`
                      : 'blur(6px)',
                }}
              />
            ) : null}
            {!live && !resumeFrame && !requireCamera && (
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
            {requireCamera && !live && !cameraIssue && !resumeFrame ? (
              <p
                role="status"
                className="absolute inset-0 flex items-center justify-center text-[13px]"
                style={{ color: 'rgba(224, 218, 191, 0.85)' }}>
                Starting the camera…
              </p>
            ) : null}
            {requireCamera && cameraIssue && !empty ? (
              <div
                role="alert"
                className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-[10px] px-[20px] text-center"
                style={{ background: 'rgba(20, 20, 20, 0.9)' }}>
                <p
                  className="text-[20px] font-bold leading-[130%]"
                  style={{ color: colour.cream }}>
                  {issueCopy[cameraIssue].title}
                </p>
                <p
                  className="text-[13px] leading-[150%]"
                  style={{ color: 'rgba(224, 218, 191, 0.85)' }}>
                  {issueCopy[cameraIssue].body}
                </p>
                <div className="mt-[6px] flex gap-[8px]">
                  {cameraIssue !== 'unsupported' ? (
                    <button
                      type="button"
                      onClick={() => {
                        trackMemoRoll('memoroll_camera_retry', {
                          issue: cameraIssue,
                          attempt: cameraAttempt + 1,
                        });
                        setCameraIssue(null);
                        setLightingNote(null);
                        setCameraAttempt((n) => n + 1);
                      }}
                      className="rounded-full px-[16px] py-[8px] text-[13px] font-bold"
                      style={{ background: colour.flame, color: '#ffffff' }}>
                      Try again
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-full px-[16px] py-[8px] text-[13px] font-bold"
                    style={{
                      background: 'transparent',
                      color: colour.cream,
                      border: '1px solid rgba(224, 218, 191, 0.5)',
                    }}>
                    Reload page
                  </button>
                </div>
              </div>
            ) : null}
            <AnimatePresence>
              {empty && revealLabel !== undefined ? (
                <motion.div
                  key="roll-done"
                  role="status"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] px-[20px] text-center"
                  style={{
                    background: 'rgba(20, 20, 20, 0.78)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduce ? 0.12 : 0.3,
                    ease: [0.23, 1, 0.32, 1],
                  }}>
                  <p
                    className="text-[20px] font-bold leading-[130%]"
                    style={{ color: colour.cream }}>
                    That&apos;s your roll!
                  </p>
                  <p
                    className="text-[13px] leading-[150%]"
                    style={{ color: 'rgba(224, 218, 191, 0.85)' }}>
                    You&apos;ve shot all {rollSize}. They develop at the reveal
                    {revealLabel ? (
                      <>
                        {' '}
                        on <strong>{revealLabel}</strong>
                      </>
                    ) : null}
                    .
                  </p>
                  <button
                    type="button"
                    onClick={onOpenGallery}
                    className="mt-[6px] rounded-full px-[16px] py-[8px] text-[13px] font-bold"
                    style={{ background: colour.flame, color: '#ffffff' }}>
                    See my shots
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
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
                      : { duration: 0.35, ease: EASE_OUT }
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

      {/* One line for anything the camera could not do: a light that
          failed, or a camera that would not turn round. */}
      <div role="status" aria-live="polite">
        {lightingNote && (
          <p
            className="px-[16px] pb-[8px] text-[10px] leading-[150%]"
            style={{ color: colour.cream }}>
            {lightingNote}
          </p>
        )}
      </div>

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
            aria-label={
              empty
                ? 'No shots left'
                : cameraReady
                  ? 'Take a shot'
                  : 'Camera not ready'
            }
            aria-disabled={shutterOff}
            whileTap={reduce || shutterOff ? undefined : { scale: 0.92 }}
            transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
            // Centred by its left edge, never by transform: framer-motion
            // owns this element's transform for the tap scale, and the first
            // press would rewrite it without the -translate-x-1/2, jumping the
            // button half its width off the dock's hump.
            className="absolute left-[calc(50%-32px)] top-[15px] flex h-[64px] w-[64px] items-center justify-center rounded-full"
            style={{
              background: shutterOff ? '#5a5a5a' : colour.flame,
              boxShadow:
                'inset 2px 4px 5.2px rgba(255, 255, 255, 0.25), inset 0 -4px 4.5px rgba(102, 24, 3, 0.98)',
            }}>
            <span
              className="text-[13px] font-extrabold italic leading-[150%]"
              style={{ color: shutterOff ? '#2f2f2f' : '#a52400' }}>
              SHOOT
            </span>
          </motion.button>
          {/* Turn the camera round (2026-11-26). It sits on the dock's left
              hump, the raised pad the design draws opposite the gallery and
              leaves empty, so the shutter, the folder and Flash keep their
              places. It wears the shutter well's mauve and the gallery
              badge's ink. Shown only on a phone that lists two cameras, and
              still while a shot is baking or the camera is restarting. Placed
              by its left edge, as the shutter is, because framer-motion owns
              its transform. */}
          {canSwitch && live && (
            <motion.button
              type="button"
              onClick={switchCamera}
              disabled={switching || shotBusy}
              aria-label={
                facing === 'back'
                  ? 'Switch to the front camera'
                  : 'Switch to the back camera'
              }
              aria-busy={switching}
              whileTap={
                reduce || switching || shotBusy ? undefined : { scale: 0.92 }
              }
              transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[calc(12.667%-24px)] top-[29.5px] flex h-[48px] w-[48px] items-center justify-center rounded-full transition-opacity duration-200 disabled:opacity-50"
              style={{
                background: '#b79fad',
                border: '1px solid #a18294',
                boxShadow: 'inset 0 1px 2px rgba(58, 44, 52, 0.1)',
              }}>
              <svg
                aria-hidden
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#40363b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M19.5 10.5A7.6 7.6 0 0 0 6.1 6.6L4.5 8.2" />
                <path d="M4.5 4.2v4h4" />
                <path d="M4.5 13.5a7.6 7.6 0 0 0 13.4 3.9l1.6-1.6" />
                <path d="M19.5 19.8v-4h-4" />
                <circle cx="12" cy="12" r="2.4" />
              </svg>
            </motion.button>
          )}
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

/** Resolves once the browser has painted what was just rendered. */
function painted(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
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
  // The stage is already a keeper's size (stageFrom); the keeper it is says
  // how hard to encode it.
  const FRAME_W = stage.width;
  const FRAME_H = stage.height;
  const quality =
    KEEPERS.find((k) => k.width === FRAME_W)?.quality ?? FLOOR.quality;
  // The marks were drawn for the floor. On a larger keeper they grow with
  // it, so they sit in the same place and read the same size on a print.
  const k = FRAME_W / MARK_BASE_WIDTH;
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
    ctx.font = `600 ${34 * k}px ${stampFonts.ui}, sans-serif`;
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 6 * k;
    // The glow a real date-back burns: the orange itself, bleeding a little.
    ctx.fillStyle = 'rgba(241, 126, 3, 0.35)';
    ctx.fillText(stampDate, 33 * k, FRAME_H - 119 * k);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f17e03';
    ctx.fillText(stampDate, 32 * k, FRAME_H - 120 * k);
  }

  ctx.font = `500 ${20 * k}px ${stampFonts.ui}, sans-serif`;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4 * k;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'left';
  ctx.fillText('memoify.live', 32 * k, FRAME_H - 84 * k);
  ctx.shadowBlur = 0;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('JPEG encode failed')),
      'image/jpeg',
      quality
    );
  });
}

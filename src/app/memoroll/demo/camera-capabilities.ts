/**
 * Lighting capabilities for the MemoRoll camera (hbd-sk4).
 *
 * Two distinct hardware controls, never conflated and never faked:
 *  - Flash: a synchronized fill light fired by ImageCapture.takePhoto with
 *    fillLightMode 'flash'. Offered only when getPhotoCapabilities() lists
 *    'flash'.
 *  - Torch: the continuous LED, driven by applyConstraints. Offered only
 *    when the video track reports a controllable torch capability.
 *
 * Both are conceptually separate from the shutter's white-screen feedback
 * animation and from the renderer's highlight bloom. Unsupported controls
 * are hidden, never disabled-but-visible, and Torch is never silently
 * substituted for Flash.
 *
 * Dependencies are injectable so the proof harness can exercise the
 * unsupported / flash-only / torch-only / both / runtime-failure states
 * without hardware.
 */

export interface LightingCapabilities {
  flash: boolean;
  torch: boolean;
}

/** The slice of ImageCapture this module relies on. */
export interface PhotoCapturer {
  takePhoto(settings?: { fillLightMode?: string }): Promise<Blob>;
  getPhotoCapabilities(): Promise<{ fillLightMode?: string[] }>;
}

export type ImageCaptureFactory = (
  track: MediaStreamTrack
) => PhotoCapturer | null;

/** Wraps window.ImageCapture where it exists; null everywhere else. */
export const defaultImageCaptureFactory: ImageCaptureFactory = (track) => {
  const Ctor = (globalThis as { ImageCapture?: new (t: MediaStreamTrack) => PhotoCapturer })
    .ImageCapture;
  if (!Ctor) return null;
  try {
    return new Ctor(track);
  } catch {
    return null;
  }
};

/**
 * A track's torch is controllable when its capabilities report it: Chrome
 * exposes `torch: true`, and some implementations report the settable
 * states as an array - only [true, false] counts as controllable there.
 */
export function torchSupported(track: MediaStreamTrack): boolean {
  const getCaps = track.getCapabilities?.bind(track);
  if (!getCaps) return false;
  try {
    const caps = getCaps() as { torch?: boolean | boolean[] };
    if (caps.torch === true) return true;
    return (
      Array.isArray(caps.torch) &&
      caps.torch.includes(true) &&
      caps.torch.includes(false)
    );
  } catch {
    return false;
  }
}

/**
 * Detect what the granted stream can actually do. Detection failures mean
 * "unsupported", never a thrown error - a camera that cannot answer the
 * question must not offer the control.
 */
export async function detectLightingCapabilities(
  track: MediaStreamTrack,
  factory: ImageCaptureFactory = defaultImageCaptureFactory
): Promise<LightingCapabilities> {
  let flash = false;
  const capturer = factory(track);
  if (capturer) {
    try {
      const photoCaps = await capturer.getPhotoCapabilities();
      flash = Array.isArray(photoCaps.fillLightMode)
        ? photoCaps.fillLightMode.includes('flash')
        : false;
    } catch {
      flash = false;
    }
  }
  return { flash, torch: torchSupported(track) };
}

/**
 * Drive the torch. Throws on failure so the caller can disable the control
 * and tell the guest what happened - a runtime failure downgrades the
 * capability rather than pretending.
 */
export async function setTorch(
  track: MediaStreamTrack,
  on: boolean
): Promise<void> {
  await track.applyConstraints({
    advanced: [{ torch: on } as MediaTrackConstraintSet],
  });
}

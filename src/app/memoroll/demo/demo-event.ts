/**
 * The demo event: what the creator demo hands the guest demo (owner,
 * 2026-11-13).
 *
 * The two demos used to be two separate stories - a creator could name their
 * roll, pick a cover and give everyone twelve shots, scan the QR, and land on
 * somebody else's wedding with ten. The creator demo now saves its answers
 * here when the roll is created, and the guest demo opens on them.
 *
 * Browser storage only, like the rest of the demo: nothing is uploaded, and
 * no image host is touched. A photo the creator picked is a `blob:` URL that
 * dies with the page, so it is redrawn small into a data URL before it is
 * stored; the design's sample photos are local files and are stored as paths.
 */

import type { CoverStyle } from '@/components/memoroll/guest/cover';

const STORAGE_KEY = 'memoroll-demo:event';

/** Longest side a stored cover photo keeps: plenty for a phone-wide Cover. */
const PHOTO_EDGE = 720;
const PHOTO_QUALITY = 0.78;

export interface DemoEvent {
  eventName: string;
  coverStyle: CoverStyle;
  /** Data URLs or local paths, in the Cover's slots; empty slots are null. */
  photos: (string | null)[];
  shotsPerGuest: number;
  /** Epoch ms the roll opens, from the creator's date and time. */
  opensAt: number;
  /** Epoch ms of the Reveal. */
  revealAt: number;
}

/** The creator's date and time fields as one moment, local time. */
export function momentOf(date: string, time: string): number {
  const at = new Date(`${date}T${time || '00:00'}`);
  return at.getTime();
}

/** A picked photo, redrawn small enough to keep in browser storage. */
async function storable(src: string): Promise<string> {
  if (!src.startsWith('blob:')) return src;
  const image = new Image();
  image.src = src;
  await image.decode();
  const scale = Math.min(
    1,
    PHOTO_EDGE / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', PHOTO_QUALITY);
}

/**
 * Keep the creator's roll for the guest demo. Never throws: if the browser
 * refuses the photos (storage full, private mode), the event is kept without
 * the creator's own photos, and if it refuses even that, the guest demo
 * simply opens on the designed wedding.
 */
export async function saveDemoEvent(event: DemoEvent): Promise<void> {
  if (typeof window === 'undefined') return;
  let photos: (string | null)[];
  try {
    photos = await Promise.all(
      event.photos.map((photo) => (photo ? storable(photo) : null))
    );
  } catch {
    photos = event.photos.map((photo) =>
      photo && !photo.startsWith('blob:') ? photo : null
    );
  }
  const write = (value: DemoEvent) =>
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  try {
    write({ ...event, photos });
  } catch {
    try {
      write({
        ...event,
        photos: photos.map((photo) =>
          photo && !photo.startsWith('data:') ? photo : null
        ),
      });
    } catch {
      // Storage refused outright: the guest demo keeps its designed wedding.
    }
  }
}

/** The creator's roll, if the creator demo has made one in this browser. */
export function loadDemoEvent(): DemoEvent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const event = JSON.parse(raw) as Partial<DemoEvent>;
    if (
      typeof event.eventName !== 'string' ||
      !Array.isArray(event.photos) ||
      typeof event.shotsPerGuest !== 'number' ||
      typeof event.opensAt !== 'number' ||
      typeof event.revealAt !== 'number'
    ) {
      return null;
    }
    return {
      eventName: event.eventName,
      coverStyle: event.coverStyle ?? 'collage',
      photos: event.photos,
      shotsPerGuest: event.shotsPerGuest,
      opensAt: event.opensAt,
      revealAt: event.revealAt,
    };
  } catch {
    return null;
  }
}

/** Forget the creator's roll: the guest demo goes back to the design's wedding. */
export function clearDemoEvent(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to forget.
  }
}

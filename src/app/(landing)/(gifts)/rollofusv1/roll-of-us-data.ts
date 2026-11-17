/**
 * Roll of Us (idea #37 in discussion #77): a disposable camera the recipient
 * operates - wind, press, flash, and a photo develops - then the whole roll
 * as a contact sheet with the letter in the envelope.
 *
 * Started as a preview (owner, 2026-11-18) and approved, so it is now a real
 * template: route id `rollofusv1`, made with
 * src/components/forms/new/new-roll-of-us-form.tsx (registered in /create
 * and /dashboard/edit), and opened by recipients at `/rollofusv1/<id>`.
 * /create only offers it once the owner adds its template row (route
 * `rollofusv1`) on the backend, which the frontend does not do.
 * Whatever a saved gift holds reaches the camera only through
 * `normalizeRollOfUsData` below, because the saved JSON is whatever any
 * past version of the form wrote.
 */

export type CameraColor = 'lime' | 'pink' | 'blue' | 'black';

export interface RollFrame {
  imageUrl: string;
  /** The day it was taken, `YYYY-MM-DD`: printed as the orange date stamp. */
  date: string;
  /** Written by hand on the print's border. */
  caption: string;
  alt?: string;
  /** A frame that came out wrong, for a laugh. */
  blooper?: 'blurry' | 'overexposed';
}

export interface RollOfUsData {
  title: string;
  recipientName: string;
  senderName?: string;
  cameraColor: CameraColor;
  frames: RollFrame[];
  letter: string;
  /** Written on the envelope the letter is in. */
  envelopeNote?: string;
  /** Whether it may be shown on /inspiration; set in the form's Add-Ons. */
  isPublic?: boolean;
}

/** The camera's shell and the darker plate on top of it. */
export const CAMERA_COLORS: Record<
  CameraColor,
  { body: string; plate: string; ink: string }
> = {
  lime: { body: '#c9e265', plate: '#1d1f1a', ink: '#1d1f1a' },
  pink: { body: '#ff9db8', plate: '#2a1a20', ink: '#2a1a20' },
  blue: { body: '#8fc4ff', plate: '#14202e', ink: '#14202e' },
  black: { body: '#2b2b2b', plate: '#111111', ink: '#f4efe6' },
};

/** `2025-03-14` -> `'25 03 14`, the way a point-and-shoot stamps it. */
export function dateStamp(date: string): string {
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) return '';
  return `’${year.slice(-2)} ${month} ${day}`;
}

/**
 * A real roll of film. The form adds frames up to the account's plan cap
 * (src/lib/plan-limits.ts), which can rise; this is only the ceiling past
 * which a saved gift is not trusted, set above any plan so a gift made on
 * a bigger plan never loses frames it was saved with.
 */
const MAX_FRAMES = 27;
/** Fewer than this is not a roll worth winding, and the form asks for it. */
const MIN_FRAMES = 3;

const COLORS = Object.keys(CAMERA_COLORS) as CameraColor[];
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `YYYY-MM-DD` that names a real day (no 2025-02-30), else ''. */
function validDate(value: unknown): string {
  if (typeof value !== 'string') return '';
  const match = ISO_DATE.exec(value.trim());
  if (!match) return '';
  const [, y, m, d] = match.map(Number);
  const day = new Date(Date.UTC(y, m - 1, d));
  return day.getUTCFullYear() === y &&
    day.getUTCMonth() === m - 1 &&
    day.getUTCDate() === d
    ? match[0]
    : '';
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * A saved gift's JSON, made safe for the camera, or null when there is no
 * roll to shoot (too few frames with a picture) or nothing in the envelope.
 *
 * Lengths match the form's limits; the caption is clamped hard because the
 * print truncates it to one line. A frame whose date cannot be read keeps
 * its picture and simply prints no stamp - losing someone's photo over a
 * date would be the worse failure.
 */
export function normalizeRollOfUsData(value: unknown): RollOfUsData | null {
  if (!value || typeof value !== 'object') return null;

  const raw = value as Partial<Record<keyof RollOfUsData, unknown>>;
  const frames: RollFrame[] = Array.isArray(raw.frames)
    ? raw.frames
        .filter((frame): frame is Record<string, unknown> =>
          Boolean(
            frame &&
            typeof frame === 'object' &&
            typeof frame.imageUrl === 'string' &&
            frame.imageUrl.trim()
          )
        )
        .slice(0, MAX_FRAMES)
        .map((frame) => ({
          imageUrl: (frame.imageUrl as string).trim(),
          date: validDate(frame.date),
          caption: text(frame.caption, 40),
          alt: text(frame.alt, 160) || undefined,
          blooper:
            frame.blooper === 'blurry' || frame.blooper === 'overexposed'
              ? frame.blooper
              : undefined,
        }))
    : [];

  if (frames.length < MIN_FRAMES) return null;

  const letter = text(raw.letter, 1200);
  if (!letter) return null;

  return {
    title: text(raw.title, 40) || 'Roll of Us',
    recipientName: text(raw.recipientName, 30) || 'Someone special',
    senderName: text(raw.senderName, 30) || undefined,
    cameraColor: COLORS.includes(raw.cameraColor as CameraColor)
      ? (raw.cameraColor as CameraColor)
      : 'lime',
    frames,
    letter,
    envelopeNote: text(raw.envelopeNote, 40) || undefined,
    isPublic: Boolean(raw.isPublic),
  };
}

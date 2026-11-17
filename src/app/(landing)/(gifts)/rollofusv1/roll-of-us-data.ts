/**
 * Roll of Us (idea #37 in discussion #77): a disposable camera the recipient
 * operates - wind, press, flash, and a photo develops - then the whole roll
 * as a contact sheet with the letter in the envelope.
 *
 * PREVIEW STAGE (owner, 2026-11-18): every idea from the discussion is built
 * as a preview first - the finished look on sample content, no form, no
 * registration, nothing wired into the rest of the product. If the owner
 * likes it the pipeline follows; if not, deleting this folder removes it
 * whole. So nothing outside this folder knows it exists.
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

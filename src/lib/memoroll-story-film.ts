/**
 * A guest's prints as an Instagram Story, on a strip of film: the designed
 * template (Figma "Template-Frame", Layouts 1-4, owner 2026-11-14) for one to
 * four photos. It replaces the paper/darkroom/flame drafts in
 * memoroll-story.ts, which stay in the code but are no longer offered.
 *
 * Every photo fills its window and never leaves a gap: the guest can slide
 * and zoom it inside (owner: "maximum semua foto sembunyi di dalam frame"),
 * and `clampFraming` is what keeps that promise - the window always lies
 * inside the picture.
 *
 * Measurements are the Figma frames', at 1080x1920, except where the frames
 * disagree with their own grid: Layout 3's column is centred like Layout
 * 2's, its strips share Layout 2's positions, and rows meant to match are
 * made equal.
 *
 * Everything is drawn on a canvas, nothing is fetched here: the caller hands
 * in pixels it is allowed to read (same-origin, see /api/memoroll/photo).
 */
import {
  ARROW,
  BARCODE_SHORT,
  BARCODE_TALL,
  BARCODE_WIDE,
  ROLL_HORIZONTAL,
  ROLL_VERTICAL,
} from './memoroll-story-film-art';

export const FILM_STORY_WIDTH = 1080;
export const FILM_STORY_HEIGHT = 1920;

const GROUND = '#232323';
const HOLE = '#1D1D1D';
const INK = '#FF3E09';

export type FilmCount = 1 | 2 | 3 | 4;

/** One photo window on the Story. */
export interface FilmSlot {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
}

/** Layouts 1 and 4 carry the strip across the top and foot; 2 and 3 down the
 *  sides. */
const HORIZONTAL: Record<1 | 4, { left: number; right: number }> = {
  1: { left: 86, right: 995 },
  4: { left: 34, right: 1046 },
};

export const FILM_SLOTS: Record<FilmCount, FilmSlot[]> = {
  1: [{ x: 86, y: 151, w: 909, h: 1618, radius: 10 }],
  // Two equal rows between the grid's 56 and 1865, 48 apart.
  2: [
    { x: 158, y: 56, w: 764, h: 880.5, radius: 10 },
    { x: 158, y: 984.5, w: 764, h: 880.5, radius: 10 },
  ],
  3: [
    { x: 158, y: 56, w: 764, h: 496, radius: 10 },
    { x: 158, y: 596, w: 764, h: 729, radius: 10 },
    { x: 158, y: 1369, w: 764, h: 496, radius: 10 },
  ],
  // Two by two, square-cornered, 36 between columns and 34 between rows.
  4: [
    { x: 34, y: 149, w: 488, h: 792, radius: 0 },
    { x: 558, y: 149, w: 488, h: 792, radius: 0 },
    { x: 34, y: 975, w: 488, h: 792, radius: 0 },
    { x: 558, y: 975, w: 488, h: 792, radius: 0 },
  ],
};

/**
 * How a photo sits in its window: `zoom` over the smallest scale that still
 * covers it (1 = just covering), and the point of the photo, as fractions of
 * its width and height, that lies under the window's centre.
 */
export interface Framing {
  zoom: number;
  cx: number;
  cy: number;
}

export const CENTRED: Framing = { zoom: 1, cx: 0.5, cy: 0.5 };
export const MAX_ZOOM = 3;

type Photo = CanvasImageSource & { width: number; height: number };

function coverScale(photo: { width: number; height: number }, slot: FilmSlot) {
  return Math.max(slot.w / photo.width, slot.h / photo.height);
}

/** The framing nearest `framing` that still fills the window edge to edge. */
export function clampFraming(
  photo: { width: number; height: number },
  slot: FilmSlot,
  framing: Framing
): Framing {
  const zoom = Math.min(MAX_ZOOM, Math.max(1, framing.zoom));
  const scale = coverScale(photo, slot) * zoom;
  // Half the window, as a fraction of the photo, on each axis.
  const halfX = slot.w / scale / photo.width / 2;
  const halfY = slot.h / scale / photo.height / 2;
  const clamp = (value: number, half: number) =>
    half >= 0.5 ? 0.5 : Math.min(1 - half, Math.max(half, value));
  return {
    zoom,
    cx: clamp(framing.cx, halfX),
    cy: clamp(framing.cy, halfY),
  };
}

/**
 * Move a framing by a drag of (dx, dy) Story pixels and a pinch of `factor`
 * about (ax, ay), a point in Story pixels - the photo follows the finger.
 */
export function moveFraming(
  photo: { width: number; height: number },
  slot: FilmSlot,
  framing: Framing,
  dx: number,
  dy: number,
  factor = 1,
  ax = slot.x + slot.w / 2,
  ay = slot.y + slot.h / 2
): Framing {
  const before = coverScale(photo, slot) * framing.zoom;
  const zoom = Math.min(MAX_ZOOM, Math.max(1, framing.zoom * factor));
  const after = coverScale(photo, slot) * zoom;
  // The photo point under the anchor stays under it as the scale changes.
  const centreX = slot.x + slot.w / 2;
  const centreY = slot.y + slot.h / 2;
  const anchorX = framing.cx + (ax - centreX) / before / photo.width;
  const anchorY = framing.cy + (ay - centreY) / before / photo.height;
  return clampFraming(photo, slot, {
    zoom,
    cx: anchorX - (ax - centreX + dx) / after / photo.width,
    cy: anchorY - (ay - centreY + dy) / after / photo.height,
  });
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  photo: Photo | undefined,
  slot: FilmSlot,
  framing: Framing
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(slot.x, slot.y, slot.w, slot.h, slot.radius);
  ctx.clip();
  if (!photo) {
    ctx.fillStyle = '#2c2c2c';
    ctx.fill();
    ctx.restore();
    return;
  }
  const f = clampFraming(photo, slot, framing);
  const scale = coverScale(photo, slot) * f.zoom;
  const sw = slot.w / scale;
  const sh = slot.h / scale;
  ctx.drawImage(
    photo,
    f.cx * photo.width - sw / 2,
    f.cy * photo.height - sh / 2,
    sw,
    sh,
    slot.x,
    slot.y,
    slot.w,
    slot.h
  );
  ctx.restore();
}

function fillPath(
  ctx: CanvasRenderingContext2D,
  d: string,
  x: number,
  y: number,
  colour: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = colour;
  ctx.fill(new Path2D(d));
  ctx.restore();
}

/** The plain triangle of the design, 29.44 across and 86.25 long, its apex
 *  at (ax, ay) and pointing `towards`. */
function triangle(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  towards: 'up' | 'down' | 'right'
) {
  const length = 86.25;
  const half = 29.4449 / 2;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  if (towards === 'right') {
    ctx.lineTo(ax - length, ay - half);
    ctx.lineTo(ax - length, ay + half);
  } else {
    const base = towards === 'up' ? ay + length : ay - length;
    ctx.lineTo(ax + half, base);
    ctx.lineTo(ax - half, base);
  }
  ctx.closePath();
  ctx.fillStyle = INK;
  ctx.fill();
}

export interface FilmFonts {
  /** Plus Jakarta Sans, with 200, 300 and 400 loaded. */
  body: string;
}

type Weight = 200 | 300 | 400;

function font(fonts: FilmFonts, weight: Weight, size: number) {
  return `${weight} ${size}px ${fonts.body}`;
}

const NAME_SIZE = 40;
const NAME_FLOOR = 24;

/**
 * The couple's name, bracketed, at 40px or as much smaller as it needs to
 * fit `room` (owner: "font mengecil aja"), down to a floor below which it is
 * cut with an ellipsis rather than become unreadable.
 */
function fitName(
  ctx: CanvasRenderingContext2D,
  fonts: FilmFonts,
  name: string,
  room: number
): string {
  let size = NAME_SIZE;
  let text = `[${name}]`;
  ctx.font = font(fonts, 300, size);
  while (size > NAME_FLOOR && ctx.measureText(text).width > room) {
    size -= 1;
    ctx.font = font(fonts, 300, size);
  }
  if (ctx.measureText(text).width <= room) return text;
  let cut = name;
  while (cut.length > 1) {
    cut = cut.slice(0, -1);
    text = `[${cut.trimEnd()}…]`;
    if (ctx.measureText(text).width <= room) break;
  }
  return text;
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  align: CanvasTextAlign = 'center',
  rotate = false
) {
  ctx.save();
  ctx.translate(x, y);
  if (rotate) ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = INK;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  // Canvas centres the em box; Figma centres a 30px line box, which sits
  // the glyphs lower by about 7.5% of the size (measured against the
  // frames' renders).
  const size = Number(/(\d+(?:\.\d+)?)px/.exec(ctx.font)?.[1] ?? 40);
  ctx.fillText(value, 0, size * 0.075);
  ctx.restore();
}

/** Layouts 1 and 4: a strip across the top with name and date, and one
 *  across the foot with the handle. */
function drawHorizontalStrips(
  ctx: CanvasRenderingContext2D,
  fonts: FilmFonts,
  count: 1 | 4,
  name: string,
  date: string
) {
  const { left, right } = HORIZONTAL[count];
  fillPath(ctx, ROLL_HORIZONTAL.d, -22, 47, HOLE);
  fillPath(ctx, ROLL_HORIZONTAL.d, -22, 1796, HOLE);

  fillPath(ctx, BARCODE_WIDE.d, left, 81, INK);
  ctx.font = font(fonts, 200, 40);
  const dateWidth = ctx.measureText(date).width;
  text(ctx, date, right, 96, 'right');
  const nameLeft = left + 173;
  const shown = fitName(ctx, fonts, name, right - dateWidth - 40 - nameLeft);
  text(ctx, shown, nameLeft, 96, 'left');

  fillPath(ctx, BARCODE_SHORT.d, left, 1798, INK);
  ctx.font = font(fonts, 400, 40);
  text(ctx, '[@memoify.live]', FILM_STORY_WIDTH / 2 - 2, 1818);
  triangle(ctx, right, 1820, 'right');
}

/** Layouts 2 and 3: a strip down each side. */
function drawVerticalStrips(
  ctx: CanvasRenderingContext2D,
  fonts: FilmFonts,
  name: string,
  date: string
) {
  // The left strip: frame speed, name, mark, date.
  const lx = 41;
  const ly = -2;
  fillPath(ctx, ROLL_VERTICAL.d, lx, ly, HOLE);
  ctx.font = font(fonts, 200, 40);
  text(ctx, '400', lx + 34, ly + 93, 'center', true);
  // The name reads upward from its start and ends where the design ends it,
  // so a longer name grows down into the room the barcode left (owner,
  // 2026-11-14), stopping short of the triangle.
  const nameEnd = ly + 324;
  const shown = fitName(ctx, fonts, name, ly + 799 - nameEnd);
  text(ctx, shown, lx + 34, nameEnd, 'right', true);
  triangle(ctx, lx + 39, ly + 829, 'up');
  ctx.font = font(fonts, 400, 40);
  text(ctx, 'MEMOROLL', lx + 38, ly + 1051, 'center', true);
  fillPath(ctx, BARCODE_TALL.d, lx + 19, ly + 1298, INK);
  ctx.font = font(fonts, 200, 40);
  text(ctx, date, lx + 34, ly + 1610.5, 'center', true);
  triangle(ctx, lx + 36, ly + 1841, 'down');

  // The right strip: arrow, frame number, barcode, handle.
  const rx = 962;
  const ry = -2;
  fillPath(ctx, ROLL_VERTICAL.d, rx, ry, HOLE);
  ctx.save();
  ctx.translate(rx + 47, ry + 129);
  ctx.rotate(-Math.PI / 2);
  ctx.translate(0, -ARROW.height / 2);
  ctx.fillStyle = INK;
  ctx.fill(new Path2D(ARROW.d));
  ctx.restore();
  ctx.font = font(fonts, 400, 50);
  text(ctx, '6', rx + 50, ry + 575);
  fillPath(ctx, BARCODE_TALL.d, rx + 27, ry + 819, INK);
  ctx.font = font(fonts, 200, 40);
  text(ctx, '[@memoify.live]', rx + 42, ry + 1333, 'center', true);
  triangle(ctx, rx + 41, ry + 1619, 'down');
  ctx.fillStyle = INK;
  ctx.fillRect(rx + 19, ry + 1821, 38, 46);
}

/** The event day as the strip prints it: 11.04.2026. */
export function filmDate(day: Date): string {
  const two = (value: number) => String(value).padStart(2, '0');
  return `${two(day.getDate())}.${two(day.getMonth() + 1)}.${day.getFullYear()}`;
}

export interface FilmStoryInput {
  /** One to four prints, in the order of the windows. */
  photos: Photo[];
  /** One framing per photo; a missing one is centred. */
  framings: Framing[];
  /** The couple's name, unbracketed. */
  eventName: string;
  /** The event day. */
  date: Date;
  fonts: FilmFonts;
}

export function filmCountFor(photos: number): FilmCount {
  return Math.max(1, Math.min(4, photos)) as FilmCount;
}

/** Draw the Story onto a 1080x1920 canvas. Synchronous, so a preview can
 *  redraw it on every move of a finger. */
export function drawFilmStory(
  ctx: CanvasRenderingContext2D,
  input: FilmStoryInput
) {
  const count = filmCountFor(input.photos.length);
  ctx.save();
  ctx.fillStyle = GROUND;
  ctx.fillRect(0, 0, FILM_STORY_WIDTH, FILM_STORY_HEIGHT);
  FILM_SLOTS[count].forEach((slot, index) =>
    drawPhoto(
      ctx,
      input.photos[index],
      slot,
      input.framings[index] ?? CENTRED
    )
  );
  const name = input.eventName.trim() || 'MemoRoll';
  const date = filmDate(input.date);
  if (count === 1 || count === 4)
    drawHorizontalStrips(ctx, input.fonts, count, name, date);
  else drawVerticalStrips(ctx, input.fonts, name, date);
  ctx.restore();
}

/** Which window, if any, lies under (x, y) in Story pixels. */
export function slotAt(count: FilmCount, x: number, y: number): number {
  return FILM_SLOTS[count].findIndex(
    (slot) =>
      x >= slot.x && x <= slot.x + slot.w && y >= slot.y && y <= slot.y + slot.h
  );
}

/**
 * A MemoRoll print as an Instagram Story: one 1080x1920 PNG a guest shares
 * from the photo preview, the way Spotify hands a song to Stories.
 *
 * DRAFT (2026-11-12). There is no designed template yet; this is drawn from
 * the MemoRoll design's own vocabulary so the owner has something real to
 * react to: the paper/ink/flame palette (ui/tokens.ts), the MEMO·R·LL
 * wordmark's own outlines (ui/wordmark.tsx), the event name in the Cover's
 * script, labels in the mono, and the print as a print - white border,
 * slight tilt, soft shadow - the way the gallery lays them on the table.
 * Three themes so the direction can be chosen before anything is polished.
 *
 * Everything is drawn on a canvas, nothing is fetched here: the caller hands
 * in pixels it is allowed to read (same-origin, see /api/memoroll/photo).
 */
import {
  WORDMARK_PATHS,
  WORDMARK_VIEWBOX,
} from '@/components/memoroll/ui/wordmark';

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;

export type StoryTheme = 'paper' | 'darkroom' | 'flame';

export const STORY_THEMES: { id: StoryTheme; label: string }[] = [
  { id: 'paper', label: 'Paper' },
  { id: 'darkroom', label: 'Darkroom' },
  { id: 'flame', label: 'Flame' },
];

interface Palette {
  ground: string;
  /** A soft light pooled behind the print, or null for a flat ground. */
  glow: string | null;
  ink: string;
  muted: string;
  /** The wordmark's letters, and its lens. */
  mark: string;
  lens: string;
}

// Values from src/components/memoroll/ui/tokens.ts.
const PALETTES: Record<StoryTheme, Palette> = {
  paper: {
    ground: '#f7f5f3',
    glow: 'rgba(255, 172, 150, 0.35)',
    ink: '#232323',
    muted: '#808080',
    mark: '#232323',
    lens: '#ff3e09',
  },
  darkroom: {
    ground: '#1b1b1b',
    glow: 'rgba(196, 42, 0, 0.55)',
    ink: '#e0dabf',
    muted: '#ae9ea6',
    mark: '#e0dabf',
    lens: '#ff3e09',
  },
  flame: {
    ground: '#ff3e09',
    glow: 'rgba(255, 255, 255, 0.18)',
    ink: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.75)',
    mark: '#ffffff',
    lens: '#232323',
  },
};

export interface StoryFonts {
  /** Plus Jakarta Sans - the body family. */
  body: string;
  /** Oooh Baby - the event name's script. */
  script: string;
  /** Sometype Mono - labels. */
  mono: string;
}

export interface StoryInput {
  /** The print's pixels, readable by this origin. */
  photo: CanvasImageSource & { width: number; height: number };
  eventName: string;
  /** Who took it, as the gallery signs it; '' to leave the line off. */
  shooter: string;
  theme: StoryTheme;
  fonts: StoryFonts;
}

function drawWordmark(
  ctx: CanvasRenderingContext2D,
  centreX: number,
  top: number,
  width: number,
  palette: Palette
) {
  const scale = width / WORDMARK_VIEWBOX.width;
  ctx.save();
  ctx.translate(centreX - width / 2, top);
  ctx.scale(scale, scale);
  WORDMARK_PATHS.forEach((path) => {
    ctx.fillStyle = path.accent ? palette.lens : palette.mark;
    ctx.fill(new Path2D(path.d));
  });
  ctx.restore();
}

/** Shrink a line's font until it fits `maxWidth`, never below `floor`. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  start: number,
  floor: number,
  maxWidth: number
): number {
  let size = start;
  ctx.font = `${size}px ${family}`;
  while (size > floor && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    ctx.font = `${size}px ${family}`;
  }
  return size;
}

/** Where one print lies on the Story: centre, photo width, tilt. */
interface Placement {
  cx: number;
  cy: number;
  /** The photo window's width; its height is the print's own 3:4. */
  photoW: number;
  /** Degrees, clockwise. */
  rotate: number;
}

type Photo = StoryInput['photo'];

/**
 * A print on the table: white border, deeper at the foot, tilted, with a
 * soft shadow - the gallery's prints, at Story size. Returns the lowest
 * point it reaches, for laying the type out below.
 */
function drawPrint(
  ctx: CanvasRenderingContext2D,
  photo: Photo,
  at: Placement,
  caption?: { text: string; family: string }
): number {
  const photoW = at.photoW;
  const photoH = (photoW * 4) / 3;
  const border = Math.round(photoW * 0.039);
  const foot = Math.round(photoW * 0.167);
  const frameW = photoW + border * 2;
  const frameH = photoH + border + foot;

  ctx.save();
  ctx.translate(at.cx, at.cy);
  ctx.rotate((at.rotate * Math.PI) / 180);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = Math.round(photoW * 0.083);
  ctx.shadowOffsetY = Math.round(photoW * 0.033);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-frameW / 2, -frameH / 2, frameW, frameH);
  ctx.shadowColor = 'transparent';

  // Cover-crop the photo into the window, the way the gallery shows it.
  const scale = Math.max(photoW / photo.width, photoH / photo.height);
  const sw = photoW / scale;
  const sh = photoH / scale;
  ctx.drawImage(
    photo,
    (photo.width - sw) / 2,
    (photo.height - sh) / 2,
    sw,
    sh,
    -photoW / 2,
    -frameH / 2 + border,
    photoW,
    photoH
  );

  if (caption?.text) {
    ctx.fillStyle = '#232323';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    fitFont(
      ctx,
      caption.text,
      caption.family,
      Math.round(foot * 0.47),
      Math.round(foot * 0.27),
      photoW - 40
    );
    ctx.fillText(caption.text, 0, frameH / 2 - foot / 2);
  }
  ctx.restore();

  // The rotated frame's lowest corner, near enough: half its diagonal span.
  const r = Math.abs((at.rotate * Math.PI) / 180);
  return (
    at.cy + (frameH / 2) * Math.cos(r) + (frameW / 2) * Math.sin(r)
  );
}

/** One print, large: the single-photo Story. */
const SINGLE: Placement = { cx: 540, cy: 330 + (720 * 4) / 3 / 2 + 74, photoW: 720, rotate: -2.5 };

/**
 * A guest's own Roll as a Story: two to four of their prints, laid the way
 * prints land on a table (owner, 2026-11-12: "variasi 2-4 foto, foto user
 * sendiri"). Drawn in order; the last lies on top.
 */
export const ROLL_LAYOUTS: Record<2 | 3 | 4, Placement[]> = {
  // Two, overlapping on the diagonal, the second dropped over the first.
  2: [
    { cx: 400, cy: 790, photoW: 480, rotate: -6 },
    { cx: 690, cy: 1130, photoW: 480, rotate: 5 },
  ],
  // Three, fanned like a hand of cards, the middle one held up front.
  3: [
    { cx: 320, cy: 960, photoW: 420, rotate: -9 },
    { cx: 760, cy: 960, photoW: 420, rotate: 9 },
    { cx: 540, cy: 910, photoW: 420, rotate: -1 },
  ],
  // Four, a scrapbook page: two by two, each a little off true.
  4: [
    { cx: 300, cy: 690, photoW: 360, rotate: -4 },
    { cx: 780, cy: 670, photoW: 360, rotate: 3 },
    { cx: 290, cy: 1230, photoW: 360, rotate: 2 },
    { cx: 790, cy: 1250, photoW: 360, rotate: -3 },
  ],
};

/** The ground: flat colour, a soft pool of light behind the prints. */
function drawGround(ctx: CanvasRenderingContext2D, palette: Palette) {
  ctx.fillStyle = palette.ground;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
  if (palette.glow) {
    const glow = ctx.createRadialGradient(
      STORY_WIDTH / 2,
      860,
      60,
      STORY_WIDTH / 2,
      860,
      1000
    );
    glow.addColorStop(0, palette.glow);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
  }
  // Instagram lays its own chrome over the top ~250px; the mark sits below it.
  drawWordmark(ctx, STORY_WIDTH / 2, 190, 420, palette);
}

/** The event's name in the script, a mono line under it. */
function drawType(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  fonts: StoryFonts,
  eventName: string,
  line: string,
  top: number
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = palette.ink;
  const name = eventName.trim() || 'MemoRoll';
  const nameSize = fitFont(ctx, name, fonts.script, 120, 56, 900);
  ctx.fillText(name, STORY_WIDTH / 2, top + 20);

  ctx.fillStyle = palette.muted;
  ctx.font = `30px ${fonts.mono}`;
  fitFont(ctx, line, fonts.mono, 30, 22, 940);
  ctx.fillText(line, STORY_WIDTH / 2, top + 40 + nameSize * 1.3);
}

function toPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('no blob'))),
      'image/png'
    )
  );
}

function storyCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  return [canvas, ctx];
}

/** Draw the single-print Story and hand it back as a PNG. */
export async function renderStory(input: StoryInput): Promise<Blob> {
  const palette = PALETTES[input.theme];
  const [canvas, ctx] = storyCanvas();
  drawGround(ctx, palette);
  const bottom = drawPrint(
    ctx,
    input.photo,
    SINGLE,
    input.shooter
      ? { text: `shot by ${input.shooter}`, family: input.fonts.script }
      : undefined
  );
  drawType(
    ctx,
    palette,
    input.fonts,
    input.eventName,
    'SHOT ON MEMOROLL · MEMOIFY.LIVE',
    bottom + 20
  );
  return toPng(canvas);
}

export interface RollStoryInput {
  /** Two to four of the guest's own prints, in the order to lay them. */
  photos: Photo[];
  eventName: string;
  /** The guest's own name, for "GALIH'S ROLL"; '' for "MY ROLL". */
  shooter: string;
  theme: StoryTheme;
  fonts: StoryFonts;
}

/** Draw the guest's Roll as one Story and hand it back as a PNG. */
export async function renderRollStory(input: RollStoryInput): Promise<Blob> {
  const count = Math.max(2, Math.min(4, input.photos.length)) as 2 | 3 | 4;
  const layout = ROLL_LAYOUTS[count];
  const palette = PALETTES[input.theme];
  const [canvas, ctx] = storyCanvas();
  drawGround(ctx, palette);
  let bottom = 0;
  layout.forEach((at, index) => {
    bottom = Math.max(bottom, drawPrint(ctx, input.photos[index], at));
  });
  const owner = input.shooter.trim()
    ? `${input.shooter.trim().toUpperCase()}'S ROLL`
    : 'MY ROLL';
  drawType(
    ctx,
    palette,
    input.fonts,
    input.eventName,
    `${owner} · MEMOIFY.LIVE`,
    bottom + 10
  );
  return toPng(canvas);
}

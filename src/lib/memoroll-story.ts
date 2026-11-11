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

/** The print on the table: white border, deeper at the foot, tilted. */
function drawPrint(ctx: CanvasRenderingContext2D, input: StoryInput) {
  const photoW = 720;
  const photoH = 960; // the print's own 3:4
  const border = 28;
  const foot = 120;
  const frameW = photoW + border * 2;
  const frameH = photoH + border + foot;
  const centreX = STORY_WIDTH / 2;
  const centreY = 330 + frameH / 2;

  ctx.save();
  ctx.translate(centreX, centreY);
  ctx.rotate((-2.5 * Math.PI) / 180);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-frameW / 2, -frameH / 2, frameW, frameH);
  ctx.shadowColor = 'transparent';

  // Cover-crop the photo into the window, the way the gallery shows it.
  const { photo } = input;
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

  if (input.shooter) {
    ctx.fillStyle = '#232323';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const line = `shot by ${input.shooter}`;
    fitFont(ctx, line, input.fonts.script, 56, 32, photoW - 40);
    ctx.fillText(line, 0, frameH / 2 - foot / 2);
  }
  ctx.restore();

  return { bottom: centreY + frameH / 2 + 40 };
}

/** Draw the Story and hand it back as a PNG. */
export async function renderStory(input: StoryInput): Promise<Blob> {
  const palette = PALETTES[input.theme];
  const canvas = document.createElement('canvas');
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

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

  const { bottom } = drawPrint(ctx, input);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = palette.ink;
  const name = input.eventName.trim() || 'MemoRoll';
  const nameSize = fitFont(ctx, name, input.fonts.script, 120, 56, 900);
  ctx.fillText(name, STORY_WIDTH / 2, bottom + 20);

  ctx.fillStyle = palette.muted;
  ctx.font = `30px ${input.fonts.mono}`;
  ctx.fillText(
    'SHOT ON MEMOROLL · MEMOIFY.LIVE',
    STORY_WIDTH / 2,
    bottom + 40 + nameSize * 1.3
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('no blob'))),
      'image/png'
    )
  );
}

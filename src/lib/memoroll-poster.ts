import cameraDoodle from '@/assets/memoroll/cover-camera-doodle.png';
import hearts from '@/assets/memoroll/cover-hearts.png';
import tape from '@/assets/memoroll/cover-tape.png';
import memoifyMark from '@/assets/memoroll/memoify-mark.png';
import wordmark from '@/assets/memoroll/wordmark.svg';
import { body, mono, script } from '@/components/memoroll/ui/fonts';

/**
 * The poster a creator prints for the tables: the roll's QR, with the three
 * things a guest has to do and the one thing they have to wait for.
 *
 * The plain QR was all a creator got, which left them to lay out a sign
 * themselves; a sign that never gets made is a roll nobody joins (owner,
 * 2026-11-23). This is that sign, ready to print: an A4 portrait at 300dpi,
 * which prints smaller for a table card from the same file.
 *
 * It is drawn on a canvas rather than rendered from markup because it has to
 * leave as one image file, at a size no screen shows. The layout is written
 * in the units of a 1240-wide page and drawn at twice that.
 *
 * What changes from roll to roll: the event's name, the QR and its address,
 * how many shots a guest gets, and when the roll develops. The wording is the
 * owner's, and it is in Indonesian whatever the creator's own language,
 * because it is read by the guests of an Indonesian wedding, not by the
 * creator.
 */

const PAGE = { width: 1240, height: 1754 };
/** A4 at 300dpi is 2480x3508: twice the layout's units. */
const SCALE = 2;

const INK = '#1b1714';
const PAPER = '#F7F5F3';
const MUTED = '#5d5650';
const SOFT = '#3a342f';
const FLAME = '#FF3D0A';
const STAMP = '#f17e03';
const HAIRLINE = '#e6e1da';

const COLUMN = { left: 110, width: 1020 };
const CENTRE = PAGE.width / 2;

export interface MemoRollPoster {
  eventName: string;
  /** The roll's address, which the QR already encodes. */
  url: string;
  /** How many shots each guest gets. */
  shots: number;
  /** When the roll develops, as an ISO date. */
  revealAt: string;
  /**
   * The QR, already drawn with its own quiet margin (qrcode.react's canvas).
   * Made by the caller, because the caller already makes one to download.
   */
  qr: HTMLCanvasElement;
}

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`poster: could not load ${src}`));
    image.src = src;
  });
}

/**
 * The Reveal the way a film camera stamps a date: "24 05 ’26 · 20.00 WIB".
 *
 * Read in Jakarta's clock whatever the browser's, because that is the clock
 * the product keeps: an event's hours are entered and stored as WIB (see
 * momentIso in the create flow), so a creator downloading their poster from
 * another zone still gets the hour they typed.
 */
export function revealStamp(revealAt: string) {
  const date = new Date(revealAt);
  if (Number.isNaN(date.getTime())) return null;
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );
  return `${parts.day} ${parts.month} ’${parts.year} · ${parts.hour}.${parts.minute} WIB`;
}

/** "https://www.memoify.live/memoroll/abc" as a guest would type it. */
function typed(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

type Run = { text: string; font: string; colour: string };

/** One line made of differently set runs, centred on `x`. */
function centredRuns(
  ctx: CanvasRenderingContext2D,
  runs: Run[],
  x: number,
  baseline: number
) {
  const widths = runs.map((run) => {
    ctx.font = run.font;
    return ctx.measureText(run.text).width;
  });
  let at = x - widths.reduce((a, b) => a + b, 0) / 2;
  ctx.textAlign = 'left';
  runs.forEach((run, i) => {
    ctx.font = run.font;
    ctx.fillStyle = run.colour;
    ctx.fillText(run.text, at, baseline);
    at += widths[i];
  });
  ctx.textAlign = 'center';
}

/** Break `text` into lines no wider than `width`, in the current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** The white the QR's print keeps around the code. */
const CARD_PAD = 34;

/**
 * Where the code itself is inside a QR canvas that has a quiet margin: the
 * square from its first dark pixel to its last.
 */
function inked(qr: HTMLCanvasElement) {
  const whole = { x: 0, y: 0, size: qr.width };
  const context = qr.getContext('2d');
  if (!context) return whole;
  let pixels: Uint8ClampedArray;
  try {
    pixels = context.getImageData(0, 0, qr.width, qr.height).data;
  } catch {
    return whole;
  }
  const dark = (x: number, y: number) => pixels[(y * qr.width + x) * 4] < 128;
  // A code's top-left corner is always dark (a finder pattern), so the
  // first dark pixel down the diagonal is that corner.
  let first = -1;
  for (let i = 0; i < qr.width && i < qr.height; i++) {
    if (dark(i, i)) {
      first = i;
      break;
    }
  }
  if (first < 0) return whole;
  // The top-right corner is a finder pattern too: walk in from the right
  // along the same row.
  let last = qr.width - 1;
  while (last > first && !dark(last, first)) last--;
  return { x: first, y: first, size: last - first + 1 };
}

/** The three steps' glyphs, drawn in a 48-unit box. */
const GLYPHS = [
  // A code in a viewfinder's corners.
  'M6 15V9a3 3 0 0 1 3-3h6M33 6h6a3 3 0 0 1 3 3v6M42 33v6a3 3 0 0 1-3 3h-6M15 42H9a3 3 0 0 1-3-3v-6M16 15h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1zM27 15h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1zM16 26h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1zM27 27h2M32 27v6M27 32h2',
  // A name card.
  'M12 11h24a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V16a5 5 0 0 1 5-5zM22 21a4 4 0 1 1-8 0a4 4 0 0 1 8 0zM11 32c1.2-3.6 3.8-5 7-5s5.8 1.4 7 5M30 20h6M30 27h6',
  // A camera.
  'M17 12l2.5-4h9L31 12h7a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4zM31.5 25a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0zM36 18h.01',
];

/**
 * Draw the poster and hand it back as a PNG.
 *
 * Everything is measured first and drawn second: the name may take one line
 * or two, and whatever it takes comes out of the QR's size, so the page is
 * always full and never spills.
 */
export async function drawMemoRollPoster(poster: MemoRollPoster) {
  const SCRIPT = script.style.fontFamily;
  const BODY = body.style.fontFamily;
  const MONO = mono.style.fontFamily;

  const stamp = revealStamp(poster.revealAt);
  const address = typed(poster.url);

  // A canvas only draws a face the page has already fetched, and none of
  // these may have been used on the screen the button is on.
  await Promise.all([
    document.fonts.load(`400 106px ${SCRIPT}`, poster.eventName),
    document.fonts.load(`400 33px ${BODY}`, 'Hari ini'),
    document.fonts.load(`600 25px ${BODY}`, 'Scan'),
    document.fonts.load(`700 28px ${BODY}`, 'Scan'),
    document.fonts.load(`400 23px ${MONO}`, `${address}${stamp ?? ''}`),
  ]).catch(() => undefined);

  const [wordmarkArt, tapeArt, heartsArt, cameraArt, markArt] =
    await Promise.all([
      load(wordmark.src),
      load(tape.src),
      load(hearts.src),
      load(cameraDoodle.src),
      load(memoifyMark.src),
    ]);

  const canvas = document.createElement('canvas');
  canvas.width = PAGE.width * SCALE;
  canvas.height = PAGE.height * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';

  // --- measure ----------------------------------------------------------
  // The name: as large as fits in two lines, never smaller than readable.
  let nameSize = 106;
  let nameLines: string[] = [];
  for (; nameSize >= 60; nameSize -= 4) {
    ctx.font = `400 ${nameSize}px ${SCRIPT}`;
    nameLines = wrap(ctx, poster.eventName, 1040);
    if (nameLines.length <= 2) break;
  }
  nameLines = nameLines.slice(0, 2);
  const nameLine = nameSize * 1.08;

  const WORDMARK_W = 300;
  const wordmarkH =
    (WORDMARK_W * wordmarkArt.naturalHeight) / wordmarkArt.naturalWidth;
  const STEP_H = 214;
  const DATE_H = stamp ? 132 : 0;

  // Everything but the QR, top to bottom, gaps included.
  const fixed =
    72 +
    wordmarkH +
    36 +
    nameLines.length * nameLine +
    14 +
    33 +
    64 + // to the QR card
    (CARD_PAD + 20 + 23 + 24) + // the card's own padding and its address line
    52 +
    52 + // the pill
    42 +
    STEP_H +
    (stamp ? 26 + DATE_H : 0) +
    20 +
    60 + // the two closing lines
    22 +
    34 + // the footer
    44;
  const qrSize = Math.max(400, Math.min(610, PAGE.height - fixed));

  // --- draw -------------------------------------------------------------
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, PAGE.width, PAGE.height);

  // The Cover's own stickers, half off the page as they are half off the
  // screen, so the sign and the page it opens are plainly one thing.
  const heartsW = 380;
  ctx.drawImage(
    heartsArt,
    -170,
    560,
    heartsW,
    (heartsW * heartsArt.naturalHeight) / heartsArt.naturalWidth
  );
  ctx.save();
  const cameraW = 280;
  const cameraH = (cameraW * cameraArt.naturalHeight) / cameraArt.naturalWidth;
  ctx.translate(PAGE.width + 128 - cameraW / 2, 300 + cameraH / 2);
  ctx.rotate((8 * Math.PI) / 180);
  ctx.drawImage(cameraArt, -cameraW / 2, -cameraH / 2, cameraW, cameraH);
  ctx.restore();

  let y = 72;
  ctx.drawImage(wordmarkArt, CENTRE - WORDMARK_W / 2, y, WORDMARK_W, wordmarkH);
  y += wordmarkH + 36;

  ctx.fillStyle = INK;
  ctx.font = `400 ${nameSize}px ${SCRIPT}`;
  for (const line of nameLines) {
    ctx.fillText(line, CENTRE, y + nameSize * 0.86);
    y += nameLine;
  }

  y += 14;
  ctx.font = `400 33px ${BODY}`;
  ctx.fillText('Hari ini kamu juga fotografernya.', CENTRE, y + 27);
  y += 33 + 64;

  // The QR, on a print of its own, taped up by two corners.
  const cardW = qrSize + CARD_PAD * 2;
  const cardH = CARD_PAD + qrSize + 20 + 23 + 24;
  const cardX = CENTRE - cardW / 2;
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cardX, y, cardW, cardH);
  ctx.restore();
  // The caller's code carries its own quiet margin, for standing alone on
  // a white page. On this print the print is the margin, so only the code
  // itself is drawn, and the card's padding does the rest.
  const code = inked(poster.qr);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    poster.qr,
    code.x,
    code.y,
    code.size,
    code.size,
    cardX + CARD_PAD,
    y + CARD_PAD,
    qrSize,
    qrSize
  );
  ctx.imageSmoothingEnabled = true;
  ctx.fillStyle = SOFT;
  ctx.font = `400 23px ${MONO}`;
  // An address too long for the print is set smaller, not cut.
  const addressWidth = ctx.measureText(address).width;
  if (addressWidth > qrSize) {
    ctx.font = `400 ${Math.floor((23 * qrSize) / addressWidth)}px ${MONO}`;
  }
  ctx.fillText(address, CENTRE, y + CARD_PAD + qrSize + 20 + 18);

  const tapeW = 170;
  const tapeH = (tapeW * tapeArt.naturalHeight) / tapeArt.naturalWidth;
  for (const [tx, ty] of [
    [cardX, y],
    [cardX + cardW, y + cardH],
  ]) {
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate((-11.5 * Math.PI) / 180);
    ctx.drawImage(tapeArt, -tapeW / 2, -tapeH / 2, tapeW, tapeH);
    ctx.restore();
  }
  y += cardH + 52;

  // The pill.
  ctx.font = `600 25px ${BODY}`;
  const pill = 'Scan pakai kamera HP, nggak perlu install aplikasi';
  const pillW = ctx.measureText(pill).width + 64;
  ctx.fillStyle = FLAME;
  roundRect(ctx, CENTRE - pillW / 2, y, pillW, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(pill, CENTRE, y + 35);
  y += 52 + 42;

  // The three steps.
  const steps: { title: string; lines: Run[][] }[] = [
    {
      title: 'Scan QR',
      lines: [
        [{ text: 'Pakai kamera', font: `400 20.5px ${BODY}`, colour: MUTED }],
        [{ text: 'HP kamu', font: `400 20.5px ${BODY}`, colour: MUTED }],
      ],
    },
    {
      title: 'Tulis nama',
      lines: [
        [
          {
            text: 'Supaya ketahuan',
            font: `400 20.5px ${BODY}`,
            colour: MUTED,
          },
        ],
        [
          {
            text: 'ini foto dari siapa',
            font: `400 20.5px ${BODY}`,
            colour: MUTED,
          },
        ],
      ],
    },
    {
      title: 'Jepret',
      lines: [
        [
          { text: 'Jatahmu ', font: `400 20.5px ${BODY}`, colour: MUTED },
          {
            text: `${poster.shots} foto`,
            font: `700 20.5px ${BODY}`,
            colour: INK,
          },
          { text: '.', font: `400 20.5px ${BODY}`, colour: MUTED },
        ],
        [
          {
            text: 'Pakai baik-baik!',
            font: `400 20.5px ${BODY}`,
            colour: MUTED,
          },
        ],
      ],
    },
  ];
  const gap = 26;
  const stepW = (COLUMN.width - gap * 2) / 3;
  steps.forEach((step, i) => {
    const x = COLUMN.left + i * (stepW + gap);
    const middle = x + stepW / 2;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = HAIRLINE;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, stepW, STEP_H, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(middle, y, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PAPER;
    ctx.font = `700 24px ${BODY}`;
    ctx.fillText(String(i + 1), middle, y + 8.5);

    ctx.save();
    ctx.translate(middle - 30, y + 30);
    ctx.scale(60 / 48, 60 / 48);
    ctx.strokeStyle = FLAME;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D(GLYPHS[i]));
    ctx.restore();

    ctx.fillStyle = INK;
    ctx.font = `700 28px ${BODY}`;
    ctx.fillText(step.title, middle, y + 126);
    step.lines.forEach((runs, line) =>
      centredRuns(ctx, runs, middle, y + 160 + line * 27.7)
    );
  });
  y += STEP_H;

  // When the roll develops, stamped the way the camera stamps a Shot.
  if (stamp) {
    y += 26;
    ctx.strokeStyle = '#cfc8bf';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 7]);
    for (const lineY of [y, y + DATE_H]) {
      ctx.beginPath();
      ctx.moveTo(COLUMN.left, lineY);
      ctx.lineTo(COLUMN.left + COLUMN.width, lineY);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = MUTED;
    ctx.font = `400 24px ${BODY}`;
    ctx.fillText('Fotonya akan terbuka pada', CENTRE, y + 46);
    ctx.fillStyle = STAMP;
    ctx.font = `400 46px ${MONO}`;
    ctx.fillText(stamp, CENTRE, y + 100);
    y += DATE_H;
  }

  // The reminder, and the owner's word to the next couple in the room.
  y += 20;
  const small = `400 21px ${BODY}`;
  centredRuns(
    ctx,
    [
      {
        text: 'Jangan lupa cek email kamu ya. Kalo kamu pengen pake MemoRoll juga',
        font: small,
        colour: SOFT,
      },
    ],
    CENTRE,
    y + 22
  );
  centredRuns(
    ctx,
    [
      {
        text: 'di nikahan kamu nanti, cek Instagram ',
        font: small,
        colour: SOFT,
      },
      { text: '@memoify.live', font: `700 21px ${BODY}`, colour: FLAME },
    ],
    CENTRE,
    y + 52
  );

  // The footer sits on the bottom margin whatever came before it.
  const footY = PAGE.height - 44 - 34;
  ctx.font = `400 21px ${MONO}`;
  const credit = 'Created by memoify.live';
  const creditW = ctx.measureText(credit).width;
  const footW = creditW + 14 + 34;
  ctx.fillStyle = SOFT;
  ctx.textAlign = 'left';
  ctx.fillText(credit, CENTRE - footW / 2, footY + 24);
  ctx.drawImage(markArt, CENTRE - footW / 2 + creditW + 14, footY, 34, 34);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('poster: nothing drawn')),
      'image/png'
    )
  );
}

function save(blob: Blob, name: string) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = name;
  anchor.click();
  // Long enough for the save to have started on a slow phone.
  window.setTimeout(() => URL.revokeObjectURL(href), 60_000);
}

function pngOf(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('qr: nothing drawn'))),
      'image/png'
    )
  );
}

/**
 * One press, both files: the bare QR and the poster around it (owner,
 * 2026-11-23 - a creator should not have to know which one they want before
 * they have seen either).
 *
 * Two saves from one press is the thing browsers distrust. A phone drops the
 * second one without a word, so a phone gets its own share sheet holding both
 * pictures instead: "Save 2 Images", or straight to whoever prints them. A
 * desktop saves the two files one after the other, and Chrome asks once
 * whether this site may do that.
 *
 * Says what happened, so the caller's button can: 'shared', 'saved', or
 * 'dismissed' when the guest closed the share sheet themselves.
 */
export async function downloadMemoRollKit(
  poster: MemoRollPoster,
  names: { qr: string; poster: string }
): Promise<'shared' | 'saved' | 'dismissed'> {
  const [qr, sign] = await Promise.all([
    pngOf(poster.qr),
    drawMemoRollPoster(poster),
  ]);

  const files = [
    new File([qr], names.qr, { type: 'image/png' }),
    new File([sign], names.poster, { type: 'image/png' }),
  ];
  const onAPhone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  if (onAPhone && navigator.canShare?.({ files })) {
    try {
      await navigator.share({ files });
      return 'shared';
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') return 'dismissed';
      // The sheet would not open (the press went stale while the poster was
      // being drawn, or the browser has no taste for files): save instead.
    }
  }

  save(qr, names.qr);
  await new Promise((done) => window.setTimeout(done, 500));
  save(sign, names.poster);
  return 'saved';
}

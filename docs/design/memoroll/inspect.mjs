#!/usr/bin/env node
/**
 * Read the frozen MemoRoll design.
 *
 * The design lives in a Figma file called "Randos" reached through a plugin
 * bridge, and the bridge answers only while somebody has that plugin open.
 * Agents work these beads cold, so `design-nodes.json` is a capture of the two
 * selected sections taken on 2026-08-24, and this is how you read it.
 *
 * Do not re-read the bridge to settle a question this file can answer. The file
 * renumbers its nodes between sessions - the previous capture's ids (79:194,
 * 80:590, 103:260) name nothing today - so a live read can disagree with the
 * spec these beads were written against. If the design genuinely moved, that is
 * a design change: re-capture on purpose and say so.
 *
 *   node docs/design/memoroll/inspect.mjs                    list every screen
 *   node docs/design/memoroll/inspect.mjs guest-09-camera-a  one screen's tree
 *   node docs/design/memoroll/inspect.mjs guest-09-camera-a --depth 3
 *   node docs/design/memoroll/inspect.mjs --node 434:7827    any node by id
 *   node docs/design/memoroll/inspect.mjs guest-13-gallery-all-during --copy
 *   node docs/design/memoroll/inspect.mjs --colors           colour census
 *   node docs/design/memoroll/inspect.mjs --fonts            type census
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Every designed screen: the Figma node it came from, the exported frame beside
 * it, and what the screen is. Order is the order a guest, then a creator, meets
 * them. Ids are only valid against `design-nodes.json`, never against the live
 * file.
 */
export const SCREENS = [
  // ---------------------------------------------------------------- guest
  {
    id: 'guest-01-landing-a',
    node: '450:13476',
    side: 'guest',
    what: 'Landing, cover template 1. CTA reads "Get me in".',
  },
  {
    id: 'guest-02-landing-b',
    node: '472:8253',
    side: 'guest',
    what: 'Landing, cover template 2. CTA reads "Let’s Shoot!".',
  },
  {
    id: 'guest-03-landing-c',
    node: '472:8311',
    side: 'guest',
    what: 'Landing, cover template 3.',
  },
  {
    id: 'guest-04-countdown',
    node: '434:7640',
    side: 'guest',
    what: 'Before the roll opens: "Come back when the function begins." with a days/hours/minutes/seconds countdown.',
  },
  {
    id: 'guest-05-username',
    node: '450:13751',
    side: 'guest',
    what: 'Signed in, confirming who you are: "This you?" over an editable handle.',
  },
  {
    id: 'guest-06-username-keyboard',
    node: '450:14629',
    side: 'guest',
    what: 'Same screen with the iOS keyboard up, editing the handle.',
  },
  {
    id: 'guest-07-location-allow',
    node: '434:7429',
    side: 'guest',
    what: '"Made it to the function?" - the permission ask before shooting.',
  },
  {
    id: 'guest-08-location-blocked',
    node: '434:7485',
    side: 'guest',
    what: 'Outside the 500m radius: "Looks like you’re a little too far" + Check Again.',
  },
  {
    id: 'guest-09-camera-a',
    node: '434:7827',
    side: 'guest',
    what: 'The camera. Shots counter, film pills, Flash button, thirds grid, stacked-prints gallery button.',
  },
  {
    id: 'guest-10-camera-b',
    node: '472:8439',
    side: 'guest',
    what: 'The camera, second state (identical copy; compare pixel state in the frame).',
  },
  {
    id: 'guest-11-popup-how-a',
    node: '472:7895',
    side: 'guest',
    what: '"Here’s how Memoroll works" - shown once, on first entry to the camera.',
  },
  {
    id: 'guest-12-popup-how-b',
    node: '472:8787',
    side: 'guest',
    what: 'The same popup, second state.',
  },
  {
    id: 'guest-13-gallery-all-during',
    node: '434:7907',
    side: 'guest',
    what: 'ALL tab while the event runs: every photo LAYER_BLUR 4, "Ends in" counting.',
  },
  {
    id: 'guest-14-gallery-all-after',
    node: '470:6015',
    side: 'guest',
    what: 'ALL tab after the reveal: photos sharp, "Ended on May 4th 2026, 12:00PM".',
  },
  {
    id: 'guest-15-myroll-undeveloped',
    node: '470:6458',
    side: 'guest',
    what: 'My Roll before developing: blurred, no CTA (shots still left).',
  },
  {
    id: 'guest-16-myroll-develop-cta',
    node: '470:7092',
    side: 'guest',
    what: 'My Roll at zero shots: the "Develop My Roll" CTA appears. Event still running.',
  },
  {
    id: 'guest-17-darkroom',
    node: '470:7362',
    side: 'guest',
    what: 'The Dark room: "Developing..." with prints at LAYER_BLUR 10 and 6. Animation approximated, reference pending.',
  },
  {
    id: 'guest-18-myroll-developed',
    node: '470:6601',
    side: 'guest',
    what: 'My Roll developed: sharp, every print stamped 5 3 ‘26 and signed with the shooter’s name.',
  },
  {
    id: 'guest-19-preview-a',
    node: '470:7628',
    side: 'guest',
    what: 'One photo, swipeable, with "Who took this?" revealing the shooter.',
  },
  {
    id: 'guest-20-preview-b',
    node: '472:7952',
    side: 'guest',
    what: 'The preview before the reveal is tapped.',
  },

  // -------------------------------------------------------------- creator
  {
    id: 'creator-01-welcome',
    node: '434:8531',
    side: 'creator',
    what: 'Creator welcome: the wordmark, "Experience the function through everyone’s eyes", Setup My Memoroll.',
  },
  {
    id: 'creator-02-vibe',
    node: '442:11307',
    side: 'creator',
    what: 'Step: Choose your vibe. Wedding / Birthday / Trips, Parties, Gatherings.',
  },
  {
    id: 'creator-03-make-it-yours-collage',
    node: '442:11433',
    side: 'creator',
    what: 'Step: Make it yours, Collage cover style, with the live cover preview.',
  },
  {
    id: 'creator-04-make-it-yours-taped-a',
    node: '450:14016',
    side: 'creator',
    what: 'Step: Make it yours, Taped wall cover style.',
  },
  {
    id: 'creator-05-make-it-yours-taped-b',
    node: '450:14343',
    side: 'creator',
    what: 'Step: Make it yours, Taped wall, second state.',
  },
  {
    id: 'creator-06-name-your-roll',
    node: '442:11372',
    side: 'creator',
    what: 'Step: Name your roll. Event name + the hint about what guests see on scan.',
  },
  {
    id: 'creator-07-time',
    node: '442:11556',
    side: 'creator',
    what: 'Step: Time. When the roll opens - date and time.',
  },
  {
    id: 'creator-08-venue',
    node: '442:11622',
    side: 'creator',
    what: 'Step: Venue & Location, with the 500m "Only at the venue" switch.',
  },
  {
    id: 'creator-09-shots-per-guest',
    node: '442:11697',
    side: 'creator',
    what: 'Step: Shots per guest. "Guests can’t preview their shots until the roll develops."',
  },
  {
    id: 'creator-10-reveal-timing',
    node: '442:11766',
    side: 'creator',
    what: 'Step: Reveal timing. When the roll develops. CTA is "Create Now".',
  },
  {
    id: 'creator-11-ready-to-publish',
    node: '442:11832',
    side: 'creator',
    what: 'Ready to publish: the cover preview with Edit / Preview / Publish.',
  },
  {
    id: 'creator-12-qr-bottomsheet',
    node: '472:9444',
    side: 'creator',
    what: 'Share QR Code bottomsheet, with Share Link.',
  },

  // ------------------------------------------------------------ templates
  {
    id: 'template-1',
    node: '450:12897',
    side: 'template',
    what: 'Cover template 1 (photo collage).',
  },
  {
    id: 'template-2',
    node: '450:12947',
    side: 'template',
    what: 'Cover template 2.',
  },
  {
    id: 'template-3',
    node: '450:12991',
    side: 'template',
    what: 'Cover template 3.',
  },
  {
    id: 'template-4',
    node: '450:13049',
    side: 'template',
    what: 'Cover template 4.',
  },
  {
    id: 'template-5',
    node: '450:13107',
    side: 'template',
    what: 'Cover template 5.',
  },
  {
    id: 'template-6',
    node: '450:13140',
    side: 'template',
    what: 'Cover template 6.',
  },
];

const roots = JSON.parse(readFileSync(join(HERE, 'design-nodes.json'), 'utf8'));

function findNode(node, id) {
  if (!node || typeof node !== 'object') return null;
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const hit = findNode(child, id);
    if (hit) return hit;
  }
  return null;
}

function lookup(id) {
  for (const root of roots) {
    const hit = findNode(root, id);
    if (hit) return hit;
  }
  return null;
}

/* ------------------------------- formatting ------------------------------ */

const round = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);

function paint(fill) {
  if (!fill || typeof fill !== 'object') return null;
  if (fill.type === 'SOLID') {
    const a = fill.opacity ?? 1;
    return a === 1 ? fill.color : `${fill.color}@${round(a)}`;
  }
  return fill.type; // IMAGE, GRADIENT_LINEAR, ...
}

function describeBox(styles) {
  const parts = [];
  const fills = (styles.fills ?? []).map(paint).filter(Boolean);
  if (fills.length) parts.push(`fill ${fills.join(' + ')}`);

  const strokes = (styles.strokes ?? []).map(paint).filter(Boolean);
  if (strokes.length) {
    parts.push(
      `stroke ${strokes.join(' + ')} ${round(styles.strokeWeight)}px ${(styles.strokeAlign ?? '').toLowerCase()}`
    );
  }

  if (styles.cornerRadius) parts.push(`radius ${round(styles.cornerRadius)}`);

  const auto = styles.autoLayout;
  if (auto) {
    const p = styles.padding ?? {};
    const pad = [p.top, p.right, p.bottom, p.left]
      .map((v) => round(v ?? 0))
      .join('/');
    parts.push(
      `auto ${auto.direction === 'HORIZONTAL' ? 'row' : 'col'} gap ${round(auto.gap)} pad ${pad} ` +
        `main ${auto.primaryAxisAlign} cross ${auto.counterAxisAlign} ` +
        `sizing ${auto.primaryAxisSizing}/${auto.counterAxisSizing}` +
        (auto.wrap && auto.wrap !== 'NO_WRAP' ? ` wrap ${auto.wrap}` : '')
    );
  }

  for (const effect of styles.effects ?? []) {
    if (!effect || typeof effect !== 'object') continue;
    if (String(effect.type).includes('BLUR')) {
      parts.push(`${effect.type} ${round(effect.radius)}`);
    } else if (String(effect.type).includes('SHADOW')) {
      const o = effect.offset ?? {};
      parts.push(
        `${effect.type} ${paint(effect) ?? effect.color}@${round(effect.opacity)} ` +
          `${round(o.x)},${round(o.y)} blur ${round(effect.radius)} spread ${round(effect.spread ?? 0)}`
      );
    }
  }

  if (styles.opacity !== undefined && styles.opacity !== 1)
    parts.push(`opacity ${round(styles.opacity)}`);
  if (styles.clipsContent) parts.push('clips');
  if (styles.visible === false) parts.push('HIDDEN');
  return parts;
}

function describeType(styles) {
  const lh = styles.lineHeight;
  const ls = styles.letterSpacing;
  const unit = (v) =>
    v?.unit === 'PERCENT'
      ? `${round(v.value)}%`
      : v?.unit === 'PIXELS'
        ? `${round(v.value)}px`
        : 'auto';
  return (
    `${styles.fontFamily} ${styles.fontStyle} ${round(styles.fontSize)}/${unit(lh)} ` +
    `track ${unit(ls)} w${styles.fontWeight} ` +
    `${(styles.textAlignHorizontal ?? '').toLowerCase()}` +
    (styles.textDecoration && styles.textDecoration !== 'NONE'
      ? ` ${styles.textDecoration}`
      : '')
  );
}

function print(node, depth, maxDepth, out, parent = null, showDead = false) {
  const styles =
    typeof node.styles === 'object' && node.styles ? node.styles : {};
  const b = node.bounds ?? {};
  const pad = '  '.repeat(depth);
  const size = `${round(b.width)}x${round(b.height)}`;
  const at = depth === 0 ? '' : ` @${round(b.x)},${round(b.y)}`;
  const dead =
    parent && offCanvas(node, parent) ? '  ← OFF-CANVAS, not rendered' : '';

  out.push(`${pad}${node.name} [${node.type}] ${size}${at}${dead}`);

  const detail = describeBox(styles);
  if (node.type === 'TEXT') {
    detail.unshift(describeType(styles));
    out.push(`${pad}  ${detail.join(' · ')}`);
    out.push(`${pad}  "${node.characters}"`);
  } else if (detail.length) {
    out.push(`${pad}  ${detail.join(' · ')}`);
  }

  const kids = showDead ? (node.children ?? []) : liveChildren(node);
  const hidden = (node.children ?? []).length - kids.length;
  if (hidden > 0) {
    out.push(
      `${pad}  (${hidden} off-canvas leftover${hidden === 1 ? '' : 's'} hidden, --all to show)`
    );
  }

  if (depth < maxDepth) {
    for (const child of kids)
      print(child, depth + 1, maxDepth, out, node, showDead);
  } else if (kids.length) {
    out.push(`${pad}  … ${kids.length} more, raise --depth`);
  }
}

/**
 * Whether a direct child of a screen frame is actually rendered.
 *
 * The file carries leftovers from earlier versions of these screens, parked far
 * off the artboard rather than deleted: the Camera frame is 375 wide and clips,
 * and three of its children sit at x ≈ -16830. They are invisible in Figma and
 * in the exported frame, but they are in the tree, they are fully styled, and an
 * agent reading the tree would build them. The Homemade Apple counter and
 * "gallery" label are exactly this - the previous design's camera, still
 * attached.
 *
 * A child counts as dead when its box does not intersect the screen's own box.
 * Coordinates below the first level are relative to their parent, so only the
 * first level needs the test.
 */
function offCanvas(child, parent) {
  if (!parent?.styles?.clipsContent) return false;
  const b = child.bounds ?? {};
  const w = parent.bounds?.width ?? 0;
  const h = parent.bounds?.height ?? 0;
  return b.x + b.width <= 0 || b.y + b.height <= 0 || b.x >= w || b.y >= h;
}

function liveChildren(node) {
  return (node.children ?? []).filter((child) => !offCanvas(child, node));
}

function collectText(node, out = []) {
  if (node.type === 'TEXT') out.push(node.characters);
  for (const child of liveChildren(node)) collectText(child, out);
  return out;
}

/**
 * Count something across every registered screen, skipping the off-canvas
 * leftovers. Censusing the raw capture instead would report the previous
 * design's fonts and colours as if they were this one's.
 */
function census(pick) {
  const tally = new Map();
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    pick(node, tally);
    for (const child of liveChildren(node)) walk(child);
  };
  for (const screen of SCREENS) {
    const frame = lookup(screen.node);
    if (frame) walk(frame);
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1]);
}

/* ---------------------------------- main --------------------------------- */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const positional = argv.filter(
  (a, i) => !a.startsWith('--') && !String(argv[i - 1] ?? '').startsWith('--')
);

if (flag('--colors')) {
  const rows = census((node, tally) => {
    const fills = node.styles?.fills;
    if (!Array.isArray(fills)) return;
    for (const f of fills) {
      if (f?.type === 'SOLID' && f.color)
        tally.set(f.color, (tally.get(f.color) ?? 0) + 1);
    }
  });
  for (const [colour, n] of rows) console.log(`${colour}  ${n}`);
  process.exit(0);
}

if (flag('--fonts')) {
  const rows = census((node, tally) => {
    if (node.type !== 'TEXT') return;
    const s = node.styles ?? {};
    const key = `${s.fontFamily} ${s.fontStyle} ${round(s.fontSize)}`;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  });
  for (const [face, n] of rows) console.log(`${face}  x${n}`);
  process.exit(0);
}

const byNode = value('--node', null);
const name = positional[0];

if (!byNode && !name) {
  console.log('MemoRoll design, captured 2026-08-24 from Figma "Randos".\n');
  let side = null;
  for (const screen of SCREENS) {
    if (screen.side !== side) {
      side = screen.side;
      console.log(`\n${side.toUpperCase()}`);
    }
    console.log(
      `  ${screen.id.padEnd(34)} ${screen.node.padEnd(12)} ${screen.what}`
    );
  }
  console.log('\nFrames: docs/design/memoroll/frames/<id>.jpg');
  console.log(
    'Read one: node docs/design/memoroll/inspect.mjs <id> [--depth N] [--copy]'
  );
  process.exit(0);
}

const screen = SCREENS.find((s) => s.id === name);
if (name && !screen) {
  console.error(
    `No screen called "${name}". Run with no arguments to list them.`
  );
  process.exit(1);
}

const target = lookup(byNode ?? screen.node);
if (!target) {
  console.error(`Node ${byNode ?? screen.node} is not in the capture.`);
  process.exit(1);
}

if (flag('--copy')) {
  for (const line of collectText(target)) console.log(JSON.stringify(line));
  process.exit(0);
}

if (screen) {
  console.log(`${screen.id}  -  ${screen.what}`);
  console.log(`node ${screen.node}  ·  frames/${screen.id}.jpg\n`);
}

const lines = [];
print(target, 0, Number(value('--depth', '99')), lines, null, flag('--all'));
console.log(lines.join('\n'));

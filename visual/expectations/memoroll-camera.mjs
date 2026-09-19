/**
 * The camera (guest-09 in the capture, Figma node 434:7827).
 *
 * The shots counter over the viewfinder, the film strip, and the mauve dock
 * carrying the shutter and the gallery. The checked pose is the design's own:
 * the How popup dismissed, RAW chosen (the design draws its selected pill
 * first, and RAW is the label the roster's agreed deviation gives the
 * no-film option), and Flash present - the dock's lighting dial stands in
 * for hardware the checking browser does not have, the same stand-in it
 * already is for clocks and rolls. Flash and Torch stay capability-detected
 * on a real phone.
 *
 * Three of the design's values cannot ride into CSS and ship as named
 * stand-ins, asserted here as what they are:
 * - the counter's outer stroke is a gradient; the Dark Room's half-white
 *   hairline is repeated so the one counter cannot drift into two.
 * - the viewfinder's stroke is a gradient (#232323 -> #808080 -> #5e5e5e);
 *   its brightest stop, the design's own grey, stands in at 1px.
 * - the LED wears LAYER_BLUR 4 in the design; a green glow shadow stands in
 *   so the dot stays a dot.
 *
 * The pills' first inner shadow is drawn white at 10% in the capture and
 * ships black at 10%: the shared pill token the gallery's tabs already
 * assert, invisible either way at that opacity, and one token beats two.
 *
 * The gallery button holds dark prints on purpose. An Undeveloped Shot is
 * veiled and nothing on this camera previews one, so the stack's windows are
 * ink rather than a thumbnail of anybody's last shot.
 */

import { body, COLOUR } from './memoroll.mjs';
import { GALLERY_COLOUR, PILL_SHADOW } from './memoroll-gallery.mjs';

/** The tracked-out ExtraBold Italic the counter speaks in. */
const counterType = (tracking) => ({
  fontSize: '18px',
  fontWeight: 800,
  lineHeight: '27px',
  letterSpacing: tracking,
  color: GALLERY_COLOUR.cream,
});

/** The triple inner shadow of the counter's dark cards. */
const COUNTER_CARD_SHADOW = [
  'inset 4px 4px 40.9px 12px rgba(0, 0, 0, 0.1)',
  'inset 0 3.6px 5.2px 1px rgba(0, 0, 0, 0.45)',
  'inset 0 -3.6px 5.2px 1px rgba(0, 0, 0, 0.17)',
].join(', ');

/** One film pill: cream on dark when chosen, dark with cream text when not. */
const filmPill = (copy, chosen) => ({
  name: `${copy} film pill, ${chosen ? 'chosen' : 'not chosen'}`,
  withText: copy,
  style: {
    ...body(12, 800, chosen ? COLOUR.ink : GALLERY_COLOUR.cream),
    backgroundColor: chosen ? GALLERY_COLOUR.cream : GALLERY_COLOUR.pill,
    borderRadius: '9999px',
    padding: '8px 12px',
    boxShadow: PILL_SHADOW,
  },
});

export const expectations = [
  {
    name: 'the camera’s dark ground',
    select: 'section[aria-label="Camera"]',
    style: { backgroundColor: COLOUR.ink },
  },
  {
    name: 'the counter’s outer pill',
    select: 'section[aria-label="Camera"] > div > div',
    nth: 0,
    style: {
      backgroundColor: GALLERY_COLOUR.mauve,
      borderRadius: '16px',
      padding: '8px',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      borderWidth: '1px',
      boxShadow: 'inset 0 1px 2px rgba(58, 44, 52, 0.25)',
    },
  },
  {
    name: 'the counter’s LED card',
    select: 'section[aria-label="Camera"] > div > div > div > div:first-child',
    style: {
      backgroundColor: GALLERY_COLOUR.pill,
      borderRadius: '8px',
      padding: '10px 16px',
      boxShadow: COUNTER_CARD_SHADOW,
    },
  },
  {
    name: 'the green LED',
    select:
      'section[aria-label="Camera"] > div > div > div > div:first-child > span[aria-hidden]:first-child',
    style: {
      // Top to bottom is a gradient's default, and the browser reports the
      // computed value without spelling the 180deg out.
      backgroundImage: 'linear-gradient(#2bfa32, #19941d)',
      borderRadius: '9999px',
      boxShadow:
        '0 2px 4.6px 1px rgba(43, 250, 50, 0.25), 0 -2px 6.9px rgba(43, 250, 50, 0.25)',
    },
  },
  {
    name: 'the count of shots left',
    withText: '10',
    nth: 0,
    // The one place the camera tracks type out at +12%, like the Dark Room.
    style: counterType('2.16px'),
  },
  {
    name: 'the SHOTS LEFT card',
    select: 'section[aria-label="Camera"] > div > div > div > div:nth-child(2)',
    style: {
      backgroundColor: GALLERY_COLOUR.pill,
      borderRadius: '8px',
      padding: '10px 16px',
      boxShadow: COUNTER_CARD_SHADOW,
    },
  },
  {
    name: 'SHOTS LEFT',
    withText: 'SHOTS LEFT',
    style: counterType('-0.198px'),
  },
  {
    name: 'the viewfinder',
    select: 'section[aria-label="Camera"] > div > div',
    nth: 1,
    style: {
      backgroundColor: '#3b3a3a',
      borderRadius: '16px',
      padding: '8px',
      borderColor: '#808080',
      borderWidth: '1px',
      boxShadow:
        'inset -2px 2px 6.1px rgba(35, 35, 35, 1), inset 2px -2px 6.1px rgba(35, 35, 35, 1)',
    },
  },
  {
    name: 'the first line of the thirds grid',
    select: 'section[aria-label="Camera"] span.pointer-events-none > span',
    nth: 0,
    style: { backgroundColor: COLOUR.ink },
  },
  {
    name: 'the Flash pill',
    select: 'button[aria-label="Flash"]',
    style: {
      backgroundColor: GALLERY_COLOUR.pill,
      borderRadius: '9999px',
      padding: '4px 8px',
      gap: '4px',
      boxShadow: PILL_SHADOW,
    },
  },
  {
    name: 'Flash reading OFF',
    withText: 'OFF',
    style: body(12, 800, GALLERY_COLOUR.cream),
  },
  {
    name: 'the film strip',
    select: '[role="radiogroup"]',
    style: { gap: '16px', padding: '16px' },
  },
  filmPill('RAW', true),
  filmPill('Wedding Natural', false),
  filmPill('Soft Pastel', false),
  filmPill('Clean Cool', false),
  filmPill('Bold Color', false),
  filmPill('Black & White', false),
  {
    name: 'the mauve ring around the shutter',
    select: 'section[aria-label="Camera"] > div:last-of-type span[aria-hidden]',
    nth: 0,
    style: {
      backgroundColor: '#b79fad',
      borderColor: '#a18294',
      borderWidth: '1px',
      borderRadius: '9999px',
      boxShadow: 'inset 0 1px 2px rgba(58, 44, 52, 0.1)',
    },
  },
  {
    name: 'the SHOOT button',
    select: 'button[aria-label="Take a shot"]',
    style: {
      backgroundColor: COLOUR.flame,
      borderRadius: '9999px',
      boxShadow:
        'inset 2px 4px 5.2px rgba(255, 255, 255, 0.25), inset 0 -4px 4.5px rgba(102, 24, 3, 0.98)',
    },
  },
  {
    name: 'SHOOT',
    withText: 'SHOOT',
    style: { fontSize: '13px', fontWeight: 800, color: '#a52400' },
  },
  {
    // The folder is the design's own artwork, exported from the file (node
    // 434:7888): the mauve folder with its prints spilling out. What is
    // asserted is that the artwork is what the button draws - its pixels are
    // the export's, not this harness's to re-measure.
    name: 'the design’s folder artwork',
    select: 'button[aria-label="Open the gallery"] > img[aria-hidden]',
  },
  {
    name: 'the gallery count badge',
    select: 'button[aria-label="Open the gallery"] > span:last-of-type',
    style: { backgroundColor: '#40363b', borderRadius: '9999px' },
  },
  {
    name: 'how many prints the roll holds',
    withText: '10',
    nth: 1,
    style: body(10, 700, COLOUR.white),
  },
];

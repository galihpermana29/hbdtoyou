/**
 * The properties a screen may be checked against, and how a value is normalised.
 *
 * Two values match when their normal forms are identical strings. Both sides go
 * through the same normaliser, so an expectation is written in ordinary CSS
 * syntax and still compares against whatever spelling the browser hands back:
 * `#e34013` against `rgb(227, 64, 19)`, `24` against `24px`, `bold` against
 * `700`.
 *
 * The list is an allow-list rather than a deny-list. A property nobody has
 * decided how to compare is an authoring mistake, not a silent pass, and a
 * dimension can never sneak in through a name nobody thought of.
 */

/**
 * Properties that describe how big an element is.
 *
 * These are refused by name so the refusal can explain itself. A form field that
 * stretches to its container is correct at any size, so a check that measured
 * one would fail correct work. See `docs/adr/0002-figma-is-literal-truth.md`.
 */
const DIMENSION_PROPERTIES = new Set([
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'inlineSize',
  'blockSize',
  'minInlineSize',
  'minBlockSize',
  'maxInlineSize',
  'maxBlockSize',
  'flexBasis',
]);

/**
 * Properties that name which typeface an element is set in.
 *
 * The application sets one family globally and the Create Flow keeps it, so the
 * design's typeface is deliberately not matched. Everything else about type is:
 * size, weight, line height and letter spacing are all asserted. Only the family
 * is free. See `docs/adr/0002-figma-is-literal-truth.md`.
 */
const TYPEFACE_PROPERTIES = new Set(['fontFamily', 'font', 'fontStyle']);

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNCTIONAL_COLOUR = /^rgba?\(([^)]*)\)$/i;

const clampByte = (value) => Math.min(255, Math.max(0, Math.round(value)));
const twoDigits = (value) => clampByte(value).toString(16).padStart(2, '0');

/**
 * How opaque a colour is, to two decimal places.
 *
 * Two places, because the same colour reaches this module by two routes that do
 * not round-trip through each other: a browser reports `rgba(0, 0, 0, 0.5)` and
 * a hex spelling of the same colour is `#0000007f`, whose alpha byte is 0.498.
 * Rounding both to 0.5 makes them one colour again, and still tells 5% apart
 * from 6%.
 */
const opacityText = (opacity) => String(Number(opacity.toFixed(2)));

/**
 * Any colour spelling to `#rrggbb`, or `#rrggbb@<opacity>` when see-through.
 *
 * Anything that is not a hex value, an `rgb()`, `transparent` or `currentcolor`
 * is refused rather than passed through. A browser never reports a colour by
 * name, so `white` in an expectation could only ever fail against the `#ffffff`
 * the page reports, and failing at the point it was written says so far better
 * than a screen that can never go green.
 */
export function normaliseColour(input) {
  const value = String(input).trim().toLowerCase();

  if (value === 'transparent') {
    return '#000000@0';
  }
  if (value === 'currentcolor') {
    return 'currentcolor';
  }

  const hex = HEX.exec(value);
  if (hex) {
    const digits =
      hex[1].length <= 4
        ? [...hex[1]].map((digit) => digit + digit).join('')
        : hex[1];
    const channels = digits.slice(0, 6);
    const opacity =
      digits.length === 8 ? Number.parseInt(digits.slice(6), 16) / 255 : 1;
    return withOpacity(channels, opacity);
  }

  const functional = FUNCTIONAL_COLOUR.exec(value);
  if (functional) {
    const parts = functional[1]
      .replace(/\//g, ' ')
      .split(/[\s,]+/)
      .filter(Boolean);
    if (parts.length >= 3) {
      const [red, green, blue, alpha = '1'] = parts;
      const channels =
        twoDigits(Number.parseFloat(red)) +
        twoDigits(Number.parseFloat(green)) +
        twoDigits(Number.parseFloat(blue));
      const opacity = alpha.endsWith('%')
        ? Number.parseFloat(alpha) / 100
        : Number.parseFloat(alpha);
      return withOpacity(channels, opacity);
    }
  }

  throw new Error(
    `"${input}" is not a colour this harness recognises. Write it as a hex ` +
      'value such as #e34013, as rgb(...) or rgba(...), or as transparent'
  );
}

const withOpacity = (channels, opacity) =>
  Number(opacity.toFixed(2)) >= 1
    ? `#${channels}`
    : `#${channels}@${opacityText(opacity)}`;

/** A number to at most two decimal places, without a trailing `.00`. */
const trimNumber = (value) => String(Number(value.toFixed(2)));

/**
 * A length to `<n>px`.
 *
 * Bare numbers are read as pixels, so an expectation may say `24` instead of
 * `'24px'`. Percentages and keywords such as `normal` or `auto` keep their own
 * spelling, because there is nothing to convert them to without knowing the
 * element they belong to.
 */
export function normaliseLength(input) {
  if (typeof input === 'number') {
    return `${trimNumber(input)}px`;
  }

  const value = String(input).trim().toLowerCase();
  if (/^-?[\d.]+$/.test(value)) {
    return `${trimNumber(Number.parseFloat(value))}px`;
  }
  const px = /^(-?[\d.]+)px$/.exec(value);
  if (px) {
    return `${trimNumber(Number.parseFloat(px[1]))}px`;
  }
  return value;
}

/**
 * Every token of a multi-value property, each normalised on its own.
 *
 * The split respects brackets, because the four sides of a border colour reach
 * this as `rgb(208, 213, 221) rgb(208, 213, 221) ...`, and a plain split on
 * whitespace would cut each colour into three pieces that are not colours.
 */
const normaliseEachToken = (normalise) => (input) =>
  splitTokens(String(input)).map(normalise).join(' ');

const splitTokens = (value) =>
  splitOutsideBrackets(value, (character) => /\s/.test(character));

const normaliseLengthList = normaliseEachToken(normaliseLength);
const normaliseColourList = normaliseEachToken(normaliseColour);
const normaliseKeywordList = normaliseEachToken((token) =>
  String(token).trim().toLowerCase()
);

const NAMED_WEIGHTS = { normal: '400', bold: '700' };

/** A font weight to its number, so `bold` and `700` are the same claim. */
export function normaliseFontWeight(input) {
  const value = String(input).trim().toLowerCase();
  return NAMED_WEIGHTS[value] ?? value;
}

/**
 * A font stack to the typeface actually asked for.
 *
 * The design names one typeface. What a browser reports is that typeface
 * followed by whatever fallbacks the implementation chose, and the fallbacks are
 * nobody's design decision, so only the first family is compared. Case is
 * dropped because `Inter` and `inter` select the same font.
 */
export function normaliseFontFamily(input) {
  const first = String(input).split(',')[0] ?? '';
  return first
    .trim()
    .replace(/^["']|["']$/g, '')
    .toLowerCase();
}

/**
 * A shadow to `<colour> <x> <y> <blur> <spread>`, one layer per comma.
 *
 * Browsers report the colour first and always give four lengths. Authors write
 * CSS, which puts the colour last and allows two. Both are rewritten into the
 * same shape so either spelling can be used.
 */
export function normaliseShadow(input) {
  const value = String(input).trim();
  if (value === '' || value.toLowerCase() === 'none') {
    return 'none';
  }

  return splitOutsideBrackets(value, (character) => character === ',')
    .map((layer) => {
      const tokens = splitOutsideBrackets(layer, (character) =>
        /\s/.test(character)
      );
      const inset = tokens.some((token) => token.toLowerCase() === 'inset');
      const rest = tokens.filter((token) => token.toLowerCase() !== 'inset');

      // A shadow's numbers are its offsets, blur and spread; anything else in
      // the layer is its colour. Splitting on that rather than on a list of
      // recognised colour spellings means an unrecognised one is refused by
      // normaliseColour instead of being silently counted as a length.
      const lengths = rest.filter((token) => /^[-+.\d]/.test(token));
      const colours = rest.filter((token) => !/^[-+.\d]/.test(token));
      while (lengths.length < 4) {
        lengths.push('0');
      }

      const colour =
        colours.length > 0 ? normaliseColour(colours[0]) : 'currentcolor';
      const offsets = lengths.slice(0, 4).map(normaliseLength).join(' ');
      return `${colour} ${offsets}${inset ? ' inset' : ''}`;
    })
    .join(', ');
}

/**
 * A background image to its gradients, each colour and stop normalised.
 *
 * A gradient is the one thing a design fills a box with that `backgroundColor`
 * cannot hold, so without this the Messages fade could have nothing said about
 * it. The colours inside a gradient go through `normaliseColour`, the same way
 * they do everywhere else, so `rgba(0,0,0,0.8)` written in an expectation
 * matches the `rgba(0, 0, 0, 0.8)` the browser reports. Stops and angles are
 * trimmed the way lengths are, so `-6.67%` is one claim however it is spelled.
 *
 * A layer that is not a function at all, or a function that is not a gradient -
 * `url(…)` most of all - is passed through as written rather than refused,
 * because this normaliser runs on the page's side of the comparison too: a
 * claim against an element that turns out to draw an image should fail with
 * both spellings shown, not stop the run.
 */
export function normaliseBackgroundImage(input) {
  const value = String(input).trim();
  if (value === '' || value.toLowerCase() === 'none') {
    return 'none';
  }

  return splitOutsideBrackets(value, (character) => character === ',')
    .map((layer) => {
      const call = /^([a-z-]+)\((.*)\)$/is.exec(layer);
      if (!call || !call[1].toLowerCase().endsWith('gradient')) {
        return layer;
      }
      const name = call[1].toLowerCase();
      const parts = splitOutsideBrackets(
        call[2],
        (character) => character === ','
      ).map(normaliseGradientArgument);
      return `${name}(${parts.join(', ')})`;
    })
    .join(', ');
}

/**
 * One comma-separated argument of a gradient: a direction, or a colour stop.
 *
 * Its tokens are judged one by one, because a colour stop is a colour and its
 * positions in either order and a direction is keywords or an angle: whatever
 * spells like a colour is normalised as one, whatever spells like a percentage,
 * an angle or a length is trimmed as a number, and the keywords are lowered.
 */
function normaliseGradientArgument(argument) {
  return splitOutsideBrackets(argument, (character) => /\s/.test(character))
    .map((token) => {
      const value = token.toLowerCase();
      if (
        HEX.test(value) ||
        FUNCTIONAL_COLOUR.test(value) ||
        value === 'transparent' ||
        value === 'currentcolor'
      ) {
        return normaliseColour(token);
      }
      const percentage = /^(-?[\d.]+)%$/.exec(value);
      if (percentage) {
        return `${trimNumber(Number.parseFloat(percentage[1]))}%`;
      }
      const angle = /^(-?[\d.]+)deg$/.exec(value);
      if (angle) {
        return `${trimNumber(Number.parseFloat(angle[1]))}deg`;
      }
      if (/^-?[\d.]+(px)?$/.test(value)) {
        return normaliseLength(value);
      }
      return value;
    })
    .join(' ');
}

/**
 * Split on separators that are not inside brackets, so `rgba(…)` survives.
 *
 * Used for both halves of reading a shadow: commas separate its layers, and
 * whitespace separates one layer's parts.
 */
function splitOutsideBrackets(value, isSeparator) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const character of value) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (isSeparator(character) && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += character;
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

/**
 * Every property a screen may be checked against, and how it is compared.
 *
 * `read` says how the value is assembled from a browser's computed style. The
 * shorthands are assembled from their longhands rather than read directly,
 * because a computed shorthand is not reported consistently once its sides
 * disagree.
 */
export const ASSERTABLE_PROPERTIES = {
  fontSize: { normalise: normaliseLength, read: ['fontSize'] },
  fontWeight: { normalise: normaliseFontWeight, read: ['fontWeight'] },
  lineHeight: { normalise: normaliseLength, read: ['lineHeight'] },
  letterSpacing: { normalise: normaliseLength, read: ['letterSpacing'] },
  color: { normalise: normaliseColour, read: ['color'] },
  backgroundColor: { normalise: normaliseColour, read: ['backgroundColor'] },
  backgroundImage: {
    normalise: normaliseBackgroundImage,
    read: ['backgroundImage'],
  },
  borderColor: {
    normalise: normaliseColourList,
    read: [
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
    ],
  },
  borderWidth: {
    normalise: normaliseLengthList,
    read: [
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
    ],
  },
  borderStyle: {
    normalise: normaliseKeywordList,
    read: [
      'borderTopStyle',
      'borderRightStyle',
      'borderBottomStyle',
      'borderLeftStyle',
    ],
  },
  borderRadius: {
    normalise: normaliseLengthList,
    read: [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomRightRadius',
      'borderBottomLeftRadius',
    ],
  },
  boxShadow: { normalise: normaliseShadow, read: ['boxShadow'] },
  padding: {
    normalise: normaliseLengthList,
    read: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  },
  margin: {
    normalise: normaliseLengthList,
    read: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  },
  gap: { normalise: normaliseLengthList, read: ['rowGap', 'columnGap'] },

  /**
   * Whether what is inside an element is drawn outside it.
   *
   * One of the two properties here that carry a behaviour rather than an
   * appearance, and it earns its place because a sealed invitation is defined
   * by it: everything below the envelope is clipped away until a guest opens
   * it, and drawn afterwards. Read from both axes, so `hidden` is a claim about
   * the region rather than about one direction of it.
   */
  overflow: {
    normalise: normaliseKeywordList,
    read: ['overflowX', 'overflowY'],
  },

  /**
   * Whether an element is taken out of the page it sits in.
   *
   * The other behavioural property, and the other half of what a sealed
   * invitation is: `size` says a region takes up no room at all, so the page a
   * guest can scroll ends where the envelope does. It is here rather than a
   * height because it is not one - `max-height: 0` would say the same thing and
   * would be refused, along with every other dimension, for the good reason
   * that a dimension is a measurement of a screen and this is a decision about
   * a page.
   */
  contain: { normalise: normaliseKeywordList, read: ['contain'] },
};

/** The longhands a browser has to be asked for to cover every property above. */
export const READABLE_PROPERTIES = [
  ...new Set(Object.values(ASSERTABLE_PROPERTIES).flatMap(({ read }) => read)),
];

/**
 * Expand a value written as one to four sides into the four the browser reports.
 *
 * `'24px 12px'` is the same claim as `'24px 12px 24px 12px'`, and `gap: '24px'`
 * is the same claim as `'24px 24px'`, so an expectation may be written either
 * way.
 */
function expandSides(value, sides) {
  const tokens = splitTokens(String(value));
  if (tokens.length >= sides || tokens.length === 0) {
    return tokens.join(' ');
  }
  if (sides === 2) {
    return [tokens[0], tokens[0]].join(' ');
  }
  const [top, right = top, bottom = top, left = right] = tokens;
  return [top, right, bottom, left].join(' ');
}

/**
 * The normal form of one property's value, ready to be compared as a string.
 *
 * Throws when the property is not one this harness knows how to compare, so a
 * mistyped or unconsidered property is caught where it is written rather than
 * quietly passing.
 */
export function normaliseValue(property, value) {
  const definition = ASSERTABLE_PROPERTIES[property];
  if (!definition) {
    throw new Error(unknownPropertyMessage(property));
  }
  const sides = definition.read.length;
  const spelled = sides > 1 ? expandSides(value, sides) : value;
  return definition.normalise(spelled);
}

/** Why a property cannot be asserted, in words a person can act on. */
export function unknownPropertyMessage(property) {
  if (DIMENSION_PROPERTIES.has(property)) {
    return (
      `"${property}" is a dimension, and dimensions are never asserted: a field ` +
      'that stretches to its container is correct at any size'
    );
  }
  if (TYPEFACE_PROPERTIES.has(property)) {
    return (
      `"${property}" names a typeface, and the typeface is never asserted: the ` +
      'Create Flow keeps the family the application already sets. Size, weight, ' +
      'line height and letter spacing are still asserted'
    );
  }
  return (
    `"${property}" is not a property this harness compares. Known properties: ` +
    `${Object.keys(ASSERTABLE_PROPERTIES).join(', ')}`
  );
}

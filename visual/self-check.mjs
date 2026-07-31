#!/usr/bin/env node
/**
 * Check the checker itself, without a browser and without a server.
 *
 *   npm run visual:self-check
 *
 * Every screen reports red until this epic is finished, so "differs" on its own
 * cannot tell a reviewer whether the screen is wrong or the check is. This
 * answers that question.
 *
 * This is not a second seam into the product. The spec's rule that there is
 * exactly one seam, the rendered route, is about testing the application, and
 * nothing here touches the application. It checks the harness, which the spec
 * says is worth more care than the screens it checks because everything after it
 * depends on it.
 */

import { check, validateExpectations } from './check.mjs';
import { screens, skipReason } from './screens.mjs';
import { normaliseValue, unknownPropertyMessage } from './style-vocabulary.mjs';

const failures = [];

function expect(condition, description) {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${description}`);
  if (!condition) {
    failures.push(description);
  }
}

/** Two spellings of one value are the same claim. */
function same(property, written, reported, description) {
  const left = normaliseValue(property, written);
  const right = normaliseValue(property, reported);
  expect(left === right, `${description} (${left} vs ${right})`);
}

/** Two spellings of different values are different claims. */
function differ(property, written, reported, description) {
  expect(
    normaliseValue(property, written) !== normaliseValue(property, reported),
    description
  );
}

function checkTheVocabulary() {
  console.log('reading a value the way the browser spells it');

  same('color', '#e34013', 'rgb(227, 64, 19)', 'a hex colour is an rgb colour');
  same('color', '#fff', '#FFFFFF', 'a short hex is a long hex');
  same(
    'backgroundColor',
    'transparent',
    'rgba(0, 0, 0, 0)',
    'transparent is fully transparent black'
  );
  same(
    'color',
    'rgba(16, 24, 40, 0.05)',
    '#1018280d',
    'an alpha channel survives either spelling'
  );
  same(
    'color',
    '#0000007f',
    'rgba(0, 0, 0, 0.5)',
    'a half-transparent colour is half transparent in either spelling'
  );
  differ('color', '#e34013', 'rgb(227, 64, 20)', 'one channel off is a change');
  differ(
    'color',
    'rgba(0, 0, 0, 0.05)',
    'rgba(0, 0, 0, 0.5)',
    'ten times the opacity is a change'
  );

  for (const colour of ['white', '#e3401', 'chartreuse']) {
    let refused = false;
    try {
      normaliseValue('color', colour);
    } catch (error) {
      refused = error.message.includes('not a colour');
    }
    expect(
      refused,
      `"${colour}" is refused: a browser never reports a colour that way, so it could only ever fail`
    );
  }

  let shadowRefused = false;
  try {
    normaliseValue('boxShadow', '0 1px 2px black');
  } catch (error) {
    shadowRefused = error.message.includes('not a colour');
  }
  expect(
    shadowRefused,
    'a named colour inside a shadow is refused too, rather than counted as a length'
  );

  same('fontSize', 14, '14px', 'a bare number is a pixel length');
  same('padding', '0', '0px', 'zero is zero pixels');
  same('fontWeight', 'bold', 700, 'bold is seven hundred');
  same('fontWeight', 'normal', '400', 'normal is four hundred');
  for (const property of ['fontFamily', 'font', 'fontStyle']) {
    let refused = false;
    try {
      normaliseValue(property, 'Inter');
    } catch (error) {
      refused = error.message.includes('typeface');
    }
    expect(
      refused,
      `"${property}" is refused, because the Create Flow keeps the family the application already sets`
    );
  }

  same(
    'padding',
    '24px 12px',
    '24px 12px 24px 12px',
    'two sides mean the same as four'
  );
  same('gap', '24px', '24px 24px', 'one gap means both gaps');
  same('borderRadius', 8, '8px 8px 8px 8px', 'one radius means four corners');
  same(
    'borderColor',
    '#d0d5dd',
    'rgb(208, 213, 221) rgb(208, 213, 221) rgb(208, 213, 221) rgb(208, 213, 221)',
    'one border colour means four sides, even spelled as rgb() with spaces in it'
  );
  differ(
    'borderColor',
    '#d0d5dd',
    'rgb(208, 213, 221) rgb(208, 213, 221) rgb(208, 213, 221) rgb(227, 64, 19)',
    'one side of a border being another colour is a change'
  );
  differ(
    'padding',
    '24px 12px',
    '24px 12px 24px 16px',
    'one side off is a change'
  );

  same(
    'boxShadow',
    '0 1px 2px rgba(16, 24, 40, 0.05)',
    'rgba(16, 24, 40, 0.05) 0px 1px 2px 0px',
    'a shadow written as CSS is the shadow the browser reports'
  );
  same('boxShadow', 'none', 'NONE', 'no shadow is no shadow');
  differ(
    'boxShadow',
    '0 1px 2px rgba(16, 24, 40, 0.05)',
    'rgba(16, 24, 40, 0.05) 0px 2px 2px 0px',
    'a moved shadow is a change'
  );

  for (const property of ['width', 'height', 'minWidth', 'maxHeight']) {
    let refused = false;
    try {
      normaliseValue(property, '100px');
    } catch (error) {
      refused = error.message.includes('dimension');
    }
    expect(
      refused,
      `"${property}" is refused, because dimensions are not asserted`
    );
  }

  expect(
    unknownPropertyMessage('backgroundImage').includes('not a property'),
    'a property nobody has decided how to compare is refused too'
  );
}

/** One expectation and an observation that satisfies it exactly. */
function matchingPair() {
  const expectations = [
    {
      name: 'Section name',
      select: 'form section h2',
      text: 'Cover Header',
      style: {
        fontSize: '18px',
        fontWeight: 600,
        color: '#1b1b1b',
        padding: '24px 12px',
      },
    },
    {
      name: 'Section description',
      withText: 'Verses or prayers you and your partner love',
      style: { color: '#475467' },
    },
  ];
  const observations = [
    {
      name: 'Section name',
      matched: 1,
      documentIndex: 10,
      describe: '<h2>',
      text: 'Cover Header',
      style: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'rgb(27, 27, 27)',
        padding: '24px 12px 24px 12px',
      },
    },
    {
      name: 'Section description',
      matched: 1,
      documentIndex: 20,
      describe: '<p>',
      text: 'Verses or prayers you and your partner love',
      style: { color: 'rgb(71, 84, 103)' },
    },
  ];
  return { expectations, observations };
}

const only = (list) => (list.length === 1 ? list[0] : {});

function checkTheVerdict() {
  console.log('deciding whether a screen matches');

  const { expectations, observations } = matchingPair();
  expect(
    check(expectations, observations).length === 0,
    'a screen styled as the design says it is has nothing wrong with it'
  );

  const missing = check(expectations, [
    { name: 'Section name', matched: 0 },
    observations[1],
  ]);
  expect(
    missing.length === 1 &&
      missing[0].element === 'Section name' &&
      missing[0].property === 'presence',
    'a missing element fails, named, rather than scored'
  );
  expect(
    only(missing).expected?.includes('form section h2'),
    'and the failure says how the element was looked for'
  );

  const nearest = check(expectations, [
    observations[0],
    {
      name: 'Section description',
      matched: 0,
      nearest: {
        text: 'Verses or prayers you and your partner like',
        describe: '<p>',
      },
    },
  ]);
  expect(
    only(nearest).actual?.includes('partner like'),
    'an element found only by its copy names the nearest copy on the page'
  );

  const ambiguous = check(expectations, [
    { name: 'Section name', matched: 4 },
    observations[1],
  ]);
  expect(
    only(ambiguous).property === 'presence' &&
      only(ambiguous).actual.includes('4 elements'),
    'an element the design cannot point at unambiguously fails too'
  );

  const rewritten = check(expectations, [
    { ...observations[0], text: 'Cover header' },
    observations[1],
  ]);
  expect(
    only(rewritten).property === 'copy' &&
      only(rewritten).expected === 'Cover Header' &&
      only(rewritten).actual === 'Cover header',
    'copy that does not match the design fails, with both spellings'
  );

  const restyled = check(expectations, [
    {
      ...observations[0],
      style: { ...observations[0].style, color: 'rgb(0, 0, 0)' },
    },
    observations[1],
  ]);
  expect(
    only(restyled).element === 'Section name' &&
      only(restyled).property === 'color' &&
      only(restyled).expected === '#1b1b1b' &&
      only(restyled).actual === '#000000',
    'a wrong property fails, naming the element, the property, and both values'
  );

  const reordered = check(expectations, [
    { ...observations[0], documentIndex: 99 },
    observations[1],
  ]);
  expect(
    only(reordered).property === 'position' &&
      only(reordered).element === 'Section description',
    'an element in the wrong place in the document fails on its position'
  );

  const whitespace = check(expectations, [
    { ...observations[0], text: '  Cover   Header \n' },
    observations[1],
  ]);
  expect(
    whitespace.length === 0,
    'indentation in the markup is not a difference in the copy'
  );

  // One element in the wrong place used to blame every element after it, which
  // on a screen of sixty turned one fault into fifty-nine failures pointing at
  // innocent elements.
  const displaced = [
    { name: 'One', select: 'h1', style: {} },
    { name: 'Two', select: 'h2', style: {} },
    { name: 'Three', select: 'h3', style: {} },
    { name: 'Four', select: 'h4', style: {} },
  ];
  const cascade = check(
    displaced,
    [900, 10, 20, 30].map((documentIndex, index) => ({
      name: displaced[index].name,
      matched: 1,
      documentIndex,
      style: {},
    }))
  );
  expect(
    cascade.length === 1 && cascade[0].element === 'Two',
    `one element in the wrong place is one failure, not a cascade (got ${cascade.length})`
  );

  const misaligned = check(expectations, [
    { ...observations[1], name: 'Section description' },
    observations[1],
  ]);
  expect(
    misaligned.some(
      (entry) =>
        entry.property === 'observation' && entry.element === 'Section name'
    ),
    'an observation about the wrong element is caught rather than compared'
  );

  const past = check(
    [{ name: 'The fourth Section', select: 'form section', nth: 3, style: {} }],
    [{ name: 'The fourth Section', matched: 0, available: 2 }]
  );
  expect(
    only(past).actual.includes('2 were found'),
    'asking for the fourth of two says there are two, not that there are none'
  );

  const lastOfOne = check(
    [{ name: 'The second Section', select: 'form section', nth: 1, style: {} }],
    [{ name: 'The second Section', matched: 0, available: 1 }]
  );
  expect(
    only(lastOfOne).actual.includes('1 was found'),
    'and it counts in English when there is only one'
  );
}

function checkTheAuthoring() {
  console.log('refusing expectations that cannot be checked');

  const measured = check(
    [{ name: 'A field', select: 'input', style: { width: '320px' } }],
    [{ name: 'A field', matched: 1, documentIndex: 1, style: {} }]
  );
  expect(
    only(measured).property === 'width' &&
      only(measured).actual.includes('dimension'),
    'an expectation that measures an element is refused, not silently checked'
  );

  const nameless = validateExpectations([{ select: 'h1' }]);
  expect(
    nameless.some((entry) => entry.actual === 'no name'),
    'an expectation with no name is refused, because a failure could not name it'
  );

  const lost = validateExpectations([{ name: 'Somewhere' }]);
  expect(
    lost.some((entry) => entry.actual === 'no way to find the element'),
    'an expectation with no way to find its element is refused'
  );

  const twice = validateExpectations([
    { name: 'Page title', select: 'h1' },
    { name: 'Page title', select: 'h2' },
  ]);
  expect(
    twice.some((entry) => entry.actual === 'a repeated name'),
    'two expectations sharing a name are refused, because a failure would be ambiguous'
  );
}

function checkTheManifest() {
  console.log('the expectations this repository has recorded');

  const checkable = screens.filter((screen) => !skipReason(screen));
  expect(
    checkable.length > 0,
    'at least one screen has both a route and expectations taken from the design'
  );

  for (const screen of checkable) {
    const authoring = validateExpectations(screen.expectations);
    expect(
      authoring.length === 0,
      `${screen.id}: every expectation can be checked` +
        (authoring.length === 0
          ? ''
          : ` (${authoring[0].element}: ${authoring[0].actual})`)
    );
    expect(
      screen.expectations.length > 0,
      `${screen.id}: the design says something about this screen`
    );
  }

  for (const screen of screens.filter((candidate) => skipReason(candidate))) {
    expect(
      !screen.expectations,
      `${screen.id}: skipped, and skipped screens record nothing to check`
    );
  }
}

function main() {
  checkTheVocabulary();
  checkTheVerdict();
  checkTheAuthoring();
  checkTheManifest();

  if (failures.length > 0) {
    throw new Error(`${failures.length} self-check(s) failed`);
  }
  console.log(
    '\nThe check behaves. A red screen means the screen, not the harness.'
  );
}

try {
  main();
} catch (error) {
  console.error(`\nSelf-check failed: ${error.message}`);
  process.exitCode = 1;
}

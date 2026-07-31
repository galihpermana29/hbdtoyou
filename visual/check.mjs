/**
 * Decide whether a screen matches the design.
 *
 * This module is pure. It takes what the design says a screen should be and what
 * a browser reported it actually is, and returns the list of ways they disagree.
 * Nothing here touches a browser, a file, or the network, which is what lets the
 * self-check exercise every rule without either.
 *
 * A failure names one element and one property, with the expected value and the
 * actual one. There is no score and no percentage: a screen either matches the
 * design or there is a list of specific things wrong with it.
 */

import {
  ASSERTABLE_PROPERTIES,
  normaliseValue,
  unknownPropertyMessage,
} from './style-vocabulary.mjs';

/** Collapse every run of whitespace, so indentation is never a difference. */
export const normaliseCopy = (text) => String(text).replace(/\s+/g, ' ').trim();

/**
 * The ways an expectation may say which element it is about.
 *
 * Named once, because three places need to agree on the list: the browser side
 * that resolves them, the words a failure uses, and the rule that an expectation
 * with none of them cannot be checked.
 */
export const FINDER_KEYS = ['select', 'control', 'withText', 'nth'];

/** Whether an expectation says how to find its element at all. */
export const hasFinder = (expectation) =>
  Boolean(expectation.select || expectation.control || expectation.withText);

/** How an expectation says to find its element, in words, for a failure. */
export function describeFinder(expectation) {
  const parts = [];
  if (expectation.select) {
    parts.push(`matching "${expectation.select}"`);
  }
  if (expectation.control) {
    parts.push(`labelled "${expectation.control}"`);
  }
  if (expectation.withText) {
    parts.push(`rendering "${expectation.withText}"`);
  }
  if (typeof expectation.nth === 'number') {
    parts.push(`at position ${expectation.nth + 1}`);
  }
  return parts.length > 0 ? parts.join(', ') : 'with no way to find it';
}

/** The copy an expectation claims its element renders, if it claims any. */
export function expectedCopy(expectation) {
  if (typeof expectation.text === 'string') {
    return normaliseCopy(expectation.text);
  }
  if (typeof expectation.withText === 'string') {
    return normaliseCopy(expectation.withText);
  }
  return null;
}

const failure = (element, property, expected, actual, found) => ({
  element,
  property,
  expected,
  actual,
  ...(found ? { found } : {}),
});

/**
 * Everything wrong with the expectations themselves, before any browser runs.
 *
 * An expectation that cannot be checked is a mistake in the manifest, and it is
 * reported as a failure rather than skipped, because a rule nobody notices was
 * dropped is worse than one that fails loudly.
 */
export function validateExpectations(expectations) {
  const failures = [];
  const seen = new Set();

  expectations.forEach((expectation, index) => {
    const element = expectation.name ?? `expectation ${index + 1}`;

    if (!expectation.name) {
      failures.push(
        failure(
          element,
          'expectation',
          'a name, so a failure can say which element it is about',
          'no name'
        )
      );
    } else if (seen.has(expectation.name)) {
      failures.push(
        failure(
          element,
          'expectation',
          'a name no other expectation on this screen uses',
          'a repeated name'
        )
      );
    }
    seen.add(expectation.name);

    if (!hasFinder(expectation)) {
      failures.push(
        failure(
          element,
          'expectation',
          'a selector, a label, or the copy the element renders',
          'no way to find the element'
        )
      );
    }

    for (const [property, value] of Object.entries(expectation.style ?? {})) {
      if (!ASSERTABLE_PROPERTIES[property]) {
        failures.push(
          failure(
            element,
            property,
            'a property this harness compares',
            unknownPropertyMessage(property)
          )
        );
        continue;
      }
      try {
        normaliseValue(property, value);
      } catch (error) {
        failures.push(
          failure(
            element,
            property,
            'a value that can be compared',
            error.message
          )
        );
      }
    }
  });

  return failures;
}

/** Compare one element's computed style against what the design says it is. */
function checkStyle(expectation, observation) {
  const failures = [];
  for (const [property, value] of Object.entries(expectation.style ?? {})) {
    const expected = normaliseValue(property, value);
    const observed = observation.style?.[property];
    if (observed === undefined) {
      failures.push(
        failure(
          expectation.name,
          property,
          expected,
          'the browser reported no value',
          observation.describe
        )
      );
      continue;
    }

    // The browser's own spelling is normalised here rather than trusted. If it
    // is one this harness cannot read, that is worth saying plainly instead of
    // ending the whole run on an exception from inside a comparison.
    let actual;
    try {
      actual = normaliseValue(property, observed);
    } catch (error) {
      failures.push(
        failure(
          expectation.name,
          property,
          expected,
          `${observed} (${error.message})`,
          observation.describe
        )
      );
      continue;
    }

    if (actual !== expected) {
      failures.push(
        failure(
          expectation.name,
          property,
          expected,
          actual,
          observation.describe
        )
      );
    }
  }
  return failures;
}

/**
 * Compare where an element sits in the document against the designed order.
 *
 * Only adjacent pairs are compared, and the running reference advances whether
 * or not the pair matched. One element in the wrong place is then one failure
 * naming the pair it broke, rather than every element after it being blamed for
 * following the first thing that moved.
 */
function checkOrder(expectations, observations) {
  const failures = [];
  let previous = null;

  expectations.forEach((expectation, index) => {
    const observation = observations[index];
    if (!observation || observation.matched !== 1) {
      return;
    }
    if (previous && observation.documentIndex <= previous.documentIndex) {
      failures.push(
        failure(
          expectation.name,
          'position',
          `after "${previous.name}", as the design arranges them`,
          `before "${previous.name}"`,
          observation.describe
        )
      );
    }
    previous = {
      name: expectation.name,
      documentIndex: observation.documentIndex,
    };
  });

  return failures;
}

/**
 * Why nothing matched, said as usefully as the observation allows.
 *
 * "Nothing matched" on its own sends a person hunting. When the element was
 * looked for by its copy, the nearest copy the page does render turns a typo
 * into two spellings side by side; when a position was asked for, saying how
 * many the selector did find separates "the element is missing" from "there are
 * fewer of them than the design has".
 */
function nothingMatched(observation) {
  if (observation?.nearest) {
    return (
      `nothing matched. The closest is ${observation.nearest.describe} ` +
      `rendering "${observation.nearest.text}"`
    );
  }
  if (observation?.available > 0) {
    const found = observation.available;
    return `nothing matched at that position, though ${
      found === 1 ? '1 was' : `${found} were`
    } found`;
  }
  return 'nothing matched';
}

/**
 * Every way a screen disagrees with the design.
 *
 * `observations` is index-aligned with `expectations`: one entry per expectation,
 * saying how many elements matched and, when exactly one did, what it renders and
 * how it is styled.
 */
export function check(expectations, observations) {
  const authoring = validateExpectations(expectations);
  if (authoring.length > 0) {
    return authoring;
  }

  const failures = [];

  expectations.forEach((expectation, index) => {
    const observation = observations[index];

    if (
      observation &&
      observation.name &&
      observation.name !== expectation.name
    ) {
      failures.push(
        failure(
          expectation.name,
          'observation',
          'the browser to have been asked about this element',
          `it was asked about "${observation.name}" instead, which is a bug in the harness`
        )
      );
      return;
    }

    if (!observation || observation.matched === 0) {
      failures.push(
        failure(
          expectation.name,
          'presence',
          `one element ${describeFinder(expectation)}`,
          nothingMatched(observation)
        )
      );
      return;
    }

    if (observation.matched > 1) {
      failures.push(
        failure(
          expectation.name,
          'presence',
          `one element ${describeFinder(expectation)}`,
          `${observation.matched} elements matched, so the design cannot say which one it means`
        )
      );
      return;
    }

    const copy = expectedCopy(expectation);
    if (copy !== null) {
      const rendered = normaliseCopy(observation.text ?? '');
      if (rendered !== copy) {
        failures.push(
          failure(
            expectation.name,
            'copy',
            copy,
            rendered,
            observation.describe
          )
        );
      }
    }

    failures.push(...checkStyle(expectation, observation));
  });

  failures.push(...checkOrder(expectations, observations));

  return failures;
}

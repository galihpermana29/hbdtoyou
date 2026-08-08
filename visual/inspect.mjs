/**
 * Ask a rendered page what it actually is.
 *
 * This is the only part of the check that needs a browser. It finds each element
 * the design describes, and reports back the copy it renders, where it sits in
 * the document, and its computed style. It makes no judgement: deciding whether
 * any of that matches the design is `check.mjs`, which needs no browser at all.
 */

import { FINDER_KEYS } from './check.mjs';
import {
  ASSERTABLE_PROPERTIES,
  READABLE_PROPERTIES,
} from './style-vocabulary.mjs';

/** The longhands each assertable property is assembled from, as plain data. */
const propertyReads = Object.fromEntries(
  Object.entries(ASSERTABLE_PROPERTIES).map(([property, { read }]) => [
    property,
    read,
  ])
);

/**
 * Only the parts of an expectation that say how to find its element.
 *
 * Everything crossing into the page has to be plain data, and sending an
 * expectation whole would send the design's values along with it, which would
 * let the browser side decide something it has no business deciding.
 */
const asFinder = (expectation) => ({
  name: expectation.name,
  ...Object.fromEntries(
    FINDER_KEYS.map((key) => [key, expectation[key] ?? null])
  ),
});

/**
 * Observe every element a screen's expectations describe, in the same order.
 *
 * Returns one entry per expectation. `matched` is how many elements the finder
 * resolved to, so nothing and too many are told apart; the rest is filled in
 * only when exactly one did.
 */
export async function observe(page, expectations) {
  return page.evaluate(
    ({ finders, reads, readable }) => {
      // Repeated from check.mjs rather than imported: this function body is
      // serialised into the page, where nothing can be imported. The two must
      // agree, or an element could be located by one spelling of its copy and
      // then judged against another.
      const normaliseCopy = (text) => String(text).replace(/\s+/g, ' ').trim();

      const everyElement = Array.from(document.querySelectorAll('*'));
      const documentIndexes = new Map(
        everyElement.map((element, index) => [element, index])
      );

      /** Enough of an element to recognise it in a failure message. */
      const describe = (element) => {
        const id = element.id ? `#${element.id}` : '';
        const className =
          typeof element.className === 'string' && element.className.trim()
            ? `.${element.className.trim().split(/\s+/).join('.')}`
            : '';
        return `<${element.tagName.toLowerCase()}${id}${className}>`;
      };

      /**
       * An element nobody can see is not an element the design placed there.
       *
       * Hidden markup is skipped rather than compared, so a panel that is in the
       * DOM but collapsed reports as a missing element, which is what it is.
       * `display: none` leaves no box at all; `visibility: hidden` leaves one,
       * so it has to be asked about separately.
       */
      const isRendered = (element) =>
        element.getClientRects().length > 0 &&
        window.getComputedStyle(element).visibility !== 'hidden';

      /** Drop any candidate that wraps another, leaving the innermost. */
      const innermost = (candidates) =>
        candidates.filter(
          (candidate) =>
            !candidates.some(
              (other) => other !== candidate && candidate.contains(other)
            )
        );

      const inDocumentOrder = (candidates) =>
        [...new Set(candidates)].sort(
          (left, right) =>
            documentIndexes.get(left) - documentIndexes.get(right)
        );

      /**
       * The element a field's appearance is drawn on.
       *
       * A plain text input is the bordered box itself, so a label pointing at it
       * points at the thing worth measuring. Antd's date picker and select are
       * built differently: a bordered box wrapping a bare input, with the label
       * pointing at the input. That input has no border, corner, padding or
       * shadow of its own, so measuring it reports every one of those as absent
       * however correct the field looks on screen.
       *
       * Climb to the box instead. The picker draws its own border; the select
       * draws it on the inner selector, which is where `field-treatment.css`
       * puts it too.
       */
      const styledField = (control) => {
        if (!control) {
          return control;
        }
        const picker = control.closest('.ant-picker');
        if (picker) {
          return picker;
        }
        const select = control.closest('.ant-select');
        if (select) {
          return select.querySelector('.ant-select-selector') ?? select;
        }
        return control;
      };

      /**
       * The example a field shows while it is empty.
       *
       * The design writes one into every empty field, so it is design copy like
       * any other and a typo in it should fail rather than pass unread.
       *
       * Three places to look, because a field is not always the element holding
       * the attribute: a plain input carries its own, a date picker wraps one,
       * and a select draws its example as text rather than as a placeholder at
       * all.
       */
      const placeholderOf = (element) => {
        if (typeof element.placeholder === 'string' && element.placeholder) {
          return element.placeholder;
        }
        const inner = element.querySelector?.(
          'input[placeholder], textarea[placeholder]'
        );
        if (inner) {
          return inner.placeholder;
        }
        const drawn = element.querySelector?.(
          '.ant-select-selection-placeholder'
        );
        return drawn ? normaliseCopy(drawn.textContent) : '';
      };

      /** The form control a label of this copy is for. */
      const controlsLabelled = (copy) =>
        Array.from(document.querySelectorAll('label'))
          .filter((label) => normaliseCopy(label.textContent) === copy)
          .map((label) =>
            styledField(
              label.control ??
                (label.htmlFor ? document.getElementById(label.htmlFor) : null)
            )
          )
          .filter(Boolean);

      /**
       * The rendered copy closest to one the page does not have.
       *
       * A misspelled label matches nothing, and "nothing matched" on its own
       * sends a person hunting. Naming the nearest thing on the page turns that
       * into a copy they can read side by side with the design's.
       *
       * Closeness is how many words two copies share, ignoring case, rather than
       * how long a prefix they share. The differences worth catching are the
       * ones a person makes: a changed capital, an `and` for an `&`, a rewritten
       * ending. A prefix would miss every one of those.
       */
      const words = (text) =>
        text
          .toLowerCase()
          .split(/[^a-z0-9]+/i)
          .filter(Boolean);

      const nearestCopy = (wanted, scope) => {
        const wantedWords = words(wanted);
        if (wantedWords.length === 0) return null;

        let best = null;
        for (const element of scope) {
          if (element.children.length > 0 || !isRendered(element)) continue;
          const text = normaliseCopy(element.textContent);
          if (!text) continue;
          const theirs = words(text);
          const remaining = [...theirs];
          let shared = 0;
          for (const word of wantedWords) {
            const at = remaining.indexOf(word);
            if (at !== -1) {
              remaining.splice(at, 1);
              shared += 1;
            }
          }
          const closeness =
            shared / Math.max(wantedWords.length, theirs.length);
          if (closeness >= 0.5 && (!best || closeness > best.closeness)) {
            best = { closeness, text, describe: describe(element) };
          }
        }
        return best ? { text: best.text, describe: best.describe } : null;
      };

      const resolve = (finder) => {
        let candidates;
        if (finder.control) {
          candidates = controlsLabelled(normaliseCopy(finder.control));
        } else if (finder.select) {
          candidates = Array.from(document.querySelectorAll(finder.select));
        } else {
          candidates = everyElement;
        }

        candidates = candidates.filter(isRendered);

        if (finder.withText) {
          const wanted = normaliseCopy(finder.withText);
          candidates = innermost(
            candidates.filter(
              (element) => normaliseCopy(element.textContent) === wanted
            )
          );
        }

        return inDocumentOrder(candidates);
      };

      return finders.map((finder) => {
        const candidates = resolve(finder);
        const chosen =
          finder.nth === null
            ? candidates
            : candidates.slice(finder.nth, finder.nth + 1);

        if (chosen.length !== 1) {
          const observation = { name: finder.name, matched: chosen.length };
          if (chosen.length === 0 && finder.nth !== null) {
            observation.available = candidates.length;
          }
          if (chosen.length === 0 && finder.withText) {
            const scope = finder.select
              ? Array.from(document.querySelectorAll(finder.select))
              : everyElement;
            const nearest = nearestCopy(normaliseCopy(finder.withText), scope);
            if (nearest) observation.nearest = nearest;
          }
          return observation;
        }

        const element = chosen[0];
        const computed = window.getComputedStyle(element);
        const longhands = Object.fromEntries(
          readable.map((property) => [property, computed[property]])
        );
        const style = Object.fromEntries(
          Object.entries(reads).map(([property, sides]) => [
            property,
            sides.map((side) => longhands[side]).join(' '),
          ])
        );

        return {
          name: finder.name,
          matched: 1,
          documentIndex: documentIndexes.get(element),
          describe: describe(element),
          text: normaliseCopy(element.textContent),
          placeholder: placeholderOf(element),
          style,
        };
      });
    },
    {
      finders: expectations.map(asFinder),
      reads: propertyReads,
      readable: READABLE_PROPERTIES,
    }
  );
}

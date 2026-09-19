/**
 * Positions counted down a page, derived rather than written down.
 *
 * A screen finds most of its elements by where they sit among their kind - the
 * fourth label on the form, the ninth paragraph of the invitation - and the
 * check counts those in document order rather than with `:nth-of-type`, which
 * counts among siblings and would mean something else the moment anything was
 * wrapped in anything.
 *
 * Writing such a number down is the trap this exists to close. A field added to
 * an early Section, or a line added to an early part of a page, would move every
 * position after it, and a manifest full of literals would then report failures
 * against the wrong elements. So a screen declares what it holds, in order, and
 * asks for each by name.
 *
 * Two things make that safe, and both are the reason this is shared rather than
 * written twice:
 *
 * A name that is not in the list it is asked of throws, rather than resolving to
 * `-1` and silently becoming "the last one on the page", which would fail
 * somewhere else entirely.
 *
 * A name declared and never asked for throws too, at the end. Nothing in the
 * language reconciles the list a screen declares with the expectations it goes
 * on to write, and a name in one and not the other would shift every position
 * after it - so it is caught as one error naming the name, instead of as a page
 * of failures about innocent elements.
 */

/**
 * Count positions within named lists.
 *
 * `lists` is one entry per kind of thing the screen counts - `{labels, groups}`,
 * `{paragraphs}` - each an array of names in the order the page draws them. The
 * kind's key is what a failure calls it, so it reads as the design's word for
 * those things rather than as a variable name.
 */
export function declaredPositions(lists) {
  const askedFor = new Set();

  const at = (kind, name) => {
    const declared = lists[kind];
    if (!declared) {
      throw new Error(
        `"${kind}" is not something this screen declares. It declares: ${Object.keys(lists).join(', ')}`
      );
    }
    const nth = declared.indexOf(name);
    if (nth === -1) {
      throw new Error(`"${name}" is not one of this screen's ${kind}`);
    }
    askedFor.add(`${kind}: ${name}`);
    return nth;
  };

  const everythingWasAskedFor = () => {
    const unasked = Object.entries(lists)
      .flatMap(([kind, names]) => names.map((name) => `${kind}: ${name}`))
      .filter((declared) => !askedFor.has(declared));
    if (unasked.length > 0) {
      throw new Error(
        `${unasked.join(', ')} - declared by this screen and never asked for, ` +
          'so every position after it would be counted one too far'
      );
    }
  };

  return { at, everythingWasAskedFor };
}

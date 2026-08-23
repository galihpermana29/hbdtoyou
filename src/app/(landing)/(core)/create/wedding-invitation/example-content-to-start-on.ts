import type { WeddingTemplate1Content } from '@/components/forms/wedding/wedding-invitation-types';
import { exampleContent } from '@/components/wedding/wedding-template-1/example-content';

/**
 * Starting the Create Flow on Example Content somebody already wrote.
 *
 * Filling this flow in by hand takes a wedding's worth of answers, and most of
 * what anybody wants to look at - a step's layout, the Site Preview, what a
 * save sends - is behind all of them. `?default=true` hands the form the
 * Showcase's Example Content instead, so the flow opens on a wedding that is
 * already written and whoever is looking gets to the part they came for.
 *
 * Nobody's wedding. This is the same Example Content the Showcase and the
 * visual check render, which is exactly why it is safe to type into a form
 * that can be saved: it was written to be looked at.
 *
 * A named set can be asked for by name - `?default=hostile` is the one written
 * to be awkward on purpose, and the fastest way to see whether a step survives
 * long names and missing photographs. `exampleContent` already answers an
 * unknown name with the flattering set, so `true` means the flattering set
 * without this having to say so.
 *
 * The query is spelled `default` because that is what the owner asked to type,
 * and a URL somebody has to remember is worth more than a consistent one. The
 * word is only in the URL: the glossary keeps `default` away from both Prefill
 * and Fallback, so nothing in this file's names borrows it.
 */
export const START_ON_EXAMPLE_PARAM = 'default';

/** What `?default=` off, rather than a set's name, is spelled as. */
const OFF = new Set(['', 'false', '0', 'no', 'off']);

/**
 * The Example Content a query asks the flow to start on, or nothing.
 *
 * Off in production, and refused outright anywhere but a server. The check is
 * the server's own `APP_ENV`, which a browser never has: read from a client
 * component the variable would be undefined, the production test would pass by
 * accident, and a couple making their real invitation would be handed somebody
 * else's words. So the absence of a server is a no rather than a yes, and this
 * stays a server-only question. Staging is what it is for, and the flip is the
 * same one every backend call in this app already makes.
 */
export function exampleContentToStartOn(
  asked: string | string[] | undefined
): WeddingTemplate1Content | null {
  if (asked === undefined) return null;
  if (typeof window !== 'undefined') return null;
  if (process.env.APP_ENV === 'production') return null;

  // A repeated parameter is read as the last one given, which is what a person
  // editing a URL by hand means by it - the same reading `exampleContent` does,
  // and the value handed on so both answer the same question about it.
  const last = Array.isArray(asked) ? asked[asked.length - 1] : asked;
  if (OFF.has(last.trim().toLowerCase())) return null;

  return { ...exampleContent(last), mapsUrl: EXAMPLE_MAP_EMBED };
}

/**
 * A map for the venue, added here rather than to the Example Content itself.
 *
 * Every set leaves `mapsUrl` empty on purpose: the Venue Details Section draws
 * its View Location control as a link when there is a URL and as artwork when
 * there is not, so a set that filled it in would differ from the others in
 * structure rather than in length, which is the one thing the three sets exist
 * to vary. That reasoning is about rendering an invitation, and this is about
 * filling in a form: the field is required, so Example Content without it
 * cannot reach step three, and a flow that stops halfway is no use to somebody
 * who asked not to type.
 *
 * So the Showcase keeps its invariant and the form gets a venue, and the two
 * uses stop being the same object.
 */
const EXAMPLE_MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4!2d106.8317!3d-6.1937';

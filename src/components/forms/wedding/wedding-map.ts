/**
 * The map a couple pastes, turned into something the invitation can draw.
 *
 * Google Maps hands over a block of markup under Share, Embed a map, Copy HTML.
 * What is kept out of it is the address inside its `src`, and nothing else.
 *
 * The markup is never rendered. A couple's invitation is opened by strangers,
 * and putting user-supplied markup into that page is an injection hole: a
 * pasted `<script>` or an `onload` would run in every guest's browser. Taking
 * the address out and building a fresh iframe from it keeps the paste as data.
 *
 * A bare embed address is accepted too, because plenty of people paste that
 * instead of the whole block.
 */

/**
 * The hosts a Google Maps embed can come from.
 *
 * Country domains are included deliberately. An Indonesian couple's desktop
 * link is `google.co.id`, and a rule that only knew `google.com` would reject
 * the most likely paste in the market this product serves.
 */
function isGoogleMapsEmbed(address: string): boolean {
  let url: URL;
  try {
    url = new URL(address);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;

  const host = url.hostname.toLowerCase();
  const isGoogleHost =
    /^(www\.)?google\.[a-z.]{2,}$/.test(host) ||
    /^maps\.google\.[a-z.]{2,}$/.test(host);

  return isGoogleHost && url.pathname.startsWith('/maps/embed');
}

/**
 * The embed address inside whatever was pasted, or nothing.
 *
 * Parsed by hand rather than by putting the markup into a document. Handing it
 * to `DOMParser` would be safe in itself, but it invites the next person to
 * reach for `innerHTML` a line later, and the whole point here is that this
 * markup never becomes markup.
 */
export function mapEmbedFrom(pasted: string): string | null {
  const text = pasted.trim();
  if (text === '') return null;

  // A bare address, pasted without the markup around it.
  if (!text.includes('<')) {
    return isGoogleMapsEmbed(text) ? text : null;
  }

  const src = text.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  const address = (src?.[1] ?? src?.[2] ?? '').trim();
  if (address === '') return null;

  return isGoogleMapsEmbed(address) ? address : null;
}

/**
 * Where to send a guest who wants directions.
 *
 * Built from the written address rather than from what was pasted, because an
 * embed address opens a stripped map with no directions and no way to start
 * them. This opens the venue in whatever maps application the guest already
 * uses, which is the thing they actually want from that control.
 */
export function directionsTo(address: string): string {
  const venue = address.trim();
  if (venue === '') return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
}

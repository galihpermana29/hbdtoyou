/**
 * The Background Track catalog: every song a couple can pick from, and the one
 * place that knows where each is hosted.
 *
 * Static and frontend-owned on purpose (hbd-61o, decided 2026-08-09). Spotify
 * is ruled out for playback - full tracks need every listener's own Premium
 * login, preview URLs are shut off for new apps, and the iframe embed is a
 * branded widget rather than background music - so the invitation plays a
 * Cloudinary-hosted mp3 through a plain audio element, the way vinylv1 already
 * does. A backend catalog endpoint stays a later ask.
 *
 * Append to this list; do not remove from it or edit an entry's url. The
 * catalog is only how a couple picks: the saved record carries the whole track
 * - see `WeddingTemplate1Content.backgroundTrack` - so a published invitation
 * never reads this list again. What removal would break is the Create Flow
 * opened on a saved record, which finds the couple's track here by its url to
 * show it as the selected option.
 */

/** One song a couple can play behind their invitation. */
export interface WeddingBackgroundTrack {
  title: string;
  artist: string;
  url: string;
}

/**
 * The one track the catalog serves today: the sample invitation's, and the
 * song the retired id-only catalog's first slug stood for.
 */
export const MENCINTAIMU: WeddingBackgroundTrack = {
  title: 'Mencintaimu',
  artist: 'Sal Priadi',
  url: 'https://res.cloudinary.com/dztygf08a/video/upload/v1775312959/Sal_Priadi_-_Mencintaimu_Official_Audio_afbgj8.mp3',
};

// One entry, not by design. hbd-61o named a second - Semo, "The Last Dance",
// at res.cloudinary.com/braiwjaya-university/video/upload/v1763140918/
// Semo_-_The_Last_Dance_e016fm.mp3 - but that cloud answers every request
// "cloud_name braiwjaya-university is disabled" (checked 2026-08-09), and a
// catalog entry that cannot play is the spinning-record-over-silence that
// ticket exists to kill. Re-hosting it on a live cloud is `hbd-wkg`; add it
// back here, url and all, once it serves.
export const BACKGROUND_TRACK_CATALOG: WeddingBackgroundTrack[] = [
  MENCINTAIMU,
];

/**
 * The catalog as the Cover Header's select offers it, searched by artist or by
 * song as the design's placeholder says. The value is the track's url - its
 * one stable identity - rather than an index into a list that can reorder.
 */
export const BACKGROUND_TRACK_OPTIONS = BACKGROUND_TRACK_CATALOG.map(
  (track) => ({
    label: `${track.artist} - ${track.title}`,
    value: track.url,
  })
);

/** The catalog entry a picked url names, or null when it names none. */
export function backgroundTrackByUrl(
  url: string | undefined
): WeddingBackgroundTrack | null {
  return BACKGROUND_TRACK_CATALOG.find((track) => track.url === url) ?? null;
}

/**
 * What the retired id-only catalog's slugs meant, for records saved while the
 * chosen track was stored as `backgroundMusicId`.
 *
 * Only one of the three old slugs ever had an audio file behind it. The other
 * two were labels over nothing, so a record carrying one has no song to play
 * and reads back as no track rather than as a broken player.
 */
const LEGACY_TRACK_IDS: Record<string, WeddingBackgroundTrack> = {
  'sal-priadi-mencintaimu': MENCINTAIMU,
};

/** The track a retired `backgroundMusicId` slug stood for, or null. */
export function backgroundTrackFromLegacyId(
  id: string | undefined
): WeddingBackgroundTrack | null {
  return (id && LEGACY_TRACK_IDS[id]) || null;
}

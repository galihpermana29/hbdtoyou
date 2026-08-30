import dayjs from 'dayjs';

import type { IMemorollPayload } from '@/action/interfaces';
import type { MemorollDraft } from '@/components/memoroll/creator/draft';
import { serializeMemorollRecord } from '@/lib/memoroll-record';

/**
 * The creator's answers, turned into the one payload the flow ever sends.
 *
 * The mapping the 2026-08-29 session settled:
 *
 * - The event's one name goes to both `title` and `host_name`. The gallery's
 *   unauthenticated preview returns only `host_name`, so that is what every
 *   guest surface reads; `title` keeps the content row and the owner listing
 *   from being nameless.
 * - `ends_at` is `reveal_at`. Shooting runs to the Reveal (CONTEXT.md), the
 *   backend's countdown phase never occurs, and the creator is never asked a
 *   third time question the design does not draw.
 * - vibe, venue, address and the geofence switch have no backend fields and
 *   travel in `detail_content_json_text` - see `memoroll-record.ts`.
 * - `cover_style` is the design's own three words, sent as they are.
 */

/**
 * The day a creator typed, read the way the design writes it: `03/05/2026`
 * is the third of May - DD/MM/YYYY, confirmed by the gallery frame heading
 * the same event "May 3". An ISO day is taken too, so a prefilled value
 * survives being left untouched.
 */
function parseDay(raw: string): dayjs.Dayjs | null {
  const trimmed = raw.trim();
  const slashes = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (slashes) {
    const [, day, month, year] = slashes;
    const parsed = dayjs(
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    );
    return parsed.isValid() ? parsed : null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parsed = dayjs(trimmed);
    return parsed.isValid() ? parsed : null;
  }
  return null;
}

/**
 * The hour a creator typed: the design's `07:15 PM`, or a plain `19:15`.
 * Answered as minutes past midnight, or null for anything else.
 */
function parseHour(raw: string): number | null {
  const trimmed = raw.trim();
  const twelve = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(trimmed);
  if (twelve) {
    const hours = Number(twelve[1]);
    const minutes = Number(twelve[2]);
    if (hours < 1 || hours > 12 || minutes > 59) return null;
    const half = twelve[3].toLowerCase() === 'pm' ? 12 : 0;
    return ((hours % 12) + half) * 60 + minutes;
  }
  const twentyFour = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (twentyFour) {
    const hours = Number(twentyFour[1]);
    const minutes = Number(twentyFour[2]);
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }
  return null;
}

/**
 * A day and an hour as the moment they name, written the way the wedding
 * writes its own: with Jakarta's offset on it, because that is where the
 * product's events are and a bare stamp would move by the browser's zone.
 */
function momentIso(day: string, hour: string): string | null {
  const parsedDay = parseDay(day);
  const minutes = parseHour(hour);
  if (!parsedDay || minutes === null) return null;
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return `${parsedDay.format('YYYY-MM-DD')}T${hh}:${mm}:00+07:00`;
}

export type PayloadBuilt =
  | { payload: Omit<IMemorollPayload, 'template_id'> }
  | { problem: string };

/**
 * Everything the create call needs except the template, which is resolved at
 * the moment of publishing, or the one sentence saying what stops it.
 *
 * The problems here are the flow's own to catch before the backend is asked:
 * a schedule that does not parse, and a reveal that comes before the opening.
 * Everything the backend refuses - credit, a raced wedding link - is its
 * answer to the send, not this function's.
 */
export function buildMemorollPayload(
  draft: MemorollDraft,
  weddingId: string | null
): PayloadBuilt {
  const startsAt = momentIso(draft.opensOn, draft.opensAt);
  if (!startsAt) {
    return {
      problem:
        'The roll needs an opening date and hour - pick both on the TIme step.',
    };
  }

  const revealAt = momentIso(draft.revealOn, draft.revealAt);
  if (!revealAt) {
    return {
      problem:
        'The roll needs a reveal date and hour - pick both on the Reveal timing step.',
    };
  }

  if (!dayjs(revealAt).isAfter(dayjs(startsAt))) {
    return {
      problem: 'The reveal has to come after the roll opens.',
    };
  }

  const name = draft.eventName.trim();
  if (!name) {
    return { problem: 'The roll needs a name before it can be published.' };
  }

  return {
    payload: {
      title: name,
      host_name: name,
      wedding_id: weddingId ?? undefined,
      detail_content_json_text: serializeMemorollRecord({
        vibe: draft.vibe,
        venue: draft.venue.trim(),
        address: draft.address.trim(),
        onlyAtTheVenue: draft.onlyAtTheVenue,
      }),
      starts_at: startsAt,
      ends_at: revealAt,
      reveal_at: revealAt,
      shot_limit: draft.shotsPerGuest,
      cover_style: draft.coverStyle,
      cover_photo_urls: draft.photos.filter(
        (photo): photo is string => typeof photo === 'string' && photo !== ''
      ),
    },
  };
}

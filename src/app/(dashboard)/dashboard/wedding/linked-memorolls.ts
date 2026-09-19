import { listOwnedMemorollEvents } from '@/action/memoroll-api';

/**
 * Which of a person's weddings already has its MemoRoll, and where that
 * memoroll's guests go.
 *
 * One wedding, one active memoroll - the backend enforces it with
 * `WEDDING_ALREADY_LINKED` - so each card needs exactly one answer: create,
 * or open the one that exists. The contents listing the cards are drawn from
 * does not carry it (a backend ask from 2026-08-29 would add it), so the
 * answer comes from the memoroll listing instead: one call for the whole
 * screen, matched by `wedding_id` here, rather than a `GET /wedding/{id}`
 * per card.
 *
 * The listing pages, and this reads one generous page. A person with more
 * than a hundred memorolls would get cards offering to create what exists -
 * the backend's refusal still stands behind them - and that person does not
 * exist yet.
 */
const MEMOROLLS_PER_PAGE = 100;

/** The one status that stands a link down: an archived memoroll frees its wedding. */
const ARCHIVED = 'archived';

/** What a card needs of its wedding's memoroll: the console's id, the guests' code. */
export interface LinkedMemoroll {
  id: string;
  code: string;
}

/**
 * Each wedding's active memoroll, by wedding id - the event's own id for the
 * owner console, and its code for the guest page.
 *
 * Empty when the listing cannot be read: a card that cannot know says
 * "create", and the backend refuses the ones that should not, which is the
 * same net the two-tabs race already relies on.
 */
export async function linkedMemorolls(): Promise<
  Record<string, LinkedMemoroll>
> {
  const events = await listOwnedMemorollEvents(String(MEMOROLLS_PER_PAGE), '1');
  if (!events.success || !events.data) return {};

  const byWedding: Record<string, LinkedMemoroll> = {};
  for (const event of events.data) {
    if (!event.wedding_id || event.status === ARCHIVED) continue;
    byWedding[event.wedding_id] = { id: event.id, code: event.code };
  }
  return byWedding;
}

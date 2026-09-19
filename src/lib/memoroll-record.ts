import type { Vibe } from '@/components/memoroll/creator/draft';

/**
 * What a memoroll event's `detail_content_json_text` carries.
 *
 * The backend's own fields hold the schedule, the shots, the cover and the
 * names; everything else the creator answers travels in this blob, which the
 * backend stores opaquely and hands back verbatim. The frontend owns this
 * schema - both surfaces read and write it through here, so the two ends
 * cannot drift.
 *
 * `onlyAtTheVenue` is stored exactly as answered and enforced by nothing yet:
 * the 500m rule needs coordinates nobody collects, and shipping the stored
 * answer now means enforcement can arrive later with no migration. Decided
 * 2026-08-29.
 */
export interface MemorollRecord {
  vibe: Vibe;
  venue: string;
  address: string;
  onlyAtTheVenue: boolean;
}

const VIBES: Vibe[] = ['wedding', 'birthday', 'moments'];

export function serializeMemorollRecord(record: MemorollRecord): string {
  return JSON.stringify(record);
}

/**
 * The record as it was actually stored, or null when there is nothing there.
 *
 * Absent fields read back as absent-shaped values - empty strings, the first
 * vibe, an off switch - rather than throwing, because the gallery does not
 * send this blob yet (asked for on 2026-08-29) and a guest surface reading
 * nothing must render the event without its venue rather than fall over.
 */
export function memorollRecordFrom(
  stored: string | null | undefined
): MemorollRecord | null {
  if (!stored) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;

  const record = parsed as Partial<MemorollRecord>;
  return {
    vibe: VIBES.includes(record.vibe as Vibe) ? (record.vibe as Vibe) : VIBES[0],
    venue: typeof record.venue === 'string' ? record.venue : '',
    address: typeof record.address === 'string' ? record.address : '',
    onlyAtTheVenue: record.onlyAtTheVenue === true,
  };
}

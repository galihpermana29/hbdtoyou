import dayjs from 'dayjs';

import type { IOwnedWeddingInvitationResponse } from '@/action/interfaces';
import {
  COVER_SLOTS,
  FEWEST_SHOTS,
  type MemorollDraft,
} from '@/components/memoroll/creator/draft';
import { weddingContentFrom } from '@/components/forms/wedding/wedding-invitation-types';

/**
 * What the creator flow opens on when nobody arrived with a wedding: nothing
 * answered, every field the creator's to fill. The vibe sits on the first
 * option the way the step draws it, and the shots on the floor the design
 * draws the minus grey at - both are where the controls rest, not answers.
 */
export function blankMemorollDraft(): MemorollDraft {
  return {
    vibe: 'wedding',
    eventName: '',
    coverStyle: 'collage',
    photos: Array<string | null>(COVER_SLOTS).fill(null),
    opensOn: '',
    opensAt: '',
    venue: '',
    address: '',
    onlyAtTheVenue: false,
    shotsPerGuest: FEWEST_SHOTS,
    revealOn: '',
    revealAt: '',
  };
}

/** The date picker's own spelling: `YYYY-MM-DD` (the fields are native
 *  pickers since 2026-08-30). */
function dayFromIso(iso: string | undefined): string {
  const day = (iso ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return '';
  const parsed = dayjs(day);
  return parsed.isValid() ? day : '';
}

/** The time picker's own spelling: `HH:mm`, which is also how the wedding
 *  stores it - validated and passed through. */
function hourFromStored(time: string | undefined): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec((time ?? '').trim());
  if (!match) return '';
  const hours = Number(match[1]);
  if (hours > 23 || Number(match[2]) > 59) return '';
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
}

/**
 * The creator flow's opening answers, prefilled from the wedding that sent
 * the couple here.
 *
 * Prefill in the glossary's sense: theirs from the moment the flow opens,
 * editable and clearable, saved exactly like anything they typed. A wedding
 * field that is empty prefills nothing - no fallbacks invented - so the
 * blank draft underneath shows through wherever the invitation had nothing
 * to say.
 *
 * What maps where (settled 2026-08-29):
 * - the couple's nicknames name the roll, `{Groom} & {Bride}`, the same
 *   order the invitation titles itself
 * - the wedding's day and start time open it
 * - the venue and address are the fields whose hint already says
 *   "We get this from your digital invitation"
 * - the Photo Collection fills the cover's slots
 * - the reveal is not prefilled: the wedding has nothing to say about it
 */
export function draftFromWedding(
  wedding: IOwnedWeddingInvitationResponse
): MemorollDraft {
  const draft = blankMemorollDraft();
  const content = weddingContentFrom(wedding.detail_content_json_text);
  if (!content) return draft;

  const groom = content.groomName?.trim() ?? '';
  const bride = content.brideName?.trim() ?? '';
  if (groom && bride) draft.eventName = `${groom} & ${bride}`;

  draft.opensOn = dayFromIso(content.weddingDateIso);
  draft.opensAt = hourFromStored(content.eventStartTime);
  draft.venue = content.venueName?.trim() ?? '';
  draft.address = content.address?.trim() ?? '';

  const photos = (content.galleryPhotos ?? [])
    .filter((photo) => typeof photo === 'string' && photo.trim() !== '')
    .slice(0, COVER_SLOTS);
  draft.photos = [
    ...photos,
    ...Array<string | null>(COVER_SLOTS - photos.length).fill(null),
  ];

  return draft;
}

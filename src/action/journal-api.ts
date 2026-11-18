'use server';

import { unstable_cache } from 'next/cache';

import type { IContent } from '@/action/interfaces';
import { toJournalCard, type JournalCardData } from '@/lib/journal-card';

const baseUri =
  process.env.APP_ENV === 'production'
    ? process.env.API_URI
    : process.env.STAGING_API;

/** The journal template: every journal is a content row made from it. */
const JOURNAL_TEMPLATE_ID = '2d4df00e-e773-4391-ad6a-1b6d688950ff';

/** How many cards arrive with the page; the rest come when asked for. */
const FIRST_CARDS = 24;

/**
 * Every journal on the published list, as cards, newest first as the
 * backend returns them.
 *
 * The backend's answer is the journals in full and too large for Next's
 * fetch cache (over 2 MB), so every visit used to wait for it. The cards
 * are a fraction of that, so it is the cards that are kept, for a minute.
 * The list is the same for every visitor: no session is sent.
 */
const journalCards = unstable_cache(
  async (): Promise<JournalCardData[]> => {
    const params = new URLSearchParams({
      limit: '9999',
      page: '1',
      template_id: JOURNAL_TEMPLATE_ID,
    });
    const res = await fetch(`${baseUri}/contents?${params}`, {
      headers: { 'Content-Type': 'application/json', 'X-Source': 'web' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`journals: ${res.status}`);
    const body: { data?: IContent[] } = await res.json();
    return (body.data ?? [])
      .filter((content) => content.template_name?.includes('journal'))
      .map(toJournalCard)
      .filter((card): card is JournalCardData => card !== null);
  },
  ['published-journal-cards'],
  { revalidate: 60, tags: ['dashboard-content'] }
);

async function cards(): Promise<JournalCardData[]> {
  try {
    return await journalCards();
  } catch {
    // The landing still has to draw when the backend does not answer.
    return [];
  }
}

/** What the journal landing draws first: a page of cards and the count. */
export async function getJournalListStart(): Promise<{
  first: JournalCardData[];
  total: number;
}> {
  const all = await cards();
  return { first: all.slice(0, FIRST_CARDS), total: all.length };
}

/** The whole list, for "show more" and for the search. */
export async function getAllJournalCards(): Promise<JournalCardData[]> {
  return cards();
}

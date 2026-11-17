'use server';

import type { InspirationItem, InspirationPage } from '@/lib/inspiration';
import { labelOf, routeOf } from '@/lib/inspiration';
import { mapContentToCard } from '@/lib/utils';

import { getLatestInspiration } from './user-api';

/**
 * One page of the inspiration wall, ready to draw.
 *
 * Owner, 2026-11-17: some gifts' pictures have since been deleted from
 * Cloudinary, and a broken thumbnail has no place on this page. So every
 * picture is asked for (a HEAD, nothing downloaded) before its card is
 * sent, and a card whose picture is gone is left out. One whole Cloudinary
 * cloud answers 401 now, about one card in ten on staging.
 *
 * - An answer that says the picture is gone (4xx) drops the card.
 * - No answer in time, or a network error, keeps it: the browser asks again
 *   and the card hides itself if the picture really is not there.
 * - Answers are remembered for as long as this server instance lives.
 */

const PER_PAGE = 24;
const ASK_TIMEOUT_MS = 2500;
const REMEMBERED_MAX = 5000;
const remembered = new Map<string, boolean>();

async function pictureExists(url: string): Promise<boolean> {
  const known = remembered.get(url);
  if (known !== undefined) return known;
  let exists = true;
  try {
    const answer = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(ASK_TIMEOUT_MS),
      cache: 'no-store',
    });
    exists = !(answer.status >= 400 && answer.status < 500);
  } catch {
    // Slow or unreachable is not "gone": do not remember it either.
    return true;
  }
  if (remembered.size >= REMEMBERED_MAX) remembered.clear();
  remembered.set(url, exists);
  return exists;
}

/** A journal's abstract is rich text; the card shows words only. */
function plain(html: unknown): string {
  return String(html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

async function oneFeed(
  page: number,
  limit: number,
  templateId?: string,
  keyword?: string
): Promise<InspirationPage> {
  const response = await getLatestInspiration(
    limit,
    page,
    templateId,
    keyword ? encodeURIComponent(keyword) : undefined
  );
  if (!response.success || !response.data) return { items: [], hasMore: false };

  // The site's own mapping decides what is public and which picture leads.
  const cards = mapContentToCard(response.data.data as never[]).filter(
    Boolean
  ) as Array<Record<string, unknown>>;

  const items = await Promise.all(
    cards.map(async (card): Promise<InspirationItem | null> => {
      const route = routeOf(card.template_name as string);
      const label = labelOf(route);
      const title = String(card.title ?? '').trim();
      if (!label || !title) return null;
      const base = {
        id: String(card.id),
        title,
        link: String(card.link),
        label,
        route,
      };

      if (route === 'journal') {
        let detail: Record<string, unknown> = {};
        try {
          detail = JSON.parse(String(card.detail_content_json_text ?? '{}'));
        } catch {
          return null;
        }
        return {
          ...base,
          journal: {
            volume: String(detail.volume ?? ''),
            author: String(detail.author ?? ''),
            abstract: plain(detail.abstract),
          },
        };
      }

      const image = card.jumbotronImage;
      if (typeof image !== 'string' || !/^https?:\/\//.test(image)) return null;
      return (await pictureExists(image)) ? { ...base, image } : null;
    })
  );

  return {
    items: items.filter((item): item is InspirationItem => item !== null),
    hasMore: page < response.data.meta.totalPage,
  };
}

export async function getInspirationPage({
  page,
  templateIds = [],
  keyword,
}: {
  page: number;
  /** None: everything. Several: a chip that covers several templates. */
  templateIds?: string[];
  keyword?: string;
}): Promise<InspirationPage> {
  if (templateIds.length <= 1) {
    return oneFeed(page, PER_PAGE, templateIds[0], keyword);
  }
  // The backend filters by one template at a time, so a chip of several
  // (the scrapbooks) asks each for its share and deals them out in turn.
  const share = Math.ceil(PER_PAGE / templateIds.length);
  const feeds = await Promise.all(
    templateIds.map((id) => oneFeed(page, share, id, keyword))
  );
  const items: InspirationItem[] = [];
  for (let turn = 0; turn < share; turn++) {
    for (const feed of feeds) {
      if (feed.items[turn]) items.push(feed.items[turn]);
    }
  }
  return { items, hasMore: feeds.some((feed) => feed.hasMore) };
}

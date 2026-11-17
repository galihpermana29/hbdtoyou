import type { IAllTemplateResponse } from '@/action/interfaces';

/**
 * What the inspiration page shows, and how it names things.
 *
 * A card is the little the page needs to draw it. The backend row carries
 * the whole gift (`detail_content_json_text`, every photo and word in it);
 * none of that is sent to the browser for a thumbnail.
 */
export interface InspirationItem {
  id: string;
  title: string;
  /** Where it opens: `/netflixv1/<id>`, `/journal/<id>`. */
  link: string;
  /** What kind of gift, as the page words it: "Scrapbook". */
  label: string;
  /** The template's route, for the card's proportions. */
  route: string;
  /** A picture that was there when the page asked. Journals have none. */
  image?: string;
  /** A journal is drawn as its own paper, from these. */
  journal?: { volume: string; author: string; abstract: string };
}

export interface InspirationPage {
  items: InspirationItem[];
  hasMore: boolean;
}

/** A filter chip: one name, the template ids behind it. */
export interface InspirationFilter {
  key: string;
  label: string;
  templateIds: string[];
}

/**
 * The page's own word for each template that can appear on it. A template
 * not named here has no thumbnail to show (`mapContentToCard` in
 * lib/utils.ts has no picture for it), so it gets no chip either.
 *
 * The eight scrapbook designs share one word, and one chip.
 */
const NAMES: Record<string, string> = {
  netflixv1: 'Series',
  disneyplusv1: 'Movie',
  spotifyv1: 'Playlist',
  magazinev1: 'Magazine',
  newspaperv1: 'Newspaper',
  newspaperv3: 'Front page',
  vinylv1: 'Vinyl',
  boardofusv1: 'Board of Us',
  arcadeclawv1: 'Claw of Us',
  f1historyv1: 'Race history',
  albumgraduation1: 'Graduation album',
  'photobox-newspaper': 'Photobox',
  journal: 'Journal',
};

/** A template's route, from its backend name: "Netflix v1 - netflixv1". */
export function routeOf(templateName?: string): string {
  const name = templateName ?? '';
  if (name.includes('photobox-newspaper')) return 'photobox-newspaper';
  return name.split(' - ')[1]?.trim() ?? '';
}

export function labelOf(route: string): string | undefined {
  if (/^scrapbook\d+$/.test(route)) return 'Scrapbook';
  return NAMES[route];
}

/** The chips, in the order the templates come, one per word. */
export function filtersFor(
  templates: IAllTemplateResponse[] | null | undefined
): InspirationFilter[] {
  const filters: InspirationFilter[] = [];
  for (const template of templates ?? []) {
    const label = labelOf(routeOf(template.name));
    if (!label) continue;
    const existing = filters.find((filter) => filter.label === label);
    if (existing) existing.templateIds.push(template.id);
    else {
      filters.push({
        key: label.toLowerCase().replace(/\s+/g, '-'),
        label,
        templateIds: [template.id],
      });
    }
  }
  return filters;
}

import type { IContent } from '@/action/interfaces';

/**
 * What a card in the published-journals list shows, and nothing else.
 *
 * A journal is a whole letter: preamble, introduction, two abstracts. The
 * list used to be sent every journal in full (2.9 MB of page for 846 of
 * them, 2026-11-18), including the ones their authors had taken off the
 * list, which were only hidden in the browser. A card needs six short
 * fields, so the server now makes cards and sends those.
 */
export interface JournalCardData {
  id: string;
  volume: string;
  date: string;
  title: string;
  /** HTML, as the author's editor wrote it. Long ones are cut to plain text. */
  abstract: string;
  author: string;
  /** Who it is for and who wrote it, lowercased: what the search reads. */
  names: string;
}

/** A card shows three lines of the abstract; this is far more than fits. */
const ABSTRACT_MAX = 600;
const ABSTRACT_CUT = 320;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** An abstract short enough is kept as written; a long one is cut as text. */
function cardAbstract(html: unknown): string {
  if (typeof html !== 'string') return '';
  if (html.length <= ABSTRACT_MAX) return html;
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Entities left in the text (&amp;) are already HTML; only stray angle
  // brackets need escaping, and the tag strip above leaves none paired.
  return `${escapeHtml(text.slice(0, ABSTRACT_CUT)).replace(/&amp;(\w+;)/g, '&$1')}…`;
}

const text = (value: unknown) => (typeof value === 'string' ? value : '');

/**
 * The card of a journal, or null when it is not for the list: its author
 * took it off (`isPublic: false`), or it cannot be read.
 */
export function toJournalCard(content: IContent): JournalCardData | null {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(content.detail_content_json_text);
  } catch {
    return null;
  }
  if (!data || data.isPublic === false) return null;
  return {
    id: content.id,
    volume: text(data.volume),
    date: text(data.date),
    title: text(data.title),
    abstract: cardAbstract(data.abstract),
    author: text(data.author),
    names: `${text(data.destinationName)} ${text(data.author)}`.toLowerCase(),
  };
}

import type { IAllTemplateResponse } from '@/action/interfaces';
import { templateRoute, templateThumbnail } from '@/lib/template-thumbnail';

/**
 * The template the home page shows off as new (owner, 2026-11-18): a pill
 * over the hero's headline and a "Just dropped" section under the hero.
 *
 * WHICH template is the owner's to say, from the admin dashboard, without
 * a deploy: the one tagged `New`. A template record carries no date, so
 * "the newest" cannot be worked out; a tag can be given and taken away.
 * Nothing tagged: neither the pill nor the section is drawn.
 *
 * WHAT is said about it lives here, because the backend has no field for
 * it. A template without an entry below still shows, with its catalogue
 * thumbnail and a plain line; one with an entry gets its own words and,
 * when it is playable, the gift itself in a phone to try on the spot.
 */
export interface NewTemplate {
  id: string;
  route: string;
  name: string;
  /** One line under the name. */
  says: string;
  /** A longer line for the section. */
  body: string;
  /** The gift's own sample page, to open or to play in the phone. */
  sample: string;
  /** A phone-shaped still of the gift; without one, the catalogue art. */
  poster?: string;
  thumbnail?: string;
  /** Whether the sample can be played inside the phone on the page. */
  playable: boolean;
}

const WORDS: Record<
  string,
  Pick<NewTemplate, 'says' | 'body' | 'playable'> & { poster?: string }
> = {
  rollofusv1: {
    says: 'A camera they wind and shoot',
    body: 'They wind the film, press the shutter, and every flash develops one of your photos, date stamp and all. The last frame comes with your letter.',
    poster: '/home/new-rollofusv1.webp',
    playable: true,
  },
  boardofusv1: {
    says: 'A board game of your memories',
    body: 'They roll the die and travel a little board where every square is a moment of yours, with a message waiting at the finish.',
    poster: '/home/new-boardofusv1.webp',
    playable: true,
  },
  arcadeclawv1: {
    says: 'A claw machine full of memories',
    body: 'Three grabs at a claw machine, and every capsule opens one of your photos, with a wish at the end.',
    poster: '/home/new-arcadeclawv1.webp',
    playable: true,
  },
};

const isNew = (template: IAllTemplateResponse) =>
  (template.tag ?? []).some((tag) => tag.trim().toLowerCase() === 'new');

/**
 * The template to show off: the first one tagged `New`, or the one whose
 * route is `forced` (the page's `?spotlight=<route>`, for looking at a
 * template here before tagging it for everybody).
 */
export function pickNewTemplate(
  templates: IAllTemplateResponse[] | null | undefined,
  forced?: string
): NewTemplate | null {
  const list = templates ?? [];
  const chosen = forced
    ? list.find((template) => templateRoute(template.name) === forced)
    : list.find(isNew);
  const route = chosen && templateRoute(chosen.name);
  if (!chosen || !route) return null;

  const words = WORDS[route];
  return {
    id: chosen.id,
    route,
    // "Roll of Us - rollofusv1": the part people read.
    name: chosen.name.split(' - ')[0].trim(),
    says: words?.says ?? 'A new way to give',
    body:
      words?.body ??
      'Fresh in the catalogue. Open the sample to see what they will get.',
    sample: `/${route}`,
    poster: words?.poster,
    thumbnail: templateThumbnail(chosen),
    playable: Boolean(words?.playable),
  };
}

import type { IAllTemplateResponse } from '@/action/interfaces';
import { pickNewTemplate, type NewTemplate } from '@/lib/new-template';

/**
 * The template the home page shows off as new, fetched with the page so the
 * pill over the headline is there on first paint and nothing shifts.
 *
 * The catalogue is public, so this asks without a session, which lets the
 * answer be kept for five minutes: the home page does not wait on the
 * backend for every visitor, and a tag changed in the admin dashboard shows
 * within that time. Any failure is "nothing is new": the home page must not
 * break over a ribbon.
 */
const baseUri =
  process.env.APP_ENV === 'production'
    ? process.env.API_URI
    : process.env.STAGING_API;

export async function getNewTemplate(
  forced?: string
): Promise<NewTemplate | null> {
  try {
    const res = await fetch(`${baseUri}/templates`, {
      headers: { 'Content-Type': 'application/json', 'X-Source': 'web' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: IAllTemplateResponse[] };
    return pickNewTemplate(body.data, forced);
  } catch {
    return null;
  }
}

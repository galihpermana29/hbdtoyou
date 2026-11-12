import { zip, type Zippable } from 'fflate';

import { listMemorollPhotosClient } from '@/action/memoroll-client-api';
import type { IMemorollGalleryPhoto } from '@/action/interfaces';

/**
 * Every photo of a roll, as one ZIP the host saves (owner, 2026-11-12).
 *
 * Built in the browser: a roll can hold hundreds of prints and a serverless
 * function has seconds (VERCEL_OPTIMIZATION.md), while the host's browser
 * has all the time it needs. Each print is fetched through our own origin
 * (/api/memoroll/photo) because the print host sends no CORS header. Prints
 * are JPEGs already, so the archive stores them rather than compressing
 * them again.
 */

const PAGE = 100;
/** Prints fetched at once: quick without hammering the CDN. */
const PARALLEL = 4;

export type ZipProgress =
  | { stage: 'listing' }
  | { stage: 'fetching'; done: number; total: number }
  | { stage: 'zipping' };

export interface RollZip {
  blob: Blob;
  /** Prints in the archive. */
  count: number;
  /** Prints that could not be fetched and are not in it. */
  missed: number;
}

/** Every photo of the event, across pages. */
async function everyPhoto(eventId: string): Promise<IMemorollGalleryPhoto[]> {
  const all: IMemorollGalleryPhoto[] = [];
  for (let page = 1; ; page++) {
    const result = await listMemorollPhotosClient(eventId, page, PAGE);
    if (!result.success) throw new Error(result.message);
    const rows = result.data ?? [];
    all.push(...rows);
    const totalPage = result.meta?.totalPage ?? 0;
    if (rows.length < PAGE || (totalPage && page >= totalPage)) return all;
  }
}

/** `012-galih-2026-11-12-0203.jpg`: sorts by shot order, says who and when. */
export function zipEntryName(
  photo: IMemorollGalleryPhoto,
  index: number,
  width: number
): string {
  const who =
    photo.uploader_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30) || 'guest';
  const at = new Date(photo.create_time);
  const when = isNaN(at.getTime())
    ? ''
    : `-${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(
        at.getDate()
      ).padStart(2, '0')}-${String(at.getHours()).padStart(2, '0')}${String(
        at.getMinutes()
      ).padStart(2, '0')}`;
  return `${String(index + 1).padStart(width, '0')}-${who}${when}.jpg`;
}

export async function buildRollZip(
  eventId: string,
  onProgress: (progress: ZipProgress) => void
): Promise<RollZip> {
  onProgress({ stage: 'listing' });
  const photos = (await everyPhoto(eventId)).sort(
    (a, b) => Date.parse(a.create_time) - Date.parse(b.create_time)
  );
  if (photos.length === 0) throw new Error('This roll has no photos yet');

  const width = Math.max(3, String(photos.length).length);
  const files: Zippable = {};
  let done = 0;
  let missed = 0;
  onProgress({ stage: 'fetching', done, total: photos.length });

  let next = 0;
  const worker = async () => {
    while (next < photos.length) {
      const index = next++;
      const photo = photos[index];
      try {
        const response = await fetch(
          `/api/memoroll/photo?url=${encodeURIComponent(photo.photo_url)}`
        );
        if (!response.ok) throw new Error(String(response.status));
        files[zipEntryName(photo, index, width)] = [
          new Uint8Array(await response.arrayBuffer()),
          { level: 0 },
        ];
      } catch {
        missed++;
      }
      done++;
      onProgress({ stage: 'fetching', done, total: photos.length });
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, worker));

  const count = photos.length - missed;
  if (count === 0) throw new Error('None of the photos could be fetched');

  onProgress({ stage: 'zipping' });
  const bytes = await new Promise<Uint8Array>((resolve, reject) =>
    zip(files, { level: 0 }, (error, data) =>
      error ? reject(error) : resolve(data)
    )
  );
  return {
    blob: new Blob([bytes], { type: 'application/zip' }),
    count,
    missed,
  };
}

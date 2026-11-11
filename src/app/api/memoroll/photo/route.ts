import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * A MemoRoll print, handed over as a file.
 *
 * Guests save prints from the photo preview, and a browser will only save a
 * cross-origin image if it can read it. It cannot: a print's address is
 * `cdn.memoify.live`, which 302s to Cloudinary without an
 * Access-Control-Allow-Origin header, so the preview's fetch was refused and
 * every Download fell back to opening the print in a new tab (found on
 * production, 2026-11-12). Same-origin, with `Content-Disposition:
 * attachment`, the save is the browser's own - iOS Safari included.
 *
 * Only the hosts prints actually live on are fetched, before and after
 * redirects, so this cannot be pointed at anything else.
 */
const ALLOWED_HOSTS = new Set(['cdn.memoify.live', 'res.cloudinary.com']);

/** Prints are 960x1280 JPEGs; anything far bigger is not one. */
const MAX_BYTES = 15 * 1024 * 1024;

function allowed(raw: string | null): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname)
      ? url
      : null;
  } catch {
    return null;
  }
}

/** A file name safe to put in a header: letters, digits, dash, dot. */
function fileName(raw: string | null): string {
  const cleaned = (raw ?? '').replace(/[^A-Za-z0-9._-]/g, '').slice(0, 80);
  return cleaned && /\.(jpe?g|png|webp)$/i.test(cleaned)
    ? cleaned
    : 'memoroll-print.jpg';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = allowed(searchParams.get('url'));
  if (!source) {
    return new NextResponse('Not a MemoRoll print', { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(source, { redirect: 'follow', cache: 'no-store' });
  } catch {
    return new NextResponse('The print could not be reached', { status: 502 });
  }

  // A redirect is followed only to where prints live.
  if (!allowed(upstream.url) || !upstream.ok) {
    return new NextResponse('The print could not be fetched', { status: 502 });
  }

  const type = upstream.headers.get('content-type') ?? '';
  if (!type.startsWith('image/')) {
    return new NextResponse('Not an image', { status: 502 });
  }

  const body = await upstream.arrayBuffer();
  if (body.byteLength > MAX_BYTES) {
    return new NextResponse('Too large', { status: 413 });
  }

  return new NextResponse(body, {
    headers: {
      'Content-Type': type,
      'Content-Length': String(body.byteLength),
      'Content-Disposition': `attachment; filename="${fileName(
        searchParams.get('name')
      )}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

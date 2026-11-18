'use client';

import { useEffect, useState } from 'react';

import { isStaleBuildError, reloadOnceForStaleBuild } from '@/lib/stale-build';

/**
 * The last resort: something threw in the root layout itself, so there is
 * no layout left to draw an error inside. Next's own version of this screen
 * titles the document "Application error: a client-side exception has
 * occurred"; this one keeps Memoify's name on it, and reloads once when the
 * cause is a page older than the current deploy (lib/stale-build.ts).
 *
 * It replaces the whole document, so it carries its own <html> and styles
 * itself inline: the site's stylesheet may be part of what failed.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!reloadOnceForStaleBuild(error)) setSettled(true);
  }, [error]);

  const stale = isStaleBuildError(error);
  return (
    <html lang="en">
      <head>
        <title>Memoify | Digital Gifts, Scrapbooks and Albums</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fbf4ec',
          color: '#1b1b1b',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textAlign: 'center',
          padding: 20,
        }}>
        {settled ? (
          <>
            <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: 0 }}>
              {stale ? 'This page needs a refresh' : 'Something went wrong'}
            </h1>
            <p
              style={{
                maxWidth: 420,
                fontSize: 16,
                lineHeight: 1.6,
                color: '#4a4642',
                margin: '12px 0 28px',
              }}>
              {stale
                ? 'Memoify was updated while this page was open. Reload to get the new version.'
                : 'Memoify hit a problem while loading. Reloading usually fixes it.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                height: 48,
                padding: '0 28px',
                borderRadius: 999,
                border: 0,
                background: '#ff3e09',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
              }}>
              Reload the page
            </button>
          </>
        ) : null}
      </body>
    </html>
  );
}

import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getSession } from '@/store/get-set-session';
import SessionProvider from './session-provider';
import QueryProvider from './query-provider';
import { Analytics } from '@vercel/analytics/react';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { getUserProfile } from '@/action/user-api';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { PAGE_LANGUAGE_HEADER } from '@/lib/page-language';
import { headers } from 'next/headers';

/**
 * What every page says unless it says something itself. `metadataBase` is
 * what relative links in a page's metadata are resolved against; the title
 * and description here are for pages that set none, so no page reaches a
 * search result untitled.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: 'Memoify | Digital Gifts, Scrapbooks & Albums',
  description:
    'Turn your photos into a digital gift, scrapbook or album and share it with one link. Bikin kado digital dalam hitungan menit.',
};

/** The families globals.css used to @import, one request instead of seven. */
const GOOGLE_FONTS =
  'https://fonts.googleapis.com/css2' +
  '?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800' +
  '&family=Raleway:ital,wght@0,100..900;1,100..900' +
  '&family=Young+Serif' +
  '&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900' +
  '&family=Cinzel:wght@400;700' +
  '&family=Playfair+Display:ital,wght@0,400;0,700;1,400' +
  '&family=UnifrakturMaguntia' +
  '&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400' +
  '&family=Baloo+2:wght@400..800' +
  '&family=Lilita+One' +
  '&family=Nunito:ital,wght@0,400..800;1,400..700' +
  '&display=swap';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const res = session?.accessToken
    ? await getUserProfile({
        userId: session.userId!,
        accessToken: session.accessToken!,
      })
    : null;

  // English unless the middleware says the page is written in Indonesian.
  const lang = headers().get(PAGE_LANGUAGE_HEADER) === 'id' ? 'id' : 'en';

  return (
    <html lang={lang}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* Every Google font the site uses, in one stylesheet linked here
            rather than seven @imports in globals.css. Imported, they were
            fetched one step later, after globals.css itself, and the page
            could not paint until the slowest of the seven arrived (3.6s on
            a phone on production, 2026-11-18). Linked, the browser asks for
            it with the HTML, beside the app's own CSS. The same font faces,
            the same display=swap. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={GOOGLE_FONTS} />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AntdRegistry>
          <Analytics />
          <PostHogProvider>
            <QueryProvider>
              <SessionProvider
                session={JSON.stringify(session)}
                initialProfileData={res?.data || null}>
                {children}
              </SessionProvider>
            </QueryProvider>
          </PostHogProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

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

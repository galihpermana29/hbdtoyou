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
  title: "Memoify | Indonesia's First Digital Gifts & Disposable Camera",
  description:
    "Indonesia's first digital gifts and digital disposable camera, since 2024. Make a Netflix-style birthday gift, or give wedding guests a camera with MemoRoll.",
};

/**
 * The Google families single templates are set in (Cinzel for one, Lilita
 * One for another). Plus Jakarta Sans, the face of every page, is not here:
 * it is served from this site, see globals.css.
 */
const TEMPLATE_FONTS =
  'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900' +
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
        {/* The page's own face comes from this site; fetch it with the HTML
            so text is set in it from the first paint. */}
        <link
          rel="preload"
          href="/font/plus-jakarta-sans-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* The templates' Google fonts must not hold up the paint of pages
            that do not use them (they held the home page back 3.6s on a
            phone on production, 2026-11-18). A print stylesheet is fetched
            without blocking; the script below turns it on for the screen
            once it has arrived. Each face is display=swap, as before, so a
            template shows its fallback until its font is in - which it
            already did while the font file itself was loading. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          id="template-fonts"
          rel="stylesheet"
          href={TEMPLATE_FONTS}
          media="print"
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.getElementById('template-fonts');if(!l)return;var on=function(){l.media='all'};if(l.sheet)on();else l.addEventListener('load',on)})()",
          }}
        />
        <noscript>
          <link rel="stylesheet" href={TEMPLATE_FONTS} />
        </noscript>
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

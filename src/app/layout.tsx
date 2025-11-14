import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getSession } from '@/store/get-set-session';
import SessionProvider from './session-provider';
import QueryProvider from './query-provider';
import { Analytics } from '@vercel/analytics/react';
import { PostHogProvider } from '@/providers/PostHogProvider';
import { getUserProfile } from '@/action/user-api';

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

  if (process.env.IS_MAINTENANCE === 'true') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className=" max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Under Maintenance
          </h1>
          <p className="text-gray-700 mt-4 max-w-[400px]">
            We are currently working on improving this feature. Please check
            back soon!
          </p>

          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <html lang="en">
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

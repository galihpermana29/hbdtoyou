import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getSession } from '@/store/get-set-session';
import SessionProvider from './session-provider';

export const metadata: Metadata = {
  title: 'Memoify',
  description:
    'With memoify create custom websites inspired by your favorite platforms like Netflix, Spotify, or YouTube. Add personal touches and let your memories shine!',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <SessionProvider session={JSON.stringify(session)}>
            {children}
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

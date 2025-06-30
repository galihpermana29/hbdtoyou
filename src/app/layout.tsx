import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getSession } from '@/store/get-set-session';
import SessionProvider from './session-provider';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body>
        <AntdRegistry>
          <Analytics />
          <SessionProvider session={JSON.stringify(session)}>
            {children}
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

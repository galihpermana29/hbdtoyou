import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getSession } from '@/store/get-set-session';
import SessionProvider from './session-provider';

export const metadata: Metadata = {
  title: 'HBDTY',
  description: 'HBDTY is a Netflix clone, to celebrate anything in your lifes',
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
